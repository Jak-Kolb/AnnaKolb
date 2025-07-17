import React, { useState } from 'react';
import './Gallery.css';

function Gallery({ art }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  const handleImageError = (artworkId, src) => {
    console.warn(`Failed to load image: ${src}`);
    setImageErrors(prev => new Set(prev).add(artworkId));
  };

  const getFallbackSrc = (originalSrc) => {
    // Try to convert HEIC to JPG if the original fails
    if (originalSrc.toLowerCase().endsWith('.heic')) {
      return originalSrc.replace(/\.heic$/i, '.jpg');
    }
    return originalSrc;
  };

  return (
    <>
      <div className="gallery">
        {art.map((artwork) => {
          const hasError = imageErrors.has(artwork.id);
          const displaySrc = hasError ? getFallbackSrc(artwork.src) : artwork.src;
          
          return (
            <div key={artwork.id} className="gallery-item">
              <img 
                src={displaySrc} 
                alt={artwork.title} 
                onClick={() => openModal(artwork)}
                onError={() => handleImageError(artwork.id, artwork.src)}
                style={{ 
                  opacity: hasError ? 0.7 : 1,
                  filter: hasError ? 'grayscale(50%)' : 'none'
                }}
              />
              <h3>{artwork.title}</h3>
              {hasError && (
                <small style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>
                  Image format may not be supported
                </small>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <span className="close-button">&times;</span>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title}
              onError={(e) => {
                const fallbackSrc = getFallbackSrc(selectedImage.src);
                if (fallbackSrc !== selectedImage.src) {
                  e.target.src = fallbackSrc;
                }
              }}
            />
            <h2>{selectedImage.title}</h2>
          </div>
        </div>
      )}
    </>
  );
}

export default Gallery;
