module.exports = (req, res, next) => {
    let errorMessages = []
    let sauceObject = JSON.parse(req.body.sauce)
    const authorisedValues = new RegExp('^[a-zA-ZÀ-ú0-9,\\-\'\\s]+$')

    // Test of sauce name
    if (sauceObject.name.length < 5 || !authorisedValues.test(sauceObject.name) ) {
        errorMessages.push("Name field should have at least 5 characters and should contain alphanumeric characters or spaces")
    }

    // Test of sauce manufacturer
    if (sauceObject.manufacturer.length < 3 || !authorisedValues.test(sauceObject.manufacturer) ) {
        errorMessages.push("Manufacturer field should have at least 3 characters and should contain alphanumeric characters or spaces")
    }

    // Test of sauce description
    if (sauceObject.description.length < 10 || !authorisedValues.test(sauceObject.description) ) {
        errorMessages.push("Description field should have at least 10 characters and should contain alphanumeric characters or spaces")
    }

    // Test of sauce mainPepper
    if (sauceObject.mainPepper.length < 4 || !authorisedValues.test(sauceObject.mainPepper) ) {
        errorMessages.push("Main pepper field should have at least 4 characters and should contain alphanumeric characters or spaces")
    }

    // Return errors or continue
    if (!errorMessages.length) {
        return next()
    } else {
        return res.status(422).json({success: false, errorMessages})
    }
}