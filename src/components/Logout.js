import React, { Component } from 'react';
import client from '../api/feathers';

class Logout extends Component {
  render() {
    return <button type="button" className="logout" onClick={() => client.logout()}>
      Log out
    </button>;
  }
}

export default Logout;
