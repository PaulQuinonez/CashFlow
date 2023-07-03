const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  // Obtener el token de autorización del encabezado de la solicitud
  const token = req.headers.authorization;
  const secret = process.env.SECRET_KEY;

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no provisto.' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, secret);

    // Agregar el ID de usuario decodificado al objeto de solicitud para su uso posterior
    req.user = decoded;
    // Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token inválido.' });
  }
}

module.exports = authenticate;
