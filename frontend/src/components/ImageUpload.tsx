import React, { useCallback, useState, useRef } from 'react';
import { uploadImage, replaceImage } from '@/lib/api/upload.api';
import { useI18n } from '@/hooks/useI18n';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  className = '',
}) => {
  const { t } = useI18n();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        setUploadError(t('upload.invalidType'));

        return;
      }

      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        setUploadError(t('upload.fileTooLarge'));

        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        let response;

        if (currentImage) {
          response = await replaceImage(file, currentImage);
        } else {
          response = await uploadImage(file);
        }

        onImageSelect(response.url);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : t('upload.uploadError'));
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onImageSelect, currentImage, t]
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-4">
        {currentImage && (
          <div className="w-20 h-20 rounded-lg overflow-hidden border">
            <img src={currentImage} alt={t('upload.preview')} className="w-full h-full object-cover" />
          </div>
        )}

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? t('upload.uploading') : currentImage ? t('upload.changeImage') : t('upload.selectImage')}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <p className="text-xs text-gray-500">
        {t('upload.supportedFormats')}
      </p>
    </div>
  );
};
