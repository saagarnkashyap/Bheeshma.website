import React from 'react';
import { darkPageArtwork } from '../lib/darkArtwork';

const DarkThreePageBanner = ({ view }) => {
  const artwork = darkPageArtwork[view];
  if (!artwork) return null;
  const [titleLead, titleEmphasis] = artwork.overline.split(' / ');

  return (
    <div className="dark-three-page-banner" aria-label={`${artwork.overline} artwork`}>
      <div className="dark-three-page-banner-copy">
        <span className="dark-three-page-banner-index">FIELD NOTE / {artwork.index}</span>
        <span className="dark-three-page-banner-title">
          <span>{titleLead} </span>
          <span className="dark-three-page-banner-title-emphasis">{titleEmphasis}</span>
        </span>
      </div>
      <div className="dark-three-page-banner-image">
        <img src={artwork.src} alt={artwork.alt} loading="lazy" decoding="async" />
      </div>
    </div>
  );
};

export default DarkThreePageBanner;
