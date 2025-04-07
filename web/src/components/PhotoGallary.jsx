import React, { Fragment, useState } from 'react';
import { Spinner } from 'react-bootstrap';

const styles = {
  galleryContainer: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  textCenter: {
    textAlign: 'center',
  },
  mb4: {
    marginBottom: '1.5rem',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
  },
  galleryItem: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: 201,
    height: 267
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
  },
  galleryImageHover: {
    transform: 'scale(1.1)',
  },
  spinnerContainer: {
    display: 'flex',
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
};

const GalleryItem = ({ image }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <Fragment>
      {!loaded && (
        <div style={styles.spinnerContainer}>
          <Spinner animation="border" role="status" />
        </div>
      )}
      <img
        src={image}
        style={styles.galleryImage}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
        onLoad={() => setLoaded(true)}
      />
    </Fragment>
  )
}

const PhotoGallery = ({ data }) => {
  return (
    <div style={styles.galleryContainer}>
      <div style={styles.gallery}>
        {(data || []).map((item, index) => (
          <div
            key={index}
            style={styles.galleryItem}
          >
            <GalleryItem image={item.image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
