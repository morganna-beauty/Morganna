import React, { useCallback, useState, useRef } from 'react';
import { uploadImage, replaceImage } from '@/lib/api/upload.api';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        setUploadError('Tipo de archivo no válido. Solo se permiten JPEG, PNG y WebP.');

        return;
      }

      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        setUploadError('El archivo es demasiado grande. Máximo 5MB.');

        return;
      }

      setIsUploading(true);
      setUploadError(null);

      console.log('Iniciando carga de imagen:', file.name, file.type, file.size);
      console.log('Imagen actual:', currentImage);

      try {
        let response;

        // Si hay una imagen actual, usar replaceImage para eliminar la anterior
        if (currentImage) {
          console.log('Reemplazando imagen existente');
          response = await replaceImage(file, currentImage);
        } else {
          console.log('Subiendo nueva imagen');
          response = await uploadImage(file);
        }

        console.log('Respuesta de carga exitosa:', response);
        onImageSelect(response.url);
      } catch (error) {
        console.error('Error en carga de imagen:', error);
        setUploadError(error instanceof Error ? error.message : 'Error al subir imagen');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onImageSelect, currentImage]
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-4">
        {currentImage && (
          <div className="w-20 h-20 rounded-lg overflow-hidden border">
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Subiendo...' : currentImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
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
        Formatos soportados: JPEG, PNG, WebP. Tamaño máximo: 5MB.
      </p>
    </div>
  );
};
