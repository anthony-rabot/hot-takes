const { body, validationResult } = require('express-validator')

// Use operators defined at https://github.com/validatorjs/validator.js#validators
const userValidationRules = () => {
    return [
        // email must be an valid email
        body('email')
            .isEmail()
            .withMessage('adresse mail non valide'),
        // password must be at least 5 chars long
        body('password')
            .isLength({ min: 5 })
            .withMessage('le mot de passe doit contenir au moins 5 caractères'),
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    userValidationRules,
    validate
}
