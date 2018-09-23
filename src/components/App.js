import React, { Component } from 'react';

// API
import client from '../api/feathers';

// Components
import Login from './Login';
import Footer from './Footer';
import Header from './Header';
// import Chat from './chat';

// Styles
import './_variables.css';
import './App.css';

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // const transactions = client.service('transactions');
    const users = client.service('users');

    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => this.setState({ login: null }));

    // On successfull login
    client.on('authenticated', login => {
      // Get all users and transactions
      Promise.all([
        // transactions.find({
        //   query: {
        //     $sort: { createdAt: -1 },
        //     $limit: 25
        //   }
        // }),
        users.find()
      ]).then( ([
        // transactionPage,
        userPage
      ]) => {
        // We want the latest transactions but in the reversed order
        // const transactions = transactionPage.data.reverse();
        const transactions = null;
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
    // transactions.on('created', transaction => this.setState({
    //   transactions: this.state.transactions.concat(transaction)
    // }));

    // Add new users to the user list
    users.on('created', user => this.setState({
      users: this.state.users.concat(user)
    }));
  }

  render() {
    if (this.state.login === undefined) {
      return <div className="content-wrapper">
        <Header login={this.state.login} />
        <main>
          <h1>Loading...</h1>
        </main>
        <Footer />
      </div>;
    } else if (this.state.login) {
      return <div className="content-wrapper">
        <Header login={this.state.login} />
        <main>
          <h2>Transations</h2>
        </main>
        <Footer />
      </div>;
    }

    return <Login />;
  }
}

export default Application;
