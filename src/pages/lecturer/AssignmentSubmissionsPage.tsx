import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, ClipboardList, ArrowLeft, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import toast from 'react-hot-toast';

interface Submission {
  id: string;
  student: {
    user: {
      firstName: string;
      lastName: string;
      registrationNumber: string;
    };
  };
  fileUrl: string;
  submittedAt: string;
  isLate: boolean;
  status: string;
  marks: number | null;
  feedback: string | null;
}

const AssignmentSubmissionsPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [markData, setMarkData] = useState({ marks: '', feedback: '' });

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const assignmentRes = await axiosInstance.get(`/assignments/${assignmentId}`);
      setAssignment(assignmentRes.data.data.assignment);

      const submissionsRes = await axiosInstance.get(`/assignments/${assignmentId}/submissions`);
      setSubmissions(submissionsRes.data.data.submissions);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (submissionId: string, studentName: string) => {
    try {
      const response = await axiosInstance.get(`/assignments/submissions/${submissionId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Submission_${studentName.replace(/\s+/g, '_')}.pdf`); // Assuming pdf or similar
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!markingId) return;

    try {
      await axiosInstance.put(`/assignments/submissions/${markingId}/mark`, {
        marks: parseInt(markData.marks),
        feedback: markData.feedback,
      });
      toast.success('Submission marked successfully');
      setMarkingId(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to mark submission');
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

  if (!assignment) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link to={`/lecturer/modules/${assignment.module.id}/assignments`} className="flex items-center text-gray-500 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Assignments
          </Link>
          <h1 className="text-2xl font-bold">Submissions: {assignment.title}</h1>
          <div className="w-10"></div>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 rounded-lg mr-4">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-bold text-gray-900">{new Date(assignment.dueDate).toLocaleString()}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Submitted At</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Marks</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{sub.student.user.firstName} {sub.student.user.lastName}</p>
                      <p className="text-xs text-gray-500">{sub.student.user.registrationNumber}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {sub.isLate ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <Clock className="h-3 w-3 mr-1" /> LATE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" /> ON TIME
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {sub.marks !== null ? (
                        <span className="font-bold text-primary-600">{sub.marks}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not marked</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDownload(sub.id, `${sub.student.user.firstName}_${sub.student.user.lastName}`)}
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                          title="Download"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setMarkingId(sub.id);
                            setMarkData({ marks: sub.marks?.toString() || '', feedback: sub.feedback || '' });
                          }}
                          className="text-sm font-bold text-primary-600 hover:text-primary-700"
                        >
                          {sub.marks !== null ? 'Edit Mark' : 'Mark'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No submissions found for this assignment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mark Modal */}
      {markingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Mark Submission</h3>
            <form onSubmit={handleMark} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Marks</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  value={markData.marks}
                  onChange={(e) => setMarkData({ ...markData, marks: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  rows={3}
                  value={markData.feedback}
                  onChange={(e) => setMarkData({ ...markData, feedback: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMarkingId(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition"
                >
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AssignmentSubmissionsPage;