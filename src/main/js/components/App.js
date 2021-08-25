import {React} from 'react'
import {UserList} from './UserList'

const client = require('../client')
const follow = require('../follow')
const root = '/api'

export {
    App
}

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {users: []}
    }

    loadFromServer(pageSize) {
        follow(client, root, [
            {rel: 'users', params: {size: pageSize}}
        ]).then(userCollection => {
            return client({
                method: 'GET',
                path: userCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.emtity
                return userCollection
            })
        }).done(userCollection => {
            this.setState({
                users: userCollection.entity._embedded.users,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: userCollection.entity._links
            })
        })
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize)
    }

    render() {
        return (
            <UserList users={this.state.users}/>
        )
    }
}
