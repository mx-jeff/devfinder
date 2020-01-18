const mongoose = require('mongoose')

const mongoDB = mongoose.connect('mongodb+srv://root:toor@cluster0-7n4em.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})


module.exports = mongoDB