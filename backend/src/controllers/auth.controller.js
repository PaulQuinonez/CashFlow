const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../utils/jwt');

async function registerUser(req, res) {
    try {
        const params = req.body;
        const user = new User();

        if (params.password) {
            //* Generar el hash de la contraseña
            const hash = await new Promise((resolve, reject) => {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });

            if (hash) {
                // TODO: Asignar los valores al objeto de usuario
                user.password = hash;
                user.name = params.name;
                user.phone = params.phone;
                user.email = params.email;
                user.address = params.address;

                //? Verificar si el email ya está registrado
                const existingUser = await User.findOne({ email: params.email });
                if (existingUser) {
                    // Si el email ya está registrado, devolver un error
                    res.status(409).send({ error: 'El email ya está registrado' });
                } else {
                    // Guardar el nuevo usuario en la base de datos
                    const newUser = await user.save();
                    res.status(200).send({ user: newUser });
                }
            }
        } else {
            //? Si no se ingresó una contraseña, devolver un error
            res.status(403).send({ error: 'No se ingresó una contraseña' });
        }
    } catch (error) {
        //! Si ocurre algún error durante el proceso, devolver un error genérico
        res.status(500).send({ error: 'Error en la validación del email' });
    }
}

async function login(req, res) {
    const data = req.body;
    try {
        const user = await User.findOne({ email: data.email });

        if (user) {
            bcrypt.compare(data.password, user.password, function (err, check) {
                if(check){
                    if(data.gettoken){
                        const token = jwt.createToken(user)
                        res.status(200).send({
                            jwt: token,
                            user: user,
                        });
                    } else {
                        res.status(200).send({
                            user: user,
                            message: 'no token',
                            jwt: jwt.createToken(user)
                        })
                    }
                } else {
                    res.status(403).send({ message: 'Las credenciales de ingreso no coinciden' })
                }
            })
        } else {
            res.status(403).send({ message: 'El email no existe' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

module.exports = {
    registerUser,
    login
}