import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  File,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  ArrowLeft,
  Calendar,
  User,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import MaterialModal from '../../components/lecturer/Materials/MaterialModal';

interface Material {
  id: string;
  title: string;
  type: 'TEXT' | 'IMAGE' | 'LINK' | 'FILE';
  content: string;
  fileUrl: string;
  uploadDate: string;
  lecturer: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
}

const LectureMaterialsPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const navigate = useNavigate();

  const isLecturer = user?.role === 'LECTURER';

  useEffect(() => {
    if (user) {
      fetchAvailableModules();
    }
  }, [user]);

  useEffect(() => {
    if (moduleId) {
      fetchModule();
      fetchMaterials();
    } else {
      setModule(null);
      setMaterials([]);
      setLoading(false);
    }
  }, [moduleId]);

  const fetchAvailableModules = async () => {
    try {
      if (isLecturer) {
        const response = await axiosInstance.get('/lecturers/profile/me');
        setAvailableModules(response.data.data.lecturer.modules || []);
      } else {
        const response = await axiosInstance.get('/dashboard/student');
        setAvailableModules(response.data.data.enrolledModules || []);
      }
    } catch (error) {
      console.error('Failed to fetch available modules:', error);
    }
  };

  const fetchModule = async () => {
    if (!moduleId) return;
    try {
      const response = await axiosInstance.get(`/modules/${moduleId}`);
      setModule(response.data.data.module);
    } catch (error) {
      console.error('Failed to fetch module details:', error);
    }
  };

  const fetchMaterials = async () => {
    if (!moduleId) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/lecture-notes/module/${moduleId}`);
      setMaterials(response.data.data.materials);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      await axiosInstance.delete(`/lecture-notes/${id}`);
      toast.success('Material deleted successfully');
      fetchMaterials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete material');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TEXT':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'IMAGE':
        return <ImageIcon className="h-6 w-6 text-green-500" />;
      case 'LINK':
        return <LinkIcon className="h-6 w-6 text-purple-500" />;
      case 'FILE':
        return <File className="h-6 w-6 text-orange-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModuleId = e.target.value;
    if (newModuleId) {
      navigate(isLecturer ? `/lecturer/modules/${newModuleId}/materials` : `/student/modules/${newModuleId}/materials`);
    } else {
      navigate(isLecturer ? '/lecturer/materials' : '/student/materials');
    }
  };

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
                Lecture Materials
              </h1>
              <p className="text-gray-600">
                Please select a module to view materials.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <div className="p-3 bg-primary-50 rounded-full inline-block mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Select a Module</h3>
              <p className="text-gray-500 mt-1 text-sm">
                Choose one of your assigned modules to view its materials.
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
                to={isLecturer ? "/lecturer/classes" : "/student/courses"}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Go to My {isLecturer ? "Classes" : "Courses"}
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
            <h1 className="text-2xl font-bold text-gray-900">
              Lecture Materials
            </h1>
            {module && (
              <p className="text-gray-600">
                {module.moduleCode} - {module.moduleName}
              </p>
            )}
          </div>

          {isLecturer && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Share Material
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {getIcon(material.type)}
                    </div>
                    {isLecturer && (
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {material.title}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {material.lecturer.user.firstName} {material.lecturer.user.lastName}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(material.uploadDate)}
                      </div>
                    </div>
                  </div>

                  {material.type === 'TEXT' && material.content && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 line-clamp-3 italic">
                      {material.content}
                    </div>
                  )}
                </div>

                <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                  {material.type === 'LINK' ? (
                    <a
                      href={material.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Link
                    </a>
                  ) : material.fileUrl ? (
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      {material.type === 'IMAGE' ? (
                        <>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          View Image
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download File
                        </>
                      )}
                    </a>
                  ) : (
                    <div className="text-center text-sm text-gray-500 py-2">
                      No attachment
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No materials found</h3>
            <p className="text-gray-500 mt-1">
              {isLecturer
                ? "You haven't shared any materials for this module yet."
                : "Your lecturer hasn't shared any materials for this module yet."}
            </p>
            {isLecturer && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Share your first material
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <MaterialModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          moduleId={moduleId!}
          onSuccess={fetchMaterials}
        />
      )}
    </DashboardLayout>
  );
};

export default LectureMaterialsPage;
