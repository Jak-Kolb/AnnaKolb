import React, { useState } from 'react';
import './Gallery.css';

function Gallery({ art }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  return (
    <>
      <div className="gallery">
        {art.map((artwork) => (
          <div key={artwork.id} className="gallery-item">
            <img 
              src={artwork.src} 
              alt={artwork.title} 
              onClick={() => openModal(artwork)}
            />
            <h3>{artwork.title}</h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <span className="close-button">&times;</span>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.title} />
            <h2>{selectedImage.title}</h2>
          </div>
        </div>
      )}
    </>
  );
}

export default Gallery;
