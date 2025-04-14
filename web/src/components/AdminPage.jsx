import React, { useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import { useAdvertisement } from '../hooks/useAdvertisement';
import { useApproveAdvertisement } from '../hooks/useApproveAdvertisement';
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
  const { mutate, isPending } = useApproveAdvertisement();
  return (
    <Card style={{ width: '18rem', border: 'none' }}>
      <Card.Img variant="top" src={item.metadata.image} style={{ height: 261, objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title>{item.metadata.name}</Card.Title>
        <Card.Text>
          {item.metadata.description}
        </Card.Text>
        <Button variant="primary" onClick={() => mutate({ tokenId: item.tokenId })} disabled={isPending}>
          {isPending ? <Spinner size='sm' animation="border" role="status" style={{ marginRight: 10 }} /> : null}
          Approve
        </Button>
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

  const items = useMemo(() => (data?.list || []).filter((item) => item.minted && !item.isApproved), [data]);

  return (
    <div style={{ marginTop: 50 }}>
      <Container style={{ border: '2px dashed #212529' }}>
        {items.length ? <PhotoGallery data={items} />
          : <h5 style={{ textAlign: 'center', margin: 20 }}>No advertisement found for approval</h5>}
      </Container>
      <br />
    </div>
  );
};

export default AdminPage;