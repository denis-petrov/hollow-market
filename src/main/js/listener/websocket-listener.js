'use strict'

const SockJS = require('sockjs-client')
require('stompjs')

function register(registrations) {
    const socket = SockJS('/payroll')
    const stompClient = Stomp.over(socket)
    stompClient.connect({}, () => {
        registrations.forEach(registration => {
            stompClient.subscribe(registration.route, registration.callback)
        })
    })
}

module.exports.register = register;