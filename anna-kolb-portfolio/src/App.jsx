import React from 'react';
import './App.css'; // Create this file for styling

const artworks = [
  { id: 1, src: '/imgs/eye.png', title: 'Artwork 1' },
  { id: 2, src: '/imgs/art2.png', title: 'Artwork 2' },
  { id: 3, src: '/imgs/art3.png', title: 'Artwork 3' },
];

function Gallery({ art }) {
  return (
    <section className="gallery">
      {art.map(item => (
        <img key={item.id} src={item.src} alt={item.title} />
      ))}
    </section>
  );
}

function App() {
  return (
    <>
      <header>
        <h1>Anna Kolb</h1>
        <p>Art Portfolio</p>
      </header>
      <main>
        <Gallery art={artworks} />
        {/* <section className="about">
          <h2>About Me</h2>
          <p>Welcome to my art portfolio! I am a passionate artist who loves to explore different mediums and styles. My work is inspired by nature, emotions, and the human experience.</p>
          </section> */}
      </main>
      <footer>
        <p>&copy; 2025 Anna Kolb. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
