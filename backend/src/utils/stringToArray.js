module.exports = function stringAsArray(arrayToString){
    return arrayToString.split(',').map(tech => tech.trim())
}