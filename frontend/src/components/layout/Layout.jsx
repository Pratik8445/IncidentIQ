import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.shell}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.main}>
        <Topbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
