import * as React from 'react'

export {
    User
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