"use client";

import React, { useState, useRef, useCallback } from 'react';
import { 
  PhotoIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useLanguage';

const ImageUploader = ({
  value = [],
  onChange,
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
  disabled = false,
  error = null,
  label = '',
  required = false,
  showPreview = true,
  uploadMode = 'local' // 'local' | 's3'
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  // 파일 유효성 검사
  const validateFile = (file) => {
    const errors = [];

    // 파일 형식 검사
    if (!acceptedFormats.includes(file.type)) {
      errors.push(`지원되지 않는 파일 형식입니다. (${acceptedFormats.join(', ')})`);
    }

    // 파일 크기 검사
    if (file.size > maxFileSize) {
      const sizeMB = (maxFileSize / (1024 * 1024)).toFixed(1);
      errors.push(`파일 크기가 너무 큽니다. 최대 ${sizeMB}MB까지 업로드 가능합니다.`);
    }

    return errors;
  };

  // 로컬 파일 처리 (임시 URL 생성)
  const processLocalFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          file: file // 실제 파일 객체 보관
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // S3 업로드 처리 (향후 구현)
  const uploadToS3 = async (file) => {
    try {
      // 1. presigned URL 요청
      // const presignedResponse = await fetch('/api/upload/presigned', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ filename: file.name, contentType: file.type })
      // });
      // const { url, key } = await presignedResponse.json();

      // 2. S3에 파일 업로드
      // await fetch(url, {
      //   method: 'PUT',
      //   body: file,
      //   headers: { 'Content-Type': file.type }
      // });

      // 임시로 로컬 처리
      return await processLocalFile(file);
    } catch (error) {
      console.error('S3 upload failed:', error);
      throw error;
    }
  };

  // 파일 처리
  const processFiles = async (files) => {
    if (disabled) return;

    const fileList = Array.from(files);
    
    // 최대 파일 수 검사
    if (value.length + fileList.length > maxFiles) {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
      return;
    }

    setUploading(true);

    try {
      const processedFiles = [];

      for (const file of fileList) {
        // 파일 유효성 검사
        const errors = validateFile(file);
        if (errors.length > 0) {
          alert(errors.join('\n'));
          continue;
        }

        // 파일 처리
        let processedFile;
        if (uploadMode === 's3') {
          processedFile = await uploadToS3(file);
        } else {
          processedFile = await processLocalFile(file);
        }

        processedFiles.push(processedFile);
      }

      // 상위 컴포넌트에 전달
      onChange([...value, ...processedFiles]);

    } catch (error) {
      console.error('File processing failed:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // input 값 초기화
    e.target.value = '';
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [disabled, value, maxFiles, onChange]);

  // 파일 삭제
  const handleRemoveFile = (index) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  // 파일 클릭으로 업로드
  const handleUploadClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 미리보기
  const handlePreview = (image) => {
    setPreviewImage(image);
  };

  return (
    <div className={`${className}`}>
      {/* 라벨 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 업로드 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploading ? 'pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-600">업로드 중...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">클릭하여 업로드</span> 하거나 
                파일을 여기로 드래그하세요
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {acceptedFormats.map(format => format.split('/')[1]).join(', ')} 파일, 
                최대 {(maxFileSize / (1024 * 1024)).toFixed(1)}MB
              </p>
              <p className="text-xs text-gray-500">
                최대 {maxFiles}개 파일
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* 업로드된 파일 목록 */}
      {value.length > 0 && showPreview && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            업로드된 이미지 ({value.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {value.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.name || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(image);
                      }}
                      className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                      title="미리보기"
                    >
                      <EyeIcon className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                      title="삭제"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* 파일 이름 */}
                <p className="mt-1 text-xs text-gray-500 truncate" title={image.name}>
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 이미지 미리보기 모달 */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 