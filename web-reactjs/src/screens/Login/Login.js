import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Login.css';
import { browserHistory } from 'react-router';
import Constants from '../../configs/constants';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
        }
    }

    onLogin = () => {
        fetch(`${Constants.ROOT_URL}/api/authenticate`, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                user: this.state.username,
                password: this.state.password
            })
        }).then(response => response.json())
            .then(resJSON => {
                if (resJSON.success) {
                    localStorage.setItem('token', resJSON.token);
                    browserHistory.push({
                        pathname: '/DevicesList',
                        state: {
                            username: this.state.username
                        }
                    })
                } else {
                    alert('Login failed!');
                }
            }).catch(err => {
                console.log(err);
                alert('Login failed!');
            })
    }

    navigateToRegister = () => {
        browserHistory.push({
            pathname: '/Register',
        })
    }

    render() {
        return (
            <div className="screen">
                <div className="inputForm">
                    <p>Name</p>
                    <input
                        type="text"
                        name="name"
                        value={this.state.username}
                        onChange={(event) => { this.setState({ username: event.target.value }) }} />
                    <p>Password</p>
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={(event) => { this.setState({ password: event.target.value }) }} />
                    <p></p>
                    <button onClick={this.onLogin}>Login</button>
                    <p></p>
                    <button onClick={this.navigateToRegister}>
                        Don't have account? Register here.
                    </button>
                </div>
            </div>
        )
    }
}

export default Login