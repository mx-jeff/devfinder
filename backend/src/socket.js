const socket_io = require('socket.io')
const stringAsArray = require('./utils/stringToArray')
const calculateDistance = require('./utils/calculateDistance')

let io
const connections = []

exports.setupSocket = server => {
    io = socket_io(server)

    io.on('connection', socket => {
        const { latitude, longitude, input } = socket.handshake.query
        const techs = input

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },

            techs: stringAsArray(techs)
        })

        console.log(connections)
    })
}

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
      return calculateDistance(coordinates, connection.coordinates) < 10
        && connection.techs.some(item => techs.includes(item))
    });
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data)
    })
}