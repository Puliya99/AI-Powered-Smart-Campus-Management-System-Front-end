import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, ClipboardList, Upload, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';

const EditAssignmentPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    moduleId: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/assignments/${assignmentId}`);
      const assignment = response.data.data.assignment;
      
      // Format date for datetime-local input
      const date = new Date(assignment.dueDate);
      const formattedDate = date.toISOString().slice(0, 16);

      setFormData({
        title: assignment.title,
        description: assignment.description,
        dueDate: formattedDate,
        moduleId: assignment.module.id,
      });
    } catch (error) {
      toast.error('Failed to fetch assignment details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) {
      return toast.error('Please fill in all required fields');
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('dueDate', formData.dueDate);
      if (file) {
        data.append('file', file);
      }

      await axiosInstance.put(`/assignments/${assignmentId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Assignment updated successfully!');
      navigate(`/lecturer/modules/${formData.moduleId}/assignments`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update assignment');
    } finally {
      setSaving(false);
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

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </button>
          <h1 className="text-2xl font-bold">Edit Assignment</h1>
          <div className="w-10"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center text-gray-900">
              <ClipboardList className="h-5 w-5 mr-2 text-primary-600" />
              Assignment Details
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignment Title *</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  Due Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Upload className="h-4 w-4 mr-1 text-gray-400" />
                  Assignment Brief (Optional)
                </label>
                <input
                  type="file"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center font-bold disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditAssignmentPage;