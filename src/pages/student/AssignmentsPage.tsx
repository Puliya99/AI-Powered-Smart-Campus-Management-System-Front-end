import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle, Download, Upload, AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import toast from 'react-hot-toast';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  fileUrl: string;
  submission?: {
    id: string;
    fileUrl: string;
    submittedAt: string;
    isLate: boolean;
    status: string;
    marks: number | null;
    feedback: string | null;
  };
}

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
}

const StudentAssignmentsPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

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
      const response = await axiosInstance.get('/dashboard/student');
      setAvailableModules(response.data.data.enrolledModules || []);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingId || !file) return;

    try {
      const data = new FormData();
      data.append('file', file);

      await axiosInstance.post(`/assignments/${submittingId}/submit`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Assignment submitted successfully!');
      setSubmittingId(null);
      setFile(null);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to submit assignment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
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
          <h2 className="text-xl font-bold mb-4">Select a Course</h2>
          <div className="space-y-4">
            {availableModules.map(m => (
              <Link
                key={m.id}
                to={`/student/modules/${m.id}/assignments`}
                className="block w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
              >
                <p className="font-bold text-gray-900">{m.moduleCode}</p>
                <p className="text-sm text-gray-500">{m.moduleName}</p>
              </Link>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Link to="/student/courses" className="text-sm text-gray-500 hover:text-primary-600 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-primary-600">{module?.moduleCode}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : assignments.length > 0 ? (
          <div className="space-y-6">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                          <ClipboardList className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{assignment.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          Due: {formatDate(assignment.dueDate)}
                        </div>
                        {assignment.fileUrl && (
                          <a 
                            href={`http://localhost:5000${assignment.fileUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-primary-600 hover:underline"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download Brief
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="md:w-64">
                      {assignment.submission ? (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Your Submission</h4>
                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              {assignment.submission.isLate ? (
                                <span className="inline-flex items-center text-red-600 font-bold">
                                  <AlertCircle className="h-4 w-4 mr-1" /> Late Submission
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-green-600 font-bold">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Submitted
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              On {formatDate(assignment.submission.submittedAt)}
                            </p>
                            
                            {assignment.submission.marks !== null && (
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm font-bold text-gray-900">
                                  Grade: <span className="text-primary-600">{assignment.submission.marks}</span>
                                </p>
                                {assignment.submission.feedback && (
                                  <p className="text-xs text-gray-600 mt-1 italic">
                                    "{assignment.submission.feedback}"
                                  </p>
                                )}
                              </div>
                            )}

                            <button
                              onClick={() => setSubmittingId(assignment.id)}
                              className="text-xs text-primary-600 hover:underline font-medium"
                            >
                              Resubmit Assignment
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSubmittingId(assignment.id)}
                          className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-bold text-sm flex items-center justify-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
            <p className="text-gray-500 mt-1">There are no assignments posted for this module yet.</p>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {submittingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Upload Assignment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  required
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-400 mt-2">Upload your assignment file (PDF, DOCX, ZIP)</p>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittingId(null);
                    setFile(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!file}
                  className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                  Submit Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentAssignmentsPage;