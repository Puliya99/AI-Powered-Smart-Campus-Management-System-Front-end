import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap, Award, AlertTriangle, CheckCircle, XCircle,
  ChevronDown, ChevronUp, RefreshCw, Send, Search, Download,
  Building2, BookOpen, Users, Star, RotateCcw, DollarSign,
  ShieldAlert, ShieldCheck, ShieldOff, Activity,
  CalendarCheck, ClipboardList, FileText, Library, Eye,
} from 'lucide-react';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import axiosInstance from '../../services/api/axios.config';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ── Types ────────────────────────────────────────────────────────────────────

interface RiskFactor {
  score:  number;  // 0-100, higher = safer
  detail: string;
}

interface RiskProfile {
  factors: {
    attendance:  RiskFactor;
    quiz:        RiskFactor;
    assignment:  RiskFactor;
    violations:  RiskFactor;
    materials:   RiskFactor;
    library:     RiskFactor;
  };
  overallScore: number;
  riskLevel:    'LOW' | 'MEDIUM' | 'HIGH';
}

interface ModuleResult {
  moduleId: string; moduleCode: string; moduleName: string;
  semesterNumber: number; credits: number;
  hasResult: boolean;
  marks: number | null; maxMarks: number | null; percentage: number | null;
  grade: string | null; gpaPoints: number | null;
  status: 'PASS' | 'FAIL' | 'PENDING' | null;
  attemptNumber: number | null; isRepeat: boolean; examDate: string | null;
  repeatEnrollment: {
    id: string; status: string; hasPaid: boolean; repeatFee: number | null;
    nextBatch: { id: string; batchNumber: string } | null;
    originalBatch: { id: string; batchNumber: string } | null;
    notifiedAt: string | null;
  } | null;
}

interface StudentRow {
  studentId: string; universityNumber: string;
  name: string; email: string; enrollmentStatus: string;
  totalModules: number; passedModules: number; failedModules: number; pendingModules: number;
  gpa: number; gpaClass: string; isFirstClass: boolean; isEligibleToGraduate: boolean;
  moduleResults: ModuleResult[];
  risk: RiskProfile;
}

