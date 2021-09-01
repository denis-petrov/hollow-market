import React from 'react'
import {UserList} from './UserList'
import {CreateDialog} from './CreateDialog'

const client = require('../client/client')
const follow = require('../client/follow')
const when = require('when')
const root = '/api'
const stompClient = require('../listener/websocket-listener')

export {
    App
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {users: [], attributes: [], page: 1, pageSize: 2, links: {}};
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.refreshCurrentPage = this.refreshCurrentPage.bind(this)
        this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this)
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
        follow(client, root, ['users']).then(response => {
            return client({
                method: 'POST',
                path: response.entity._links.self.href,
                entity: newUser,
                headers: {'Content-Type': 'application/json'}
            })
        })
    }

    onUpdate(user, updatedUser) {
        client({
            method: 'PUT',
            path: user.entity._links.self.href,
            entity: updatedUser,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': user.headers.Etag
            }
        })
    }

    onDelete(user) {
        client({method: 'DELETE', path: user.entity._links.self.href})
    }

    onNavigate(navUri) {
        client({
            method: 'GET', path: navUri
        }).then(userCollection => {
            this.links = userCollection.entity._links

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

    refreshAndGoToLastPage(message) {
        follow(client, root, [{
            rel: 'users',
            params: {size: this.state.pageSize}
        }]).done(response => {
            if (response.entity._links.last !== undefined) {
                this.onNavigate(response.entity._links.last.href)
            } else {
                this.onNavigate(response.entity._links.self.href)
            }
        })
    }

    refreshCurrentPage(message) {
        follow(client, root, [{
            rel: 'users',
            params: {
                size: this.state.pageSize,
                page: this.state.page.number
            }
        }]).then(userCollection => {
            this.links = userCollection.entity._links
            this.page = userCollection.entity.page

            return userCollection.entity._embedded.users.map(user => {
                return client({
                    method: 'GET',
                    path: user._links.self.href
                })
            })
        }).then(userPromises => {
            return when.all(userPromises)
        }).then(users => {
            this.setState({
                page: this.page,
                users: users,
                attributes: Object.keys(this.schema.properties),
                pageSize: this.state.pageSize,
                links: this.links
            })
        })
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize)
        stompClient.register([
            {route: '/topic/newUser', callback: this.refreshAndGoToLastPage},
            {route: '/topic/updateUser', callback: this.refreshCurrentPage},
            {route: '/topic/deleteUser', callback: this.refreshCurrentPage},
        ])
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
