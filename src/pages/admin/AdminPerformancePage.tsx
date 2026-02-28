import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  BarChart2, 
  Search, 
  FileText,
  User,
  Star,
  Activity,
  ArrowRight,
  Filter,
  Brain,
  Zap,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AdminPerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [lecturersPerformance, setLecturersPerformance] = useState<any[]>([]);
  const [batchRiskStats, setBatchRiskStats] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [batchPerformance, setBatchPerformance] = useState<any>(null);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState('');

  useEffect(() => {
    fetchCenters();
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchPerformanceData();
    fetchAiRiskData();
  }, [selectedCenter]);

  useEffect(() => {
    if (selectedBatch) {
      fetchBatchPerformance();
    } else {
      setBatchPerformance(null);
    }
  }, [selectedBatch]);

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers/dropdown');
      setCenters(response.data.data.centers || []);
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axiosInstance.get('/batches/dropdown');
      setBatches(response.data.data.batches || []);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    }
  };

  const fetchAiRiskData = async () => {
    try {
      const url = selectedCenter 
        ? `/performance/ai-predictions?centerId=${selectedCenter}` 
        : '/performance/ai-predictions';
      const response = await axiosInstance.get(url);
      setBatchRiskStats(response.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch AI risk data:', error);
    }
  };

  const fetchBatchPerformance = async () => {
    try {
      setLoadingBatch(true);
      const response = await axiosInstance.get(`/performance/batch/${selectedBatch}`);
      setBatchPerformance(response.data.data);
    } catch (error) {
      console.error('Failed to fetch batch performance:', error);
      toast.error('Failed to load batch performance');
    } finally {
      setLoadingBatch(false);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const url = selectedCenter 
        ? `/performance/admin/all-lecturers?centerId=${selectedCenter}` 
        : '/performance/admin/all-lecturers';
      const response = await axiosInstance.get(url);
      setLecturersPerformance(response.data.data);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      toast.error('Failed to load performance metrics');
    } finally {
      setLoading(false);
    }
  };

  const filteredLecturers = lecturersPerformance.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Prepare data for top chart
  const topAcademic = [...lecturersPerformance]
    .sort((a, b) => b.avgMarks - a.avgMarks)
    .slice(0, 5);

  const topEngagement = [...lecturersPerformance]
    .sort((a, b) => b.avgAttendance - a.avgAttendance)
    .slice(0, 5);

  const noData = lecturersPerformance.length === 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Overview</h1>
            <p className="text-gray-600 mt-1">System-wide quality, engagement and AI risk metrics.</p>
          </div>
          <div className="flex space-x-4">
            {user?.role === 'ADMIN' && (
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">All Centers</option>
                  {centers.map(center => (
                    <option key={center.id} value={center.id}>{center.centerName}</option>
                  ))}
                </select>
              </div>
            )}
            <Activity className="h-10 w-10 text-primary-600 opacity-20" />
          </div>
        </div>

        {/* AI Batch Risk Overview */}
        {batchRiskStats && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 bg-gradient-to-r from-white to-purple-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-2 rounded-lg shadow-lg shadow-purple-200">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">AI Batch Risk Overview</h3>
                  <p className="text-sm text-gray-500">Predicted examination failure risk across all modules</p>
                </div>
              </div>
              <div className="flex items-center text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
                <Zap className="h-3 w-3 mr-1" />
                Live Center Analysis
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 font-medium">Total Predicted</p>
                <p className="text-2xl font-bold text-gray-900">{batchRiskStats.highRisk + batchRiskStats.mediumRisk + batchRiskStats.lowRisk}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
                <p className="text-sm text-red-600 font-medium">High Risk Students</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-red-700">{batchRiskStats.highRisk}</p>
                  <span className="text-xs font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded">
                    {Math.round((batchRiskStats.highRisk / (batchRiskStats.highRisk + batchRiskStats.mediumRisk + batchRiskStats.lowRisk || 1)) * 100)}%
                  </span>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
                <p className="text-sm text-yellow-600 font-medium">Medium Risk Students</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-yellow-700">{batchRiskStats.mediumRisk}</p>
                  <span className="text-xs font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                    {Math.round((batchRiskStats.mediumRisk / (batchRiskStats.highRisk + batchRiskStats.mediumRisk + batchRiskStats.lowRisk || 1)) * 100)}%
                  </span>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <p className="text-sm text-green-600 font-medium">Low Risk Students</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-green-700">{batchRiskStats.lowRisk}</p>
                  <span className="text-xs font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded">
                    {Math.round((batchRiskStats.lowRisk / (batchRiskStats.highRisk + batchRiskStats.mediumRisk + batchRiskStats.lowRisk || 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end">
              <Link to="/admin/students" className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center">
                Identify students at risk
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Batch Performance Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary-600" />
              Batch Performance Analysis
            </h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-sm"
              >
                <option value="">Select a Batch</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>{batch.batchNumber}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingBatch ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : batchPerformance ? (
            <div className="space-y-6">
              <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">Active Batch</p>
                  <h4 className="text-xl font-bold text-primary-900">{batchPerformance.batchNumber}</h4>
                  <p className="text-sm text-primary-700">{batchPerformance.programName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">Modules Tracked</p>
                  <p className="text-2xl font-bold text-primary-900">{batchPerformance.metrics.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {batchPerformance.metrics.map((m: any) => (
                  <div key={m.moduleId} className="p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors shadow-sm">
                    <h5 className="font-bold text-gray-900 mb-3">{m.moduleCode}: {m.moduleName}</h5>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Average Marks</span>
                          <span className="font-bold text-gray-900">{m.avgMarks}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${m.avgMarks > 70 ? 'bg-green-500' : m.avgMarks > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${m.avgMarks}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Attendance Rate</span>
                          <span className="font-bold text-gray-900">{m.attendanceRate}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${m.attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-3 opacity-20" />
              <p className="text-gray-500">Select a batch to view detailed performance metrics</p>
            </div>
          )}
        </div>

        {/* Global Stats Bar Charts */}
        {!noData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                <Award className="h-5 w-5 mr-2 text-indigo-600" />
                Top Academic Performers (Avg Marks)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topAcademic} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="avgMarks" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Top Student Engagement (Attendance)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topEngagement} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="avgAttendance" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No data available for the selected center</h3>
            <p className="text-gray-500">Try selecting a different center or "All Centers".</p>
          </div>
        )}

        {/* Lecturers Performance Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-bold text-gray-900">Lecturer Metrics</h3>
            <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl justify-end">
              {user?.role === 'ADMIN' && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedCenter}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="">All Centers</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.centerName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lecturers..."
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Lecturer</th>
                  <th className="px-6 py-4 text-center">Modules</th>
                  <th className="px-6 py-4 text-center">Avg Marks</th>
                  <th className="px-6 py-4 text-center">Avg Attendance</th>
                  <th className="px-6 py-4 text-center">Rating</th>
                  <th className="px-6 py-4 text-center">Materials</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLecturers.map((l) => (
                  <tr key={l.lecturerId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="font-bold text-gray-900">{l.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
                        {l.moduleCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-gray-900">{l.avgMarks}%</span>
                        <div className="w-16 bg-gray-100 h-1 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full ${l.avgMarks >= 60 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                            style={{ width: `${l.avgMarks}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-gray-900">{l.avgAttendance}%</span>
                        <div className="w-16 bg-gray-100 h-1 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full ${l.avgAttendance >= 70 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${l.avgAttendance}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center text-yellow-500">
                        <Star className="h-4 w-4 mr-1" fill="currentColor" />
                        <span className="font-bold text-gray-900">{l.avgRating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-gray-600">{l.materialsCount}</span>
                    </td>
                  </tr>
                ))}
                {filteredLecturers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No lecturer performance data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPerformancePage;
