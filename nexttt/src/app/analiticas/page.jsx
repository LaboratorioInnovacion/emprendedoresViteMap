"use client";
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
const pieDistData = [
  { name: "Cat A", value: 400 },
  { name: "Cat B", value: 300 },
  { name: "Cat C", value: 300 },
  { name: "Cat D", value: 200 },
];
const pieColors = ["#60a5fa", "#22c55e", "#fbbf24", "#a21caf"];

const visitsData = [
  { name: "Jan", visits: 1200 },
  { name: "Feb", visits: 2100 },
  { name: "Mar", visits: 1800 },
  { name: "Apr", visits: 2600 },
  { name: "May", visits: 1700 },
  { name: "Jun", visits: 2200 },
  { name: "Jun", visits: 2200 },
  { name: "Jun", visits: 2200 },
  { name: "Jun", visits: 2200 },
  { name: "Jun", visits: 2200 },
  { name: "Jun", visits: 2200 },
  { name: "Jun", visits: 2200 },
];

const radarData = [
  { subject: "Ventas", A: 120, B: 110, fullMark: 150 },
  { subject: "Usuarios", A: 98, B: 130, fullMark: 150 },
  { subject: "Pedidos", A: 86, B: 130, fullMark: 150 },
  { subject: "Crecimiento", A: 99, B: 100, fullMark: 150 },
  { subject: "Retención", A: 85, B: 90, fullMark: 150 },
];

const metrics = [
  {
    label: "Total Revenue",
    value: "$45,230",
    icon: (
      <span className="inline-block bg-green-100 p-2 rounded">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path
            fill="#22c55e"
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15.93V18a1 1 0 1 1-2 0v-.07A8.001 8.001 0 0 1 4.07 13H6a1 1 0 1 1 0 2H4.07A8.001 8.001 0 0 1 11 4.07V6a1 1 0 1 1 2 0V4.07A8.001 8.001 0 0 1 19.93 11H18a1 1 0 1 1 0-2h1.93A8.001 8.001 0 0 1 13 19.93Z"
          />
        </svg>
      </span>
    ),
    change: "+20.1%",
    changeColor: "text-green-500",
  },
  {
    label: "Active Users",
    value: "2,350",
    icon: (
      <span className="inline-block bg-blue-100 p-2 rounded">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path
            fill="#2563eb"
            d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 1.79-8 4v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.21-3.582-4-8-4Z"
          />
        </svg>
      </span>
    ),
    change: "+15.3%",
    changeColor: "text-blue-500",
  },
  {
    label: "Total Orders",
    value: "1,425",
    icon: (
      <span className="inline-block bg-purple-100 p-2 rounded">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path
            fill="#a21caf"
            d="M7 18a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7Zm0-2h10V7H7v9Zm5-7a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
          />
        </svg>
      </span>
    ),
    change: "+7.2%",
    changeColor: "text-purple-500",
  },
  {
    label: "Growth Rate",
    value: "12.5%",
    icon: (
      <span className="inline-block bg-orange-100 p-2 rounded">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path
            fill="#f59e42"
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15.93V18a1 1 0 1 1-2 0v-.07A8.001 8.001 0 0 1 4.07 13H6a1 1 0 1 1 0 2H4.07A8.001 8.001 0 0 1 11 4.07V6a1 1 0 1 1 2 0V4.07A8.001 8.001 0 0 1 19.93 11H18a1 1 0 1 1 0-2h1.93A8.001 8.001 0 0 1 13 19.93Z"
          />
        </svg>
      </span>
    ),
    change: "+2.1%",
    changeColor: "text-orange-500",
  },
];

const revenueData = [
  { name: "Jan", revenue: 12 },
  { name: "Jan", revenue: 12 },
  { name: "Jan", revenue: 12 },
  { name: "Feb", revenue: 18 },
  { name: "Mar", revenue: 3 },
  { name: "Apr", revenue: 5 },
  { name: "May", revenue: 2 },
  { name: "Jun", revenue: 3 },
  { name: "Jun", revenue: 3 },
  { name: "Jun", revenue: 3 },
  { name: "Jun", revenue: 3 },
  { name: "Jun", revenue: 3 },
];

const userGrowthData = [
  { name: "Jan", users: 1000 },
  { name: "Feb", users: 2000 },
  { name: "Mar", users: 3500 },
  { name: "Apr", users: 5000 },
  { name: "May", users: 1500 },
  { name: "Jun", users: 2500 },
  { name: "Jun", users: 2500 },
  { name: "Jun", users: 2500 },
  { name: "Jun", users: 2500 },
  { name: "Jun", users: 2500 },
  { name: "Jun", users: 2500 },
  { name: "Jun", users: 2500 },
];

export default function AnaliticasPage() {
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
            Monthly Revenue
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#60a5fa"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
                name="Revenue ($000)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-800 rounded-xl shadow border border-gray-700 flex flex-col justify-center col-span-1">
          <div className="mb-2 font-semibold text-gray-700 text-center">
            Distribución por Categoría
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieDistData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={55}
                label
              >
                {pieDistData.map((entry, idx) => (
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
            Visitas Mensuales
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={visitsData}>
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#a21caf"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#a21caf", strokeWidth: 2, fill: "#fff" }}
                name="Visits"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
          <div className="mb-2 font-semibold text-gray-700">
            Distribución por Categoría
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieDistData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {pieDistData.map((entry, idx) => (
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
          <div className="mb-2 font-semibold text-gray-700">User Growth</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={userGrowthData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Active Users"
                dot={{ r: 5, stroke: "#22c55e", strokeWidth: 2, fill: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col justify-between">
          <div className="mb-2 font-semibold text-gray-700">
            Distribución por Categoría
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieDistData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {pieDistData.map((entry, idx) => (
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
      {/* Segunda fila: radar centrado */}
      <div className="w-full max-w-7xl flex justify-center items-center mt-8">
        <div className="bg-slate-800 rounded-xl shadow p-6 border border-gray-700 w-full">
          <div className="mb-2 font-semibold text-gray-700">
            Comparación de Categorías
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart cx="50%" cy="50%" outerRadius={120} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar
                name="A"
                dataKey="A"
                stroke="#60a5fa"
                fill="#60a5fa"
                fillOpacity={0.6}
              />
              <Radar
                name="B"
                dataKey="B"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
