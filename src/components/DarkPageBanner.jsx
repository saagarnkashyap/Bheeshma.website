import React from 'react';
import { darkPageArtwork } from '../lib/darkArtwork';

const DarkPageBanner = ({ view }) => {
  const artwork = darkPageArtwork[view];
  if (!artwork) return null;
  const [titleLead, titleEmphasis] = artwork.overline.split(' / ');

  return (
    <div className="dark-mode-page-banner" aria-label={`${artwork.overline} artwork`}>
      <div className="dark-mode-page-banner-copy">
        <span className="dark-mode-page-banner-index">FIELD NOTE / {artwork.index}</span>
        <span className="dark-mode-page-banner-title">
          <span>{titleLead} </span>
          <span className="dark-mode-page-banner-title-emphasis">{titleEmphasis}</span>
        </span>
      </div>
      <div className="dark-mode-page-banner-image">
        <img src={artwork.src} alt={artwork.alt} loading="lazy" decoding="async" />
      </div>
    </div>
  );
};

export default DarkPageBanner;
