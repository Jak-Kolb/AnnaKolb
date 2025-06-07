import React from 'react';
import './Home.css';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';

function Home() {
  // Use the public path for images
  const eyeImage = process.env.PUBLIC_URL + '/imgs/eye.png';

  return (
    <div className="home-page">
      <div className="hero" style={{ backgroundImage: `url(${eyeImage})` }}>
        <h2>Anna Kolb</h2>
        <p>Artist & Illustrator</p>
      </div>
      <Gallery art={artworks} />
    </div>
  );
}

export default Home;
