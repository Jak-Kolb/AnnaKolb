const artworks = [
  { id: 1, src: 'https://via.placeholder.com/600x400', title: 'Artwork 1' },
  { id: 2, src: 'https://via.placeholder.com/600x400', title: 'Artwork 2' },
  { id: 3, src: 'https://via.placeholder.com/600x400', title: 'Artwork 3' },
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

ReactDOM.render(<App />, document.getElementById('root'));

