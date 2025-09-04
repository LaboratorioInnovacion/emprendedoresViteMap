"use client";
import { useState, useEffect, useRef } from "react";
import { useEmprendimientos } from "../../context/EmprendimientosContext";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Search, Bell, User, Moon, Sun, Menu, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { canAccess } from "../../lib/canAcces";
import { useAuth } from "../../context/AuthContext";
import { useSession } from "next-auth/react";
import Link from "next/link";

function Header({ toggleMobileSidebar }) {
  const { data: session, status } = useSession();

  const { user, isAuthenticated } = useAuth();
  const userBtnRef = useRef(null);
  // Tour con Driver.js
  useEffect(() => {
    if (isAuthenticated && userBtnRef.current && !localStorage.getItem("tour_done")) {
      const tour = driver({
        allowClose: false,
        doneBtnText: 'Entendido',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        closeBtnText: 'Cerrar',
        steps: [
          {
            element: userBtnRef.current,
            popover: {
              title: 'Tu perfil',
              description: 'Haz click aquí para ver tu perfil y completar los datos.',
              position: 'bottom',
            },
          },
        ],
      });
      setTimeout(() => {
        tour.drive();
        localStorage.setItem("tour_done", "1");
      }, 800);
    }
  }, [isAuthenticated]);
  const isAdmin = canAccess("ADMIN", user?.rol);
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { allemprendimientos } = useEmprendimientos();

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    // console.log('session',session)
    // console.log('status',status)
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const results = allemprendimientos.filter((emp) =>
      (emp.denominacion || "").toLowerCase().includes(term) ||
      (emp.sector || "").toLowerCase().includes(term) ||
      (emp.actividadPrincipal || "").toLowerCase().includes(term)
    );
    setSearchResults(results);
  };

  // Buscar en tiempo real
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const results = allemprendimientos.filter((emp) =>
      (emp.denominacion || "").toLowerCase().includes(term) ||
      (emp.sector || "").toLowerCase().includes(term) ||
      (emp.actividadPrincipal || "").toLowerCase().includes(term)
    );
    setSearchResults(results);
  }, [searchTerm, allemprendimientos]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMobileSidebar}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 md:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="hidden md:flex items-center relative">
            <form onSubmit={handleSearch} className="w-full">
              <input
                type="text"
                placeholder="Buscar Negocio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-64 lg:w-80"
                autoComplete="off"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>
            {searchTerm && searchResults.length > 0 && (
              <div className="absolute top-12 left-0 w-64 lg:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-20 animate-fadeIn max-h-72 overflow-y-auto">
                {searchResults.map((emp) => (
                  <a
                    key={emp.id}
                    href={`/emprendimientos/${emp.id}`}
                    className="block px-4 py-2 hover:bg-primary-50 dark:hover:bg-primary-900 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                  >
                    <span className="font-semibold">{emp.denominacion || 'Sin nombre'}</span>
                    <span className="ml-2 text-xs text-gray-500">{emp.sector}</span>
                  </a>
                ))}
                {searchResults.length === 0 && (
                  <div className="px-4 py-2 text-gray-500 text-sm">Sin resultados</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              ref={userBtnRef}
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <User
                  size={18}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <ChevronDown
                size={16}
                className="text-gray-500 hidden md:block"
              />
            </button>

            {isAuthenticated && dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-dropdown rounded-md py-1 z-10 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">rol {session.user.rol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {/* {session.user.name || session.user.email} */}
                    {session.user.name}
                  </p>
                </div>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Perfil
                </a>
                {/* <a
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Ajustes
                </a> */}
                <a
                  href="/emprendimientos/new"
                  className="cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Crear emprendimiento
                </a>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
            {!isAuthenticated && dropdownOpen && (
              <div
                // className="absolute right-0 mt-2 w-48 bg-white dark
                // className="absolute right-0 mt-2 w-48  dark:bg-gray-700 shadow-dropdown rounded-md py-1 z-10 animate-fadeIn"
                className="absolute right-0 mt-2 w-48  dark:bg-gray-700 bg-slate-200 rounded-md py-1 z-10 animate-fadeIn"
              >
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Iniciar sesión
                </Link>
                <a
                  href="/auth/register"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Registrarse
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex md:hidden relative w-full">
        <form onSubmit={handleSearch} className="w-full">
          <input
            type="text"
            placeholder="Buscar Negocio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
            autoComplete="off"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </form>
        {searchTerm && searchResults.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-20 animate-fadeIn max-h-72 overflow-y-auto">
            {searchResults.map((emp) => (
              <a
                key={emp.id}
                href={`/emprendimientos/${emp.id}`}
                className="block px-4 py-2 hover:bg-primary-50 dark:hover:bg-primary-900 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
              >
                <span className="font-semibold">{emp.denominacion || 'Sin nombre'}</span>
                <span className="ml-2 text-xs text-gray-500">{emp.sector}</span>
              </a>
            ))}
            {searchResults.length === 0 && (
              <div className="px-4 py-2 text-gray-500 text-sm">Sin resultados</div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
