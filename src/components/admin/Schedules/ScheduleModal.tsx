import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';
import axiosInstance from '../../../services/api/axios.config';
import toast from 'react-hot-toast';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: any | null;
  onSuccess: () => void;
}

interface FormData {
  moduleId: string;
  batchId: string;
  lecturerId: string;
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  lectureHall: string;
  status: string;
}

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
}

interface Batch {
  id: string;
  batchNumber: string;
}

interface Lecturer {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface Center {
  id: string;
  centerCode: string;
  centerName: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    moduleId: '',
    batchId: '',
    lecturerId: '',
    centerId: '',
    date: '',
    startTime: '',
    endTime: '',
    lectureHall: '',
    status: 'SCHEDULED',
  });

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (schedule) {
      setFormData({
        moduleId: schedule.module?.id || '',
        batchId: schedule.batch?.id || '',
        lecturerId: schedule.lecturer?.id || '',
        centerId: schedule.center?.id || '',
        date: schedule.date?.split('T')[0] || '',
        startTime: schedule.startTime || '',
        endTime: schedule.endTime || '',
        lectureHall: schedule.lectureHall || '',
        status: schedule.status || 'SCHEDULED',
      });
    } else {
      setFormData({
        moduleId: '',
        batchId: '',
        lecturerId: '',
        centerId: '',
        date: '',
        startTime: '',
        endTime: '',
        lectureHall: '',
        status: 'SCHEDULED',
      });
    }
    setConflicts([]);
  }, [schedule]);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      const [modulesRes, batchesRes, lecturersRes, centersRes] = await Promise.all([
        axiosInstance.get('/modules/dropdown'),
        axiosInstance.get('/batches/dropdown'),
        axiosInstance.get('/lecturers'),
        axiosInstance.get('/centers'),
      ]);

      setModules(modulesRes.data.data.modules);
      setBatches(batchesRes.data.data.batches);
      setLecturers(lecturersRes.data.data.lecturers || []);
      setCenters(centersRes.data.data.centers || []);
    } catch (error) {
      console.error('Failed to fetch dropdown data:', error);
      toast.error('Failed to load form data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setConflicts([]);
  };

  const validateForm = () => {
    if (!formData.moduleId) {
      toast.error('Please select a module');
      return false;
    }
    if (!formData.batchId) {
      toast.error('Please select a batch');
      return false;
    }
    if (!formData.lecturerId) {
      toast.error('Please select a lecturer');
      return false;
    }
    if (!formData.centerId) {
      toast.error('Please select a center');
      return false;
    }
    if (!formData.date) {
      toast.error('Date is required');
      return false;
    }
    if (!formData.startTime || !formData.endTime) {
      toast.error('Start time and end time are required');
      return false;
    }
    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time');
      return false;
    }
    if (!formData.lectureHall.trim()) {
      toast.error('Lecture hall is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setConflicts([]);

    try {
      if (schedule) {
        await axiosInstance.put(`/schedules/${schedule.id}`, formData);
        toast.success('Schedule updated successfully');
      } else {
        await axiosInstance.post('/schedules', formData);
        toast.success('Schedule created successfully');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.response?.data?.conflicts) {
        setConflicts(error.response.data.conflicts);
        toast.error('Schedule conflicts detected');
      } else {
        toast.error(
          error.response?.data?.message ||
            `Failed to ${schedule ? 'update' : 'create'} schedule`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              {schedule ? 'Edit Schedule' : 'Add New Schedule'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {loadingData ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <>
                  {/* Conflicts Warning */}
                  {conflicts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-red-800 mb-2">
                            Schedule Conflicts Detected:
                          </h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            {conflicts.map((conflict, index) => (
                              <li key={index}>• {conflict.message}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Module */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="moduleId"
                        value={formData.moduleId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select module</option>
                        {modules.map((module) => (
                          <option key={module.id} value={module.id}>
                            {module.moduleCode} - {module.moduleName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Batch */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Batch <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="batchId"
                        value={formData.batchId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select batch</option>
                        {batches.map((batch) => (
                          <option key={batch.id} value={batch.id}>
                            {batch.batchNumber}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Lecturer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lecturer <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="lecturerId"
                        value={formData.lecturerId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select lecturer</option>
                        {lecturers.map((lecturer) => (
                          <option key={lecturer.id} value={lecturer.id}>
                            {lecturer.user.firstName} {lecturer.user.lastName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Center */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Center <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="centerId"
                        value={formData.centerId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select center</option>
                        {centers.map((center) => (
                          <option key={center.id} value={center.id}>
                            {center.centerCode} - {center.centerName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Lecture Hall */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lecture Hall <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lectureHall"
                        value={formData.lectureHall}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Hall A, Room 101"
                      />
                    </div>

                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RESCHEDULED">Rescheduled</option>
                      </select>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> The system will automatically check for
                      conflicts with existing schedules (lecturer availability and
                      lecture hall booking).
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || loadingData}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {schedule ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {schedule ? 'Update Schedule' : 'Create Schedule'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;