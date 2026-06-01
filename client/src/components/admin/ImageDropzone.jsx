import { useState, useRef, useCallback } from 'react';
import { useUploadImageMutation } from '../../features/api/productApi.js';
import compressImage from '../../utils/compressImage.js';
import toast from 'react-hot-toast';

const ImageDropzone = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = useCallback(async (file) => {
    if (!file) return;
    const compressed = await compressImage(file);
    const formData = new FormData();
    formData.append('image', compressed);
    try {
      const result = await uploadImage(formData).unwrap();
      onImagesChange([...images, result.url]);
      toast.success('Imagen subida correctamente');
    } catch {
      toast.error('Error al subir la imagen');
    }
  }, [uploadImage, images, onImagesChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
    e.target.value = '';
  }, [handleUpload]);

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const atLimit = images.length >= maxImages;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Imágenes del producto</label>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {!atLimit && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-sadness bg-sadness/5'
              : 'border-gray-200 hover:border-sadness/50 bg-gray-50/50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-sadness animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-gray-500">Subiendo imagen...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-gray-500">
                Arrastra una imagen aquí o <span className="text-sadness font-medium">selecciona un archivo</span>
              </span>
              <span className="text-xs text-gray-400">PNG, JPG o WebP — Máx. 5 MB</span>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleInput}
          />
        </div>
      )}

      {atLimit && (
        <p className="text-xs text-gray-400">Máximo {maxImages} imágenes permitidas</p>
      )}
    </div>
  );
};

export default ImageDropzone;
