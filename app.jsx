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
      </main>
      <footer>
        <p>&copy; 2025 Anna Kolb. All rights reserved.</p>
      </footer>
    </>
  );
}

// Update to React 18 rendering method
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

