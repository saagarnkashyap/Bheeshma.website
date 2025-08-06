import { useState, useEffect } from 'react';
import gitaCompleteData from '../assets/bhagavad_gita_complete.json';
import gitaMetaData from '../assets/bhagavad_gita_meta_data.json';
import audioLinksData from '../assets/gita_audio_links.json';

export const useGitaData = () => {
  const [gitaData, setGitaData] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [audioLinks, setAudioLinks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setGitaData(gitaCompleteData);
      setMetaData(gitaMetaData);
      setAudioLinks(audioLinksData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const getChapterData = (chapterNumber) => {
    if (!gitaData) return null;
    return gitaData.chapters.find(chapter => chapter.number === chapterNumber);
  };

  const getShlokaData = (chapterNumber, shlokaNumber) => {
    const chapter = getChapterData(chapterNumber);
    if (!chapter) return null;
    return chapter.shlokas.find(shloka => shloka.shloka_number === shlokaNumber);
  };

  const getEmotionBasedVerses = (emotion) => {
    if (!gitaData || !gitaData.problem_solutions_map) return [];
    const emotionData = gitaData.problem_solutions_map[emotion];
    if (!emotionData) return [];
    
    return emotionData.references.map(ref => {
      const shloka = getShlokaData(ref.chapter, ref.shloka);
      return {
        ...shloka,
        chapter: ref.chapter,
        emotion: emotion,
        description: emotionData.description
      };
    }).filter(Boolean);
  };

  const getAllEmotions = () => {
    if (!gitaData || !gitaData.problem_solutions_map) return [];
    return Object.keys(gitaData.problem_solutions_map).map(key => ({
      key,
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: gitaData.problem_solutions_map[key].description,
      count: gitaData.problem_solutions_map[key].references.length
    }));
  };

  const getChapterAudio = (chapterNumber) => {
    if (!audioLinks) return null;
    return audioLinks[`chapter_${chapterNumber}`] || null;
  };

  return {
    gitaData,
    metaData,
    audioLinks,
    loading,
    error,
    getChapterData,
    getShlokaData,
    getEmotionBasedVerses,
    getAllEmotions,
    getChapterAudio
  };
};

export default useGitaData;

