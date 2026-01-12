import React, { useState, useEffect } from 'react';
import { FileBarChart, Users, BookOpen, Layers, DollarSign, Search } from 'lucide-react';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import ReportGenerator from '../../components/admin/Reports/ReportGenerator';
import ReportPreview from '../../components/admin/Reports/ReportPreview';
import reportService from '../../services/report.service';
import axiosInstance from '../../services/api/axios.config';

const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<{ type: string; data: any[] } | null>(null);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [centers, setCenters] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPrograms: 0,
    totalBatches: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    fetchStats();
  }, [selectedCenter]);

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers');
      setCenters(response.data.data.centers || []);
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reportService.getReportStats(selectedCenter);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleReportGenerated = (type: string, data: any[]) => {
    setReportData({ type, data });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
            <p className="text-gray-600 mt-1">Generate and view campus reports</p>
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Centers</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.centerName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <Users className="w-10 h-10 text-blue-100" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
              </div>
              <BookOpen className="w-10 h-10 text-green-100" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Batches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBatches}</p>
              </div>
              <Layers className="w-10 h-10 text-purple-100" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">LKR {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-yellow-100" />
            </div>
          </div>
        </div>

        <ReportGenerator onReportGenerated={handleReportGenerated} selectedCenter={selectedCenter} />

        {reportData && (
          <ReportPreview type={reportData.type} data={reportData.data} />
        )}

        {!reportData && (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <FileBarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Select a report type and click generate to view data.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
