import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, ShieldCheck, ShieldOff, Activity,
  Users, Search, RefreshCw, Send, ChevronDown, ChevronUp,
  CalendarCheck, ClipboardList, FileText, BookOpen, Library,
  Bell, X,
} from 'lucide-react';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import axiosInstance from '../../services/api/axios.config';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ── Types ────────────────────────────────────────────────────────────────────

interface RiskFactor {
  score:  number;
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

interface StudentRiskRow {
  studentId:        string;
  universityNumber: string;
  name:             string;
  email:            string;
  program: { id: string; programCode: string; programName: string };
  batch:   { id: string; batchNumber: string } | null;
  enrollmentStatus: string;
  risk: RiskProfile;
}

interface RiskReportData {
  summary: { total: number; highRisk: number; mediumRisk: number; lowRisk: number };
  students: StudentRiskRow[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Page ─────────────────────────────────────────────────────────────────────

const StudentRiskPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [centers,    setCenters]    = useState<any[]>([]);
  const [programs,   setPrograms]   = useState<any[]>([]);
  const [allBatches, setAllBatches] = useState<any[]>([]);
  const [batches,    setBatches]    = useState<any[]>([]);

  const [centerId,        setCenterId]        = useState('');
  const [programId,       setProgramId]       = useState('');
  const [batchId,         setBatchId]         = useState('');
  const [search,          setSearch]          = useState('');
  const [riskLevelFilter, setRiskLevelFilter] = useState<'' | 'HIGH' | 'MEDIUM' | 'LOW'>('');

  const [loading,    setLoading]    = useState(false);
  const [reportData, setReportData] = useState<RiskReportData | null>(null);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [notifyModal,   setNotifyModal]   = useState<{ student: StudentRiskRow } | null>(null);
  const [notifyMessage, setNotifyMessage] = useState('Your academic performance shows risk factors that need immediate attention. Please speak to your academic advisor.');
  const [notifyLoading, setNotifyLoading] = useState(false);

  const [bulkLoading, setBulkLoading] = useState(false);

  // ── Load reference data ──────────────────────────────────────────────────

  useEffect(() => {
    if (isAdmin) {
      axiosInstance.get('/centers').then(r => setCenters(r.data.data.centers || [])).catch(() => {});
    }
    axiosInstance.get('/programs').then(r => setPrograms(r.data.data.programs || [])).catch(() => {});
    axiosInstance.get('/batches').then(r => {
      setAllBatches(r.data.data.batches || []);
      setBatches(r.data.data.batches || []);
    }).catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    if (!programId) { setBatches(allBatches); return; }
    const filtered = allBatches.filter((b: any) => b.program?.id === programId);
    setBatches(filtered.length ? filtered : allBatches);
  }, [programId, allBatches]);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (programId) params.programId = programId;
      if (batchId)   params.batchId   = batchId;
      if (centerId && isAdmin) params.centerId = centerId;

      const res = await axiosInstance.get('/results/student-risk', { params });
      setReportData(res.data.data);
      setExpanded({});
      setRiskLevelFilter('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load risk report');
    } finally {
      setLoading(false);
    }
  };

  // ── Notify single student ────────────────────────────────────────────────

  const handleSendNotification = async () => {
    if (!notifyModal) return;
    setNotifyLoading(true);
    try {
      await axiosInstance.post('/results/student-risk/notify', {
        studentIds: [notifyModal.student.studentId],
        title:      'Academic Risk Alert',
        message:    notifyMessage,
      });
      toast.success(`Alert sent to ${notifyModal.student.name}`);
      setNotifyModal(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send notification');
    } finally {
      setNotifyLoading(false);
    }
  };

  // ── Bulk notify all HIGH risk ────────────────────────────────────────────

  const handleBulkNotify = async () => {
    if (!reportData) return;
    const ids = reportData.students
      .filter(s => s.risk.riskLevel === 'HIGH')
      .map(s => s.studentId);
    if (ids.length === 0) return;

    setBulkLoading(true);
    try {
      await axiosInstance.post('/results/student-risk/notify', {
        studentIds: ids,
        title:      'Academic Risk Alert',
        message:    'Your academic performance has been flagged as HIGH RISK. Please contact your academic advisor immediately to discuss a remediation plan.',
      });
      toast.success(`Alerts sent to ${ids.length} high-risk student(s)`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send notifications');
    } finally {
      setBulkLoading(false);
    }
  };

  // ── Filter ───────────────────────────────────────────────────────────────

  const filteredStudents = (reportData?.students ?? []).filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      s.name.toLowerCase().includes(q) ||
      s.universityNumber.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.program.programName.toLowerCase().includes(q);
    const matchRisk = !riskLevelFilter || s.risk?.riskLevel === riskLevelFilter;
    return matchSearch && matchRisk;
  });

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-red-500" />
            Student Risk Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Identify at-risk students based on attendance, quiz performance, assignment submission, exam violations, material engagement, and library use.
          </p>
        </div>

