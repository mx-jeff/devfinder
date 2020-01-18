const User = require('../models/User')
const stringAsArray = require('../utils/stringToArray')

module.exports = {
    async index(request, response){
        //Buscas Usuario em 10km
        //Filtrar por techs
        
        const { latitude, longitude, techs } = request.query
        
        const techsArray = stringAsArray(techs)

        const users = await User.find({
            techs: { $in: techsArray },
            location: { 
                $near: { 
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000,
                }, 
            },
        })


        return response.json(users)
    },

    async update(request, response){
        //Não alterar o usuario do github!
        null
    },

    async destroy(request, response){
        null
    }
}