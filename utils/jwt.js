const jwt = require("jsonwebtoken");

const generateJWT = (id) => {
    return new Promise((resolve, reject) => {
        const paylod = { id }

        jwt.sign(
            paylod,
            process.env.SECRETE_JWT_SEED,
            {
                expiresIn: process.env.JWT_EXPIRE_IN
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject(err)
                }

                resolve(token)
            }
        )
    })
}

module.exports = generateJWT