#!/usr/bin/env python3
"""Acquire and normalize the requested Gita Supersite content.

The upstream scraper repository is useful reference code, but its default URL
now redirects to a redesigned site. This project-specific importer targets the
legacy endpoint Saagar referenced and writes resumable, source-shaped JSON
before producing the app-facing dataset.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import urlencode

import requests
from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_RAW_DIR = ROOT / "data" / "gitasupersite-raw"
DEFAULT_OUTPUT = ROOT / "src" / "assets" / "bhagavad_gita_supersite.json"
LEGACY_DATASET = ROOT / "src" / "assets" / "bhagavad_gita_complete.json"
SOURCE_BASE_URL = "https://old.gitasupersite.in"
SOURCE_PAGE = f"{SOURCE_BASE_URL}/srimad"

CHAPTER_VERSES = {
    1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47,
    7: 30, 8: 28, 9: 34, 10: 42, 11: 55, 12: 20,
    13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78,
}

SCRIPT_KEYS = {
    "dv": "devanagari",
    "ro": "roman",
    "kn": "kannada",
    "te": "telugu",
}

CONTENT_KEYS = {
    "etpurohit": "purohitSwami",
    "scsh": "shankaracharya",
    "scmad": "madhvacharya",
    "scram": "ramanujacharya",
}

CONTENT_LABELS = {
    "etpurohit": "English Translation by Shri Purohit Swami",
    "scsh": "Sanskrit Commentary By Sri Shankaracharya",
    "scmad": "Sanskrit Commentary By Sri Madhvacharya",
    "scram": "Sanskrit Commentary By Sri Ramanujacharya",
}

NO_COMMENTARY_MARKERS = (
    "did not comment",
    "didn't comment",
    "no commentary",
    "not commented",
)


def clean_lines(value: str) -> str:
    return "\n".join(line.strip() for line in value.splitlines() if line.strip()).strip()


def remove_heading(value: str, heading: str | None = None) -> str:
    text = clean_lines(value)
    if heading and text.lower().startswith(heading.lower()):
        text = text[len(heading):].lstrip(" :\n")
    return text


def remove_reference_prefix(value: str, chapter: int, verse: int) -> str:
    pattern = rf"^\s*(?:[।৷|]{{1,4}}\s*)?{chapter}\s*[.:]\s*{verse}\s*"
    return re.sub(pattern, "", value, count=1).strip()


def remove_reference_suffix(value: str, chapter: int, verse: int) -> str:
    pattern = rf"\s*[।৷|]{{2,}}\s*{chapter}\s*[.:]\s*{verse}\s*[।৷|]{{2,}}\s*$"
    return re.sub(pattern, "", value).strip()


def normalize_verse_text(value: str, chapter: int, verse: int) -> str | None:
    text = remove_heading(value, "मूल श्लोकः")
    text = remove_reference_suffix(text, chapter, verse)
    return text or None


def normalize_content_text(value: str, label: str, chapter: int, verse: int) -> str | None:
    text = remove_heading(value, label)
    text = remove_reference_prefix(text, chapter, verse)
    return text or None


def is_unavailable_commentary(value: str | None) -> bool:
    if not value:
        return True
    lowered = value.lower()
    return any(marker in lowered for marker in NO_COMMENTARY_MARKERS)


def build_url(chapter: int, verse: int, language: str, include_content: bool) -> str:
    params: list[tuple[str, str]] = [
        ("language", language),
        ("field_chapter_value", str(chapter)),
        ("field_nsutra_value", str(verse)),
        ("show_mool", "1"),
    ]
    if include_content:
        params.extend((key, "1") for key in CONTENT_KEYS)
        params.append(("choose", "1"))
    return f"{SOURCE_PAGE}?{urlencode(params)}"


def find_field(soup: BeautifulSoup, class_name: str):
    target = f"views-field-{class_name}"
    return soup.find("div", class_=lambda classes: classes and target in classes)


def extract_field_text(field, chapter: int, verse: int, label: str | None = None) -> str | None:
    if field is None:
        return None
    text = clean_lines(field.get_text(separator="\n", strip=True))
    heading = field.find("b")
    if heading:
        heading_text = clean_lines(heading.get_text(" ", strip=True))
        text = text.replace(heading_text, "", 1).strip()
    if label:
        text = remove_heading(text, label)
    text = remove_reference_prefix(text, chapter, verse)
    return text or None


def fetch_page(session: requests.Session, url: str, delay: float) -> BeautifulSoup:
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            response = session.get(url, timeout=45)
            response.raise_for_status()
            response.encoding = response.encoding or "utf-8"
            if delay > 0:
                time.sleep(delay)
            return BeautifulSoup(response.content, "lxml")
        except requests.RequestException as error:
            last_error = error
            time.sleep(max(delay, 0.5) * (attempt + 1))
    raise RuntimeError(f"Unable to fetch {url}: {last_error}")


def scrape_verse(session: requests.Session, chapter: int, verse: int, delay: float) -> dict[str, Any]:
    scripts: dict[str, str | None] = {}
    translations: dict[str, str | None] = {}
    source_urls: dict[str, str] = {}

    for language, normalized_key in SCRIPT_KEYS.items():
        url = build_url(chapter, verse, language, language == "dv")
        source_urls[language] = url
        soup = fetch_page(session, url, delay)
        field = find_field(soup, "body")
        text = extract_field_text(field, chapter, verse)
        scripts[normalized_key] = normalize_verse_text(text or "", chapter, verse)

        if language == "dv":
            for source_key, normalized_content_key in CONTENT_KEYS.items():
                content_field = find_field(soup, f"field-{source_key}")
                content = extract_field_text(
                    content_field,
                    chapter,
                    verse,
                    CONTENT_LABELS[source_key],
                )
                if source_key != "etpurohit" and is_unavailable_commentary(content):
                    content = None
                translations[normalized_content_key] = content

    return {
        "chapter": chapter,
        "verse": verse,
        "reference": f"{chapter}.{verse}",
        "scripts": scripts,
        "translations": translations,
        "source": {
            "provider": "IIT Kanpur Gita Supersite",
            "baseUrl": SOURCE_BASE_URL,
            "urls": source_urls,
            "keys": {
                "scripts": {key: f"language={key}" for key in SCRIPT_KEYS},
                "translation": {key: f"{key}=1" for key in CONTENT_KEYS},
            },
        },
    }


def verse_path(raw_dir: Path, chapter: int, verse: int) -> Path:
    return raw_dir / "chapters" / f"chapter_{chapter:02d}" / f"verse_{verse:03d}.json"


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def fetch_all(raw_dir: Path, delay: float, chapter: int | None, verse: int | None) -> None:
    raw_dir.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Bheeshma Gita data importer/1.0 (research project)",
    })
    targets = [(chapter, verse)] if chapter and verse else [
        (current_chapter, current_verse)
        for current_chapter, total in CHAPTER_VERSES.items()
        for current_verse in range(1, total + 1)
        if chapter is None or current_chapter == chapter
    ]
    failures: list[dict[str, Any]] = []
    completed = 0

    for current_chapter, current_verse in targets:
        output_path = verse_path(raw_dir, current_chapter, current_verse)
        if output_path.exists():
            try:
                existing = load_json(output_path)
                has_scripts = all(existing.get("scripts", {}).get(key) for key in SCRIPT_KEYS.values())
                has_content_keys = all(key in existing.get("translations", {}) for key in CONTENT_KEYS.values())
                if has_scripts and has_content_keys:
                    completed += 1
                    continue
            except (OSError, json.JSONDecodeError):
                pass
        try:
            data = scrape_verse(session, current_chapter, current_verse, delay)
            write_json(output_path, data)
            completed += 1
            print(f"Fetched {current_chapter}.{current_verse} ({completed}/{len(targets)})")
        except Exception as error:  # keep the run resumable
            failures.append({
                "chapter": current_chapter,
                "verse": current_verse,
                "error": str(error),
            })
            print(f"Failed {current_chapter}.{current_verse}: {error}", file=sys.stderr)

    write_json(raw_dir / "manifest.json", {
        "source": SOURCE_BASE_URL,
        "expectedVerses": sum(CHAPTER_VERSES.values()),
        "requestedVerses": len(targets),
        "completedThisRun": completed,
        "failures": failures,
        "scripts": list(SCRIPT_KEYS.values()),
        "content": list(CONTENT_KEYS.values()),
    })
    if failures:
        raise SystemExit(f"Acquisition completed with {len(failures)} failure(s); rerun to resume.")


def get_legacy_maps() -> tuple[dict[str, Any], dict[tuple[int, int], dict[str, Any]]]:
    legacy = load_json(LEGACY_DATASET)
    chapter_metadata: dict[str, Any] = {}
    legacy_verses: dict[tuple[int, int], dict[str, Any]] = {}
    for chapter in legacy.get("chapters", []):
        number = int(chapter["number"])
        chapter_metadata[str(number)] = {
            key: value for key, value in chapter.items() if key != "shlokas"
        }
        for shloka in chapter.get("shlokas", []):
            legacy_verses[(number, int(shloka["shloka_number"]))] = shloka
    return {
        "problem_solutions_map": legacy.get("problem_solutions_map", {}),
        "chapter_metadata": chapter_metadata,
    }, legacy_verses


def normalize_dataset(raw_dir: Path, output_path: Path) -> None:
    app_metadata, legacy_verses = get_legacy_maps()
    chapters: list[dict[str, Any]] = []
    missing: list[str] = []

    for chapter_number, total in CHAPTER_VERSES.items():
        chapter = dict(app_metadata["chapter_metadata"].get(str(chapter_number), {
            "number": chapter_number,
            "name": f"Chapter {chapter_number}",
        }))
        shlokas: list[dict[str, Any]] = []
        for verse_number in range(1, total + 1):
            path = verse_path(raw_dir, chapter_number, verse_number)
            if not path.exists():
                missing.append(f"{chapter_number}.{verse_number}")
                continue
            source = load_json(path)
            scripts = source.get("scripts", {})
            translations = source.get("translations", {})
            legacy = dict(legacy_verses.get((chapter_number, verse_number), {}))
            legacy.pop("sanskrit_text", None)
            legacy.pop("transliteration", None)
            legacy.pop("meaning", None)
            shloka = {
                **legacy,
                "name": legacy.get("name", f"Shloka {verse_number}"),
                "chapter": chapter_number,
                "shloka_number": verse_number,
                "scripts": {
                    key: scripts.get(key) for key in SCRIPT_KEYS.values()
                },
                "translation": {
                    "purohitSwami": translations.get("purohitSwami"),
                },
                "commentaries": {
                    "shankaracharya": translations.get("shankaracharya"),
                    "madhvacharya": translations.get("madhvacharya"),
                    "ramanujacharya": translations.get("ramanujacharya"),
                },
                "availability": {
                    "hasPurohitTranslation": bool(translations.get("purohitSwami")),
                    "hasCompleteSanskritCommentary": all(
                        translations.get(key)
                        for key in ("shankaracharya", "madhvacharya", "ramanujacharya")
                    ),
                },
                "sanskrit_text": scripts.get("devanagari"),
                "transliteration": scripts.get("roman"),
                "meaning": translations.get("purohitSwami"),
                "source": source.get("source"),
            }
            shlokas.append(shloka)
        chapter["shlokas"] = shlokas
        chapters.append(chapter)

    dataset = {
        "metadata": {
            "source": SOURCE_BASE_URL,
            "sourceRepository": "https://github.com/shyamperi/gitasupersite.iitk.ac.in",
            "scripts": SCRIPT_KEYS,
            "content": CONTENT_KEYS,
            "expectedVerses": sum(CHAPTER_VERSES.values()),
            "actualVerses": sum(len(chapter["shlokas"]) for chapter in chapters),
            "missingVerses": missing,
        },
        "problem_solutions_map": app_metadata["problem_solutions_map"],
        "chapters": chapters,
    }
    write_json(output_path, dataset)
    if missing:
        raise SystemExit(f"Normalization found {len(missing)} missing verse(s); see metadata.missingVerses.")


def validate_dataset(output_path: Path) -> None:
    dataset = load_json(output_path)
    errors: list[str] = []
    chapters = dataset.get("chapters", [])
    if len(chapters) != 18:
        errors.append(f"expected 18 chapters, found {len(chapters)}")
    for chapter in chapters:
        chapter_number = chapter.get("number")
        for shloka in chapter.get("shlokas", []):
            ref = f"{chapter_number}.{shloka.get('shloka_number')}"
            scripts = shloka.get("scripts", {})
            for key in SCRIPT_KEYS.values():
                if not scripts.get(key):
                    errors.append(f"{ref}: missing {key}")
            if not shloka.get("translation", {}).get("purohitSwami"):
                errors.append(f"{ref}: missing Purohit translation")
            complete = shloka.get("availability", {}).get("hasCompleteSanskritCommentary")
            actual_complete = all(shloka.get("commentaries", {}).get(key) for key in (
                "shankaracharya", "madhvacharya", "ramanujacharya"
            ))
            if complete != actual_complete:
                errors.append(f"{ref}: commentary availability flag is incorrect")
    if errors:
        print("Validation failed:", file=sys.stderr)
        print("\n".join(f"- {error}" for error in errors[:40]), file=sys.stderr)
        if len(errors) > 40:
            print(f"- ... and {len(errors) - 40} more", file=sys.stderr)
        raise SystemExit(1)
    print(f"Validated {sum(len(chapter.get('shlokas', [])) for chapter in chapters)} verses.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    fetch_parser = subparsers.add_parser("fetch", help="Acquire source JSON with resume support")
    fetch_parser.add_argument("--raw-dir", type=Path, default=DEFAULT_RAW_DIR)
    fetch_parser.add_argument("--delay", type=float, default=0.35)
    fetch_parser.add_argument("--chapter", type=int)
    fetch_parser.add_argument("--verse", type=int)

    normalize_parser = subparsers.add_parser("normalize", help="Build the app-facing dataset")
    normalize_parser.add_argument("--raw-dir", type=Path, default=DEFAULT_RAW_DIR)
    normalize_parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)

    validate_parser = subparsers.add_parser("validate", help="Validate the app-facing dataset")
    validate_parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)

    args = parser.parse_args()
    if args.command == "fetch":
        if args.verse and not args.chapter:
            parser.error("--verse requires --chapter")
        fetch_all(args.raw_dir, args.delay, args.chapter, args.verse)
    elif args.command == "normalize":
        normalize_dataset(args.raw_dir, args.output)
    elif args.command == "validate":
        validate_dataset(args.output)


if __name__ == "__main__":
    main()
