import React from 'react';
import { darkPageArtwork } from '../lib/darkArtwork';

const DarkThreePageBanner = ({ view }) => {
  const artwork = darkPageArtwork[view];
  if (!artwork) return null;

  return (
    <div className="dark-three-page-banner" aria-label={`${artwork.overline} artwork`}>
      <div className="dark-three-page-banner-copy">
        <span className="dark-three-page-banner-index">FIELD NOTE / {artwork.index}</span>
        <span className="dark-three-page-banner-title">{artwork.overline}</span>
        <span className="dark-three-page-banner-rule" aria-hidden="true" />
      </div>
      <div className="dark-three-page-banner-image">
        <img src={artwork.src} alt={artwork.alt} loading="lazy" decoding="async" />
      </div>
    </div>
  );
};

export default DarkThreePageBanner;
