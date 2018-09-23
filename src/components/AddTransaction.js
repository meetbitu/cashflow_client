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

  add() {
    const { description, amount } = this.state;

    return client.service('transactions')
      .create({ description, amount })
      .then(() => this.setState({
        description: null,
        amount: null,
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
          onChange={event => this.updateField('amount', event)}
        />
        <button type="button" className="add-transaction" onClick={() => this.add()}>
          Add transaction
        </button>
      </form>
    );
  }
}

export default AddTransaction;
