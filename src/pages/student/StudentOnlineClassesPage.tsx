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
      
      // Get all active meetings for student's modules
      // First, get enrolled modules to fetch meetings for each (or use a dedicated endpoint if available)
      // Based on previous analysis, we'll fetch student dashboard data to get modules
      const dashboardRes = await axiosInstance.get('/dashboard/student');
      const modules = dashboardRes.data.data.enrolledModules || [];
      
      const activeMeetingsPromises = modules.map((m: any) => 
        axiosInstance.get(`/video-meetings/module/${m.id}`)
      );
      
      const activeMeetingsResponses = await Promise.all(activeMeetingsPromises);
      const allActiveMeetings = activeMeetingsResponses.flatMap(res => res.data.data.meetings);
      setActiveMeetings(allActiveMeetings);

      // Get meeting history
      const historyRes = await axiosInstance.get('/video-meetings/history');
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
            <h1 className="text-3xl font-bold text-gray-900">Online Classes</h1>
            <p className="text-gray-600 mt-1">
              Join your virtual lectures and view past meeting history.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'active'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
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
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
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
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Video className="h-6 w-6 text-primary-600" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                        Live Now
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center text-sm text-primary-600 font-medium mb-3">
                      <BookOpen className="h-4 w-4 mr-1.5" />
                      {meeting.module?.moduleCode}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      {meeting.module?.moduleName}
                    </p>

                    <div className="space-y-2 mb-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3.5 w-3.5 mr-2" />
                        Lecturer: {meeting.lecturer.user.firstName} {meeting.lecturer.user.lastName}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
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
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No active online classes
              </h3>
              <p className="text-gray-500 mt-1">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historyMeetings.length > 0 ? (
                    historyMeetings.map((meeting) => (
                      <tr key={meeting.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg mr-3">
                              <History className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{meeting.title}</div>
                              <div className="text-xs text-gray-500">
                                Host: {meeting.lecturer.user.firstName} {meeting.lecturer.user.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{meeting.module?.moduleCode}</div>
                          <div className="text-xs text-gray-500">{meeting.module?.moduleName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(meeting.startTime).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                            <span className="text-gray-400">Finished</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <AlertCircle className="h-10 w-10 text-gray-300 mb-2" />
                          <p className="text-gray-500">No meeting history found.</p>
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
