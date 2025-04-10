import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import { useAdvertisement } from '../hooks/useAdvertisement';

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
    gap: '15px',
    flexWrap: 'wrap',
    display: 'flex',
    justifyContent: 'center',
  },
  galleryItem: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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

const GalleryItem = ({ item }) => {  
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={item.metadata.image} style={{ height: 261, objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title>{item.metadata.name}</Card.Title>
        <Card.Text>
        {item.metadata.description}
        </Card.Text>
        <Button variant="primary">Approve</Button>
      </Card.Body>
    </Card>
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
            <GalleryItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};


const AdminPage = () => {
    const { data } = useAdvertisement();
  
  return (
    <div>
       <div style={{ lineHeight: '16px' }}>
        <Container style={{ border: '2px dashed #212529' }}>
          <br />
          <PhotoGallery data={(data?.list || []).filter((item) => item.isApproved === false)} />
          <br />
        </Container>
        <br />
      </div>
    </div>
  );
};

export default AdminPage;