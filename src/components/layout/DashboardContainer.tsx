'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardContainer({ 
  children, 
  user 
}: { 
  children: React.ReactNode, 
  user: any 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar - Menerima state isOpen */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Content Area - Margin kiri berubah sesuai status sidebar */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        
        {/* Navbar - Menerima fungsi toggle */}
        <Navbar 
          user={user} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        /> 
        
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}