import React, { Component } from 'react';

// API
import client from '../api/feathers';

// Components
import Login from './Login';
import Footer from './Footer';
import Header from './Header';
import Transaction from './Transaction';
// import Chat from './chat';

// Styles
import './_vars_colors.css';
import './_vars_layout.css';
import './App.css';

// Feature flags
import fflip from 'fflip';
const fflipConfig = require('../config/fflip_config.js');
fflip.config(fflipConfig);

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const transactions = client.service('transactions');
    const users = client.service('users');

    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => this.setState({ login: null }));

    // On successfull login
    client.on('authenticated', login => {
      // Get all users and transactions
      Promise.all([
        transactions.find({
          query: {
            $sort: { createdAt: -1 },
            $limit: 25
          }
        }),
        users.find()
      ]).then( ([
        transactionPage,
        userPage
      ]) => {
        // We want the latest transactions but in the reversed order
        const transactions = transactionPage.data.reverse();
        const users = userPage.data;

        // Once both return, update the state
        // this.setState({ login, transactions, users });
        this.setState({ login, transactions, users });
      });

    });

    // On logout reset all all local state (which will then show the login screen)
    client.on('logout', () => this.setState({
      login: null,
      transactions: null,
      users: null
    }));

    // Add new transactions to the transaction list
    transactions.on('created', transaction => this.setState({
      transactions: this.state.transactions.concat(transaction)
    }));

    // Add new users to the user list
    users.on('created', user => this.setState({
      users: this.state.users.concat(user)
    }));
  }

  render() {
    const { transactions } = this.state;
    let output = '';

    if (this.state.login === undefined) {
      output = (<div className="content-wrapper">
        <Header login={ this.state.login } />
        <main>
          <h1>Loading...</h1>
        </main>
        <Footer />
      </div>);
    } else if (this.state.login) {
      output = (<div className="content-wrapper">
        <Header
          login={ this.state.login }
        />
        <main>
          <ul>
            {transactions.map(transaction => (
              <Transaction
                key={transaction.id}
                description={transaction.description}
                amount={transaction.amount}
              />
            ))}
          </ul>
        </main>
        <Footer />
      </div>);
    } else {
      output = <Login />;
    }

    return output;
  }
}

export default Application;
