import React, { Component } from 'react';

// Utilities
import each from 'lodash/each';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// API
import client from '../api/feathers';

// Components
import Login from './Login';
import Footer from './Footer';
import Header from './Header';
import Transaction from './Transaction';

// Styles
import './_vars_colors.css';
import './_vars_layout.css';
import './App.css';

// Feature flags
import fflip from 'fflip';
const fflipConfig = require('../config/fflip_config.js');
fflip.config(fflipConfig);

// Draggable helper functions
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const bodyStyles = window.getComputedStyle(document.body);
const getItemStyle = (isDragging, draggableStyle) => ({

  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging

  background: isDragging ? bodyStyles.getPropertyValue('--blue-one') : 'none',
  color: isDragging ? bodyStyles.getPropertyValue('--blue-four') : 'inherit',
  border: isDragging ? `1px solid ${bodyStyles.getPropertyValue('--blue-two')}` : 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
});

// const getListStyle = isDraggingOver => ({
//   background: isDraggingOver ? 'lightblue' : 'lightgrey',
//   width: 250,
// });

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    const transactions = client.service('transactions');
    // const users = client.service('users');

    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => this.setState({ login: null }));

    // On successfull login
    client.on('authenticated', login => {
      // Get all users and transactions
      Promise.all([
        transactions.find({
          query: {
            $sort: { weight: -1, createdAt: -1 },
            $limit: 25
          }
        }),
        // users.find()
      ]).then( ([
        transactionPage,
        // userPage
      ]) => {
        // We want the latest transactions but in the reversed order
        const transactions = transactionPage.data.reverse();
        // const users = userPage.data;

        // Once both return, update the state
        // this.setState((state, props) => ({ login, transactions, users }));
        this.setState((state, props) => ({ login, transactions }));
      });

    });

    // On logout reset all all local state (which will then show the login screen)
    client.on('logout', () => this.setState((state, props) => ({
      login: null,
      transactions: null,
      // users: null
    })));

    // Add new transactions to the transaction list
    transactions.on('created', transaction => {
      const transactions = this.state.transactions.concat(transaction);
      this.processTransactionOrder(transactions);
    });

    transactions.on('patched', patchedTransaction => {
      const { transactions } = this.state;
      const patchedTransactions = map(transactions, existing => {
        return (existing.id === patchedTransaction.id) ? patchedTransaction : existing;
      });

      // @TODO: This is flickering for the user who is doing the re-ordering. But is necessary for other users?
      this.setState((state, props) => ({ transactions: sortBy(patchedTransactions, 'weight') }));
    });

    // transactions.on('removed', currentTransaction => {
    //   console.log('removed');
    //   const currentTransactions = map(this.state.transactions, existing => {
    //     if (existing.id !== currentTransaction.id) {
    //       return existing;
    //     }
    //   });

    //   this.setState((state, props) => ({ transactions: currentTransactions }));
    // });
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const transactions = reorder(
      this.state.transactions,
      result.source.index,
      result.destination.index
    );

    // setState is now handled in processTransactionOrder()

    this.processTransactionOrder(transactions);
  }

  processTransactionOrder(transactions) {
    // Iterate over each one updating balances
    let balance = 0;
    const transactionsToUpdate = [];

    each(transactions, (item, index) => {
      // @TODO: This weight/index concept is going to break when we get more transactions than are displayed.
      // @TODO: What to do about dates?
      if (item.balance - item.amount !== balance) {
        item.balance = balance + item.amount;
        transactionsToUpdate.push({ id: item.id, balance: item.balance, weight: index });
      }

      balance = item.balance;
    })

    this.setState({
      transactions,
    });

    // @TODO: Why are all the transactions here? When sorting the bottom of the list the top doesn't need to be updated
    each(transactionsToUpdate, item => client.service('transactions')
      .patch(item.id, { balance: item.balance, weight: item.weight })
      .catch(error => this.setState((state, props) => ({ error }))));
  }

  render() {
    const { transactions, error } = this.state;
    let output = '';

    const messages = error && error.message ? <p className="error">{error.message}</p> : '';

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

        <div className="error">{messages}</div>

        <DragDropContext
          onDragStart={this.onDragStart}
          onDragUpdate={this.onDragUpdate}
          onDragEnd={this.onDragEnd}
        >
          <Droppable
            droppableId="transaction-list"
            type="transaction"
          >
            {(provided, snapshot) => (
              <main
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {transactions.map((transaction, index) => (
                  <Draggable
                    key={transaction.id}
                    draggableId={transaction.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <Transaction
                          id={transaction.id}
                          description={transaction.description}
                          amount={transaction.amount}
                          balance={transaction.balance}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </main>
            )}
          </Droppable>
        </DragDropContext>
        <Footer />
      </div>);
    } else {
      output = <Login />;
    }

    return output;
  }
}

export default Application;
