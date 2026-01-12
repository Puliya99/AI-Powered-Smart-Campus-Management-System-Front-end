import React, { useState, useEffect } from 'react'
import {
  X,
  DollarSign,
  Calendar,
  User,
  BookOpen,
  MapPin,
  Clock,
  Loader2,
  Hash,
  CreditCard,
  Banknote,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface PaymentViewModalProps {
  isOpen: boolean
  onClose: () => void
  paymentId: string | null
}

const PaymentViewModal: React.FC<PaymentViewModalProps> = ({
  isOpen,
  onClose,
  paymentId,
}) => {
  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState<any>(null)

  useEffect(() => {
    if (isOpen && paymentId) {
      fetchPaymentDetails()
    }
  }, [isOpen, paymentId])

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/payments/${paymentId}`)
      setPayment(response.data.data.payment)
    } catch (error: any) {
      toast.error('Failed to fetch payment details')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH':
        return <Banknote className="w-5 h-5" />
      case 'CARD':
        return <CreditCard className="w-5 h-5" />
      case 'ONLINE':
        return <Globe className="w-5 h-5" />
      case 'BANK_TRANSFER':
        return <Banknote className="w-5 h-5" />
      default:
        return <DollarSign className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PARTIAL':
        return 'bg-blue-100 text-blue-800'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800'
      case 'UNPAID':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Payment Details</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
            ) : payment ? (
              <div className="space-y-6">
                {/* Transaction Summary */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Transaction ID</p>
                    <p className="text-lg font-mono font-bold text-gray-900">
                      {payment.transactionId || 'N/A'}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    <p className="text-2xl font-bold text-primary-600 mt-1">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student & Program Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <User className="w-4 h-4 mr-2" /> Student & Program
                    </h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-sm">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Student Name</p>
                          <p className="text-sm font-medium text-gray-900">
                            {payment.student?.user?.firstName} {payment.student?.user?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Hash className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Student ID</p>
                          <p className="text-sm font-medium text-gray-900">
                            {payment.student?.studentId || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Program</p>
                          <p className="text-sm font-medium text-gray-900">
                            {payment.program?.programName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" /> Payment Information
                    </h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-sm">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Payment Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(payment.paymentDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="text-gray-400 mr-3">
                          {getMethodIcon(payment.paymentMethod)}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Payment Method</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Center</p>
                          <p className="text-sm font-medium text-gray-900">
                            {payment.center?.centerName || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outstanding & Next Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="flex items-center text-red-700 mb-1">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-xs font-bold uppercase">Outstanding Balance</span>
                    </div>
                    <p className="text-xl font-bold text-red-600">
                      {formatCurrency(payment.outstanding)}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center text-blue-700 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-xs font-bold uppercase">Next Payment Due</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      {payment.nextPaymentDate ? formatDate(payment.nextPaymentDate) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Remarks
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {payment.remarks || 'No remarks provided.'}
                    </p>
                  </div>
                </div>

                {/* Audit Info */}
                <div className="pt-4 border-t flex justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Created: {new Date(payment.createdAt).toLocaleString()}
                  </div>
                  {payment.updatedAt && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated: {new Date(payment.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">No payment data found.</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentViewModal
