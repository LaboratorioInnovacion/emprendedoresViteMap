import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Emprendedores Map
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Descubre y conecta con emprendedores en tu área
          </p>
        </div>

        {/* Test Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card Example */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Componente Card</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Esta es una tarjeta de ejemplo usando tu clase personalizada.
            </p>
            <div className="flex gap-2">
              <span className="badge badge-primary">Primary</span>
              <span className="badge badge-secondary">Secondary</span>
              <span className="badge badge-accent">Accent</span>
            </div>
          </div>

          {/* Buttons Example */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Botones</h3>
            <div className="flex flex-col gap-2">
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-secondary">Secondary Button</button>
              <button className="btn btn-accent">Accent Button</button>
              <button className="btn btn-outline">Outline Button</button>
            </div>
          </div>

          {/* Form Example */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Formulario</h3>
            <div className="flex flex-col gap-3">
              <input type="text" className="input" placeholder="Nombre" />
              <input type="email" className="input" placeholder="Email" />
              <button className="btn btn-primary">Enviar</button>
            </div>
          </div>
        </div>

        {/* Colors Demo */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Colores Personalizados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm">Primary</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm">Secondary</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm">Accent</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm">Success</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

