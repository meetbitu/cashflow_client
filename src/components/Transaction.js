import React, { Component } from 'react';

// Utilities
import classNames from 'classnames'

// Styles
import './Transaction.css';

class Transaction extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { description, amount, balance } = this.props;

    const transactionClasses = classNames({
      transaction: true,
      negative: (balance < 0),
    });

    return (
      <div className={transactionClasses}>
        <span className="description">{description}</span>
        <span className="amount">{amount.toFixed(2)}</span>
        <span className="balance">{balance.toFixed(2)}</span>
        {this.state.error && this.state.error.message}
      </div>
    );
  }
}

export default Transaction; // Don’t forget to use export default!
