'use client'
import Topbar from './components/topbar/Topbar'
import Sidebar from './components/sidebar/Sidebar'
import './adminStyles.css' // Ton ancien appDash.css renommé proprement

export default function AdminLayout({ children }) {
  return (
    <>
      <Topbar />
      <div className="admin-container flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  )
}
