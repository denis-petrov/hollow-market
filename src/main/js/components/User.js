import React from 'react'

export {
    User
}

class User extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleDelete() {
        this.props.onDelete(this.props.user)
    }

    render() {
        let date = new Date(this.props.user.dateBirth);
        return (
            <tr>
                <td>{this.props.user.firstName}</td>
                <td>{this.props.user.lastName}</td>
                <td>{date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()}</td>
                <td>
                    <button onClick={this.handleDelete}>Delete</button>
                </td>
            </tr>
        )
    }
}