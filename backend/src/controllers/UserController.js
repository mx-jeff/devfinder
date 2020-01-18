const axios = require('axios')
const User = require('../models/User')
const stringAsArray = require('../utils/stringToArray')
const { findConnections, sendMessage } = require('../socket')

//Index, show, store, update, destroy

module.exports = {
    async index(request, response){
        const users = await User.find()

        return response.json(users)
    },

    async store(request, response){
        const { github_username, techs, latitude, longitude } = request.body
    
        let user = await User.findOne({ github_username })

        if(!user){
            const api = await axios.get(`https://api.github.com/users/${github_username}`)
            const { name = login, avatar_url, bio } = api.data
        
            const techsArray = stringAsArray(techs)    
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            user = await User.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })

            //10km mostre, e techs iguais
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-user', user)
        }

        return response.json(user)
    }
}