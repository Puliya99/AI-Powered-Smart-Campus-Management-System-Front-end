import React, { useState, useRef } from 'react';
import * as xlsx from 'xlsx';
import {
  X, Upload, Download, FileSpreadsheet,
  CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp,
} from 'lucide-react';
import axiosInstance from '../../../services/api/axios.config';
import toast from 'react-hot-toast';

interface ImportError {
  row:    number;
  name:   string;
  reason: string;
}

interface ImportSummary {
  total:    number;
  imported: number;
  skipped:  number;
  errors:   ImportError[];
}

interface Props {
  isOpen:   boolean;
  onClose:  () => void;
  onImported: () => void;
}

// ── Template columns ────────────────────────────────────────────────────────
const TEMPLATE_HEADERS = [
  'First Name', 'Last Name', 'Title', 'Gender', 'Date of Birth',
  'NIC', 'Email', 'Username', 'Mobile Number', 'Home Number',
  'Address', 'Payment Type', 'Center', 'Program', 'Batch',
];

const SAMPLE_ROW = [
  'John', 'Smith', 'Mr', 'MALE', '2000-06-15',
  '200015601234', 'john.smith@email.com', 'john.smith', '0771234567', '0112345678',
  '123 Main St, Colombo', 'FULL', 'Main Center', 'BSc Computer Science', 'BATCH2024A',
];

const FIELD_HINTS: Record<string, string> = {
  'First Name':    'Required',
  'Last Name':     'Required',
  'Title':         'Mr / Ms / Dr / Prof',
  'Gender':        'MALE / FEMALE / OTHER',
  'Date of Birth': 'Required • YYYY-MM-DD',
  'NIC':           'Required • National ID',
  'Email':         'Required • must be unique',
  'Username':      'Required • must be unique',
  'Mobile Number': 'Required • must be unique',
  'Home Number':   'Optional',
  'Address':       'Optional',
  'Payment Type':  'FULL / INSTALLMENT',
  'Center':        'Optional • exact center name',
  'Program':       'Optional • exact program name',
  'Batch':         'Optional • exact batch number',
};

const ImportStudentsModal: React.FC<Props> = ({ isOpen, onClose, onImported }) => {
  const [file,       setFile]       = useState<File | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [summary,    setSummary]    = useState<ImportSummary | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // ── Download blank template ────────────────────────────────────────────────
  const downloadTemplate = () => {
    const wb = xlsx.utils.book_new();

    // Header + sample row
    const ws = xlsx.utils.aoa_to_sheet([TEMPLATE_HEADERS, SAMPLE_ROW]);

    // Column widths
    ws['!cols'] = TEMPLATE_HEADERS.map(() => ({ wch: 22 }));

    // Style header row cells with a hint comment (xlsx doesn't support colors without
    // a paid plugin, but we add a Notes row to guide users)
    xlsx.utils.book_append_sheet(wb, ws, 'Students');

    // Field hints sheet
    const hintsData = TEMPLATE_HEADERS.map(h => [h, FIELD_HINTS[h] || '']);
    const wsHints   = xlsx.utils.aoa_to_sheet([['Column', 'Notes'], ...hintsData]);
    wsHints['!cols'] = [{ wch: 22 }, { wch: 35 }];
    xlsx.utils.book_append_sheet(wb, wsHints, 'Field Notes');

    xlsx.writeFile(wb, 'student_import_template.xlsx');
    toast.success('Template downloaded');
  };

  // ── File selection ─────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSummary(null);
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (!/\.(xlsx|xls)$/i.test(f.name)) {
      toast.error('Only .xlsx or .xls files are supported');
      return;
    }
    setSummary(null);
    setFile(f);
  };

  // ── Upload & import ────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await axiosInstance.post('/students/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data: ImportSummary = res.data.data;
      setSummary(data);

      if (data.imported > 0) {
        toast.success(`${data.imported} student${data.imported !== 1 ? 's' : ''} imported successfully`);
        onImported();
      }
      if (data.skipped > 0) {
        toast.error(`${data.skipped} row${data.skipped !== 1 ? 's' : ''} skipped — see error details`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Import failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setSummary(null);
    setShowErrors(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            Import Students from Excel
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">

          {/* Step 1: Download template */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Step 1 — Download the template</p>
            <p className="text-xs text-blue-700 mb-3">
              Fill in the template with student data. Required fields are marked in the Field Notes sheet.
              The default password for all imported students is <code className="bg-blue-100 px-1 rounded font-mono">Student123</code>.
            </p>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition"
            >
              <Download className="w-4 h-4" />
              Download Template (.xlsx)
            </button>
          </div>

          {/* Step 2: Upload file */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Step 2 — Upload filled template</p>

            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="w-10 h-10 text-green-500" />
                  <p className="text-sm font-semibold text-green-800">{file.name}</p>
                  <p className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB</p>
                  <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">Drag & drop your Excel file here</p>
                  <p className="text-xs text-gray-400">or click to browse • .xlsx / .xls • max 10 MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Import result summary */}
          {summary && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-3 divide-x divide-gray-200 bg-gray-50 text-center">
                <div className="p-4">
                  <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Total rows</p>
                </div>
                <div className="p-4">
                  <p className="text-2xl font-bold text-green-600">{summary.imported}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Imported</p>
                </div>
                <div className="p-4">
                  <p className="text-2xl font-bold text-red-500">{summary.skipped}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Skipped</p>
                </div>
              </div>

              {summary.errors.length > 0 && (
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => setShowErrors(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-red-700 font-medium hover:bg-red-50 transition"
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {summary.errors.length} error{summary.errors.length !== 1 ? 's' : ''} — click to {showErrors ? 'hide' : 'view'}
                    </span>
                    {showErrors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showErrors && (
                    <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                      {summary.errors.map((err, idx) => (
                        <div key={idx} className="px-4 py-2.5 bg-red-50 flex items-start gap-3">
                          <span className="text-xs font-mono bg-red-100 text-red-700 px-1.5 py-0.5 rounded flex-shrink-0">
                            Row {err.row}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-red-800">{err.name}</p>
                            <p className="text-xs text-red-600 mt-0.5">{err.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {summary.imported > 0 && summary.errors.length === 0 && (
                <div className="border-t border-gray-200 px-4 py-3 bg-green-50 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">All students imported successfully!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            {summary ? 'Close' : 'Cancel'}
          </button>
          {!summary && (
            <button
              onClick={handleImport}
              disabled={!file || uploading}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Importing…</>
              ) : (
                <><Upload className="w-4 h-4" />Import Students</>
              )}
            </button>
          )}
          {summary && summary.errors.length > 0 && (
            <button
              onClick={() => { setSummary(null); setFile(null); }}
              className="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition"
            >
              Import another file
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportStudentsModal;
