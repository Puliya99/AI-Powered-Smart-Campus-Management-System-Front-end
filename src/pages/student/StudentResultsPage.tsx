import React, { useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  FileText,
  AlertCircle,
  Brain,
  Zap,
} from 'lucide-react';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';

interface Result {
  id: string;
  module: {
    moduleCode: string;
    moduleName: string;
  };
  marks: number;
  maxMarks: number;
  grade: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  examDate: string;
  remarks: string;
}

const StudentResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiRiskStats, setAiRiskStats] = useState<any>(null);

  useEffect(() => {
    fetchResults();
    fetchAiRiskData();
  }, []);

  const fetchAiRiskData = async () => {
    try {
      const response = await axiosInstance.get('/performance/ai-predictions');
      setAiRiskStats(response.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch AI risk data:', error);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/results/my-results');
      setResults(response.data.data.results);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(r => 
    r.module.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.module.moduleCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: results.length,
    passed: results.filter(r => r.status === 'PASS').length,
    failed: results.filter(r => r.status === 'FAIL').length,
    avg: results.length > 0 
      ? (results.reduce((acc, r) => acc + (r.marks / r.maxMarks) * 100, 0) / results.length).toFixed(1)
      : '0'
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
          <p className="text-gray-600 mt-1">View your academic performance and grades.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 rounded-full bg-blue-50 mr-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Modules</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 rounded-full bg-green-50 mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Average Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avg}%</p>
            </div>
          </div>
          
          {/* AI Risk Summary Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-purple-100 bg-gradient-to-br from-white to-purple-50 flex items-center md:col-span-2">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-purple-600 uppercase font-bold tracking-wider">AI Center Risk Status</p>
                <div className="flex items-center text-[8px] font-bold text-purple-700 bg-purple-200 px-1.5 py-0.5 rounded uppercase">
                  <Zap className="h-2 w-2 mr-1" />
                  Live
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-red-600 leading-none">{aiRiskStats?.highRisk || 0}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">High</p>
                </div>
                <div className="text-center border-x border-purple-100 px-4">
                  <p className="text-lg font-bold text-yellow-600 leading-none">{aiRiskStats?.mediumRisk || 0}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Med</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600 leading-none">{aiRiskStats?.lowRisk || 0}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Low</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                className="pl-10 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Percentage</th>
                  <th className="px-6 py-4 text-center">Grade</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Exam Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResults.map((result) => {
                  const percentage = Math.round((result.marks / result.maxMarks) * 100);
                  return (
                    <tr key={result.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{result.module.moduleName}</p>
                        <p className="text-xs text-gray-500">{result.module.moduleCode}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-gray-900">{result.marks}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-500">{result.maxMarks}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div className="w-24 bg-gray-100 rounded-full h-2 mr-3 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${percentage >= 40 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-700">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-gray-100 rounded text-sm font-black text-gray-900">
                          {result.grade || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          result.status === 'PASS' ? 'bg-green-100 text-green-700' : 
                          result.status === 'FAIL' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-2" />
                          {new Date(result.examDate).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 mb-2 opacity-20" />
                        <p>No results found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {results.some(r => r.remarks) && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-primary-600 mr-2" />
              Lecturer Remarks
            </h3>
            <div className="space-y-4">
              {results.filter(r => r.remarks).map(r => (
                <div key={r.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-primary-500">
                  <p className="text-xs font-bold text-primary-600 uppercase mb-1">{r.module.moduleName}</p>
                  <p className="text-sm text-gray-700 italic">"{r.remarks}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentResultsPage;