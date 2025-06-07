import React from 'react';
import './Home.css';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';

function Home() {
  // main hero image (replace with your favorite!)
  const heroImage = process.env.PUBLIC_URL + '/imgs/img5.png';

  return (
    <div className="home-page">
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="overlay">
          <h1>Anna Kolb</h1>
          <p className="tagline">Where Color Meets Imagination</p>
        </div>
      </section>

      <section className="intro">
        <p>
          Welcome to my studio—an explosion of vibrant palettes and whimsical
          forms. Wander through the gallery below and let each piece tell you its
          story.
        </p>
      </section>

      <Gallery art={artworks} />
    </div>
  );
}

export default Home;
