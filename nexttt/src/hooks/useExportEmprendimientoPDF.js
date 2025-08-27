import jsPDF from 'jspdf';

export function useExportEmprendimientoPDF() {
  const exportPDF = (emprendimiento) => {
    if (!emprendimiento) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = 20;
    // Header
    doc.setFillColor(37, 99, 235); // azul
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Ficha de Emprendimiento', 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`${emprendimiento.denominacion || ''}`, 105, 26, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y = 38;
    // Datos del Emprendimiento
    doc.setFontSize(14);
    doc.text('Datos del Emprendimiento', 15, y);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;
    doc.setFontSize(11);
    // Agrupar los campos en pares por fila para evitar superposición
    const campos = [
      [`Etapa: ${emprendimiento.etapa || '-'}`, `Fecha de inicio: ${emprendimiento.fechaInicio ? new Date(emprendimiento.fechaInicio).toLocaleDateString() : '-'}`],
      [`Inscripción Arca: ${emprendimiento.inscripcionArca ? 'Sí' : 'No'}`, `CUIT: ${emprendimiento.cuit || '-'}`],
      [`Sector: ${emprendimiento.sector || '-'}`, `Actividad principal: ${emprendimiento.actividadPrincipal || '-'}`],
      [`Tipo: ${emprendimiento.tipoEmprendimiento || '-'}`, `Dirección: ${emprendimiento.direccion || '-'}`],
      [`Teléfono: ${emprendimiento.telefono || '-'}`, `Email: ${emprendimiento.email || '-'}`],
      [`Web: ${emprendimiento.web || '-'}`, `Red Social 1: ${emprendimiento.redSocial1 || '-'}`],
      [`Red Social 2: ${emprendimiento.redSocial2 || '-'}`, `Personal: ${emprendimiento.tienePersonal ? 'Sí' : 'No'}`],
      [`Cantidad personal: ${emprendimiento.cantidadPersonal || '-'}`, `Modo incorporación: ${Array.isArray(emprendimiento.modoIncorporacionPersonal) ? emprendimiento.modoIncorporacionPersonal.join(', ') : (emprendimiento.modoIncorporacionPersonal || '-')}`],
      [`Planea incorporar personal: ${emprendimiento.planeaIncorporarPersonal || '-'}`, `Percepción planta personal: ${emprendimiento.percepcionPlantaPersonal || '-'}`],
      [`Requiere capacitación: ${emprendimiento.requiereCapacitacion ? 'Sí' : 'No'}`, `Tipos capacitación: ${Array.isArray(emprendimiento.tiposCapacitacion) ? emprendimiento.tiposCapacitacion.join(', ') : (emprendimiento.tiposCapacitacion || '-')}`],
      [`Otros tipos capacitación: ${emprendimiento.otrosTiposCapacitacion || '-'}`, `Requiere consultoría: ${emprendimiento.requiereConsultoria ? 'Sí' : 'No'}`],
      [`Tipos consultoría: ${Array.isArray(emprendimiento.tiposConsultoria) ? emprendimiento.tiposConsultoria.join(', ') : (emprendimiento.tiposConsultoria || '-')}`, `Otros tipos consultoría: ${emprendimiento.otrosTiposConsultoria || '-'}`],
      [`Requiere herramientas tecno: ${emprendimiento.requiereHerramientasTecno ? 'Sí' : 'No'}`, `Tipos herramientas tecno: ${Array.isArray(emprendimiento.tiposHerramientasTecno) ? emprendimiento.tiposHerramientasTecno.join(', ') : (emprendimiento.tiposHerramientasTecno || '-')}`],
      [`Otras herramientas tecno: ${emprendimiento.otrasHerramientasTecno || '-'}`, `Usa redes sociales: ${emprendimiento.usaRedesSociales ? 'Sí' : 'No'}`],
      [`Tipos redes sociales: ${Array.isArray(emprendimiento.tiposRedesSociales) ? emprendimiento.tiposRedesSociales.join(', ') : (emprendimiento.tiposRedesSociales || '-')}`, `Usa medios pago electrónicos: ${emprendimiento.usaMediosPagoElectronicos ? 'Sí' : 'No'}`],
      [`Canales comercialización: ${Array.isArray(emprendimiento.canalesComercializacion) ? emprendimiento.canalesComercializacion.join(', ') : (emprendimiento.canalesComercializacion || '-')}`, `Otros canales comercialización: ${emprendimiento.otrosCanalesComercializacion || '-'}`],
      [`Posee sucursales: ${emprendimiento.poseeSucursales ? 'Sí' : 'No'}`, `Cantidad sucursales: ${emprendimiento.cantidadSucursales || '-'}`],
      [`Ubicación sucursales: ${Array.isArray(emprendimiento.ubicacionSucursales) ? emprendimiento.ubicacionSucursales.join(', ') : (emprendimiento.ubicacionSucursales || '-')}`],
    ];
    campos.forEach(par => {
      doc.text(doc.splitTextToSize(par[0], 90), 15, y);
      if (par[1]) doc.text(doc.splitTextToSize(par[1], 90), 110, y);
      y += 7;
    });
    y += 3;
    // Datos del Emprendedor
    doc.setFontSize(14);
    doc.text('Datos del Emprendedor', 15, y);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;
    doc.setFontSize(11);
    const emp = emprendimiento.emprendedor || {};
    doc.text(`Nombre: ${emp.nombre || '-'} ${emp.apellido || '-'}`, 15, y);
    doc.text(`Género: ${emp.genero || '-'}`, 75, y);
    doc.text(`DNI: ${emp.dni || '-'}`, 135, y);
    y += 7;
    doc.text(`CUIL: ${emp.cuil || '-'}`, 15, y);
    doc.text(`Fecha de nacimiento: ${emp.fechaNacimiento ? new Date(emp.fechaNacimiento).toLocaleDateString() : '-'}`, 75, y);
    doc.text(`País: ${emp.paisOrigen || '-'}`, 135, y);
    y += 7;
    doc.text(`Ciudad: ${emp.ciudadOrigen || '-'}`, 15, y);
    doc.text(`Departamento: ${emp.departamento || '-'}`, 75, y);
    doc.text(`Dirección: ${emp.direccion || '-'}`, 135, y);
    y += 7;
    doc.text(`Teléfono: ${emp.telefono || '-'}`, 15, y);
    // doc.text(`Nivel de estudios: ${emp.nivelEstudios || '-'}`, 75, y);
    doc.text(`Otros sustentos: ${emp.poseeOtrosSustentos === true ? 'Sí' : emp.poseeOtrosSustentos === false ? 'No' : '-'}`, 75, y);
    doc.text(`Motivación para emprender: ${emp.motivacionEmprender || '-'}`, 135, y);
    y += 7;
    let tiposSustento = (emp.tiposSustento && emp.tiposSustento.length > 0) ? emp.tiposSustento.join(', ') : '-';
    doc.text(`Tipos de sustento: ${tiposSustento}`, 15, y);
    doc.text(`Dependientes económicos: ${emp.tieneDependientesEconomicos === true ? 'Sí' : emp.tieneDependientesEconomicos === false ? 'No' : '-'}`, 75, y);
    // doc.text(`Otros sustentos: ${emp.poseeOtrosSustentos === true ? 'Sí' : emp.poseeOtrosSustentos === false ? 'No' : '-'}`, 135, y);
    doc.text(`Nivel de estudios: ${emp.nivelEstudios || '-'}`, 135, y);
    y += 10;
    // Asignaciones
    doc.setFontSize(14);
    doc.text('Asignaciones', 15, y);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;
    doc.setFontSize(11);
    if (emprendimiento.asignaciones && emprendimiento.asignaciones.length > 0) {
      emprendimiento.asignaciones.forEach((asig, idx) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont(undefined, 'bold');
        doc.text(`${asig.herramienta?.nombre || 'Herramienta'} (${(asig.herramienta?.tipoHerramientaEmprendimiento?.join(', ') || '-')})`, 18, y);
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
    doc.save(`Emprendimiento_${emprendimiento.denominacion || ''}.pdf`);
  };
  return exportPDF;
}
