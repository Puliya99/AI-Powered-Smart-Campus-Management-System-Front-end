import React, { useState, useEffect } from 'react';
import {
  Video,
  Calendar,
  Users,
  ArrowRight,
  History,
  AlertCircle,
  Clock,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import toast from 'react-hot-toast';

interface Meeting {
  id: string;
  title: string;
  meetingCode: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  module: {
    id: string;
    moduleCode: string;
    moduleName: string;
  };
  lecturer: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  batch?: {
    id: string;
    batchNumber: string;
  };
}

const StudentOnlineClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeMeetings, setActiveMeetings] = useState<Meeting[]>([]);
  const [historyMeetings, setHistoryMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch active meetings restricted to the student's enrolled batches
      const [activeRes, historyRes] = await Promise.all([
        axiosInstance.get('/video-meetings/student-active'),
        axiosInstance.get('/video-meetings/history'),
      ]);

      setActiveMeetings(activeRes.data.data.meetings);
      setHistoryMeetings(historyRes.data.data.meetings);
    } catch (error) {
      console.error('Failed to fetch online classes:', error);
      toast.error('Failed to load online classes');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    navigate(`/video/room/${meeting.meetingCode}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Online Classes</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Join your virtual lectures and view past meeting history.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'active'
                ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Active Classes
            {activeMeetings.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-600 rounded-full">
                {activeMeetings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Meeting History
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : activeTab === 'active' ? (
          activeMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Video className="h-6 w-6 text-primary-600" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                        Live Now
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center text-sm text-primary-600 font-medium mb-1">
                      <BookOpen className="h-4 w-4 mr-1.5" />
                      {meeting.module?.moduleCode}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {meeting.module?.moduleName}
                    </p>
                    {meeting.batch && (
                      <div className="flex items-center text-xs text-indigo-600 font-medium mb-3">
                        <Layers className="h-3.5 w-3.5 mr-1.5" />
                        {meeting.batch.batchNumber}
                      </div>
                    )}

                    <div className="space-y-2 mb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Users className="h-3.5 w-3.5 mr-2" />
                        Lecturer: {meeting.lecturer.user.firstName} {meeting.lecturer.user.lastName}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5 mr-2" />
                        Started {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <button
                      onClick={() => handleJoinMeeting(meeting)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold"
                    >
                      Join Class
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Video className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No active online classes
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                When your lecturers start an online session, it will appear here.
              </p>
              <button 
                onClick={fetchData}
                className="mt-6 text-primary-600 hover:text-primary-700 font-medium"
              >
                Refresh to check for updates
              </button>
            </div>
          )
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Class Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {historyMeetings.length > 0 ? (
                    historyMeetings.map((meeting) => (
                      <tr key={meeting.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                              <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{meeting.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Host: {meeting.lecturer.user.firstName} {meeting.lecturer.user.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{meeting.module?.moduleCode}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{meeting.module?.moduleName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(meeting.startTime).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {meeting.endTime ? (
                            (() => {
                              const start = new Date(meeting.startTime);
                              const end = new Date(meeting.endTime);
                              const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
                              return `${diff} mins`;
                            })()
                          ) : 'Ongoing'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {meeting.isActive ? (
                            <button
                              onClick={() => handleJoinMeeting(meeting)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Join Now
                            </button>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">Finished</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <AlertCircle className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">No meeting history found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentOnlineClassesPage;
