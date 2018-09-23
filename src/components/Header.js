import React from 'react';

// Components
import Logout from './Logout';

// Styles
import './Header.css';

const Header = ({ login }) => {
  if (login) {
    return <header>
      <strong>Cash flow</strong>
      <Logout />
    </header>;
  } else {
    return <header>
      <strong>Cash flow</strong>
    </header>;
  }
}

export default Header;
