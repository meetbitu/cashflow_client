import React, { Component } from 'react';
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

const grid = 8;

const bodyStyles = window.getComputedStyle(document.body);
const getItemStyle = (isDragging, draggableStyle) => ({

  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging

  background: isDragging ? bodyStyles.getPropertyValue('--blue-one') : 'none',
  color: isDragging ? bodyStyles.getPropertyValue('--blue-four') : 'inherit',
  border: isDragging ? `1px solid ${bodyStyles.getPropertyValue('--blue-two')}` : 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
});

// const getListStyle = isDraggingOver => ({
//   background: isDraggingOver ? 'lightblue' : 'lightgrey',
//   padding: grid,
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

    this.setState({
      transactions,
    });
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
                          description={transaction.description}
                          amount={transaction.amount}
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
