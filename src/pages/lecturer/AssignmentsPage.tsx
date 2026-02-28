import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Trash2,
  Clock,
  ArrowLeft,
  Edit,
  MoreVertical,
  Users,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  fileUrl: string;
  createdAt: string;
}

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
}

const AssignmentsPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableModules();
  }, []);

  useEffect(() => {
    if (moduleId) {
      fetchModule();
      fetchAssignments();
    } else {
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

  const fetchModule = async () => {
    try {
      const response = await axiosInstance.get(`/modules/${moduleId}`);
      setModule(response.data.data.module);
    } catch (error) {
      console.error('Failed to fetch module details:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/assignments/module/${moduleId}`);
      setAssignments(response.data.data.assignments);
    } catch (error) {
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment? This will also delete all student submissions.')) return;

    try {
      await axiosInstance.delete(`/assignments/${id}`);
      toast.success('Assignment deleted successfully');
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete assignment');
    }
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (newId) navigate(`/lecturer/modules/${newId}/assignments`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!moduleId) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <ClipboardList className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">Select a Module</h2>
          <select
            onChange={handleModuleChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            defaultValue=""
          >
            <option value="" disabled>Choose a module...</option>
            {availableModules.map(m => (
              <option key={m.id} value={m.id}>{m.moduleCode} - {m.moduleName}</option>
            ))}
          </select>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Link to="/lecturer/classes" className="text-sm text-gray-500 hover:text-primary-600 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-primary-600">{module?.moduleCode}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Module Assignments</h1>
            <p className="text-gray-600">Create and manage assignments for your students.</p>
          </div>
          <Link
            to={`/lecturer/modules/${moduleId}/assignments/create`}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Assignment
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <ClipboardList className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="relative group/menu">
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 overflow-hidden">
                        <button
                          onClick={() => navigate(`/lecturer/assignments/${assignment.id}/edit`)}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <Edit className="h-3.5 w-3.5 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center border-t border-gray-100"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{assignment.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{assignment.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                    {assignment.fileUrl && (
                       <a 
                       href={`http://localhost:5000${assignment.fileUrl}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center text-primary-600 hover:underline"
                     >
                       <Download className="h-4 w-4 mr-2" />
                       View Brief
                     </a>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-5 py-3 border-t flex justify-between items-center">
                  <Link
                    to={`/lecturer/assignments/${assignment.id}/submissions`}
                    className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-700"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Submissions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No assignments yet</h3>
            <p className="text-gray-500 mt-1">Start by creating your first assignment for this module.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignmentsPage;