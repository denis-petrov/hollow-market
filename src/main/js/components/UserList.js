import * as React from 'react'
import {User} from './User'

export {
    UserList
}

class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this)
        this.handleNavPrev = this.handleNavPrev.bind(this)
        this.handleNavNext = this.handleNavNext.bind(this)
        this.handleNavLast = this.handleNavLast.bind(this)
        this.handleInput = this.handleInput.bind(this)
    }

    handleInput(e) {
        e.preventDefault()
        const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value
        if (/^[0-9]+$/.test(pageSize)) {
            this.props.updatePageSize(pageSize)
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1)
        }
    }

    handleNavFirst(e) {
        e.preventDefault()
        this.props.onNavigate(this.props.links.first.href)
    }

    handleNavPrev(e) {
        e.preventDefault()
        this.props.onNavigate(this.props.links.prev.href)
    }

    handleNavNext(e) {
        e.preventDefault()
        this.props.onNavigate(this.props.links.next.href)
    }

    handleNavLast(e) {
        e.preventDefault()
        this.props.onNavigate(this.props.links.last.href)
    }

    render() {
        const users = this.props.users.map(user =>
            <User key={user._links.self.href} user={user}/>
        )

        const navLinks = []
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>)
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>)
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>)
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>)
        }

        return (
            <div>
                <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
                <table>
                    <tbody>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date Birth</th>
                            <th></th>
                        </tr>
                        {users}
                    </tbody>
                </table>
                <div>
                    {navLinks}
                </div>
            </div>
        )
    }
}