const Type = require('../models/type');

const createtType = async (req, res) => {
    try {
        const { name } = req.body;

        // Crear el nuevo ingreso
        const type = await Type.create({
            name
        });

        res.status(201).send({ success: true, data: type });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
};

const getTypes = async (req, res) => {
    try { // TODO: Obtener el ID del usuario autenticado

        // TODO: Obtener todos los ingresos del usuario
        const types = await Type.find();

        res.status(200).send({ success: true, data: types });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
};

module.exports = {
    createtType,
    getTypes
}


