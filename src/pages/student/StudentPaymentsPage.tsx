import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  Eye,
  CreditCard,
  Banknote,
  Globe,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Calendar,
} from 'lucide-react';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import PaymentViewModal from '../../components/admin/Payments/PaymentViewModal';
import axiosInstance from '../../services/api/axios.config';
import toast from 'react-hot-toast';

interface Payment {
  id: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  transactionId: string | null;
  nextPaymentDate: string | null;
  outstanding: number;
  status: string;
  remarks: string | null;
  receiptUrl: string | null;
  program: {
    programName: string;
  };
}

const StudentPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState({
    totalPaid: 0,
    totalOutstanding: 0,
    totalProgramFees: 0,
    nextPaymentDue: null as string | null,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgramOutstanding, setSelectedProgramOutstanding] = useState<number>(0);
  const [newPayment, setNewPayment] = useState({
    programId: '',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    transactionId: '',
    remarks: '',
    receipt: null as File | null,
  });

  useEffect(() => {
    fetchPayments();
    fetchPrograms();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/payments/student');
      setPayments(response.data.data.payments);
      if (response.data.data.summary) {
        setSummary(response.data.data.summary);
      }
    } catch (error: any) {
      toast.error('Failed to fetch payments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await axiosInstance.get('/students/my-courses');
      // Extract unique programs from modules
      const myPrograms = response.data.data.courses.reduce((acc: any[], curr: any) => {
        if (curr.program && !acc.find((p: any) => p.id === curr.program.id)) {
          acc.push(curr.program);
        }
        return acc;
      }, []);
      setPrograms(myPrograms);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    }
  };

  useEffect(() => {
    if (newPayment.programId) {
      fetchOutstanding(newPayment.programId);
    } else {
      setSelectedProgramOutstanding(0);
    }
  }, [newPayment.programId]);

  const fetchOutstanding = async (programId: string) => {
    try {
      const response = await axiosInstance.get('/payments/outstanding', {
        params: {
          studentId: 'me',
          programId: programId,
        },
      });
      setSelectedProgramOutstanding(response.data.data.outstanding);
    } catch (error) {
      console.error('Failed to fetch outstanding amount:', error);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.programId || !newPayment.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('programId', newPayment.programId);
    formData.append('amount', newPayment.amount);
    formData.append('paymentMethod', newPayment.paymentMethod);
    formData.append('transactionId', newPayment.transactionId);
    formData.append('remarks', newPayment.remarks);
    if (newPayment.receipt) {
      formData.append('receipt', newPayment.receipt);
    }

    try {
      setLoading(true);
      await axiosInstance.post('/payments/student', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Payment submitted successfully for approval');
      setShowAddModal(false);
      setNewPayment({
        programId: '',
        amount: '',
        paymentMethod: 'BANK_TRANSFER',
        transactionId: '',
        remarks: '',
        receipt: null,
      });
      fetchPayments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit payment');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    setSelectedPaymentId(id);
    setShowViewModal(true);
  };

  const handleFileUpload = async (paymentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      setIsUploading(paymentId);
      await axiosInstance.post(`/payments/${paymentId}/receipt`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Receipt uploaded successfully');
      fetchPayments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload receipt');
    } finally {
      setIsUploading(null);
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PARTIAL':
        return 'bg-blue-100 text-blue-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'UNPAID':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'REJECTED':
        return <AlertCircle className="w-4 h-4 mr-1" />;
      case 'PARTIAL':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'OVERDUE':
        return <AlertCircle className="w-4 h-4 mr-1" />;
      case 'UNPAID':
        return <Clock className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = {
    totalPaid: summary.totalPaid,
    totalOutstanding: summary.totalOutstanding,
    nextPayment: summary.nextPaymentDue,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Payments</h1>
            <p className="text-gray-600 mt-1">View your payment history and manage receipts.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Payment
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Total Paid</span>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPaid)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Total Outstanding</span>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalOutstanding)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Next Payment Due</span>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.nextPayment ? formatDate(stats.nextPayment) : 'No pending payments'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by program or transaction ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.program.programName}</div>
                        <div className="text-xs text-gray-500">{payment.transactionId || 'No Transaction ID'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewDetails(payment.id)}
                            className="p-1 hover:text-primary-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          
                          <label className={`cursor-pointer p-1 hover:text-primary-600 transition-colors ${isUploading === payment.id ? 'animate-pulse' : ''}`} title="Upload Receipt">
                            <Upload className="w-5 h-5" />
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(payment.id, e)}
                              disabled={isUploading === payment.id}
                            />
                          </label>

                          {(payment.receiptUrl || payment.remarks?.includes('Receipt uploaded')) && (
                            <div className="text-xs text-green-600 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Receipt Attached
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaymentViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        paymentId={selectedPaymentId}
      />

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowAddModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddPayment}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Payment</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={newPayment.programId}
                        onChange={(e) => setNewPayment({ ...newPayment, programId: e.target.value })}
                      >
                        <option value="">Select Program</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>{program.programName}</option>
                        ))}
                      </select>
                      {newPayment.programId && (
                        <p className="mt-1 text-xs text-gray-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Current Outstanding: {formatCurrency(selectedProgramOutstanding)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (LKR) *</label>
                      <input
                        type="number"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={newPayment.paymentMethod}
                        onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                      >
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="CASH">Cash</option>
                        <option value="ONLINE">Online Payment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / Reference</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={newPayment.transactionId}
                        onChange={(e) => setNewPayment({ ...newPayment, transactionId: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                        value={newPayment.remarks}
                        onChange={(e) => setNewPayment({ ...newPayment, remarks: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Receipt</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        onChange={(e) => setNewPayment({ ...newPayment, receipt: e.target.files?.[0] || null })}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Payment'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentPaymentsPage;
