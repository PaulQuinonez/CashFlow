const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');

async function listUser(req, res) {
    try {
        const id = req.params['id'];

        const newListUser = await User.findById({ _id: id });

        if (newListUser) {
            res.status(200).send({ user: newListUser });
        } else {
            res.status(403).send({ message: 'No existe el usuario' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function listUsers(req, res) {
    try {

        const newListUser = await User.find();

        if (newListUser.length != 0) {
            res.status(200).send({ user: newListUser });
        } else {
            res.status(403).send({ message: 'No existe el usuario' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function updateUser(req, res) {
    try {
        const id = req.params.id; // TODO: Obtener el ID del usuario a actualizar desde los parámetros de la solicitud

        const update = req.body; // TODO: Obtener los datos de actualización del cuerpo de la solicitud

        const existingUser = await User.findById(id); //* Buscar el usuario existente en la base de datos utilizando el ID

        if (!existingUser) {
            //! Si el usuario no existe, devolver un mensaje de error
            return res.status(404).send({ message: 'No existe el usuario' });
        }

        const updatedUser = await User.findByIdAndUpdate(id, { $set: update }, { new: true });

        res.status(200).send({ user: updatedUser }); // TODO: Enviar la respuesta con el usuario actualizado
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' }); //! En caso de error, devolver un mensaje de error genérico
    }
}

module.exports = {
    listUser,
    updateUser,
    listUsers
}


