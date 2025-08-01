import jwt from 'jsonwebtoken';

export function getUserFromRequest(req) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('No autorizado');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Token inválido');
  }
}

export function requireRole(user, roles) {
  if (!roles.includes(user.rol)) {
    throw new Error('Acceso denegado');
  }
}
