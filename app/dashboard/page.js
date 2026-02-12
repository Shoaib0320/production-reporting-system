import React from 'react'
import Link from 'next/link'

export default function DashboardIndex() {
  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        <li><Link href="/admin">Admin</Link></li>
        <li><Link href="/operator">Operator</Link></li>
        <li><Link href="/reports">Reports</Link></li>
      </ul>
    </div>
  )
}
