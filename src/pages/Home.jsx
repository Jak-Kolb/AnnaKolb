import React, { useState, useEffect } from 'react';
import './Home.css';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';
import { Link } from 'react-router-dom';

function Home() {
    const getFirstImageByCategory = (category) => {
    console.log(`Looking for category: ${category}`);
    
    // First try to find artwork in the data
    const artwork = artworks.find(art => art.category.toLowerCase() === category.toLowerCase());
    
    if (artwork && artwork.src) {
      console.log(`Found artwork for ${category}:`, artwork.src);
      
      // Replace spaces with underscores in the image URL
      const formattedSrc = artwork.src.replace(/\s+/g, '_');
      console.log(`Formatted source for ${category}:`, formattedSrc);
      return formattedSrc;
    }
    
    // If not found in artwork data, try the fallback with spaces replaced
    console.log(`No artwork found for ${category}, using fallback`);
    const fallbackPath = process.env.PUBLIC_URL + `/imgs/${category}-fallback.jpg`.replace(/\s+/g, '_');
    
    return fallbackPath;
  };

  const heroImage = process.env.PUBLIC_URL + getFirstImageByCategory('houses');
  const firstImageCar = process.env.PUBLIC_URL + '/imgs/cars/car1.png'.replace(/\s+/g, '_');
  const firstImageAnimal = process.env.PUBLIC_URL + 'imgs/animals/dog1.JPG'.replace(/\s+/g, '_');
  const firstImageHouse = process.env.PUBLIC_URL + 'imgs/houses/IMG_4886.HEIC'.replace(/\s+/g, '_');
  

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
            style={{ backgroundImage: `url(${firstImageHouse})` }}
            onClick={() => setActiveTab('houses')}
          >
            <div className="category-overlay">
              <h2>House Paintings</h2>
            </div>
          </div>
          
          <div 
            className="category-card"
            style={{ backgroundImage: `url(${firstImageAnimal})` }}
            onClick={() => setActiveTab('animals')}
          >
            <div className="category-overlay">
              <h2>Animals</h2>
            </div>
          </div>
          
          <div 
            className="category-card"
            style={{ backgroundImage: `url(${firstImageCar})` }}
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
