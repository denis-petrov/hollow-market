'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const client = require('./client')

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {users: []}
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/users'}).done(response => {
            this.setState({users: response.entity._embedded.users})
        })
    }

    render() {
        return (
            <UserList users={this.state.users}/>
        )
    }
}

class UserList extends React.Component {

    render() {
        const users = this.props.users.map(user =>
            <User key={user._links.self.href} user={user}/>
        )
        return (
            <table>
                <tbody>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Date Birth</th>
                </tr>
                {users}
                </tbody>
            </table>
        )
    }
}

class User extends React.Component {

    render() {
        let date = new Date(this.props.user.dateBirth);
        return (
            <tr>
                <td>{this.props.user.firstName}</td>
                <td>{this.props.user.lastName}</td>
                <td>{date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()}</td>
            </tr>
        )
    }
}


ReactDOM.render(
    <App/>,
    document.getElementById('react')
)