import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Register.css';
import { browserHistory } from 'react-router';
import Constants from '../../configs/constants';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
        }
    }

    onRegister = () => {
        if (this.state.password !== this.state.confirmPassword) {
            alert('Password does not match');
        } else {
            fetch(`${Constants.ROOT_URL}/api/registration`, {
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
                        alert(resJSON.message);
                        browserHistory.push({
                            pathname: '/'
                        })
                    } else {
                        alert('Registration failed!');
                    }
                }).catch(err => {
                    console.log(err);
                    alert('Registration failed!');
                })

        }
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
                    <p>Confirm Password</p>
                    <input
                        type="password"
                        name="password"
                        value={this.state.confirmPassword}
                        onChange={(event) => { this.setState({ confirmPassword: event.target.value }) }} />
                    <p></p>
                    <button onClick={this.onRegister}>Register</button>
                </div>
            </div>
        )
    }
}

export default Register