        {/* Filter Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className={`grid gap-4 ${isAdmin ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>

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
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Program</label>
              <select value={programId} onChange={e => { setProgramId(e.target.value); setBatchId(''); }}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500">
                <option value="">All Programs</option>
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

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Name, ID, email…"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div className="flex items-end">
              <button onClick={fetchReport} disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition">
                {loading
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Loading…</>
                  : <><Search className="w-4 h-4" /> Load Report</>}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {reportData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl border-l-4 border-blue-500 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.summary.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200 dark:text-blue-900" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border-l-4 border-red-500 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">High Risk</p>
                  <p className="text-2xl font-bold text-red-600">{reportData.summary.highRisk}</p>
                </div>
                <ShieldAlert className="w-8 h-8 text-red-200 dark:text-red-900" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border-l-4 border-yellow-500 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Medium Risk</p>
                  <p className="text-2xl font-bold text-yellow-600">{reportData.summary.mediumRisk}</p>
                </div>
                <ShieldOff className="w-8 h-8 text-yellow-200 dark:text-yellow-900" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border-l-4 border-green-500 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Low Risk</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.summary.lowRisk}</p>
                </div>
                <ShieldCheck className="w-8 h-8 text-green-200 dark:text-green-900" />
              </div>
            </div>

            {/* Risk Filter Tabs + count */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Filter by risk:</span>
              {(['', 'HIGH', 'MEDIUM', 'LOW'] as const).map(level => (
                <button key={level || 'ALL'} onClick={() => setRiskLevelFilter(level)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                    riskLevelFilter === level
                      ? level === 'HIGH'   ? 'bg-red-600 text-white border-red-600'
                      : level === 'MEDIUM' ? 'bg-yellow-500 text-white border-yellow-500'
                      : level === 'LOW'    ? 'bg-green-600 text-white border-green-600'
                      :                     'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}>
                  {level === '' ? 'All' : level}
                </button>
              ))}
              <span className="ml-auto text-xs text-gray-400">
                {filteredStudents.length} of {reportData.summary.total} student(s)
              </span>
            </div>

            {/* Bulk Alert Banner */}
            {reportData.summary.highRisk > 0 && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    {reportData.summary.highRisk} student(s) are at HIGH risk of failure
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">
                    Send an alert to all high-risk students at once to prompt them to seek academic support.
                  </p>
                </div>
                <button onClick={handleBulkNotify} disabled={bulkLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition">
                  {bulkLoading
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending…</>
                    : <><Bell className="w-4 h-4" /> Notify All High Risk</>}
                </button>
              </div>
            )}

            {/* Student Cards */}
            <div className="space-y-3">
              {filteredStudents.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center text-gray-400 border border-gray-200 dark:border-gray-700">
                  No students match the current filters.
                </div>
              )}

              {filteredStudents.map(student => {
                const risk = student.risk ?? {
                  factors: {
                    attendance:  { score: 50, detail: 'No data' },
                    quiz:        { score: 50, detail: 'No data' },
                    assignment:  { score: 50, detail: 'No data' },
                    violations:  { score: 100, detail: 'No violations' },
                    materials:   { score: 50, detail: 'No data' },
                    library:     { score: 50, detail: 'No data' },
                  },
                  overallScore: 50,
                  riskLevel: 'MEDIUM' as const,
                };
                const isExpanded = expanded[`${student.studentId}::${student.program.id}`] ?? false;

                return (
                  <div key={`${student.studentId}::${student.program.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                    {/* Summary Row */}
                    <div className="flex flex-wrap items-center gap-3 px-5 py-4">

                      {/* Avatar + info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm flex-shrink-0">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{student.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student.universityNumber} · {student.email}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {student.program.programName}
                            {student.batch && <> · {student.batch.batchNumber}</>}
                          </p>
                        </div>
                      </div>

                      {/* Risk badge */}
                      <div className="text-center px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Risk Score</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${riskBadgeClass(risk.riskLevel)}`}>
                          <RiskIcon level={risk.riskLevel} />
                          {risk.riskLevel}
                        </span>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mt-1">{risk.overallScore}/100</p>
                      </div>

                      {/* Compact 3-factor preview */}
                      <div className="hidden lg:block w-44 space-y-1">
                        {[
                          { label: 'Att.',  score: risk.factors.attendance.score  },
                          { label: 'Quiz',  score: risk.factors.quiz.score        },
                          { label: 'Asgn.', score: risk.factors.assignment.score  },
                        ].map(f => (
                          <div key={f.label} className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 w-8 flex-shrink-0">{f.label}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${riskBarColor(f.score)}`} style={{ width: `${f.score}%` }} />
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500 w-5 text-right">{f.score}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => {
                            setNotifyModal({ student });
                            setNotifyMessage('Your academic performance shows risk factors that need immediate attention. Please speak to your academic advisor.');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-lg transition"
                          title="Send alert to this student">
                          <Send className="w-3.5 h-3.5" /> Alert
                        </button>
                        <button
                          onClick={() => setExpanded(p => ({ ...p, [`${student.studentId}::${student.program.id}`]: !p[`${student.studentId}::${student.program.id}`] }))}
                          className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-medium ${
                            isExpanded
                              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title="Toggle full risk breakdown">
                          <Activity className="w-3.5 h-3.5" />
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Factor Breakdown */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-700/30">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary-500" /> Risk Factor Breakdown
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${riskBadgeClass(risk.riskLevel)}`}>
                            {risk.overallScore}/100 — {risk.riskLevel}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FactorBar label="Attendance"            icon={<CalendarCheck className="w-3.5 h-3.5" />} score={risk.factors.attendance.score}  detail={risk.factors.attendance.detail}  weight="25%" />
                          <FactorBar label="Quiz Performance"      icon={<ClipboardList  className="w-3.5 h-3.5" />} score={risk.factors.quiz.score}         detail={risk.factors.quiz.detail}         weight="20%" />
                          <FactorBar label="Assignment Submission"  icon={<FileText       className="w-3.5 h-3.5" />} score={risk.factors.assignment.score}   detail={risk.factors.assignment.detail}   weight="20%" />
                          <FactorBar label="Exam Violations"       icon={<ShieldAlert    className="w-3.5 h-3.5" />} score={risk.factors.violations.score}   detail={risk.factors.violations.detail}   weight="20%" />
                          <FactorBar label="Material Engagement"   icon={<BookOpen       className="w-3.5 h-3.5" />} score={risk.factors.materials.score}    detail={risk.factors.materials.detail}    weight="10%" />
                          <FactorBar label="Library Use"           icon={<Library        className="w-3.5 h-3.5" />} score={risk.factors.library.score}      detail={risk.factors.library.detail}      weight="5%"  />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty state */}
        {!reportData && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-16 text-center">
            <ShieldAlert className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base font-medium">Select filters and click Load Report</p>
            <p className="text-gray-400 text-sm mt-1">
              Assess students across 6 risk factors: attendance, quizzes, assignments, exam violations, material engagement, and library use.
            </p>
          </div>
        )}
      </div>

      {/* ── Notify Modal ──────────────────────────────────────────────────────── */}
      {notifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" /> Send Risk Alert
              </h2>
              <button onClick={() => setNotifyModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm flex-shrink-0">
                {notifyModal.student.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{notifyModal.student.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{notifyModal.student.email}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${riskBadgeClass(notifyModal.student.risk?.riskLevel ?? 'MEDIUM')}`}>
                <RiskIcon level={notifyModal.student.risk?.riskLevel ?? 'MEDIUM'} />
                {notifyModal.student.risk?.riskLevel ?? 'MEDIUM'} ({notifyModal.student.risk?.overallScore ?? 50})
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea value={notifyMessage} onChange={e => setNotifyMessage(e.target.value)} rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter notification message…" />
              <p className="text-xs text-gray-400 mt-1">Delivered as in-app notification and email.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setNotifyModal(null)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                Cancel
              </button>
              <button onClick={handleSendNotification} disabled={notifyLoading || !notifyMessage.trim()}
                className="px-4 py-2 text-sm text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-lg font-medium flex items-center gap-2">
                {notifyLoading
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending…</>
                  : <><Send className="w-4 h-4" /> Send Notification</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentRiskPage;
