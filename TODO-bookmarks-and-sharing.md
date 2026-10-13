# TODO: Bookmarks and Verse Sharing

Implement this feature in a separate branch.

## Bookmarks

- Restore bookmark state from `localStorage` when a verse loads.
- Add a dedicated Bookmarks view reachable from the header navigation.
- Show saved verses with chapter/verse labels and links that open the exact verse.
- Let users remove bookmarks from the saved list and from the verse card.
- Keep bookmarks across refreshes on the same browser/device without requiring an account.

## Sharing

- Share the verse text together with a link to the exact chapter and verse.
- Use the native Web Share API where available.
- Fall back to copying the share text and URL to the clipboard.
- Show clear success and failure feedback instead of silently doing nothing.

## Completion criteria

Bookmarks remain visibly correct after refresh, saved verses are easy to revisit, and sharing either opens a share sheet or clearly confirms that the link was copied.
