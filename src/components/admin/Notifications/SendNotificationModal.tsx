import React, { useState, useEffect } from 'react';
import {
  X, Send, Users, Search, Loader2, Filter,
  CheckCircle2, AlertCircle, Mail, ChevronLeft,
} from 'lucide-react';
import axiosInstance from '../../../services/api/axios.config';
import notificationService, { RecipientUser } from '../../../services/notification.service';
import toast from 'react-hot-toast';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_TYPES = [
  { value: 'GENERAL',    label: 'General' },
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'PAYMENT',    label: 'Payment' },
  { value: 'ATTENDANCE', label: 'Attendance' },
  { value: 'SCHEDULE',   label: 'Schedule' },
  { value: 'RESULT',     label: 'Result' },
  { value: 'LIBRARY',    label: 'Library' },
  { value: 'EXAM',       label: 'Exam' },
];

const ROLE_CHIPS = [
  { label: 'All',       value: '' },
  { label: 'Students',  value: 'STUDENT' },
  { label: 'Lecturers', value: 'LECTURER' },
  { label: 'Staff',     value: 'USER' },
  { label: 'Admins',    value: 'ADMIN' },
];

const ROLE_COLORS: Record<string, string> = {
  STUDENT:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  LECTURER: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  ADMIN:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  USER:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const SendNotificationModal: React.FC<SendNotificationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'compose' | 'confirm'>('compose');
  const [sending, setSending] = useState(false);
  const [recipientsLoading, setRecipientsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title:     '',
    message:   '',
    type:      'GENERAL',
    link:      '',
    sendEmail: false,
  });

  const [roleFilter,  setRoleFilter]  = useState('');
  const [centerId,    setCenterId]    = useState('');
  const [programId,   setProgramId]   = useState('');
  const [batchId,     setBatchId]     = useState('');
  const [searchTerm,  setSearchTerm]  = useState('');

  const [allRecipients,   setAllRecipients]   = useState<RecipientUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [centers,  setCenters]  = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [batches,  setBatches]  = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    fetchDropdowns();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    fetchRecipients();
  }, [isOpen, roleFilter, centerId, programId, batchId]);

  useEffect(() => {
    fetchBatches(programId || undefined);
    setBatchId('');
  }, [programId]);

  const fetchDropdowns = async () => {
    try {
      const [centersRes, programsRes] = await Promise.all([
        axiosInstance.get('/centers?limit=200'),
        axiosInstance.get('/programs?limit=200'),
      ]);
      setCenters(centersRes.data.data?.centers ?? []);
      setPrograms(programsRes.data.data?.programs ?? []);
      fetchBatches();
    } catch { }
  };

  const fetchBatches = async (pId?: string) => {
    try {
      const params: Record<string, string> = { limit: '200' };
      if (pId) params.programId = pId;
      const res = await axiosInstance.get('/batches', { params });
      setBatches(res.data.data?.batches ?? []);
    } catch { }
  };

  const fetchRecipients = async () => {
    setRecipientsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (roleFilter)  params.role      = roleFilter;
      if (centerId)    params.centerId  = centerId;
      if (programId)   params.programId = programId;
      if (batchId)     params.batchId   = batchId;

      const res = await notificationService.getRecipients(params);
      const users = res.data.users ?? [];
      setAllRecipients(users);
      setSelectedUserIds(users.map(u => u.id));
    } catch {
      toast.error('Failed to load recipients');
    } finally {
      setRecipientsLoading(false);
    }
  };

  const displayedRecipients = allRecipients.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  const toggleUser = (id: string) =>
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const allDisplayedSelected =
    displayedRecipients.length > 0 &&
    displayedRecipients.every(u => selectedUserIds.includes(u.id));

  const toggleSelectAll = () => {
    if (allDisplayedSelected) {
      setSelectedUserIds(prev => prev.filter(id => !displayedRecipients.some(u => u.id === id)));
    } else {
      const newIds = displayedRecipients.map(u => u.id);
      setSelectedUserIds(prev => [...new Set([...prev, ...newIds])]);
    }
  };

  const handlePreview = () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in the title and message');
      return;
    }
    if (selectedUserIds.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }
    setStep('confirm');
  };

  const handleSend = async () => {
    try {
      setSending(true);
      await notificationService.sendNotification({ userIds: selectedUserIds, ...formData });
      toast.success(`Notification sent to ${selectedUserIds.length} recipient${selectedUserIds.length !== 1 ? 's' : ''}`);
      handleClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setStep('compose');
    setFormData({ title: '', message: '', type: 'GENERAL', link: '', sendEmail: false });
    setRoleFilter(''); setCenterId(''); setProgramId(''); setBatchId('');
    setSearchTerm(''); setSelectedUserIds([]); setAllRecipients([]);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white";

  if (step === 'confirm') {
    const selectedRecipients = allRecipients.filter(u => selectedUserIds.includes(u.id));
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Review & Confirm
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Notification preview</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{formData.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{formData.message}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full uppercase">
                  {formData.type}
                </span>
                {formData.sendEmail && (
                  <span className="text-[10px] font-medium px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center gap-1">
                    <Mail className="w-3 h-3" />Email included
                  </span>
                )}
                {formData.link && (
                  <span className="text-[10px] text-gray-400 truncate max-w-xs">{formData.link}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                  Sending to <span className="text-amber-700 dark:text-amber-400">{selectedUserIds.length}</span> recipient{selectedUserIds.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  This will create a notification for every selected user. This action cannot be undone.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Selected recipients:</p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {selectedRecipients.slice(0, 20).map(u => (
                  <span key={u.id} className="text-[11px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    {u.firstName} {u.lastName}
                    <span className={`text-[9px] px-1 rounded ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-500'}`}>{u.role}</span>
                  </span>
                ))}
                {selectedUserIds.length > 20 && (
                  <span className="text-[11px] text-gray-400 px-2 py-0.5">+{selectedUserIds.length - 20} more</span>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
            <button onClick={() => setStep('compose')}
              className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />Back
            </button>
            <button onClick={handleSend} disabled={sending}
              className="px-8 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2">
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <><Send className="w-4 h-4" />Confirm Send</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-primary-600" />
            Send Notification
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* LEFT: Notification content */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input type="text" required value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className={inputClass} placeholder="Notification title" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
              <textarea required rows={5} value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className={`${inputClass} resize-none`} placeholder="Type your message…" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className={inputClass}>
                  {NOTIFICATION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link (optional)</label>
                <input type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })}
                  className={inputClass} placeholder="/student/schedule" />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition select-none">
              <input type="checkbox" checked={formData.sendEmail}
                onChange={e => setFormData({ ...formData, sendEmail: e.target.checked })}
                className="w-4 h-4 accent-primary-600" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Also send as email
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Each recipient will also receive an email notification</p>
              </div>
            </label>
          </div>

          {/* RIGHT: Audience targeting */}
          <div className="w-full lg:w-96 flex flex-col bg-gray-50 dark:bg-gray-900">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Audience Filters
              </p>

              <div className="flex flex-wrap gap-1.5">
                {ROLE_CHIPS.map(chip => (
                  <button key={chip.value} type="button" onClick={() => setRoleFilter(chip.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      roleFilter === chip.value
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:text-primary-600'
                    }`}>
                    {chip.label}
                  </button>
                ))}
              </div>

              <select value={centerId} onChange={e => setCenterId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">All Centers</option>
                {centers.map(c => <option key={c.id} value={c.id}>{c.centerName}</option>)}
              </select>

              <select value={programId} onChange={e => setProgramId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">All Programs</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.programName ?? p.name}</option>)}
              </select>

              <select value={batchId} onChange={e => setBatchId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">All Batches</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.batchNumber ?? b.name}</option>)}
              </select>

              {(programId || batchId) && (
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Program/Batch filters show enrolled students only
                </p>
              )}
            </div>

            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  placeholder="Search by name or email…" />
              </div>
            </div>

            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button type="button" onClick={toggleSelectAll} className="text-xs text-primary-600 font-medium hover:underline">
                {allDisplayedSelected ? 'Deselect all visible' : 'Select all visible'}
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {recipientsLoading ? 'Loading…' : `${selectedUserIds.length} / ${allRecipients.length} selected`}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {recipientsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                </div>
              ) : displayedRecipients.length === 0 ? (
                <div className="text-center py-10">
                  <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No users match the current filters</p>
                </div>
              ) : (
                displayedRecipients.map(u => {
                  const isSelected = selectedUserIds.includes(u.id);
                  return (
                    <div key={u.id} onClick={() => toggleUser(u.id)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                      }`}>
                      <div className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${
                        isSelected ? 'bg-primary-600 border-primary-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500'
                      }`}>
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{u.firstName} {u.lastName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                      </div>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-500'}`}>
                        {u.role}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{selectedUserIds.length}</span>{' '}
            recipient{selectedUserIds.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={handleClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition">
              Cancel
            </button>
            <button type="button" onClick={handlePreview}
              className="px-8 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Preview & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotificationModal;
