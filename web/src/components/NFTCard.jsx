import React from 'react';

const NFTCard = ({ number, price, isFree }) => {
  const styles = {
    card: {
      width: 201,
      height: 267,
      backgroundColor: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'Arial, sans-serif',
      padding: '30px',
      paddingTop: '50px',
      position: 'relative',
    },
    title: {
      fontSize: '55px',
      fontFamily: "'Dancing Script', cursive",
      fontWeight: '400',
    },
    number: {
      fontSize: '72px',
      fontWeight: '800',
      color: 'transparent',
      WebkitTextStroke: '1px black',
    },
    price: {
      fontSize: '17px',
      fontWeight: '600',
      position: 'relative',
    },
    strike: {
      textDecoration: 'line-through',
      textDecorationColor: '#8b0000',
      textDecorationThickness: '2px',
      color: '#000',
    },
    free: {
      color: '#8b4513',
      fontWeight: 'bold',
      fontSize: '20px',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.title}>NFT</div>
      <div style={styles.number}>#{number}</div>

      {isFree ? (
        <div>
          <div style={{ ...styles.price, ...styles.strike }}>{price} ETH</div>
          <div style={styles.free}>FREE</div>
        </div>
      ) : (
        <div style={styles.price}>{price} ETH</div>
      )}
    </div>
  );
};

export default NFTCard;