interface ReportData {
  program: { id: string; programCode: string; programName: string };
  batch:   { id: string; batchNumber: string } | null;
  center:  { id: string; centerName: string } | null;
  totalModules: number; totalStudents: number;
  eligibleCount: number; firstClassCount: number; withRepeatsCount: number;
  riskSummary: { highRisk: number; mediumRisk: number; lowRisk: number };
  students: StudentRow[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusColor = (s: string | null) => {
  if (s === 'PASS')    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  if (s === 'FAIL')    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  if (s === 'PENDING') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400';
};

const gpaClassColor = (cls: string) => {
  if (cls === 'First Class')        return 'text-yellow-600 font-bold';
  if (cls === 'Second Class Upper') return 'text-blue-600 font-semibold';
  if (cls === 'Second Class Lower') return 'text-indigo-600 font-semibold';
  if (cls === 'Pass')               return 'text-green-600';
  return 'text-red-600 font-semibold';
};

const riskBadgeClass = (level: 'LOW' | 'MEDIUM' | 'HIGH') => {
  if (level === 'LOW')    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  if (level === 'MEDIUM') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
};

const riskBarColor = (score: number) => {
  if (score >= 75) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const RiskIcon = ({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
  if (level === 'LOW')    return <ShieldCheck className="w-3.5 h-3.5" />;
  if (level === 'MEDIUM') return <ShieldOff   className="w-3.5 h-3.5" />;
  return <ShieldAlert className="w-3.5 h-3.5" />;
};

// Mini progress bar with label
const FactorBar: React.FC<{
  label: string; icon: React.ReactNode;
  score: number; detail: string; weight: string;
}> = ({ label, icon, score, detail, weight }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 font-medium">
        {icon} {label}
        <span className="text-gray-400 font-normal">({weight})</span>
      </span>
      <span className={`font-bold ${score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
        {score}
      </span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all ${riskBarColor(score)}`}
        style={{ width: `${score}%` }}
      />
    </div>
    <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">{detail}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const GraduationReportPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [centers,   setCenters]   = useState<any[]>([]);
  const [programs,  setPrograms]  = useState<any[]>([]);
  const [allBatches, setAllBatches] = useState<any[]>([]);
  const [batches,    setBatches]   = useState<any[]>([]);

  const [centerId,  setCenterId]  = useState('');
  const [programId, setProgramId] = useState('');
  const [batchId,   setBatchId]   = useState('');
  const [search,    setSearch]    = useState('');
  const [riskFilter, setRiskFilter] = useState<'' | 'HIGH' | 'MEDIUM' | 'LOW'>('');

  const [loading,    setLoading]    = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // which rows are expanded (results / risk)
  const [expanded, setExpanded]       = useState<Record<string, boolean>>({});
  const [riskExpanded, setRiskExpanded] = useState<Record<string, boolean>>({});

  // Modals
  const [repeatModal, setRepeatModal] = useState<{
    open: boolean; student: StudentRow | null; module: ModuleResult | null;
  }>({ open: false, student: null, module: null });
  const [repeatNextBatch, setRepeatNextBatch] = useState('');
  const [repeatFee,       setRepeatFee]       = useState('');

  const [notifyModal,   setNotifyModal]   = useState<{ open: boolean; moduleId: string; moduleName: string } | null>(null);
  const [notifyBatchId, setNotifyBatchId] = useState('');

  // ── Load reference data ──────────────────────────────────────────────────────

  useEffect(() => {
    if (isAdmin) axiosInstance.get('/centers').then(r => setCenters(r.data.data.centers || [])).catch(() => {});
    axiosInstance.get('/programs').then(r => setPrograms(r.data.data.programs || [])).catch(() => {});
    axiosInstance.get('/batches').then(r => { setAllBatches(r.data.data.batches || []); setBatches(r.data.data.batches || []); }).catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    if (!programId) { setBatches(allBatches); return; }
    const filtered = allBatches.filter((b: any) => b.program?.id === programId);
    setBatches(filtered.length ? filtered : allBatches);
  }, [programId, allBatches]);

  // ── Fetch report ─────────────────────────────────────────────────────────────

  const fetchReport = async () => {
    if (!programId) { toast.error('Please select a program'); return; }
    setLoading(true);
    try {
      const params: Record<string, string> = { programId };
      if (batchId) params.batchId = batchId;
      if (centerId && isAdmin) params.centerId = centerId;
      const res = await axiosInstance.get('/results/graduation-report', { params });
      setReportData(res.data.data);
      setExpanded({}); setRiskExpanded({});
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // ── Repeat exam actions ──────────────────────────────────────────────────────

  const handleRegisterRepeat = async () => {
    if (!repeatModal.student || !repeatModal.module) return;
    try {
      await axiosInstance.post('/results/repeats', {
        studentId:   repeatModal.student.studentId,
        moduleId:    repeatModal.module.moduleId,
        nextBatchId: repeatNextBatch || undefined,
        repeatFee:   repeatFee ? parseFloat(repeatFee) : undefined,
      });
      toast.success('Repeat exam registered & student notified');
      setRepeatModal({ open: false, student: null, module: null });
      setRepeatNextBatch(''); setRepeatFee('');
      fetchReport();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register repeat');
    }
  };

  const handleMarkPaid = async (repeatId: string) => {
    try {
      await axiosInstance.patch(`/results/repeats/${repeatId}`, { hasPaid: true });
      toast.success('Repeat exam fee marked as paid');
      fetchReport();
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  const handleNotifyRepeat = async () => {
    if (!notifyModal || !notifyBatchId) { toast.error('Select a batch first'); return; }
    try {
      const res = await axiosInstance.post('/results/repeats/notify-batch', {
        moduleId:    notifyModal.moduleId,
        nextBatchId: notifyBatchId,
      });
      toast.success(res.data.message);
      setNotifyModal(null); setNotifyBatchId('');
      fetchReport();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to notify');
    }
  };

  // ── Filtered students ────────────────────────────────────────────────────────

  const filteredStudents = (reportData?.students ?? []).filter(s => {
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.universityNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchRisk = !riskFilter || s.risk?.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-primary-600" />
              Graduation &amp; Risk Report
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              GPA, graduation eligibility, exam repeats &amp; student risk assessment
            </p>
          </div>
          {reportData && (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium print:hidden"
            >
              <Download className="w-4 h-4" /> Print / Export
            </button>
          )}
        </div>

        {/* Filter panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isAdmin && (
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Center</label>
                <select value={centerId} onChange={e => setCenterId(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500">
                  <option value="">All Centers</option>
                  {centers.map(c => <option key={c.id} value={c.id}>{c.centerName}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Program <span className="text-red-500">*</span></label>
              <select value={programId} onChange={e => { setProgramId(e.target.value); setBatchId(''); }}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500">
                <option value="">Select Program</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.programName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Batch</label>
              <select value={batchId} onChange={e => setBatchId(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500">
                <option value="">All Batches</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.batchNumber}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={fetchReport} disabled={loading || !programId}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? 'Generating…' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>

        {reportData && (
          <>
            {/* ── Summary cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Students',    value: reportData.totalStudents,     icon: Users,         color: 'border-blue-500' },
                { label: 'Eligible to Grad.', value: reportData.eligibleCount,     icon: GraduationCap, color: 'border-green-500' },
                { label: 'First Class',       value: reportData.firstClassCount,   icon: Star,          color: 'border-yellow-500' },
                { label: 'With Repeats',      value: reportData.withRepeatsCount,  icon: RotateCcw,     color: 'border-red-500' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className={`bg-white dark:bg-gray-800 rounded-xl border-l-4 shadow-sm p-4 ${color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                    </div>
                    <Icon className="w-8 h-8 opacity-15" />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Risk summary banner ────────────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-primary-500" /> Student Risk Overview
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { label: 'High Risk',   count: reportData.riskSummary?.highRisk   ?? 0, level: 'HIGH',   cls: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' },
                  { label: 'Medium Risk', count: reportData.riskSummary?.mediumRisk ?? 0, level: 'MEDIUM', cls: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400' },
                  { label: 'Low Risk',    count: reportData.riskSummary?.lowRisk    ?? 0, level: 'LOW',    cls: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' },
                ] as const).map(({ label, count, level, cls }) => (
                  <button
                    key={level}
                    onClick={() => setRiskFilter(riskFilter === level ? '' : level)}
                    className={`rounded-lg border p-3 text-center transition ${cls} ${riskFilter === level ? 'ring-2 ring-offset-1 ring-current' : ''}`}
                  >
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs font-medium mt-0.5">{label}</p>
                    {riskFilter === level && <p className="text-[10px] mt-1 opacity-70">click to clear filter</p>}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                Risk is assessed on 6 factors: attendance (25%), quiz scores (20%), assignment submission (20%), exam violations (20%), material engagement (10%), library use (5%).
              </p>
            </div>

            {/* Report meta + search/filter row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 flex-1">
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> <strong className="text-gray-700 dark:text-gray-200">{reportData.program.programName}</strong></span>
                {reportData.batch   && <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {reportData.batch.batchNumber}</span>}
                {reportData.center  && <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {reportData.center.centerName}</span>}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
                  className="pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg w-56 focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            {/* ── Student cards ──────────────────────────────────────────────── */}
            <div className="space-y-3">
              {filteredStudents.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center text-gray-400">
                  No students match the current filters.
                </div>
              )}

              {filteredStudents.map(student => {
                const risk: RiskProfile = student.risk ?? {
                  factors: {
                    attendance:  { score: 50, detail: 'No data' },
                    quiz:        { score: 50, detail: 'No data' },
                    assignment:  { score: 50, detail: 'No data' },
                    violations:  { score: 100, detail: 'No violations' },
                    materials:   { score: 50, detail: 'No data' },
                    library:     { score: 50, detail: 'No data' },
                  },
                  overallScore: 50,
                  riskLevel: 'MEDIUM',
                };
                return (
                <div key={student.studentId} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                  {/* Student summary row */}
                  <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm flex-shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{student.universityNumber} · {student.email}</p>
                      </div>
                    </div>

                    {/* GPA */}
                    <div className="text-center px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">GPA</p>
                      <p className={`font-bold text-lg ${gpaClassColor(student.gpaClass)}`}>{student.gpa.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{student.gpaClass}</p>
                    </div>

                    {/* Modules */}
                    <div className="text-center px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Modules</p>
                      <p className="font-bold text-sm">
                        <span className="text-green-600">{student.passedModules}</span>
                        <span className="text-gray-400 mx-0.5">/</span>
                        <span className="text-gray-700 dark:text-gray-200">{student.totalModules}</span>
                      </p>
                      {student.failedModules > 0 && <p className="text-[10px] text-red-600">{student.failedModules} failed</p>}
                    </div>

                    {/* Risk badge */}
                    <div className="text-center px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Risk Score</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${riskBadgeClass(risk.riskLevel)}`}>
                        <RiskIcon level={risk.riskLevel} />
                        {risk.riskLevel} ({risk.overallScore})
                      </span>
                    </div>

                    {/* Graduation eligibility */}
                    <div>
                      {student.isEligibleToGraduate ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Eligible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Not Eligible
                        </span>
                      )}
                      {student.isFirstClass && student.isEligibleToGraduate && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold mt-1">
                          <Star className="w-3 h-3" /> First Class
                        </span>
                      )}
                    </div>

                    {/* Expand controls */}
                    <div className="flex gap-1 ml-auto print:hidden">
                      <button
                        onClick={() => setRiskExpanded(p => ({ ...p, [student.studentId]: !p[student.studentId] }))}
                        className={`p-2 rounded-lg text-xs font-medium transition flex items-center gap-1 ${riskExpanded[student.studentId] ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        title="Toggle risk breakdown"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        {riskExpanded[student.studentId] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setExpanded(p => ({ ...p, [student.studentId]: !p[student.studentId] }))}
                        className={`p-2 rounded-lg text-xs font-medium transition flex items-center gap-1 ${expanded[student.studentId] ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        title="Toggle module results"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {expanded[student.studentId] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* ── Risk breakdown panel ─────────────────────────────────── */}
                  {riskExpanded[student.studentId] && (
                    <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-primary-500" /> Risk Factor Breakdown
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Overall:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${riskBadgeClass(risk.riskLevel)}`}>
                            {risk.overallScore}/100 — {risk.riskLevel}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FactorBar
                          label="Attendance"
                          icon={<CalendarCheck className="w-3.5 h-3.5" />}
                          score={risk.factors.attendance.score}
                          detail={risk.factors.attendance.detail}
                          weight="25%"
                        />
                        <FactorBar
                          label="Quiz Performance"
                          icon={<ClipboardList className="w-3.5 h-3.5" />}
                          score={risk.factors.quiz.score}
                          detail={risk.factors.quiz.detail}
                          weight="20%"
                        />
                        <FactorBar
                          label="Assignment Submission"
                          icon={<FileText className="w-3.5 h-3.5" />}
                          score={risk.factors.assignment.score}
                          detail={risk.factors.assignment.detail}
                          weight="20%"
                        />
                        <FactorBar
                          label="Exam Violations"
                          icon={<ShieldAlert className="w-3.5 h-3.5" />}
                          score={risk.factors.violations.score}
                          detail={risk.factors.violations.detail}
                          weight="20%"
                        />
                        <FactorBar
                          label="Material Engagement"
                          icon={<BookOpen className="w-3.5 h-3.5" />}
                          score={risk.factors.materials.score}
                          detail={risk.factors.materials.detail}
                          weight="10%"
                        />
                        <FactorBar
                          label="Library Use"
                          icon={<Library className="w-3.5 h-3.5" />}
                          score={risk.factors.library.score}
                          detail={risk.factors.library.detail}
                          weight="5%"
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Module results table ─────────────────────────────────── */}
                  {expanded[student.studentId] && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase">
                            <tr>
                              <th className="px-4 py-3 text-left">Module</th>
                              <th className="px-4 py-3 text-center">Sem</th>
                              <th className="px-4 py-3 text-center">Marks</th>
                              <th className="px-4 py-3 text-center">%</th>
                              <th className="px-4 py-3 text-center">Grade</th>
                              <th className="px-4 py-3 text-center">GPA Pts</th>
                              <th className="px-4 py-3 text-center">Status</th>
                              <th className="px-4 py-3 text-center">Attempt</th>
                              <th className="px-4 py-3 text-center">Repeat</th>
                              <th className="px-4 py-3 text-center print:hidden">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {student.moduleResults.map(mr => (
                              <tr key={mr.moduleId} className={mr.status === 'FAIL' ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                <td className="px-4 py-3">
                                  <p className="font-medium text-gray-900 dark:text-white">{mr.moduleName}</p>
                                  <p className="text-xs text-gray-400">{mr.moduleCode}</p>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{mr.semesterNumber}</td>
                                <td className="px-4 py-3 text-center">
                                  {mr.hasResult ? `${mr.marks} / ${mr.maxMarks}` : <span className="text-gray-400">—</span>}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {mr.percentage !== null
                                    ? <span className={mr.percentage >= 40 ? 'text-green-700 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>{mr.percentage}%</span>
                                    : <span className="text-gray-400">—</span>}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-gray-800 dark:text-gray-200">{mr.grade ?? '—'}</td>
                                <td className="px-4 py-3 text-center">
                                  {mr.gpaPoints !== null
                                    ? <span className={gpaClassColor(mr.gpaPoints >= 3.7 ? 'First Class' : mr.gpaPoints >= 2.0 ? 'Pass' : 'Fail')}>{mr.gpaPoints.toFixed(1)}</span>
                                    : <span className="text-gray-400">—</span>}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(mr.status)}`}>
                                    {mr.status ?? 'No Result'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {mr.attemptNumber ?? '—'}
                                  {mr.isRepeat && <span className="ml-1 text-[10px] text-orange-600 font-bold">(R)</span>}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {mr.repeatEnrollment ? (
                                    <div className="space-y-0.5">
                                      <span className={`block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                        mr.repeatEnrollment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        mr.repeatEnrollment.status === 'NOTIFIED'  ? 'bg-blue-100 text-blue-700' :
                                        'bg-orange-100 text-orange-700'
                                      }`}>{mr.repeatEnrollment.status}</span>
                                      {mr.repeatEnrollment.nextBatch && <span className="block text-[10px] text-gray-500">→ {mr.repeatEnrollment.nextBatch.batchNumber}</span>}
                                      {mr.repeatEnrollment.repeatFee && (
                                        <span className={`block text-[10px] font-medium ${mr.repeatEnrollment.hasPaid ? 'text-green-600' : 'text-red-600'}`}>
                                          LKR {mr.repeatEnrollment.repeatFee} {mr.repeatEnrollment.hasPaid ? '✓' : '✗'}
                                        </span>
                                      )}
                                    </div>
                                  ) : <span className="text-gray-400 text-xs">—</span>}
                                </td>
                                <td className="px-4 py-3 text-center print:hidden">
                                  <div className="flex items-center justify-center gap-1">
                                    {mr.status === 'FAIL' && !mr.repeatEnrollment && (
                                      <button onClick={() => setRepeatModal({ open: true, student, module: mr })}
                                        className="p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700" title="Register Repeat">
                                        <RotateCcw className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    {mr.repeatEnrollment && !mr.repeatEnrollment.hasPaid && mr.repeatEnrollment.repeatFee && (
                                      <button onClick={() => handleMarkPaid(mr.repeatEnrollment!.id)}
                                        className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700" title="Mark fee paid">
                                        <DollarSign className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ); })}
            </div>

            {/* ── Notify repeat students section ──────────────────────────── */}
            {reportData.withRepeatsCount > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl p-5 print:hidden">
                <h3 className="font-semibold text-orange-900 dark:text-orange-300 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5" /> Modules with Repeat Exam Students
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-400 mb-4">
                  Notify all paid students registered for a repeat exam when the next batch's exam is scheduled.
                </p>
                {(() => {
                  const failedModules = new Map<string, { moduleId: string; moduleName: string; count: number }>();
                  for (const s of reportData.students) {
                    for (const m of s.moduleResults) {
                      if (m.status === 'FAIL') {
                        const ex = failedModules.get(m.moduleId);
                        if (ex) ex.count++;
                        else failedModules.set(m.moduleId, { moduleId: m.moduleId, moduleName: m.moduleName, count: 1 });
                      }
                    }
                  }
                  return Array.from(failedModules.values()).map(mod => (
                    <div key={mod.moduleId} className="flex items-center justify-between py-2 border-b border-orange-100 dark:border-orange-800 last:border-0">
                      <div>
                        <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{mod.moduleName}</span>
                        <span className="ml-2 text-xs text-orange-600">({mod.count} failed)</span>
                      </div>
                      <button
                        onClick={() => setNotifyModal({ open: true, moduleId: mod.moduleId, moduleName: mod.moduleName })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg"
                      >
                        <Send className="w-3.5 h-3.5" /> Notify Next Batch
                      </button>
                    </div>
                  ));
                })()}
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!reportData && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-16 text-center">
            <GraduationCap className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base font-medium">Select a program and click Generate Report</p>
            <p className="text-gray-400 text-sm mt-1">
              The report shows GPA, graduation eligibility, repeat exam status, and a 6-factor risk score per student.
            </p>
          </div>
        )}
      </div>

      {/* ── Register Repeat Exam Modal ─────────────────────────────────────── */}
      {repeatModal.open && repeatModal.student && repeatModal.module && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-orange-600" /> Register Repeat Exam
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>{repeatModal.student.name}</strong> — <strong>{repeatModal.module.moduleName}</strong>
            </p>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Next Batch</label>
              <select value={repeatNextBatch} onChange={e => setRepeatNextBatch(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm">
                <option value="">Select Batch (optional)</option>
                {allBatches.map(b => <option key={b.id} value={b.id}>{b.batchNumber}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Repeat Exam Fee (LKR)</label>
              <input type="number" value={repeatFee} onChange={e => setRepeatFee(e.target.value)}
                placeholder="Leave blank for no charge"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              <p className="text-xs text-gray-400 mt-1">Only paid students will be notified when the next batch exam is scheduled.</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setRepeatModal({ open: false, student: null, module: null }); setRepeatNextBatch(''); setRepeatFee(''); }}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={handleRegisterRepeat}
                className="px-4 py-2 text-sm text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Register & Notify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Notify Repeat Students Modal ───────────────────────────────────── */}
      {notifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-600" /> Notify Repeat Students
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Module: <strong>{notifyModal.moduleName}</strong></p>
            <p className="text-xs text-gray-400">
              All students with a <strong>paid</strong> repeat enrollment will receive an email + in-app notification.
            </p>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Next Batch <span className="text-red-500">*</span></label>
              <select value={notifyBatchId} onChange={e => setNotifyBatchId(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm">
                <option value="">Select Batch</option>
                {allBatches.map(b => <option key={b.id} value={b.id}>{b.batchNumber}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setNotifyModal(null); setNotifyBatchId(''); }}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={handleNotifyRepeat} disabled={!notifyBatchId}
                className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-lg font-medium flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default GraduationReportPage;
