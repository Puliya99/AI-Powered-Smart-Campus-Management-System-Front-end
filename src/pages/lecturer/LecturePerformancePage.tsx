import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Award, 
  Users, 
  BookOpen, 
  Star, 
  BarChart2, 
  ChevronRight,
  ArrowLeft,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import toast from 'react-hot-toast';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const LecturePerformancePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [lecturerData, setLecturerData] = useState<any>(null);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [moduleMetrics, setModuleMetrics] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const moduleIdParam = params.get('moduleId');
    
    fetchLecturerPerformance(moduleIdParam);
  }, []);

  const fetchLecturerPerformance = async (moduleIdParam?: string | null) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/performance/lecturer/me');
      setLecturerData(response.data.data);
      
      if (moduleIdParam) {
        fetchModuleMetrics(moduleIdParam);
      } else if (response.data.data.modules.length > 0) {
        fetchModuleMetrics(response.data.data.modules[0].moduleId);
      }
    } catch (error) {
      console.error('Failed to fetch lecturer performance:', error);
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleMetrics = async (moduleId: string) => {
    try {
      const response = await axiosInstance.get(`/performance/module/${moduleId}`);
      setModuleMetrics(response.data.data);
      setSelectedModule(response.data.data.module);
    } catch (error) {
      console.error('Failed to fetch module metrics:', error);
      toast.error('Failed to load module details');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const moduleStats = lecturerData?.modules || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lecture Performance</h1>
            <p className="text-gray-600 mt-1">Analytics and insights into your teaching performance.</p>
          </div>
          <Activity className="h-10 w-10 text-primary-600 opacity-20" />
        </div>

        {/* Aggregated Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg Class Performance</p>
              <Award className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {moduleStats.length > 0 
                ? (moduleStats.reduce((acc: any, m: any) => acc + m.avgMarks, 0) / moduleStats.length).toFixed(1)
                : '0'}%
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span>Overall academic average</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg Attendance</p>
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {moduleStats.length > 0 
                ? (moduleStats.reduce((acc: any, m: any) => acc + m.attendanceRate, 0) / moduleStats.length).toFixed(1)
                : '0'}%
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Activity className="h-3 w-3 text-blue-500 mr-1" />
              <span>Student engagement rate</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Student Satisfaction</p>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {moduleStats.length > 0 
                ? (moduleStats.reduce((acc: any, m: any) => acc + m.avgRating, 0) / moduleStats.length).toFixed(1)
                : '0'}/5
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
              <span>Average feedback rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module Selector List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
              Your Modules
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {moduleStats.map((m: any) => (
                <button
                  key={m.moduleId}
                  onClick={() => fetchModuleMetrics(m.moduleId)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedModule?.id === m.moduleId 
                      ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-200 shadow-sm' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-primary-600 uppercase mb-1">{m.moduleCode}</p>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{m.moduleName}</h4>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${selectedModule?.id === m.moduleId ? 'text-primary-600 translate-x-1' : 'text-gray-300'}`} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Marks: {m.avgMarks}%</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Att: {m.attendanceRate}%</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Module Detail Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {moduleMetrics ? (
              <>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <BarChart2 className="h-6 w-6 mr-2 text-primary-600" />
                    {selectedModule?.moduleName} Analytics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Academic Chart */}
                    <div className="h-64">
                      <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Academic Performance</p>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Avg Marks', value: moduleMetrics.metrics.academic.avgMarks },
                          { name: 'Pass Rate', value: moduleMetrics.metrics.academic.passRate }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            <Cell fill="#4f46e5" />
                            <Cell fill="#10b981" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Feedback Distribution */}
                    <div className="h-64">
                      <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Student Feedback</p>
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="relative h-40 w-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Rating', value: moduleMetrics.metrics.feedback.avgRating },
                                  { name: 'Empty', value: 5 - moduleMetrics.metrics.feedback.avgRating }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={60}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                              >
                                <Cell fill="#f59e0b" />
                                <Cell fill="#f3f4f6" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-gray-900">{moduleMetrics.metrics.feedback.avgRating}</span>
                            <span className="text-[10px] text-gray-500 font-bold">OUT OF 5</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Based on {moduleMetrics.metrics.feedback.totalFeedbacks} responses</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4">Content & Assignments</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Lecture Materials Shared</span>
                        <span className="text-sm font-black text-primary-600">{moduleMetrics.metrics.delivery.materialCount}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full">
                        <div className="bg-primary-600 h-full rounded-full" style={{ width: `${Math.min(moduleMetrics.metrics.delivery.materialCount * 10, 100)}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Assignments Created</span>
                        <span className="text-sm font-black text-amber-600">{moduleMetrics.metrics.delivery.assignmentCount}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: `${Math.min(moduleMetrics.metrics.delivery.assignmentCount * 20, 100)}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Submissions Received</span>
                        <span className="text-sm font-black text-green-600">{moduleMetrics.metrics.delivery.totalSubmissions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">Student Attendance</h4>
                    <p className="text-3xl font-black text-blue-600">{moduleMetrics.metrics.engagement.attendanceRate}%</p>
                    <p className="text-xs text-gray-500 mt-2 max-w-[180px]">
                      From {moduleMetrics.metrics.engagement.totalAttendanceRecords} recorded instances across all sessions.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <BarChart2 className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Select a module to view analytics</h3>
                <p className="text-gray-500 text-sm mt-1">Detailed metrics for each module will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LecturePerformancePage;
