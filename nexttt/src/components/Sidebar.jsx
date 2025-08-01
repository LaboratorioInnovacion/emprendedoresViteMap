"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Building2, Wrench, BarChart3, CheckSquare } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Emprendedores", href: "/emprendedores", icon: Users },
    { name: "Emprendimientos", href: "/emprendimientos", icon: Building2 },
    { name: "Herramientas", href: "/herramientas", icon: Wrench },
    { name: "Admin", href: "/admin", icon: BarChart3 },
    { name: "Personal", href: "/personal", icon: CheckSquare },
  ]

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-16">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
