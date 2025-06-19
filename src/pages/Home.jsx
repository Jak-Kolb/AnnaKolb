import React, { useState, useEffect } from 'react';
import './Home.css';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';
import { Link } from 'react-router-dom';

function Home() {
  const getFirstImageByCategory = (category) => {
    console.log(`Looking for category: ${category}`);
    
    // Find artwork in the data (now contains Drive URLs)
    const artwork = artworks.find(art => art.category.toLowerCase() === category.toLowerCase());
    
    if (artwork && artwork.src) {
      console.log(`Found artwork for ${category}:`, artwork.src);
      return artwork.src; // Direct Drive URL, no formatting needed
    }
    
    // Fallback to a placeholder or default image
    console.log(`No artwork found for ${category}, using fallback`);
    return 'https://via.placeholder.com/400x300?text=No+Image';
  };

  const heroImage = process.env.PUBLIC_URL + getFirstImageByCategory('houses');
  const [activeTab, setActiveTab] = useState(null);

  // Debug artworks data on component mount
  useEffect(() => {
    // console.log("Full artworks data:", artworks);
  }, []);
  
  // Filter artworks based on active tab
  const filteredArtworks = activeTab 
    ? artworks.filter(art => art.category === activeTab)
    : [];
    
  // Modified function to handle spaces in filenames


  return (
    <div className="home-page">
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>   
        <div className="hero-nav">
          <ul className="nav-links">
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
          forms. Choose a category below to explore my artwork and let each piece tell you its
          story.
        </p>
      </section>

      {/* Large category cards instead of small buttons */}
      {!activeTab ? (
        <div className="category-cards">
          <div 
            className="category-card"
            style={{ backgroundImage: `url(${getFirstImageByCategory('houses')})` }}
            onClick={() => setActiveTab('houses')}
          >
            <div className="category-overlay">
              <h2>House Paintings</h2>
            </div>
          </div>
          
          <div 
            className="category-card"
            style={{ backgroundImage: `url(${getFirstImageByCategory('animals')})` }}
            onClick={() => setActiveTab('animals')}
          >
            <div className="category-overlay">
              <h2>Animals</h2>
            </div>
          </div>
          
          <div 
            className="category-card"
            style={{ backgroundImage: `url(${getFirstImageByCategory('cars')})` }}
            onClick={() => setActiveTab('cars')}
          >
            <div className="category-overlay">
              <h2>Cars</h2>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="gallery-header">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <button className="back-button" onClick={() => setActiveTab(null)}>
              Back to Categories
            </button>
          </div>
          <Gallery art={filteredArtworks} />
        </>
      )}
    </div>
  );
}

export default Home;
