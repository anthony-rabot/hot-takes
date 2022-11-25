const mongoose = require("mongoose")

function mongooseConnexion(uri) {
    mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('Connexion à MongoDB réussie !'))
        .catch((error) => console.log('Connexion à MongoDB échouée !', error))
}

module.exports = mongooseConnexion