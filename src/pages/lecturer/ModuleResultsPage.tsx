import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Search, 
  User, 
  GraduationCap, 
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  ChevronDown
} from 'lucide-react';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface Student {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    registrationNumber: string;
  };
}

interface Result {
  id?: string;
  student: Student;
  marks: number;
  maxMarks: number;
  grade: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  examDate: string;
  remarks: string;
}

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
}

const ModuleResultsPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [module, setModule] = useState<Module | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchAvailableModules();
    }
  }, [user]);

  useEffect(() => {
    if (moduleId) {
      fetchData();
    } else {
      setModule(null);
      setResults([]);
      setLoading(false);
    }
  }, [moduleId]);

  const fetchAvailableModules = async () => {
    try {
      const response = await axiosInstance.get('/lecturers/profile/me');
      setAvailableModules(response.data.data.lecturer.modules || []);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };

  const fetchData = async () => {
    if (!moduleId) return;
    try {
      setLoading(true);
      const moduleRes = await axiosInstance.get(`/modules/${moduleId}`);
      setModule(moduleRes.data.data.module);

      const resultsRes = await axiosInstance.get(`/results/module/${moduleId}`);
      const fetchedResults = resultsRes.data.data.results;
      const fetchedEnrolled = resultsRes.data.data.enrolledStudents;

      setEnrolledStudents(fetchedEnrolled);

      // Create a map of existing results by studentId for easy lookup
      const resultsMap = new Map();
      fetchedResults.forEach((r: any) => resultsMap.set(r.student.id, r));

      // Build the list of results for all enrolled students
      const initialResults = fetchedEnrolled.map((student: Student) => {
        const existing = resultsMap.get(student.id);
        if (existing) {
          return {
            ...existing,
            examDate: existing.examDate ? new Date(existing.examDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          };
        }
        return {
          student,
          marks: 0,
          maxMarks: 100,
          grade: '',
          status: 'PENDING',
          examDate: new Date().toISOString().split('T')[0],
          remarks: ''
        };
      });

      setResults(initialResults);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load results data');
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (index: number, field: keyof Result, value: any) => {
    const updatedResults = [...results];
    updatedResults[index] = { ...updatedResults[index], [field]: value };
    
    // Auto-calculate PASS/FAIL if marks/maxMarks change
    if (field === 'marks' || field === 'maxMarks') {
      const marks = field === 'marks' ? value : updatedResults[index].marks;
      const max = field === 'maxMarks' ? value : updatedResults[index].maxMarks;
      if (max > 0) {
        const percentage = (marks / max) * 100;
        updatedResults[index].status = percentage >= 40 ? 'PASS' : 'FAIL';
        
        // Simple grade auto-assignment
        if (percentage >= 85) updatedResults[index].grade = 'A+';
        else if (percentage >= 75) updatedResults[index].grade = 'A';
        else if (percentage >= 65) updatedResults[index].grade = 'B';
        else if (percentage >= 50) updatedResults[index].grade = 'C';
        else if (percentage >= 40) updatedResults[index].grade = 'S';
        else updatedResults[index].grade = 'F';
      }
    }

    setResults(updatedResults);
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const dataToSave = results.map(r => ({
        studentId: r.student.id,
        moduleId,
        marks: r.marks,
        maxMarks: r.maxMarks,
        grade: r.grade,
        status: r.status,
        examDate: r.examDate,
        remarks: r.remarks
      }));

      await axiosInstance.post('/results/bulk', { moduleId, results: dataToSave });
      toast.success('All results saved successfully');
      fetchData(); // Refresh to get IDs for new results
    } catch (error) {
      console.error('Failed to save results:', error);
      toast.error('Failed to save results');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResult = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this result?')) return;

    try {
      await axiosInstance.delete(`/results/${id}`);
      toast.success('Result deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete result');
    }
  };

  const filteredResults = results.filter(r => 
    r.student.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.student.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.student.user.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModuleId = e.target.value;
    if (newModuleId) {
      navigate(`/lecturer/modules/${newModuleId}/results`);
    } else {
      navigate('/lecturer/results');
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

  if (!moduleId) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Module Results
              </h1>
              <p className="text-gray-600">
                Please select a module to manage results.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <div className="p-3 bg-primary-50 rounded-full inline-block mb-4">
                <GraduationCap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Select a Module</h3>
              <p className="text-gray-500 mt-1 text-sm">
                Choose one of your assigned modules to manage its student results.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg appearance-none bg-white border cursor-pointer"
                  onChange={handleModuleChange}
                  value=""
                >
                  <option value="" disabled>Select a module...</option>
                  {availableModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.moduleCode} - {m.moduleName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs text-gray-400">OR</span>
              </div>

              <Link
                to="/lecturer/classes"
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Go to My Classes
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <span className="text-gray-300">|</span>
              <div className="relative inline-block">
                <select
                  className="bg-transparent border-none text-sm text-primary-600 font-medium focus:ring-0 p-0 pr-8 appearance-none cursor-pointer hover:text-primary-700"
                  onChange={handleModuleChange}
                  value={moduleId}
                >
                  {availableModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.moduleCode}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 text-primary-600 pointer-events-none" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Module Results</h1>
            {module && (
              <p className="text-gray-600">
                {module.moduleCode} - {module.moduleName}
              </p>
            )}
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 h-fit"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Saving...' : 'Save All Results'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Pass
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Fail
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                Pending
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-3 min-w-[200px]">Student</th>
                  <th className="px-6 py-3 w-24">Marks</th>
                  <th className="px-6 py-3 w-24">Max</th>
                  <th className="px-6 py-3 w-24">Grade</th>
                  <th className="px-6 py-3 w-32">Status</th>
                  <th className="px-6 py-3 w-40">Exam Date</th>
                  <th className="px-6 py-3">Remarks</th>
                  <th className="px-6 py-3 w-16 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResults.map((result, idx) => (
                  <tr key={result.student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs mr-3">
                          {result.student.user.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {result.student.user.firstName} {result.student.user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.student.user.registrationNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        className="w-full border border-gray-200 rounded p-1 text-sm text-center focus:ring-primary-500"
                        value={result.marks}
                        onChange={(e) => handleResultChange(idx, 'marks', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        className="w-full border border-gray-200 rounded p-1 text-sm text-center focus:ring-primary-500"
                        value={result.maxMarks}
                        onChange={(e) => handleResultChange(idx, 'maxMarks', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded p-1 text-sm text-center font-bold focus:ring-primary-500"
                        value={result.grade}
                        onChange={(e) => handleResultChange(idx, 'grade', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <select
                        className={`w-full border border-gray-200 rounded p-1 text-xs font-bold focus:ring-primary-500 ${
                          result.status === 'PASS' ? 'text-green-600' : result.status === 'FAIL' ? 'text-red-600' : 'text-yellow-600'
                        }`}
                        value={result.status}
                        onChange={(e) => handleResultChange(idx, 'status', e.target.value)}
                      >
                        <option value="PASS">PASS</option>
                        <option value="FAIL">FAIL</option>
                        <option value="PENDING">PENDING</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="date"
                        className="w-full border border-gray-200 rounded p-1 text-xs focus:ring-primary-500"
                        value={result.examDate}
                        onChange={(e) => handleResultChange(idx, 'examDate', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        className="w-full border border-gray-200 rounded p-1 text-sm focus:ring-primary-500"
                        value={result.remarks}
                        onChange={(e) => handleResultChange(idx, 'remarks', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {result.id ? (
                        <button
                          onClick={() => handleDeleteResult(result.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                          title="Delete Result"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <div className="w-4 h-4"></div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <User className="h-8 w-8 mb-2 opacity-20" />
                        <p>No students found for this module.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend / Info */}
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
          <div className="text-sm text-primary-700">
            <p className="font-bold mb-1">Grading Tips:</p>
            <ul className="list-disc list-inside space-y-0.5 opacity-80">
              <li>Marks and Grade are automatically calculated based on percentages, but you can manually override them.</li>
              <li>Students with 40% or more are automatically marked as "PASS".</li>
              <li>Changes are not permanent until you click "Save All Results".</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModuleResultsPage;