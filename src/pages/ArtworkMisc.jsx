import React from 'react';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';
import './GalleryPage.css';

function ArtworkMisc() {
  const art = artworks.filter(a => a.category === 'houses');

  return (
    <div className="gallery-page">
      <h1>House Portraits</h1>
      <Gallery art={art} />
    </div>
  );
}

export default ArtworkMisc;
