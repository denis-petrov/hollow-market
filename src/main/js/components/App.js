import * as React from 'react'
import {UserList} from './UserList'
import {CreateDialog} from './CreateDialog'

const client = require('../client')
const follow = require('../follow')
const root = '/api'

export {
    App
}

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {users: [], attributes: [], pageSize: 2, links: {}}
        this.updatePageSize = this.updatePageSize.bind(this)
        this.onCreate = this.onCreate.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onNavigate = this.onNavigate.bind(this)
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
                this.schema = schema.entity
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

    onCreate(newUser) {
        follow(client, root, ['users']).then(userCollection => {
            return client({
                method: 'POST',
                path: userCollection.entity._links.self.href,
                entity: newUser,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(() => {
            return follow(client, root, [
                {rel: 'users', params: {'size': this.state.pageSize}}
            ])
        }).done(response => {
            if (typeof response.entity._links.last !== "undefined") {
                this.onNavigate(response.entity._links.last.href)
            } else {
                this.onNavigate(response.entity._links.self.href)
            }
        })
    }

    onDelete(user) {
        client({method: 'DELETE', path: user._links.self.href}).done(response => {
            this.loadFromServer(this.state.pageSize)
        })
    }

    onNavigate(navUri) {
        client({method: 'GET', path: navUri}).done(userCollection => {
            this.setState({
                employees: userCollection.entity._embedded.employees,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                links: userCollection.entity._links
            });
        });
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize)
        }
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize)
    }

    render() {
        return (
            <div>
                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
                <UserList users={this.state.users}
                          links={this.state.links}
                          pageSize={this.state.pageSize}
                          onNabigate={this.onNavigate}
                          onDelete={this.onDelete}
                          updatePageSize={this.updatePageSize}/>
            </div>
        )
    }
}
