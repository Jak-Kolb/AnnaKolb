import React from 'react';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';
import './GalleryPage.css';

function CarPortraits() {
  const art = artworks.filter(a => a.category === 'cars');

  return (
    <div className="gallery-page">
      <h1>Car Portraits</h1>
      <Gallery art={art} />
    </div>
  );
}

export default CarPortraits;
