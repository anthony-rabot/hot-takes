const fs = require("fs")

module.exports = (req, res, next) => {
    let errorMessages = []

    // Il y a une sauce dans la requête, vérifier si elle est complète et si les valeurs sont conformes
    if (req.body.sauce) {
        let sauceObject = JSON.parse(req.body.sauce)

        const authorisedValues = new RegExp('^[a-zA-ZÀ-ú0-9,\\-\'\\s]+$')

        // Test of sauce name
        if (sauceObject.name && (sauceObject.name.length < 5 || !authorisedValues.test(sauceObject.name)) ) {
            errorMessages.push("Name field should have at least 5 characters and should contain alphanumeric characters or spaces")
        }

        // Test of sauce manufacturer
        if (sauceObject.manufacturer && (sauceObject.manufacturer.length < 3 || !authorisedValues.test(sauceObject.manufacturer)) ) {
            errorMessages.push("Manufacturer field should have at least 3 characters and should contain alphanumeric characters or spaces")
        }

        // Test of sauce description
        if (sauceObject.description && (sauceObject.description.length < 10 || !authorisedValues.test(sauceObject.description)) ) {
            errorMessages.push("Description field should have at least 10 characters and should contain alphanumeric characters or spaces")
        }

        // Test of sauce mainPepper
        if (sauceObject.mainPepper && (sauceObject.mainPepper.length < 4 || !authorisedValues.test(sauceObject.mainPepper)) ) {
            errorMessages.push("Main pepper field should have at least 4 characters and should contain alphanumeric characters or spaces")
        }

        // Test of Heat
        if (!sauceObject.heat || typeof sauceObject.heat !== 'number' || sauceObject.heat < 1 || sauceObject.heat > 10) {
            errorMessages.push("Heat has to be a number between 1 to 10")
        }
    }

    // Test for file extension. If not valid, generate an error and delete file
    if (req.file) {
        const validExtensions = ['png', 'jpeg', 'jpg', 'webp']
        const fileMime = req.file.mimetype
        const fileExtension = fileMime.split('/')

        if (!validExtensions.includes(fileExtension[1]) || fileExtension[1].length === 0) {
            fs.unlink(`images/${req.file.filename}`, (error) => {
                error ? console.log(error) : console.log('file deleted')
            })
            errorMessages.push("File extension not valid or missing")
            return res.status(422).json({ success: false, errorMessages })
        }
    }

    // If sauce object ok, image ok and no error
    if (req.body.sauce && req.file && !errorMessages.length ) {
        return next()
    } else if ((!req.body.sauce || errorMessages.length ) && req.file) { // If no sauce object or error and image ok
        fs.unlink(`images/${req.file.filename}`, (error) => {
            error ? console.log(error) : console.log('file deleted')
        })
        errorMessages.push("Need correct sauce object to process it")
        return res.status(422).json({ success: false, errorMessages })
    } else if (req.body.sauce && !req.file) { // If sauce object ok but no image
        errorMessages.push("Need an image to process sauce")
        return res.status(422).json({ success: false, errorMessages })
    } else {
        return res.status(422).json({success: false, errorMessages})
    }
}