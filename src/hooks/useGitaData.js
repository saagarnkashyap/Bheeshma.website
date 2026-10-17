import { useState, useEffect } from 'react';
import gitaMetaData from '../assets/bhagavad_gita_meta_data.json';

export const useGitaData = () => {
  const [gitaData, setGitaData] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    Promise.all([
      import('../assets/bhagavad_gita_supersite.json'),
    ])
      .then(([gitaDataModule]) => {
        if (!isActive) return;

        setGitaData(gitaDataModule.default);
        setMetaData(gitaMetaData);
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

