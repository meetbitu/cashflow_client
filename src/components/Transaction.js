import React, { Component } from 'react';

// Styles
import './Transaction.css';

class Transaction extends Component {
  render() {
    const { description, amount } = this.props;

    return (
      <div className="transaction">
        <span className="description">{description}</span>
        <span className="amount">{amount}</span>
      </div>
    );
  }
}

export default Transaction; // Don’t forget to use export default!
