const Sauce = require("../models/sauce")

module.exports = (req, res, next) => {
    let errorMessages = []

    // Valeurs non acceptées
    if (req.body.like > 1 || req.body.like < -1) {
        errorMessages.push("La valeur de like n'est pas valide. -1, 0 ou 1")
        return res.status(422).json({success: false, errorMessages})
    } else if (req.body.like === 1 || req.body.like === -1 ) { // Si c'est un like ou un unlike
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.auth.userId) || sauce.usersDisliked.includes(req.auth.userId) ) {
                    errorMessages.push("La sauce est déjà likée ou unlikée. Set to 0 before 1 or -1")
                    return res.status(422).json({success: false, errorMessages})
                } else {
                    return next()
                }
            })
            .catch((error) => res.status(400).json({error}))
    } else {
        return next()
    }

}