export function canAccess(user, section) {
  const permisos = {
    herramientas: ['ADMIN', 'SUPERUSUARIO'],
    usuarios: ['SUPERUSUARIO'],
    dashboard: ['EMPRENDEDOR', 'ADMIN'],
  };

  return permisos[section]?.includes(user.rol);
}
