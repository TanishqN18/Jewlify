"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaTrash, FaStar, FaGripVertical, FaLink, FaSpinner, FaClock, FaImage } from "react-icons/fa";

export default function StepMedia({
  formData = {},
  onChange,
  errors = {},
  productSku = null, // Changed from productId to productSku
  onUploadToCloudinary = null,
  uploadMode = "deferred",
}) {
  const images = Array.isArray(formData.image) ? formData.image : [];
  const [dragIndex, setDragIndex] = useState(null);
  const [uploadingIndexes, setUploadingIndexes] = useState(new Set());
  const fileInputRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Store blob URLs to manage their lifecycle properly
  const [blobUrls, setBlobUrls] = useState(new Map());

  // Debug logs
  console.log('🔍 Current formData.image:', formData.image);
  console.log('🔍 Upload mode:', uploadMode);
  console.log('🔍 Product SKU:', productSku);
  console.log('🔍 Processed images array:', images);

  const previews = useMemo(() => {
    const result = images.map((item, index) => {
      console.log(`🖼️ Processing preview ${index}:`, item, typeof item);
      
      if (typeof item === "string") {
        return { url: item, type: 'url', index };
      }
      if (item instanceof File) {
        // Check if we already have a blob URL for this file
        const existingUrl = Array.from(blobUrls.entries()).find(([url, file]) => file === item)?.[0];
        if (existingUrl) {
          return { url: existingUrl, type: 'file', index };
        }
        
        // Create new blob URL and store it
        const newUrl = URL.createObjectURL(item);
        setBlobUrls(prev => new Map(prev).set(newUrl, item));
        return { url: newUrl, type: 'file', index };
      }
      if (item && typeof item === 'object' && item.file instanceof File) {
        // Handle stored file objects
        const existingUrl = Array.from(blobUrls.entries()).find(([url, file]) => file === item.file)?.[0];
        if (existingUrl) {
          return { url: existingUrl, type: 'stored-file', index };
        }
        
        const newUrl = URL.createObjectURL(item.file);
        setBlobUrls(prev => new Map(prev).set(newUrl, item.file));
        return { url: newUrl, type: 'stored-file', index };
      }
      return { url: "", type: 'unknown', index };
    });
    
    console.log('🖼️ Generated previews:', result);
    return result;
  }, [images, blobUrls]);

  // Clean up blob URLs when component unmounts or when files are removed
  useEffect(() => {
    return () => {
      // Only revoke URLs that are no longer needed
      blobUrls.forEach((file, url) => {
        URL.revokeObjectURL(url);
      });
      setBlobUrls(new Map());
    };
  }, []);

  // Clean up unused blob URLs when images change
  useEffect(() => {
    const currentFiles = new Set();
    images.forEach(item => {
      if (item instanceof File) {
        currentFiles.add(item);
      } else if (item && typeof item === 'object' && item.file instanceof File) {
        currentFiles.add(item.file);
      }
    });

    // Remove blob URLs for files that are no longer in the images array
    setBlobUrls(prev => {
      const newMap = new Map();
      prev.forEach((file, url) => {
        if (currentFiles.has(file)) {
          newMap.set(url, file);
        } else {
          URL.revokeObjectURL(url);
        }
      });
      return newMap;
    });
  }, [images]);

  const setImages = (next) => {
    console.log('💾 Setting images to:', next);
    const actualNext = typeof next === 'function' ? next(images) : next;
    console.log('💾 Actual next value:', actualNext);
    
    if (onChange) {
      onChange("image", actualNext);
    }
  };

  // Get signature for signed upload
  const getSignature = async (paramsToSign) => {
    try {
      const response = await fetch('/api/admin/products/cloudinary/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get signature: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Signature error:', error);
      throw error;
    }
  };

  // Upload to Cloudinary with proper folder structure: products/sku-no/images
  const uploadToCloudinary = async (file, sku) => {
    try {
      if (!sku) {
        throw new Error('SKU is required for organized folder structure');
      }

      // Create proper folder structure: products/sku-no/images
      const folder = `products/${sku}/images`;
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      // Create meaningful public_id with file name
      const fileName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
      const publicId = `${folder}/${fileName}_${timestamp}`;
      
      const paramsToSign = {
        folder: folder,
        public_id: publicId,
        tags: 'jewelry,product,ecommerce',
        timestamp: timestamp
      };

      console.log('📁 Uploading to folder structure:', folder);
      console.log('🏷️ Public ID:', publicId);
      console.log('📝 Parameters to sign:', paramsToSign);

      const signatureData = await getSignature(paramsToSign);
      console.log('✍️ Received signature data:', signatureData);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('public_id', publicId);
      formData.append('tags', 'jewelry,product,ecommerce');
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', signatureData.api_key);
      formData.append('signature', signatureData.signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary error response:', errorData);
        throw new Error(errorData.error?.message || `Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Upload successful to:', data.public_id);
      console.log('🔗 URL:', data.secure_url);
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
        folder: folder
      };
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      throw error;
    }
  };

  // Function to upload all stored files to Cloudinary (called from parent)
  const uploadAllToCloudinary = async (sku) => {
    console.log('📤 Starting bulk upload to Cloudinary with SKU:', sku);
    
    if (!sku) {
      throw new Error('SKU is required for organized upload structure');
    }
    
    const filesToUpload = images.filter(item => 
      item instanceof File || (item && typeof item === 'object' && item.file instanceof File)
    );

    if (filesToUpload.length === 0) {
      console.log('No files to upload');
      return images; // Return current images (already URLs)
    }

    setIsUploading(true);
    const uploadedUrls = [];

    try {
      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        
        if (item instanceof File) {
          // Upload File object
          console.log(`⬆️ Uploading file to products/${sku}/images: ${item.name}`);
          const result = await uploadToCloudinary(item, sku);
          uploadedUrls.push(result.url);
        } else if (item && typeof item === 'object' && item.file instanceof File) {
          // Upload stored file object
          console.log(`⬆️ Uploading stored file to products/${sku}/images: ${item.file.name}`);
          const result = await uploadToCloudinary(item.file, sku);
          uploadedUrls.push(result.url);
        } else if (typeof item === 'string') {
          // Keep existing URL
          uploadedUrls.push(item);
        } else {
          console.warn('Unknown item type:', item);
        }
        
        // Small delay between uploads
        if (i < images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      console.log('✅ All files uploaded successfully to organized structure');
      
      // After uploading images to Cloudinary:
      const uploadedImages = uploadedUrls;

      // When submitting the product:
      const submitData = {
        ...formData,
        imageUrls: uploadedImages, // <-- for backend
        coverImage: uploadedImages[0] || "", // <-- for backend
        tags: Array.isArray(formData.tags)
          ? formData.tags
          : String(formData.tags || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
        fixedPrice: formData.priceType === "fixed" ? parseFloat(formData.fixedPrice) : undefined,
        weight: formData.priceType === "weight-based" ? parseFloat(formData.weight) : undefined,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
      };

      return uploadedUrls;
    } catch (error) {
      console.error('❌ Bulk upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Expose upload function to parent component
  useEffect(() => {
    if (onUploadToCloudinary) {
      onUploadToCloudinary.current = uploadAllToCloudinary;
    }
  }, [onUploadToCloudinary, images]);

  const openPicker = () => fileInputRef.current?.click();

  const addFiles = async (filesList) => {
    const validFiles = Array.from(filesList || []).filter(file => {
      const isValidImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidImage) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) {
      return;
    }

    console.log('🚀 Adding files for preview:', validFiles.map(f => f.name));
    
    if (uploadMode === "immediate") {
      // Immediate upload (requires SKU)
      if (!productSku) {
        alert('Product SKU is required for organized image upload');
        return;
      }

      setIsUploading(true);
      const currentImages = [...images];
      const newImages = [...currentImages, ...validFiles];
      setImages(newImages);

      const startIndex = currentImages.length;
      const uploadingSet = new Set();
      validFiles.forEach((_, index) => {
        uploadingSet.add(startIndex + index);
      });
      setUploadingIndexes(uploadingSet);

      try {
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          const fileIndex = startIndex + i;
          
          try {
            console.log(`⬆️ Uploading ${file.name} to products/${productSku}/images`);
            const result = await uploadToCloudinary(file, productSku);
            
            setImages(prevImages => {
              const updated = [...prevImages];
              updated[fileIndex] = result.url;
              return updated;
            });
            
            setUploadingIndexes(prev => {
              const newSet = new Set(prev);
              newSet.delete(fileIndex);
              return newSet;
            });

            console.log(`✅ Uploaded ${file.name} -> ${result.publicId}`);
            
            if (i < validFiles.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          } catch (error) {
            console.error(`❌ Failed to upload ${file.name}:`, error);
            alert(`Failed to upload ${file.name}: ${error.message}`);
          }
        }
      } finally {
        setIsUploading(false);
        setUploadingIndexes(new Set());
      }
    } else {
      // Deferred upload - store files locally for preview
      const currentImages = [...images];
      
      // Store files with metadata for later upload
      const storedFiles = validFiles.map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        isStored: true
      }));
      
      const newImages = [...currentImages, ...storedFiles];
      console.log('📁 Stored files for later upload to SKU folder:', newImages);
      setImages(newImages);
    }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    
    try {
      new URL(url);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      alert('Please enter a valid image URL');
      return;
    }

    setImages([...images, url]);
    setUrlInput("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removeAt = (idx) => {
    const next = images.filter((_, i) => i !== idx);
    setImages(next);
  };

  const setCover = (idx) => {
    if (idx === 0) return;
    const next = [...images];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    setImages(next);
  };

  // Reorder via drag and drop
  const handleDragStart = (idx) => setDragIndex(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDropCard = (idx) => {
    if (dragIndex === null || dragIndex === idx) return;
    const next = [...images];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(idx, 0, moved);
    setImages(next);
    setDragIndex(null);
  };

  // Count stored files vs uploaded URLs
  const storedFilesCount = images.filter(item => 
    item instanceof File || (item && typeof item === 'object' && item.file instanceof File)
  ).length;
  const uploadedUrlsCount = images.filter(item => typeof item === 'string').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-primary">Product Media</h3>
          <p className="text-secondary text-sm">
            {uploadMode === "deferred" 
              ? "Files stored locally • Upload to Cloudinary on final step"
              : "Immediate upload to Cloudinary"
            } • First image is cover
            {productSku && <span className="text-gold"> • SKU: {productSku}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPicker}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-primary hover:bg-white/5 hover:border-white/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <FaSpinner className="text-base animate-spin" />
            ) : uploadMode === "deferred" ? (
              <FaClock className="text-base" />
            ) : (
              <FaCloudUploadAlt className="text-base" />
            )}
            <span className="text-sm font-semibold">
              {isUploading ? 'Uploading...' : uploadMode === "deferred" ? 'Add Files' : 'Upload'}
            </span>
          </button>
          <div className="flex items-stretch">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste image URL"
              className="w-48 bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-l-xl px-3 py-2 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold text-xs"
            />
            <button
              type="button"
              onClick={addUrl}
              className="px-3 rounded-r-xl border border-l-0 border-white/20 text-secondary hover:text-primary hover:border-white/40 hover:bg-white/5 transition-all"
              title="Add URL"
            >
              <FaLink className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {errors?.image && <p className="text-xs text-red-400 mb-3">{errors.image}</p>}

      {/* Enhanced Debug info */}
      <div className="mb-4 p-2 bg-green-50/10 border border-green-200/20 rounded-lg text-xs text-secondary">
        <div>🔒 <strong>Upload Mode:</strong> {uploadMode === "deferred" ? "Deferred (Upload on final step)" : "Immediate"}</div>
        <div>📁 <strong>Folder Structure:</strong> products/{productSku || '[SKU]'}/images/</div>
        <div>☁️ <strong>Cloud:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}</div>
        <div>📷 <strong>Images:</strong> {images.length} total ({storedFilesCount} stored, {uploadedUrlsCount} uploaded)</div>
        <div>🔗 <strong>Blob URLs:</strong> {blobUrls.size} active</div>
        <div>🏷️ <strong>SKU Status:</strong> {productSku ? `Ready (${productSku})` : 'Waiting for SKU'}</div>
      </div>

      {/* SKU Warning */}
      {!productSku && uploadMode === "immediate" && (
        <div className="mb-4 p-3 bg-red-50/10 border border-red-200/20 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-red-400">
            <FaImage />
            <span>SKU is required for organized folder structure (products/[SKU]/images)</span>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploadMode === "deferred" && storedFilesCount > 0 && (
        <div className="mb-4 p-3 bg-amber-50/10 border border-amber-200/20 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <FaClock />
            <span>{storedFilesCount} file(s) ready for upload to products/{productSku || '[SKU]'}/images/ folder</span>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-4 p-3 bg-blue-50/10 border border-blue-200/20 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-primary">
            <FaSpinner className="animate-spin" />
            <span>Uploading to products/{productSku}/images/ folder... ({uploadingIndexes.size} pending)</span>
          </div>
        </div>
      )}

      {/* Dropzone */}
      <div
        className={`mb-5 rounded-2xl border border-dashed transition-all cursor-pointer ${
          isUploading 
            ? 'border-blue-400/40 bg-blue-50/10' 
            : !productSku && uploadMode === "immediate"
              ? 'border-red-400/40 bg-red-50/10'
              : 'border-white/20 bg-primary/5 hover:border-white/40'
        } p-6 text-center text-secondary`}
        onClick={!isUploading && (productSku || uploadMode === "deferred") ? openPicker : undefined}
      >
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <FaSpinner className="text-2xl opacity-80 animate-spin text-blue-400" />
          ) : !productSku && uploadMode === "immediate" ? (
            <FaImage className="text-2xl opacity-80 text-red-400" />
          ) : uploadMode === "deferred" ? (
            <FaClock className="text-2xl opacity-80 text-amber-400" />
          ) : (
            <FaCloudUploadAlt className="text-2xl opacity-80" />
          )}
          <div className="text-sm">
            {isUploading 
              ? `Uploading to products/${productSku}/images/...`
              : !productSku && uploadMode === "immediate"
                ? 'SKU required for organized upload structure'
                : uploadMode === "deferred"
                  ? `Add images for preview • Upload to products/${productSku || '[SKU]'}/images/ on final step`
                  : 'Drag & drop images here, click to browse, or paste a URL'
            }
          </div>
          <div className="text-xs opacity-70">
            JPG, PNG, WEBP up to 10MB • Organized folder structure: products/[SKU]/images/
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
          disabled={isUploading || (!productSku && uploadMode === "immediate")}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {previews.map((preview, idx) => {
          const isUploadingFile = uploadingIndexes.has(idx);
          const currentItem = images[idx];
          const isFileObject = currentItem instanceof File;
          const isStoredFile = currentItem && typeof currentItem === 'object' && currentItem.file instanceof File;
          const isDeferred = uploadMode === "deferred" && (isFileObject || isStoredFile);
          
          return (
            <motion.div
              key={`image-${idx}-${preview.url || 'loading'}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="group relative rounded-xl overflow-hidden bg-primary/10 border border-white/10"
              draggable={!isUploadingFile && !isFileObject}
              onDragStart={() => handleDragStart(idx)}
              onDrop={() => handleDropCard(idx)}
            >
              {/* Upload status overlay */}
              {isUploadingFile && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                  <div className="text-center text-white">
                    <FaSpinner className="animate-spin text-xl mx-auto mb-2" />
                    <div className="text-xs">Uploading to SKU folder...</div>
                  </div>
                </div>
              )}

              {/* Deferred upload indicator */}
              {isDeferred && !isUploadingFile && (
                <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-amber-400/40 text-amber-300 bg-amber-400/10">
                  <FaClock className="text-[10px]" /> Pending
                </div>
              )}

              {/* Cover badge */}
              {idx === 0 && !isFileObject && !isUploadingFile && preview.url && (
                <div className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-emerald-400/40 text-emerald-300 bg-emerald-400/10">
                  <FaStar className="text-[10px]" /> Cover
                </div>
              )}

              {/* Image display */}
              {preview.url ? (
                <>
                  <img 
                    src={preview.url} 
                    alt={`Image ${idx + 1}`} 
                    className="w-full h-40 object-cover" 
                    onError={(e) => {
                      console.error('❌ Image failed to load:', preview.url);
                      console.error('❌ Image type:', preview.type);
                      console.error('❌ Current item:', currentItem);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={() => console.log('✅ Image loaded successfully:', preview.url)}
                  />

                  {/* Error fallback */}
                  <div className="w-full h-40 bg-red-50/10 border border-red-200/20 rounded text-red-400 text-xs hidden items-center justify-center">
                    <div className="text-center">
                      <FaImage className="text-2xl mx-auto mb-2 opacity-50" />
                      <div>Failed to load image</div>
                      <div className="text-[10px] mt-1 opacity-70">Type: {preview.type}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-40 bg-gray-200/20 border border-gray-300/20 rounded flex items-center justify-center">
                  <div className="text-center text-secondary">
                    <FaCloudUploadAlt className="text-2xl mx-auto mb-2 opacity-50" />
                    <div className="text-xs">Loading...</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!isUploadingFile && preview.url && (
                <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent">
                  <button
                    type="button"
                    onClick={() => setCover(idx)}
                    className="text-[11px] px-2 py-1 rounded-md border border-white/20 text-white/90 hover:bg-white/10 transition-all"
                  >
                    Set cover
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="text-[11px] px-2 py-1 rounded-md border border-red-400/40 text-red-200 hover:bg-red-500/10 transition-all inline-flex items-center gap-1"
                  >
                    <FaTrash className="text-[10px]" /> Remove
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!images?.length && !isUploading && (
        <div className="text-xs text-secondary mt-3">No images yet. Add files or URLs.</div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-gold/10 border border-gold/20 rounded-xl">
        <div className="text-xs text-secondary space-y-1">
          <div>📁 <strong>Organization:</strong> Files will be stored in products/{productSku || '[SKU]'}/images/ folder</div>
          <div>⏱️ <strong>Upload Timing:</strong> {uploadMode === "deferred" ? "Deferred until final step" : "Immediate on file selection"}</div>
          <div>🏷️ <strong>Tags:</strong> jewelry, product, ecommerce</div>
          <div>📏 <strong>Limit:</strong> 10MB per image • JPG, PNG, WebP, GIF supported</div>
          {productSku && <div>✅ <strong>Ready:</strong> SKU available for organized upload</div>}
        </div>
      </div>
    </motion.div>
  );
}

// In your StepMedia or image upload component
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'YOUR_UPLOAD_PRESET');

  const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.secure_url; // This is the URL you want to save in MongoDB
};