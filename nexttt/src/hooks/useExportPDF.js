import jsPDF from 'jspdf';

export function useExportPDF() {
  const exportPDF = (emprendedor) => {
    if (!emprendedor) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = 20;
    // Header
    doc.setFillColor(37, 99, 235); // azul
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Currículum Emprendedor', 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`${emprendedor.nombre || ''} ${emprendedor.apellido || ''}`, 105, 26, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y = 38;
    // Datos personales
    doc.setFontSize(14);
    doc.text('Datos Personales', 15, y);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;
  doc.setFontSize(11);
  // Primera fila
  doc.text(`Género: ${emprendedor.genero || '-'}`, 15, y);
  doc.text(`DNI: ${emprendedor.dni || '-'}`, 75, y);
  doc.text(`CUIL: ${emprendedor.cuil || '-'}`, 135, y);
  y += 7;
  // Segunda fila
  doc.text(`Fecha de nacimiento: ${emprendedor.fechaNacimiento ? new Date(emprendedor.fechaNacimiento).toLocaleDateString() : '-'}`, 15, y);
  doc.text(`País: ${emprendedor.paisOrigen || '-'}`, 75, y);
  doc.text(`Ciudad: ${emprendedor.ciudadOrigen || '-'}`, 135, y);
  y += 7;
  // Tercera fila
  doc.text(`Departamento: ${emprendedor.departamento || '-'}`, 15, y);
  doc.text(`Dirección: ${emprendedor.direccion || '-'}`, 75, y);
  y += 7;
  // Cuarta fila
  doc.text(`Teléfono: ${emprendedor.telefono || '-'}`, 15, y);
  doc.text(`Email: ${emprendedor.email || '-'}`, 75, y);
  y += 7;
  // Quinta fila
  let nivelEstudios = doc.splitTextToSize(`Nivel de estudios: ${emprendedor.nivelEstudios || '-'}`, 60);
  doc.text(nivelEstudios, 15, y);
  let motivacion = doc.splitTextToSize(`Motivación para emprender: ${emprendedor.motivacionEmprender || '-'}`, 60);
  doc.text(motivacion, 75, y);
  y += Math.max(nivelEstudios.length, motivacion.length) * 6;
  // Sexta fila
  let tiposSustento = (emprendedor.tiposSustento && emprendedor.tiposSustento.length > 0) ? emprendedor.tiposSustento.join(', ') : '-';
  doc.text(`Tipos de sustento: ${tiposSustento}`, 15, y);
  doc.text(`Dependientes económicos: ${emprendedor.tieneDependientesEconomicos === true ? 'Sí' : emprendedor.tieneDependientesEconomicos === false ? 'No' : '-'}`, 75, y);
  doc.text(`Otros sustentos: ${emprendedor.poseeOtrosSustentos === true ? 'Sí' : emprendedor.poseeOtrosSustentos === false ? 'No' : '-'}`, 135, y);
  y += 10;
    // Emprendimientos
    doc.setFontSize(14);
    doc.text('Emprendimientos', 15, y);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;
    doc.setFontSize(11);
    if (emprendedor.emprendimientos && emprendedor.emprendimientos.length > 0) {
      emprendedor.emprendimientos.forEach((emp, idx) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont(undefined, 'bold');
        doc.text(`${emp.denominacion || '-'} (${emp.etapa || '-'})`, 18, y);
        doc.setFont(undefined, 'normal');
        y += 6;
        // Primera columna
        doc.text(`Fecha inicio: ${emp.fechaInicio ? new Date(emp.fechaInicio).toLocaleDateString() : '-'}`, 22, y);
        doc.text(`Dirección: ${emp.direccion || '-'}`, 90, y);
        y += 6;
        doc.text(`Teléfono: ${emp.telefono || '-'}`, 22, y);
        doc.text(`Email: ${emp.email || '-'}`, 90, y);
        y += 6;
        // doc.text(`Web: ${emp.web || '-'}`, 22, y);
        // doc.text(`Redes sociales: ${[emp.redSocial1].filter(Boolean).join(', ') || '-'}`, 90, y);
         doc.text(`Consultorías: ${emp.tiposConsultoria ? emp.tiposConsultoria.join(', ') : '-'}`, 22, y);
        doc.text(`Herramientas tecno: ${emp.tiposHerramientasTecno ? emp.tiposHerramientasTecno.join(', ') : '-'}`, 90, y);
        y += 6;
        doc.text(`Sector: ${emp.sector || '-'}`, 22, y);
        doc.text(`Actividad principal: ${emp.actividadPrincipal || '-'}`, 90, y);
        y += 6;
        doc.text(`Tipo: ${emp.tipoEmprendimiento || '-'}`, 22, y);
        doc.text(`Personal: ${emp.tienePersonal ? 'Sí' : 'No'}`, 90, y);
        y += 6;
        doc.text(`Cantidad personal: ${emp.cantidadPersonal || '-'}`, 22, y);
        doc.text(`Modo incorporación: ${emp.modoIncorporacionPersonal ? emp.modoIncorporacionPersonal.join(', ') : '-'}`, 90, y);
        y += 6;
        doc.text(`Sucursales: ${emp.poseeSucursales ? 'Sí' : 'No'}`, 22, y);
        doc.text(`Cantidad sucursales: ${emp.cantidadSucursales || '-'}`, 90, y);
        y += 6;
        doc.text(`Ubicación sucursales: ${emp.ubicacionSucursales ? emp.ubicacionSucursales.join(', ') : '-'}`, 22, y);
        doc.text(`Canales comercialización: ${emp.canalesComercializacion ? emp.canalesComercializacion.join(', ') : '-'}`, 90, y);
        y += 6;
        doc.text(`Otros canales: ${emp.otrosCanalesComercializacion || '-'}`, 22, y);
        doc.text(`Capacitaciones: ${emp.tiposCapacitacion ? emp.tiposCapacitacion.join(', ') : '-'}`, 90, y);
        y += 6;
        // doc.text(`Consultorías: ${emp.tiposConsultoria ? emp.tiposConsultoria.join(', ') : '-'}`, 22, y);
        // doc.text(`Herramientas tecno: ${emp.tiposHerramientasTecno ? emp.tiposHerramientasTecno.join(', ') : '-'}`, 90, y);
        doc.text(`Web: ${emp.web || '-'}`, 22, y);
        y += 6;
        doc.text(`Redes sociales: ${[emp.redSocial1].filter(Boolean).join(', ') || '-'}`, 90, y);
        y += 10;
      });
    } else {
      doc.text('No tiene emprendimientos registrados.', 18, y);
      y += 6;
    }
    // Asignaciones
    doc.setFontSize(14);
    doc.text('Asignaciones', 15, y);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;
    doc.setFontSize(11);
    if (emprendedor.asignaciones && emprendedor.asignaciones.length > 0) {
      emprendedor.asignaciones.forEach((asig, idx) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont(undefined, 'bold');
        doc.text(`${asig.herramienta?.nombre || 'Herramienta'} (${(asig.herramienta?.tipoHerramientaEmprendedor?.join(', ') || '-')})`, 18, y);
        doc.setFont(undefined, 'normal');
        y += 6;
        doc.text(`Fecha asignación: ${asig.fechaAsignacion ? new Date(asig.fechaAsignacion).toLocaleDateString() : '-'}`, 22, y);
        doc.text(`Monto: $${asig.herramienta?.montoPorBeneficiario?.toLocaleString('es-AR') || '-'}`, 90, y);
        doc.text(`Organismo: ${asig.herramienta?.origenOrganismo || '-'}`, 22, y+6);
        doc.text(`Origen: ${asig.herramienta?.origenTipo ? asig.herramienta.origenTipo.join(', ') : '-'}`, 90, y+6);
        let obs = asig.observaciones || asig.herramienta?.observaciones || 'Sin observaciones';
        let splitObs = doc.splitTextToSize(`Observaciones: ${obs}`, 170);
        doc.text(splitObs, 22, y+12);
        y += splitObs.length * 6 + 18;
      });
    } else {
      doc.text('No tiene asignaciones registradas.', 18, y);
      y += 6;
    }
    // Footer
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text('Generado automáticamente por la plataforma Emprendedores', 105, 290, { align: 'center' });
    doc.save(`CV_Emprendedor_${emprendedor.nombre || ''}_${emprendedor.apellido || ''}.pdf`);
  };
  return exportPDF;
}
