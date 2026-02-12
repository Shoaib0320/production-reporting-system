import React from 'react'

export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>
        <h3>Dashboard</h3>
      </nav>
      <section>{children}</section>
    </div>
  )
}
