import React, { Component } from 'react';

// API
import client from '../api/feathers';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateField(name, event) {
    this.setState({ [name]: event.target.value });
  }

  login() {
    const { email, password } = this.state;

    return client.authenticate({
      strategy: 'local',
      email, password
    }).catch(error => this.setState({ error }));
  }

  signup() {
    const { email, password, firstName, lastName } = this.state;

    return client.service('users')
      .create({ email, password, firstName, lastName })
      .then(() => this.login())
      .catch(error => this.setState({ error }));
  }


  render() {
    return <main className="login container">
      <div className="row">
        <div>
          <h1>Log in or signup</h1>
          <p>{this.state.error && this.state.error.message}</p>
        </div>
      </div>
      <div>
        <div>
          <form className="form">
            <fieldset>
              <input className="block" type="email" name="email" placeholder="email" onChange={event => this.updateField('email', event)} />
            </fieldset>

            <fieldset>
              <input className="block" type="password" name="password" placeholder="password" onChange={event => this.updateField('password', event)} />
            </fieldset>

            <fieldset>
              <input className="block" type="textfield" name="first" placeholder="first name" onChange={event => this.updateField('firstName', event)} />
            </fieldset>

            <fieldset>
              <input className="block" type="textfield" name="last" placeholder="last name" onChange={event => this.updateField('lastName', event)} />
            </fieldset>

            <button type="button" className="button button-primary block signup" onClick={() => this.login()}>
              Log in
            </button>

            <button type="button" className="button button-primary block signup" onClick={() => this.signup()}>
              Signup
            </button>
          </form>
        </div>
      </div>
    </main>;
  }
}
