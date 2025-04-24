import React from 'react';
import Container from 'react-bootstrap/Container'
import AdminTable from '../components/adminTable';



const AdminPage = () => {
  return (
    <div style={{ marginTop: 50, textAlign: 'left' }}>
      <Container>
        <AdminTable />
      </Container>
      <br />
    </div>
  );
};

export default AdminPage;