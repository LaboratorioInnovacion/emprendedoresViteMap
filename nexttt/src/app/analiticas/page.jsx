"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
const pieColors = ["#60a5fa", "#22c55e", "#fbbf24", "#a21caf"];

export default function AnaliticasPage() {
  const [herramientas, setHerramientas] = useState([]);
  const [emprendedores, setEmprendedores] = useState([]);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHerramientas();
  }, []);

  const fetchHerramientas = async () => {
    try {
      const [herramientasRes, emprendedoresRes, emprendimientosRes, capacitacionesRes] = await Promise.all([
        fetch('/api/herramienta'),
        fetch('/api/emprendedores'),
        fetch('/api/emprendimientos'),
        fetch('/api/capacitaciones')
      ]);
      
      const [herramientasData, emprendedoresData, emprendimientosData, capacitacionesData] = await Promise.all([
        herramientasRes.json(),
        emprendedoresRes.json(),
        emprendimientosRes.json(),
        capacitacionesRes.json()
      ]);

      setHerramientas(herramientasData);
      setEmprendedores(emprendedoresData);
      setEmprendimientos(emprendimientosData);
      setCapacitaciones(capacitacionesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Procesar datos para gráficos
  const processData = () => {
    if (!herramientas.length && !emprendedores.length && !emprendimientos.length) {
      return {
        origenDistData: [],
        asignacionesData: [],
        montoHerramientaData: [],
        beneficiarioTipoData: [],
        radarData: [],
        emprendedoresPorGeneroData: [],
        emprendimientosPorSectorData: [],
        emprendimientosPorEtapaData: [],
        emprendedoresPorDepartamentoData: [],
        emprendimientosPorActividadData: [],
        capacitacionesPorTipoData: [],
        montosOtorgadosData: [],
        metrics: [
          { label: "Total Herramientas", value: "0", icon: <span className="inline-block bg-green-100 p-2 rounded">🔧</span>, change: "Sin datos", changeColor: "text-gray-500" },
          { label: "Total Emprendedores", value: "0", icon: <span className="inline-block bg-blue-100 p-2 rounded">👥</span>, change: "Sin datos", changeColor: "text-gray-500" },
          { label: "Total Emprendimientos", value: "0", icon: <span className="inline-block bg-purple-100 p-2 rounded">🏢</span>, change: "Sin datos", changeColor: "text-gray-500" },
          { label: "Total Capacitaciones", value: "0", icon: <span className="inline-block bg-orange-100 p-2 rounded">�</span>, change: "Sin datos", changeColor: "text-gray-500" },
        ],
        vigenciaData: [],
        evolucionData: []
      };
    }

    // Distribución por tipo de origen
    const origenCount = {};
    herramientas.forEach(h => {
      if (h.origenTipo && Array.isArray(h.origenTipo)) {
        h.origenTipo.forEach(origen => {
          origenCount[origen] = (origenCount[origen] || 0) + 1;
        });
      }
    });
    const origenDistData = Object.entries(origenCount).map(([name, value]) => ({ name, value }));

    // Asignaciones por mes
    const asignacionesPorMes = {};
    herramientas.forEach(h => {
      if (h.asignaciones && Array.isArray(h.asignaciones)) {
        h.asignaciones.forEach(a => {
          if (a.fechaAsignacion) {
            const fecha = new Date(a.fechaAsignacion);
            const mesKey = fecha.toLocaleDateString('es-ES', { month: 'short' });
            asignacionesPorMes[mesKey] = (asignacionesPorMes[mesKey] || 0) + 1;
          }
        });
      }
    });
    const asignacionesData = Object.entries(asignacionesPorMes).map(([name, asignaciones]) => ({ name, asignaciones }));

    // Monto por herramienta
    const montoHerramientaData = herramientas.map(h => ({
      name: h.nombre || 'Sin nombre',
      monto: (h.montoTotal || 0) / 1000 // Convertir a miles
    }));

    // Beneficiarios por tipo
    const beneficiarioCount = { "Emprendedor": 0, "Emprendimiento": 0 };
    herramientas.forEach(h => {
      if (h.asignaciones && Array.isArray(h.asignaciones)) {
        h.asignaciones.forEach(a => {
          if (a.beneficiarioTipo && beneficiarioCount.hasOwnProperty(a.beneficiarioTipo)) {
            beneficiarioCount[a.beneficiarioTipo]++;
          }
        });
      }
    });
    const beneficiarioTipoData = Object.entries(beneficiarioCount)
      .filter(([name, cantidad]) => cantidad > 0)
      .map(([name, cantidad]) => ({ name, cantidad }));

    // NUEVOS ANÁLISIS BASADOS EN TU SCHEMA

    // Emprendedores por género
    const generoCount = {};
    emprendedores.forEach(e => {
      const genero = e.genero || 'No especificado';
      generoCount[genero] = (generoCount[genero] || 0) + 1;
    });
    const emprendedoresPorGeneroData = Object.entries(generoCount).map(([name, value]) => ({ name, value }));

    // Emprendimientos por sector
    const sectorCount = {};
    emprendimientos.forEach(e => {
      if (e.sector) {
        const sector = e.sector.replace(/([A-Z])/g, ' $1').trim(); // Formatear camelCase
        sectorCount[sector] = (sectorCount[sector] || 0) + 1;
      }
    });
    const emprendimientosPorSectorData = Object.entries(sectorCount).map(([name, value]) => ({ name, value }));

    // Emprendimientos por etapa
    const etapaCount = {};
    emprendimientos.forEach(e => {
      if (e.etapa) {
        etapaCount[e.etapa] = (etapaCount[e.etapa] || 0) + 1;
      }
    });
    const emprendimientosPorEtapaData = Object.entries(etapaCount).map(([name, value]) => ({ name, value }));

    // Emprendedores por departamento (top 5)
    const departamentoCount = {};
    emprendedores.forEach(e => {
      if (e.departamento) {
        departamentoCount[e.departamento] = (departamentoCount[e.departamento] || 0) + 1;
      }
    });
    const emprendedoresPorDepartamentoData = Object.entries(departamentoCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // Actividades principales más comunes (top 8)
    const actividadCount = {};
    emprendimientos.forEach(e => {
      if (e.actividadPrincipal) {
        const actividad = e.actividadPrincipal.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
        actividadCount[actividad] = (actividadCount[actividad] || 0) + 1;
      }
    });
    const emprendimientosPorActividadData = Object.entries(actividadCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    // Capacitaciones por tipo
    const capacitacionTipoCount = {};
    capacitaciones.forEach(c => {
      if (c.tipo && Array.isArray(c.tipo)) {
        c.tipo.forEach(tipo => {
          capacitacionTipoCount[tipo] = (capacitacionTipoCount[tipo] || 0) + 1;
        });
      }
    });
    const capacitacionesPorTipoData = Object.entries(capacitacionTipoCount).map(([name, value]) => ({ name, value }));

    // NUEVO: Análisis de montos otorgados vs sin otorgar
    let montoTotalOtorgado = 0;
    let montoTotalPorOtorgar = 0;
    
    herramientas.forEach(h => {
      const montoHerramienta = h.montoTotal || 0;
      montoTotalPorOtorgar += montoHerramienta;
      
      if (h.asignaciones && Array.isArray(h.asignaciones)) {
        // Calcular monto otorgado basado en asignaciones
        const asignacionesCount = h.asignaciones.length;
        const montoPorBeneficiario = h.montoPorBeneficiario || 0;
        
        if (montoPorBeneficiario > 0) {
          // Si hay monto por beneficiario definido, usarlo
          montoTotalOtorgado += asignacionesCount * montoPorBeneficiario;
        } else if (h.cupo > 0) {
          // Si no hay monto por beneficiario, calcular proporcionalmente
          const proporcionOtorgada = asignacionesCount / h.cupo;
          montoTotalOtorgado += montoHerramienta * proporcionOtorgada;
        }
      }
    });
    
    const montoSinOtorgar = montoTotalPorOtorgar - montoTotalOtorgado;
    
    const montosOtorgadosData = [
      { 
        name: "Monto Otorgado", 
        value: montoTotalOtorgado / 1000000, // Convertir a millones
        fullValue: montoTotalOtorgado
      },
      { 
        name: "Monto Disponible", 
        value: montoSinOtorgar / 1000000, // Convertir a millones
        fullValue: montoSinOtorgar
      }
    ];

    // Datos para radar chart
    const radarData = [];
    const herramientasPrincipales = herramientas.slice(0, 3); // Tomar las primeras 3
    
    if (herramientasPrincipales.length > 0) {
      const subjects = ['Monto Total', 'Asignaciones', 'Cupo', 'Utilización'];
      
      subjects.forEach(subject => {
        const dataPoint = { subject };
        herramientasPrincipales.forEach(h => {
          const asignacionesCount = h.asignaciones ? h.asignaciones.length : 0;
          const cupo = h.cupo || 0;
          
          switch(subject) {
            case 'Monto Total':
              dataPoint[h.nombre] = (h.montoTotal || 0) / 10000; // Normalizar
              break;
            case 'Asignaciones':
              dataPoint[h.nombre] = asignacionesCount;
              break;
            case 'Cupo':
              dataPoint[h.nombre] = Math.max(0, cupo);
              break;
            case 'Utilización':
              dataPoint[h.nombre] = cupo > 0 ? (asignacionesCount / cupo) * 100 : 0;
              break;
          }
        });
        radarData.push(dataPoint);
      });
    }

    // Métricas principales actualizadas
    const totalHerramientas = herramientas.length;
    const totalEmprendedores = emprendedores.length;
    const totalEmprendimientos = emprendimientos.length;
    const totalCapacitaciones = capacitaciones.length;
    const totalAsignaciones = herramientas.reduce((sum, h) => sum + (h.asignaciones ? h.asignaciones.length : 0), 0);
    const montoTotalDisponible = herramientas.reduce((sum, h) => sum + (h.montoTotal || 0), 0);

    // Emprendimientos activos (En Marcha + Consolidado)
    const emprendimientosActivos = emprendimientos.filter(e => 
      e.etapa === 'EnMarcha' || e.etapa === 'Consolidado'
    ).length;

    // Emprendedores jóvenes (menores de 30 años)
    const emprendedoresJovenes = emprendedores.filter(e => {
      if (e.fechaNacimiento) {
        const edad = new Date().getFullYear() - new Date(e.fechaNacimiento).getFullYear();
        return edad < 30;
      }
      return false;
    }).length;

    const metrics = [
      {
        label: "Total Emprendedores",
        value: totalEmprendedores.toString(),
        icon: (
          <span className="inline-block bg-green-100 p-2 rounded">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                fill="#22c55e"
                d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 1.79-8 4v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.21-3.582-4-8-4Z"
              />
            </svg>
          </span>
        ),
        change: `${emprendedoresJovenes} jóvenes`,
        changeColor: "text-green-500",
      },
      {
        label: "Total Emprendimientos",
        value: totalEmprendimientos.toString(),
        icon: (
          <span className="inline-block bg-blue-100 p-2 rounded">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                fill="#2563eb"
                d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1ZM10 6a2 2 0 0 1 4 0v1h-4V6Zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10Z"
              />
            </svg>
          </span>
        ),
        change: `${emprendimientosActivos} activos`,
        changeColor: "text-blue-500",
      },
      {
        label: "Monto Otorgado",
        value: `$${(montoTotalOtorgado / 1000000).toFixed(1)}M`,
        icon: (
          <span className="inline-block bg-purple-100 p-2 rounded">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                fill="#a21caf"
                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15.93V18a1 1 0 1 1-2 0v-.07A8.001 8.001 0 0 1 4.07 13H6a1 1 0 1 1 0 2H4.07A8.001 8.001 0 0 1 11 4.07V6a1 1 0 1 1 2 0V4.07A8.001 8.001 0 0 1 19.93 11H18a1 1 0 1 1 0-2h1.93A8.001 8.001 0 0 1 13 19.93Z"
              />
            </svg>
          </span>
        ),
        change: `$${(montoSinOtorgar / 1000000).toFixed(1)}M disponible`,
        changeColor: "text-purple-500",
      },
      {
        label: "Total Capacitaciones",
        value: totalCapacitaciones.toString(),
        icon: (
          <span className="inline-block bg-orange-100 p-2 rounded">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                fill="#f59e0b"
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
          </span>
        ),
        change: `${totalAsignaciones} asignaciones`,
        changeColor: "text-orange-500",
      },
    ];

    // Estado de vigencia
    const vigenciaData = [];
    let vigentes = 0;
    let sinVencimiento = 0;
    
    herramientas.forEach(h => {
      if (!h.poseeVencimiento) {
        sinVencimiento++;
      } else {
        const ahora = new Date();
        const fechaFin = new Date(h.fechaFinVigencia);
        if (fechaFin > ahora) {
          vigentes++;
        }
      }
    });

    if (vigentes > 0) vigenciaData.push({ name: "Vigentes", value: vigentes });
    if (sinVencimiento > 0) vigenciaData.push({ name: "Sin Vencimiento", value: sinVencimiento });

    // Evolución de herramientas por mes
    const herramientasPorMes = {};
    herramientas.forEach(h => {
      if (h.createdAt) {
        const fecha = new Date(h.createdAt);
        const mesKey = fecha.toLocaleDateString('es-ES', { month: 'short' });
        herramientasPorMes[mesKey] = (herramientasPorMes[mesKey] || 0) + 1;
      }
    });
    
    const evolucionData = Object.entries(herramientasPorMes).map(([name, herramientas]) => ({ name, herramientas }));

    return {
      origenDistData,
      asignacionesData,
      montoHerramientaData,
      beneficiarioTipoData,
      radarData,
      emprendedoresPorGeneroData,
      emprendimientosPorSectorData,
      emprendimientosPorEtapaData,
      emprendedoresPorDepartamentoData,
      emprendimientosPorActividadData,
      capacitacionesPorTipoData,
      montosOtorgadosData,
      metrics,
      vigenciaData,
      evolucionData
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando datos...</div>
      </div>
    );
  }

  const {
    origenDistData,
    asignacionesData,
    montoHerramientaData,
    beneficiarioTipoData,
    radarData,
    emprendedoresPorGeneroData,
    emprendimientosPorSectorData,
    emprendimientosPorEtapaData,
    emprendedoresPorDepartamentoData,
    emprendimientosPorActividadData,
    capacitacionesPorTipoData,
    montosOtorgadosData,
    metrics,
    vigenciaData,
    evolucionData
  } = processData();
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* <h2 className="text-2xl font-bold mb-6 justify-start">Dashboard de Analíticas</h2> */}
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-7xl mb-8 text-white">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col gap-2 items-start border border-gray-700"
          >
            <div className="flex items-center gap-2">
              {m.icon}
              <span
                className={`ml-2 text-xs font-semibold dartext-gray-800 dark:text-white ${m.changeColor}`}
              >
                ↗ {m.change}
              </span>
            </div>
            <div className="text-gray-500 text-sm font-medium">{m.label}</div>
            <div className="text-3xl font-bold text-white">{m.value}</div>
          </div>
        ))}
      </div>
      {/* Primera fila de gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full max-w-7xl mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-2 border border-gray-700 flex flex-col justify-center col-span-2">
          <div className="mb-2 font-semibold text-gray-700">
            Análisis de Montos: Otorgados vs Disponibles (en millones)
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={montosOtorgadosData}>
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip 
                formatter={(value, name) => [
                  `$${value.toFixed(2)}M`, 
                  name
                ]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar
                dataKey="value"
                fill="#60a5fa"
                radius={[6, 6, 0, 0]}
                maxBarSize={80}
                name="Monto (Millones $)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-800 rounded-xl shadow border border-gray-700 flex flex-col justify-center col-span-1">
          <div className="mb-2 font-semibold text-gray-700 text-center">
            Distribución por Origen
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={origenDistData.length > 0 ? origenDistData : [{ name: "Sin datos", value: 1 }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={55}
                label
              >
                {(origenDistData.length > 0 ? origenDistData : [{ name: "Sin datos", value: 1 }]).map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={pieColors[idx % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 w-full max-w-7xl mb-8">
        <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
          <div className="mb-2 font-semibold text-gray-700">
            Emprendedores por Género
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={emprendedoresPorGeneroData.length > 0 ? emprendedoresPorGeneroData : [{ name: "Sin datos", value: 1 }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {(emprendedoresPorGeneroData.length > 0 ? emprendedoresPorGeneroData : [{ name: "Sin datos", value: 1 }]).map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={pieColors[idx % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
          <div className="mb-2 font-semibold text-gray-700">
            Emprendimientos por Sector
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={emprendimientosPorSectorData.length > 0 ? emprendimientosPorSectorData : [{ name: "Sin datos", value: 1 }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {(emprendimientosPorSectorData.length > 0 ? emprendimientosPorSectorData : [{ name: "Sin datos", value: 1 }]).map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={pieColors[idx % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 w-full max-w-7xl mb-8">
        <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
          <div className="mb-2 font-semibold text-gray-700">Emprendimientos por Etapa</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={emprendimientosPorEtapaData}>
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
                name="Cantidad"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
          <div className="mb-2 font-semibold text-gray-700">
            Top 5 Departamentos
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={emprendedoresPorDepartamentoData} layout="horizontal">
              <XAxis type="number" tick={{ fontSize: 13 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#60a5fa"
                radius={[0, 6, 6, 0]}
                name="Emprendedores"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Nueva fila para actividades principales */}
      <div className="grid grid-cols-1 w-full max-w-7xl mb-8">
        <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700">
          <div className="mb-2 font-semibold text-gray-700">
            Top 8 Actividades Principales
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emprendimientosPorActividadData}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }} 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#fbbf24"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
                name="Emprendimientos"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Fila final con capacitaciones y resumen */}
      <div className="w-full max-w-7xl flex justify-center items-center mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="mb-2 font-semibold text-gray-700">
              Capacitaciones por Tipo
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={capacitacionesPorTipoData.length > 0 ? capacitacionesPorTipoData : [{ name: "Sin datos", value: 1 }]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {(capacitacionesPorTipoData.length > 0 ? capacitacionesPorTipoData : [{ name: "Sin datos", value: 1 }]).map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={pieColors[idx % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="mb-2 font-semibold text-gray-700">
              Proporción de Montos
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={montosOtorgadosData.length > 0 ? montosOtorgadosData : [{ name: "Sin datos", value: 1 }]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({name, value}) => `${name}: $${value.toFixed(1)}M`}
                >
                  {(montosOtorgadosData.length > 0 ? montosOtorgadosData : [{ name: "Sin datos", value: 1 }]).map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={idx === 0 ? "#22c55e" : "#60a5fa"} // Verde para otorgado, azul para disponible
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`$${value.toFixed(2)}M`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

//////////////////////////////
// "use client";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
// } from "recharts";
// const pieDistData = [
//   { name: "Cat A", value: 400 },
//   { name: "Cat B", value: 300 },
//   { name: "Cat C", value: 300 },
//   { name: "Cat D", value: 200 },
// ];
// const pieColors = ["#60a5fa", "#22c55e", "#fbbf24", "#a21caf"];

// const visitsData = [
//   { name: "Jan", visits: 1200 },
//   { name: "Feb", visits: 2100 },
//   { name: "Mar", visits: 1800 },
//   { name: "Apr", visits: 2600 },
//   { name: "May", visits: 1700 },
//   { name: "Jun", visits: 2200 },
//   { name: "Jun", visits: 2200 },
//   { name: "Jun", visits: 2200 },
//   { name: "Jun", visits: 2200 },
//   { name: "Jun", visits: 2200 },
//   { name: "Jun", visits: 2200 },
//   { name: "Jun", visits: 2200 },
// ];

// const radarData = [
//   { subject: "Ventas", A: 120, B: 110, fullMark: 150 },
//   { subject: "Usuarios", A: 98, B: 130, fullMark: 150 },
//   { subject: "Pedidos", A: 86, B: 130, fullMark: 150 },
//   { subject: "Crecimiento", A: 99, B: 100, fullMark: 150 },
//   { subject: "Retención", A: 85, B: 90, fullMark: 150 },
// ];

// const metrics = [
//   {
//     label: "Total Revenue",
//     value: "$45,230",
//     icon: (
//       <span className="inline-block bg-green-100 p-2 rounded">
//         <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
//           <path
//             fill="#22c55e"
//             d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15.93V18a1 1 0 1 1-2 0v-.07A8.001 8.001 0 0 1 4.07 13H6a1 1 0 1 1 0 2H4.07A8.001 8.001 0 0 1 11 4.07V6a1 1 0 1 1 2 0V4.07A8.001 8.001 0 0 1 19.93 11H18a1 1 0 1 1 0-2h1.93A8.001 8.001 0 0 1 13 19.93Z"
//           />
//         </svg>
//       </span>
//     ),
//     change: "+20.1%",
//     changeColor: "text-green-500",
//   },
//   {
//     label: "Active Users",
//     value: "2,350",
//     icon: (
//       <span className="inline-block bg-blue-100 p-2 rounded">
//         <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
//           <path
//             fill="#2563eb"
//             d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 1.79-8 4v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.21-3.582-4-8-4Z"
//           />
//         </svg>
//       </span>
//     ),
//     change: "+15.3%",
//     changeColor: "text-blue-500",
//   },
//   {
//     label: "Total Orders",
//     value: "1,425",
//     icon: (
//       <span className="inline-block bg-purple-100 p-2 rounded">
//         <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
//           <path
//             fill="#a21caf"
//             d="M7 18a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7Zm0-2h10V7H7v9Zm5-7a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
//           />
//         </svg>
//       </span>
//     ),
//     change: "+7.2%",
//     changeColor: "text-purple-500",
//   },
//   {
//     label: "Growth Rate",
//     value: "12.5%",
//     icon: (
//       <span className="inline-block bg-orange-100 p-2 rounded">
//         <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
//           <path
//             fill="#f59e42"
//             d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15.93V18a1 1 0 1 1-2 0v-.07A8.001 8.001 0 0 1 4.07 13H6a1 1 0 1 1 0 2H4.07A8.001 8.001 0 0 1 11 4.07V6a1 1 0 1 1 2 0V4.07A8.001 8.001 0 0 1 19.93 11H18a1 1 0 1 1 0-2h1.93A8.001 8.001 0 0 1 13 19.93Z"
//           />
//         </svg>
//       </span>
//     ),
//     change: "+2.1%",
//     changeColor: "text-orange-500",
//   },
// ];

// const revenueData = [
//   { name: "Jan", revenue: 12 },
//   { name: "Jan", revenue: 12 },
//   { name: "Jan", revenue: 12 },
//   { name: "Feb", revenue: 18 },
//   { name: "Mar", revenue: 3 },
//   { name: "Apr", revenue: 5 },
//   { name: "May", revenue: 2 },
//   { name: "Jun", revenue: 3 },
//   { name: "Jun", revenue: 3 },
//   { name: "Jun", revenue: 3 },
//   { name: "Jun", revenue: 3 },
//   { name: "Jun", revenue: 3 },
// ];

// const userGrowthData = [
//   { name: "Jan", users: 1000 },
//   { name: "Feb", users: 2000 },
//   { name: "Mar", users: 3500 },
//   { name: "Apr", users: 5000 },
//   { name: "May", users: 1500 },
//   { name: "Jun", users: 2500 },
//   { name: "Jun", users: 2500 },
//   { name: "Jun", users: 2500 },
//   { name: "Jun", users: 2500 },
//   { name: "Jun", users: 2500 },
//   { name: "Jun", users: 2500 },
//   { name: "Jun", users: 2500 },
// ];

// export default function AnaliticasPage() {
//   return (
//     <div className="min-h-screen flex flex-col items-center">
//       {/* <h2 className="text-2xl font-bold mb-6 justify-start">Dashboard de Analíticas</h2> */}
//       {/* Métricas */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-7xl mb-8 text-white">
//         {metrics.map((m) => (
//           <div
//             key={m.label}
//             className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col gap-2 items-start border border-gray-700"
//           >
//             <div className="flex items-center gap-2">
//               {m.icon}
//               <span
//                 className={`ml-2 text-xs font-semibold dartext-gray-800 dark:text-white ${m.changeColor}`}
//               >
//                 ↗ {m.change}
//               </span>
//             </div>
//             <div className="text-gray-500 text-sm font-medium">{m.label}</div>
//             <div className="text-3xl font-bold text-white">{m.value}</div>
//           </div>
//         ))}
//       </div>
//       {/* Primera fila de gráficos */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full max-w-7xl mb-8">
//         <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-2 border border-gray-700 flex flex-col justify-center col-span-2">
//           <div className="mb-2 font-semibold text-gray-700">
//             Monthly Revenue
//           </div>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={revenueData}>
//               <XAxis dataKey="name" tick={{ fontSize: 13 }} />
//               <YAxis tick={{ fontSize: 13 }} />
//               <Tooltip />
//               <Legend />
//               <Bar
//                 dataKey="revenue"
//                 fill="#60a5fa"
//                 radius={[6, 6, 0, 0]}
//                 maxBarSize={40}
//                 name="Revenue ($000)"
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-slate-800 rounded-xl shadow border border-gray-700 flex flex-col justify-center col-span-1">
//           <div className="mb-2 font-semibold text-gray-700 text-center">
//             Distribución por Categoría
//           </div>
//           <ResponsiveContainer width="100%" height={180}>
//             <PieChart>
//               <Pie
//                 data={pieDistData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={55}
//                 label
//               >
//                 {pieDistData.map((entry, idx) => (
//                   <Cell
//                     key={`cell-${idx}`}
//                     fill={pieColors[idx % pieColors.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 w-full max-w-7xl mb-8">
//         <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
//           <div className="mb-2 font-semibold text-gray-700">
//             Visitas Mensuales
//           </div>
//           <ResponsiveContainer width="100%" height={220}>
//             <LineChart data={visitsData}>
//               <XAxis dataKey="name" tick={{ fontSize: 13 }} />
//               <YAxis tick={{ fontSize: 13 }} />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="visits"
//                 stroke="#a21caf"
//                 strokeWidth={3}
//                 dot={{ r: 5, stroke: "#a21caf", strokeWidth: 2, fill: "#fff" }}
//                 name="Visits"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
//           <div className="mb-2 font-semibold text-gray-700">
//             Distribución por Categoría
//           </div>
//           <ResponsiveContainer width="100%" height={220}>
//             <PieChart>
//               <Pie
//                 data={pieDistData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={70}
//                 label
//               >
//                 {pieDistData.map((entry, idx) => (
//                   <Cell
//                     key={`cell-${idx}`}
//                     fill={pieColors[idx % pieColors.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 w-full max-w-7xl mb-8">
//         <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
//           <div className="mb-2 font-semibold text-gray-700">User Growth</div>
//           <ResponsiveContainer width="100%" height={220}>
//             <AreaChart
//               data={userGrowthData}
//               margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//             >
//               <defs>
//                 <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
//                 </linearGradient>
//               </defs>
//               <XAxis dataKey="name" tick={{ fontSize: 13 }} />
//               <YAxis tick={{ fontSize: 13 }} />
//               <Tooltip />
//               <Legend />
//               <Area
//                 type="monotone"
//                 dataKey="users"
//                 stroke="#22c55e"
//                 fillOpacity={1}
//                 fill="url(#colorUsers)"
//                 name="Active Users"
//                 dot={{ r: 5, stroke: "#22c55e", strokeWidth: 2, fill: "#fff" }}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
//           <div className="mb-2 font-semibold text-gray-700">
//             Distribución por Categoría
//           </div>
//           <ResponsiveContainer width="100%" height={220}>
//             <PieChart>
//               <Pie
//                 data={pieDistData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={70}
//                 label
//               >
//                 {pieDistData.map((entry, idx) => (
//                   <Cell
//                     key={`cell-${idx}`}
//                     fill={pieColors[idx % pieColors.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//       {/* Segunda fila: radar centrado */}
//       <div className="w-full max-w-7xl flex justify-center items-center mt-8">
//         <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 w-full">
//           <div className="mb-2 font-semibold text-gray-700">
//             Comparación de Categorías
//           </div>
//           <ResponsiveContainer width="100%" height={320}>
//             <RadarChart cx="50%" cy="50%" outerRadius={120} data={radarData}>
//               <PolarGrid />
//               <PolarAngleAxis dataKey="subject" />
//               <PolarRadiusAxis angle={30} domain={[0, 150]} />
//               <Radar
//                 name="A"
//                 dataKey="A"
//                 stroke="#60a5fa"
//                 fill="#60a5fa"
//                 fillOpacity={0.6}
//               />
//               <Radar
//                 name="B"
//                 dataKey="B"
//                 stroke="#22c55e"
//                 fill="#22c55e"
//                 fillOpacity={0.6}
//               />
//               <Legend />
//               <Tooltip />
//             </RadarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }
