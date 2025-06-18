import React, { useState } from 'react';
import './Home.css';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';
import { Link } from 'react-router-dom';

function Home() {
  const heroImage = process.env.PUBLIC_URL + '/imgs/abstract1.jpg';
  const [activeTab, setActiveTab] = useState('all');

  // Filter artworks based on active tab
  const filteredArtworks = activeTab === 'all' 
    ? artworks 
    : artworks.filter(art => art.category === activeTab);

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

      {/* Gallery tabs */}
      <div className="gallery-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''} 
          onClick={() => setActiveTab('all')}
        >
          All Artwork
        </button>
        <button 
          className={activeTab === 'houses' ? 'active' : ''} 
          onClick={() => setActiveTab('houses')}
        >
          House Paintings
        </button>
        <button 
          className={activeTab === 'animals' ? 'active' : ''} 
          onClick={() => setActiveTab('animals')}
        >
          Animals
        </button>
        <button 
          className={activeTab === 'cars' ? 'active' : ''} 
          onClick={() => setActiveTab('cars')}
        >
          Cars
        </button>
      </div>

      <Gallery art={filteredArtworks} />
    </div>
  );
}

export default Home;
