
const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    maxWidth: '100%',
    maxHeight: 100,
    backgroundColor: 'rgba(201, 201, 201, 0.2)',
    borderRadius: 8,
    margin: 8,
  },
  image: {
    width: 90,
    borderRadius: 8,
    height: 90,
    objectFit: 'cover',
  },
  number: {
    fontSize: '35px',
    fontWeight: '800',
    color: 'transparent',
    WebkitTextStroke: '1px black',
    fontFamily: 'Arial, sans-serif',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
}

export const WebsiteRenderer = ({ data }) => {
  const rawUrl = data?.metadata?.attributes?.[3]?.value || '';
  const hasProtocol = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');
  const url = hasProtocol ? rawUrl : `https://${rawUrl}`;

  return (
    <div style={styles.container}>
      {rawUrl ? <a target='_blank' href={url} rel="noopener noreferrer">View Website</a> : '-'}
    </div>
  )
}