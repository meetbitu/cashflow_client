import React, { Component } from 'react';

// Components
import Logout from './Logout';
import AddTransaction from './AddTransaction';

// Styles
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { login } = this.props;
    let output = null;

    if (login) {
      output = (
        <header>
          <strong>Cash flow</strong>
          <AddTransaction />
          <Logout />
        </header>
      );
    } else {
      output = (
        <header>
          <strong>Cash flow</strong>
        </header>
      );
    }

    return output;
  }
}

export default Header;
