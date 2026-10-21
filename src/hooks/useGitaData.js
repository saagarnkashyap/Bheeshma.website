import { useState, useEffect } from 'react';
import gitaMetaData from '../assets/bhagavad_gita_meta_data.json';

let cachedGitaData = null;
let cachedError = null;
let dataPromise = null;

const loadGitaData = () => {
  if (!dataPromise) {
    dataPromise = import('../assets/bhagavad_gita_supersite.json')
      .then(({ default: data }) => {
        cachedGitaData = data;
        return data;
      })
      .catch((error) => {
        cachedError = error.message;
        throw error;
      });
  }

  return dataPromise;
};

export const useGitaData = () => {
  const [gitaData, setGitaData] = useState(() => cachedGitaData);
  const [loading, setLoading] = useState(() => !cachedGitaData && !cachedError);
  const [error, setError] = useState(() => cachedError);
  const metaData = gitaData ? gitaMetaData : null;

  useEffect(() => {
    if (!loading) return undefined;
    let isActive = true;

    loadGitaData()
      .then((data) => {
        if (!isActive) return;

        setGitaData(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isActive) return;

        setError(err.message);
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [loading]);

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

  return {
    gitaData,
    metaData,
    loading,
    error,
    getChapterData,
    getShlokaData,
    getEmotionBasedVerses,
    getAllEmotions
  };
};

export default useGitaData;

