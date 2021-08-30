import React from 'react'
import {UpdateDialog} from './UpdateDialog'

export {
    User
}

class User extends React.Component {

    constructor(props) {
        super(props)
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleDelete() {
        this.props.onDelete(this.props.user)
    }

    render() {
        let date = new Date(this.props.user.entity.dateBirth);
        return (
            <tr>
                <td>{this.props.user.entity.firstName}</td>
                <td>{this.props.user.entity.lastName}</td>
                <td>{date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()}</td>
                <td>
                    <UpdateDialog user={this.props.user}
                                  attributes={this.props.attributes}
                                  onUpdate={this.props.onUpdate} />
                </td>
                <td>
                    <button onClick={this.handleDelete}>Delete</button>
                </td>
            </tr>
        )
    }
}