import React from 'react'
import {UserList} from './UserList'
import {CreateDialog} from './CreateDialog'

const client = require('../client')
const follow = require('../follow')
const when = require('when')
const root = '/api'

export {
    App
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {users: [], attributes: [], pageSize: 2, links: {}};
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
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
                this.links = userCollection.entity._links
                return userCollection
            })
        }).then(userCollection => {
            return userCollection.entity._embedded.users.map(user =>
                client({
                    method: 'GET',
                    path: user._links.self.href
                })
            )
        }).then(userPromises => {
            return when.all(userPromises)
        }).done(users => {
            this.setState({
                users: users,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: this.links
            })
        })
    }

    onCreate(newUser) {
        const self = this
        follow(client, root, ['users']).then(response => {
            return client({
                method: 'POST',
                path: response.entity._links.self.href,
                entity: newUser,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {
            return follow(client, root, [
                {rel: 'users', params: {'size': self.state.pageSize}}
            ])
        }).done(response => {
            if (typeof response.entity._links.last !== "undefined") {
                this.onNavigate(response.entity._links.last.href)
            } else {
                this.onNavigate(response.entity._links.self.href)
            }
        })
    }

    onUpdate(user, updatedUser) {
        console.log("user:" + user)
        console.log("updatedUser:" + updatedUser)
        client({
            method: 'PUT',
            path: user.entity._links.self.href,
            entity: updatedUser,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': user.headers.Etag
            }
        }).done(response => {
            this.loadFromServer(this.state.pageSize)
        }, response => {
            if (response.status.code === 412) {
                alert('DENIED: Unable to update ' + user.entity._links.self.href + '. Your copy is stale')
            }
        })
    }

    onDelete(user) {
        client({method: 'DELETE', path: user.entity._links.self.href}).done(response => {
            this.loadFromServer(this.state.pageSize)
        })
    }

    onNavigate(navUri) {
        client({
            method: 'GET', path: navUri
        }).then(userCollection => {
            this.links = userCollection.entity._links

            return userCollection.entity._embedded.users.map(user => {
                client({
                    method: 'GET',
                    path: user._links.self.href
                })
            })
        }).then(userPromises => {
            return when.all(userPromises)
        }).done(users => {
                this.setState({
                    users: users,
                    attributes: Object.keys(this.schema.properties),
                    pageSize: this.state.pageSize,
                    links: this.links
                })
            })
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
                          attributes={this.state.attributes}
                          onNavigate={this.onNavigate}
                          onUpdate={this.onUpdate}
                          onDelete={this.onDelete}
                          updatePageSize={this.updatePageSize}/>
            </div>
        )
    }
}
