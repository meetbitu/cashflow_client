import React, { Component } from 'react';

// Styles
import './Transaction.css';

class Transaction extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { description, amount, balance } = this.props;

    return (
      <div className="transaction">
        <span className="description">{description}</span>
        <span className="amount">{amount}</span>
        <span className="balance">{balance}</span>
        {this.state.error && this.state.error.message}
      </div>
    );
  }
}

export default Transaction; // Don’t forget to use export default!
