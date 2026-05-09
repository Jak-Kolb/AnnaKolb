import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Artwork from './pages/Artwork';
import AnimalPortraits from './pages/AnimalPortraits';
import CarPortraits from './pages/CarPortraits';
import ArtworkMisc from './pages/ArtworkMisc';
import AbstractArt from './pages/AbstractArt';
import AbstractArtGallery from './pages/AbstractArtGallery';
import WorksOnCanvas from './pages/WorksOnCanvas';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/artwork" element={<Artwork />} />
          <Route path="/artwork/animal-portraits" element={<AnimalPortraits />} />
          <Route path="/artwork/car-portraits" element={<CarPortraits />} />
          <Route path="/artwork/miscellaneous" element={<ArtworkMisc />} />
          <Route path="/abstract-art" element={<AbstractArt />} />
          <Route path="/abstract-art/gallery" element={<AbstractArtGallery />} />
          <Route path="/abstract-art/works-on-canvas" element={<WorksOnCanvas />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
