import React, { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import reportService from '../../../services/report.service';

interface ReportGeneratorProps {
  onReportGenerated: (type: string, data: any) => void;
  selectedCenter: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onReportGenerated, selectedCenter }) => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('enrollment');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    batchId: '',
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let data;
      switch (reportType) {
        case 'enrollment':
          data = await reportService.getEnrollmentReport(selectedCenter);
          break;
        case 'payment':
          data = await reportService.getPaymentReport(filters.startDate, filters.endDate, selectedCenter);
          break;
        case 'attendance':
          data = await reportService.getAttendanceReport(filters.batchId, selectedCenter);
          break;
        default:
          throw new Error('Invalid report type');
      }
      onReportGenerated(reportType, data.data);
      toast.success('Report generated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-primary-600" />
        Generate Report
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="enrollment">Enrollment Report</option>
            <option value="payment">Payment Report</option>
            <option value="attendance">Attendance Report</option>
          </select>
        </div>

        {reportType === 'payment' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </>
        )}

        {reportType === 'attendance' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID (Optional)</label>
            <input
              type="text"
              placeholder="Enter Batch ID"
              value={filters.batchId}
              onChange={(e) => setFilters({ ...filters, batchId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-6 flex items-center justify-center w-full md:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Generate Report
          </>
        )}
      </button>
    </div>
  );
};

export default ReportGenerator;
