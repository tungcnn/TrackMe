import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './DevicesList.css';
import { browserHistory } from 'react-router';
import Constants from '../../configs/constants';

class DevicesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: null,
            data: [],
        }
    }
    componentWillMount() {
        this.setState({
            username: this.props.location.state.username
        })
    }

    componentDidMount = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log(token)
            console.log(this.state.username)
            const res = await fetch(`${Constants.ROOT_URL}/api/users/${this.state.username}/devices`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            const resJSON = await res.json();
            const devicesList = resJSON.map((item, index) => {
                return {
                    user: item.user,
                    device: item.name
                }
            })
            console.log(resJSON)
            this.setState({
                data: devicesList
            })
        } catch (err) {
            alert(err);
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

    renderTableData = () => {
        return this.state.data.map((item, index) => {
            const { user, device } = item;
            return (
                <tr key={index}>
                    <td>{user}</td>
                    <td>{device}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div className="screen">
                <table id='devices-list'>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Device</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default DevicesList