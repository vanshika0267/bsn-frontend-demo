import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import InputField from '../../../components/common/InputField';
import Select from '../../../components/common/Select';
import {
  FiArrowLeft,
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiFile,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { uploadResource } from '../../../services/api';

const UploadResource = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('notes');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Drag & drop
  const [dragActive, setDragActive] = useState(false);

  // Request lifecycle
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const types = [
    { value: 'notes', label: 'Notes' },
    { value: 'paper', label: 'Past Paper / Question Bank' },
    { value: 'book', label: 'Book / Reference' },
    { value: 'slides', label: 'Slides / Presentation' },
    { value: 'video', label: 'Video Lecture' },
    { value: 'repository', label: 'Code Repository / Boilerplate' },
    { value: 'other', label: 'Other' },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setType('notes');
    setDescription('');
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !subject.trim()) {
      setError('Title and subject are required.');
      return;
    }
    if (!selectedFile) {
      setError('Please attach a file to upload.');
      return;
    }
    setSubmitting(true);
    try {
      await uploadResource({
        title: title.trim(),
        subject: subject.trim(),
        type,
        description: description.trim(),
        file: selectedFile,
      });
      setSuccess(true);
      resetForm();
      setTimeout(() => {
        setSuccess(false);
        navigate('/dashboard?tab=resources');
      }, 1800);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back navigation header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard?tab=resources')}
          className="p-2 rounded-lg bg-white border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary transition-all shadow-sm"
        >
          <FiArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold font-poppins text-on-surface">Share Learning Resource</h1>
          <p className="text-xs text-on-surface-variant">Publish documents, papers, and boilerplates to the network catalog.</p>
        </div>
      </div>

      {success ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 border border-green-200 flex items-center justify-center animate-bounce">
            <FiCheckCircle size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">Resource Shared Successfully!</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Thank you for contributing to the network catalog.
            </p>
          </div>
          <div className="p-3 bg-[#eff6ff] border border-primary/20 rounded-lg text-[11px] text-[#1e40af] font-bold">
            Redirecting you back to the Resource Repository...
          </div>
        </Card>
      ) : (
        <Card className="bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <InputField
              label="Resource Title"
              placeholder="e.g., Advanced Algorithm Practice Notebook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              id="upload-title"
            />

            {/* Subject + Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Subject"
                placeholder="e.g., Software Engineering"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                id="upload-subject"
              />

              <Select
                label="Resource Type"
                options={types}
                value={type}
                onChange={(e) => setType(e.target.value)}
                id="upload-type"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="upload-desc" className="text-xs font-bold text-on-surface">Description</label>
              <textarea
                id="upload-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give a brief summary detailing what curriculum content or practical framework this resource covers..."
                className="w-full h-24 p-3 border border-outline-variant rounded-lg text-sm bg-white focus:outline-none focus:border-primary font-sans"
              />
            </div>

            {/* File input (drag & drop) */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface">Attach File <span className="text-error">*</span></label>
              <div
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer ${
                  dragActive ? 'border-primary bg-primary-container/5' : 'border-outline-variant hover:border-primary'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <FiFile size={26} className="mx-auto text-primary mb-2" />
                    <span className="text-xs font-bold text-on-surface block">{selectedFile.name}</span>
                    <span className="text-[10px] text-on-surface-variant block mt-1">
                      {(selectedFile.size / 1024).toFixed(0)} KB • click to replace
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FiUploadCloud size={28} className="mx-auto text-on-surface-variant/60 mb-2" />
                    <span className="text-xs font-bold text-on-surface block">Drag &amp; drop file here or click to browse</span>
                    <span className="text-[10px] text-on-surface-variant block mt-1">PDF, DOCX, ZIP and more.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b] text-xs font-medium">
                <FiAlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 justify-end pt-3 border-t border-outline-variant">
              <Button
                type="button"
                onClick={() => navigate('/dashboard?tab=resources')}
                variant="outline"
                size="sm"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={submitting} className="gap-2">
                {submitting && <FiLoader size={14} className="animate-spin" />}
                {submitting ? 'Uploading...' : 'Publish Study Resource'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default UploadResource;
