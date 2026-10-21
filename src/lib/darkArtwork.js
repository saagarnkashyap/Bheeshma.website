const directory = '/other%20pics/dark%20theme/';

export const darkArtwork = [
  { src: `${directory}598256351_1566998324329487_6087192982924675443_n.jpg`, alt: 'Red illustrated battle poster with Krishna and a chariot', label: 'The field', view: 'bookmarks', pageLabel: 'Saved verses' },
  { src: `${directory}797643567_1437985664887756_4305402125451444524_n.jpg`, alt: 'Black and gold mythological graphic artwork', label: 'The purpose', view: 'about', pageLabel: 'About' },
  { src: `${directory}840377761_1084744031133592_1741248250194744511_n.jpg`, alt: 'Blue and gold illustration of Krishna in motion', label: 'The recitation', view: 'audio', pageLabel: 'Audio' },
  { src: `${directory}840697317_2259977214567893_3558444369537418480_n.jpg`, alt: 'Green and orange portrait of Hanuman', label: 'The counsel', view: 'emotions', pageLabel: 'Guidance' },
  { src: `${directory}841532556_1439965651408269_8209100057610730116_n.jpg`, alt: 'Red graphic illustration of Krishna and Arjuna', label: 'The dialogue', view: 'chapters', pageLabel: 'Chapters' },
  { src: `${directory}845482537_1923697118609921_1733267767166360840_n.jpg`, alt: 'Monochrome mythological poster artwork', label: 'The inquiry', view: 'chat', pageLabel: 'Assistant' },
];

export const darkPageArtwork = {
  chapters: { ...darkArtwork[4], index: '01', overline: 'THE TEXT / 18 CHAPTERS' },
  emotions: { ...darkArtwork[3], index: '02', overline: 'GUIDANCE / THE INNER FIELD' },
  audio: { ...darkArtwork[2], index: '03', overline: 'AUDIO / HEAR THE VERSE' },
  chat: { ...darkArtwork[5], index: '04', overline: 'ASSISTANT / ASK & EXPLORE' },
  about: { ...darkArtwork[1], index: '05', overline: 'ABOUT / THE EDITION' },
  bookmarks: { ...darkArtwork[0], index: '06', overline: 'BOOKMARKS / RETURN HERE' },
};
