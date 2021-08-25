import {User} from './User'
import React from 'react'

export {
    UserList
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