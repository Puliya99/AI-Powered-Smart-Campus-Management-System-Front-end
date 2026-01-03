import React from 'react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'

const LecturerDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">
            Lecturer dashboard content coming soon...
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LecturerDashboard
