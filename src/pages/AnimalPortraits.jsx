import React from 'react';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';
import './GalleryPage.css';

function AnimalPortraits() {
  const art = artworks.filter(a => a.category === 'animals');

  return (
    <div className="gallery-page">
      <h1>Animal Portraits</h1>
      <Gallery art={art} />
    </div>
  );
}

export default AnimalPortraits;
