import React, { useState, useRef } from 'react';
import { X, Send, FileText, Image, Link as LinkIcon, File, Upload } from 'lucide-react';
import axiosInstance from '../../../services/api/axios.config';
import toast from 'react-hot-toast';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  onSuccess: () => void;
}

const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  moduleId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'FILE',
    content: '',
    fileUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return toast.error('Title is required');

    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('moduleId', moduleId);
      
      if (formData.type === 'TEXT' || formData.type === 'LINK') {
        data.append('content', formData.content);
      } else {
        if (selectedFile) {
          data.append('file', selectedFile);
        } else if (formData.fileUrl) {
          data.append('fileUrl', formData.fileUrl);
        } else {
          setLoading(false);
          return toast.error('Please select a file or provide a URL');
        }
      }

      await axiosInstance.post('/lecture-notes', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Material shared successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to share material');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-primary-600">
          <h2 className="text-xl font-bold text-white">Share Lecture Material</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter material title..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'TEXT', icon: FileText, label: 'Text' },
                { id: 'IMAGE', icon: Image, label: 'Image' },
                { id: 'LINK', icon: LinkIcon, label: 'Link' },
                { id: 'FILE', icon: File, label: 'File' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: type.id as any });
                    setSelectedFile(null);
                  }}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    formData.type === type.id
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <type.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {formData.type === 'TEXT' || formData.type === 'LINK' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'TEXT' ? 'Content' : 'Link URL'}
              </label>
              <textarea
                required
                rows={formData.type === 'TEXT' ? 4 : 2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder={
                  formData.type === 'TEXT'
                    ? 'Enter text content...'
                    : 'https://example.com/resource'
                }
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
          ) : null}

          {formData.type !== 'TEXT' && formData.type !== 'LINK' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload {formData.type === 'IMAGE' ? 'Image' : 'File'}
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-all"
                >
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <span className="relative rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                        {selectedFile ? selectedFile.name : `Upload a ${formData.type.toLowerCase()}`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF, DOC up to 5MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept={formData.type === 'IMAGE' ? "image/*" : ".pdf,.doc,.docx"}
                  onChange={handleFileChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'IMAGE' ? 'Image URL' : 'File URL'}
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com/file.pdf"
                  value={formData.fileUrl}
                  disabled={!!selectedFile}
                  onChange={(e) =>
                    setFormData({ ...formData, fileUrl: e.target.value })
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  Provide a public URL if you don't want to upload a file.
                </p>
              </div>
            </div>
          ) : null}

          {formData.type === 'IMAGE' && (selectedFile || formData.fileUrl) && (
            <div className="mt-2 border rounded-lg overflow-hidden bg-gray-50">
               <img 
                src={selectedFile ? URL.createObjectURL(selectedFile) : formData.fileUrl} 
                alt="Preview" 
                className="max-h-32 mx-auto object-contain"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+Image+URL')}
               />
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Share
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;
