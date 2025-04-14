import { ConnectButton } from '@rainbow-me/rainbowkit';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useIsAdmin } from '../hooks/useAdmin';

const Header = () => {
  const isAdmin = useIsAdmin();
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/"><b>BlockchainBillboard</b> 🐎</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/getting-started">Getting Started</Nav.Link>
            <Nav.Link href="/issue-advertisement">Issue Advertisement</Nav.Link>
            <Nav.Link href="https://testnets.opensea.io/collection/blockchain-billboard-nfts" target='_blank'>NFT Store</Nav.Link>
            <Nav.Link href="mailto:contact@blockchainbillboard.io?&subject=The%20subject%20of%20the%20email&body=The%20body%20of%20the%20email">Contact Us</Nav.Link>
            {isAdmin ? <Nav.Link href="/admin">Admin</Nav.Link> : null}
          </Nav>
          <Nav style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <ConnectButton />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Header;