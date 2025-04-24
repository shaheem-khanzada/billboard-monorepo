import React, { Component } from 'react';
import { Link } from 'react-router';


class DoesNotExistPage extends Component {

  render() {
    return (
      <div>
        <br></br>
        <br></br>
        <br></br>

        <div className="container">
          <h3>Ooopse ~ 😏</h3>
          <h5>Sorry, this page does not exist...</h5>
          <br></br>
          <h6>Please go back to the BlockchainBillboard!</h6>
          <br></br>

          <Link to={'/'}>
            <button className="btn btn-outline-dark">BlockchainBillboard</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default DoesNotExistPage;