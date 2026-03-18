'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/action/uploadFile';
import styles from './menu.module.scss';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only images (PNG, JPG, WebP, HEIC) and PDF files are allowed.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large. Maximum size is 10MB.';
  }
  return null;
}

export default function AddSourceMenu({ onClose, onUploadComplete, onManualAdd, onGmailConnect }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const lastFileRef = useRef(null);

  const handleUpload = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const doUpload = async (file) => {
    setUploading(true);
    setUploadError(null);
    setProgress(10);

    try {
      setProgress(20);
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setProgress(50);

      const result = await uploadFile(bytes, file.name, file.type);
      setProgress(90);

      if (result?.error) {
        setUploadError(result.message || 'Upload failed');
        if (result.error === 'auth') {
          window.location.href = '/';
        }
        return;
      }
      if (result) {
        setProgress(100);
        onUploadComplete?.(result);
        onClose();
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    lastFileRef.current = file;
    await doUpload(file);
  };

  const handleRetry = async () => {
    if (lastFileRef.current) {
      await doUpload(lastFileRef.current);
    } else {
      handleUpload();
    }
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.menu}>
        <button
          className={styles.option}
          onClick={() => {
            onClose();
            onGmailConnect?.();
          }}
        >
          <div className={styles.icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M22 8.608V16.75C22 18.483 20.613 19.9 18.89 19.95H18.85H5.15C3.41 19.95 2 18.535 2 16.79V16.79V8.618C2.32 8.988 2.69 9.308 3.1 9.568L9.56 13.818C10.28 14.308 11.14 14.568 12.01 14.568C12.88 14.568 13.74 14.308 14.45 13.828L20.9 9.568C21.31 9.298 21.68 8.978 22 8.608Z"
                fill="#6361F3"
              />
              <path
                d="M21.17 5.84959C20.34 4.46959 18.79 3.56959 17.04 3.56959H6.96C5.21 3.56959 3.66 4.46959 2.83 5.84959C3 5.74959 3.18 5.66959 3.37 5.60959L9.83 1.35959C10.55 0.869594 11.41 0.609594 12.28 0.609594C13.15 0.609594 14.01 0.869594 14.72 1.34959L21.17 5.59959L21.28 5.67959C21.25 5.66959 21.21 5.64959 21.17 5.84959Z"
                fill="#6361F3"
              />
            </svg>
          </div>
          <div className={styles.label}>
            <span className={styles.title}>Connect Gmail</span>
            <span className={styles.subtitle}>Scan for subscriptions</span>
          </div>
        </button>
        <button
          className={styles.option}
          onClick={() => {
            onClose();
            onManualAdd?.();
          }}
        >
          <div className={styles.icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M16 3.46V2C16 1.45 15.55 1 15 1C14.45 1 14 1.45 14 2V3H10V2C10 1.45 9.55 1 9 1C8.45 1 8 1.45 8 2V3.46C5.09 3.73 3.74 5.36 3.52 7.91C3.5 8.19 3.73 8.42 4 8.42H20C20.28 8.42 20.51 8.18 20.48 7.91C20.26 5.36 18.91 3.73 16 3.46Z"
                fill="#6361F3"
              />
              <path
                d="M20 10H4C3.45 10 3 10.45 3 11V17C3 20 4.5 22 8 22H16C19.5 22 21 20 21 17V11C21 10.45 20.55 10 20 10ZM12 17.25C11.59 17.25 11.25 16.91 11.25 16.5V13.75H8.5C8.09 13.75 7.75 13.41 7.75 13C7.75 12.59 8.09 12.25 8.5 12.25H11.25V9.5C11.25 9.09 11.59 8.75 12 8.75C12.41 8.75 12.75 9.09 12.75 9.5V12.25H15.5C15.91 12.25 16.25 12.59 16.25 13C16.25 13.41 15.91 13.75 15.5 13.75H12.75V16.5C12.75 16.91 12.41 17.25 12 17.25Z"
                fill="#6361F3"
              />
            </svg>
          </div>
          <div className={styles.label}>
            <span className={styles.title}>Add manually</span>
            <span className={styles.subtitle}>Enter subscription details</span>
          </div>
        </button>
        <button
          className={styles.option}
          onClick={handleUpload}
          disabled={uploading}
        >
          <div className={styles.icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 17V11L7 13"
                stroke="#6361F3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11L11 13"
                stroke="#6361F3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14"
                stroke="#6361F3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 10H18C15 10 14 9 14 6V2L22 10Z"
                stroke="#6361F3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.label}>
            <span className={styles.title}>{uploading ? 'Uploading...' : 'Upload a file'}</span>
            <span className={styles.subtitle}>PNG, JPG, WebP, HEIC, PDF (max 10MB)</span>
          </div>
        </button>
        {uploading && (
          <div className={styles.progressWrap}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        )}
        {uploadError && (
          <div className={styles.errorBlock}>
            <span className={styles.errorText}>{uploadError}</span>
            <button className={styles.retryBtn} onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/heic,application/pdf"
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
      </div>
    </>
  );
}
