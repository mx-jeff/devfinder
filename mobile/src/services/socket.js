import socketIo from 'socket.io-client'

const socket = socketIo(`http://192.168.15.9:3333`, {
    autoConnect: false
})

function subscribeToNewUsers(subscribeCallback){
    socket.on('new-user', subscribeCallback)
}

function connect(latitude, longitude, input){
    
    socket.io.opts.query = {
        latitude,
        longitude,
        input
    }
    
    socket.connect()
}

function disconnect(){
    if(socket.connected){
        socket.disconnect()
    }
}

export {
    connect,
    disconnect,
    subscribeToNewUsers,
}