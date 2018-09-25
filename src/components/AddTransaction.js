import React, { Component } from 'react';

// API
import client from '../api/feathers';

// Styles
import './AddTransaction.css';

class AddTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateField(name, event) {
    this.setState({ [name]: event.target.value });
  }

  updateNumberField(name, event) {
    this.setState({ [name]: parseInt(event.target.value, 10) });
  }

  add() {
    const { description, amount, balance } = this.state;

    return client.service('transactions')
      .create({ description, amount, balance })
      .then(() => this.setState({
        description: null,
        amount: null,
        balance: null,
      }))
      .catch(error => this.setState({ error }));
  }

  render() {
    const error = this.state.error && this.state.error.message ? <p className="error">{this.state.error.message}</p> : '';

    return (
      <form className="add-transaction-form">
        {error}
        <input
          type="textfield"
          name="description"
          placeholder="description"
          onChange={event => this.updateField('description', event)}
        />
        <input
          type="textfield"
          name="amount"
          placeholder="amount"
          onChange={event => this.updateNumberField('amount', event)}
        />
        <input
          type="textfield"
          name="balance"
          placeholder="balance (optional)"
          onChange={event => this.updateNumberField('balance', event)}
        />
        <button type="button" className="add-transaction" onClick={() => this.add()}>
          Add transaction
        </button>
      </form>
    );
  }
}

export default AddTransaction;
