// ...existing code...
"use client";

export default function AnaliticasPage() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-100 via-white to-primary-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="card p-8 max-w-lg w-full flex flex-col items-center shadow-2xl border border-primary-200 dark:border-primary-800 animate-fadeIn">
				<svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-4 text-primary-600 dark:text-primary-400"><path fill="currentColor" d="M5 3a1 1 0 0 1 1 1v16a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm7 6a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V10a1 1 0 0 1 1-1Zm7 4a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z"/></svg>
				<h1 className="text-3xl font-extrabold text-center text-primary-700 dark:text-primary-200 mb-2">Analíticas</h1>
				<p className="text-lg text-center text-gray-600 dark:text-gray-300">Aquí se mostrarán analíticas</p>
			</div>
		</div>
	);
}
