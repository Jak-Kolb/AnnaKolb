import React from 'react';
import './Gallery.css';

function Gallery({ art }) {
  return (
    <section className="gallery">
      {art.map(item => (
        <img key={item.id} src={item.src} alt={item.title} />
      ))}
    </section>
  );
}

export default Gallery;
