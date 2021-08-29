import React from 'react'
import ReactDOM from 'react-dom'

export {
    CreateDialog
}

class CreateDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();
        const newUser = {};
        this.props.attributes.forEach(attribute => {
            newUser[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
        })
        this.props.onCreate(newUser)
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '' // clear out the dialog's inputs
        })
        window.location = "#"
    }

    render() {
        const inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field"/>
            </p>
        )

        return (
            <div>
                <a href="#createUser">Create</a>

                <div id="createUser" className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>

                        <h2>Create new user</h2>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}