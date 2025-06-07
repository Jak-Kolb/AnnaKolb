import React from 'react';
import './Home.css';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';
import { Link } from 'react-router-dom';

function Home() {
  const heroImage = process.env.PUBLIC_URL + '/imgs/eye.png';

  return (
    <div className="home-page">
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        {/* Position the nav-links in a container for better positioning */}
        <div className="hero-nav">
          <ul className="nav-links">
            {/* <li><Link to="/">Home</Link></li> */}
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        
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
