import React from 'react';
import Gallery from '../components/Gallery';
import artworks from '../data/artworks';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h2>Welcome to my portfolio</h2>
        <p>Explore a collection of my latest artworks.</p>
      </section>
      <Gallery art={artworks} />
    </div>
  );
}

export default Home;
