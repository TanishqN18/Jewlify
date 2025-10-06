"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaBoxOpen,
  FaRupeeSign,
  FaCheckCircle,
  FaTag,
  FaImage,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";

export default function StepPreview({
  formData = {},
  onPrevious,
}) {
  const {
    name = "Untitled Product",
    description = "No description provided",
    category,
    material,
    mixedMetals = [],
    gemstones = [],
    priceType = "fixed",
    fixedPrice,
    weight,
    tags = [],
    image = [],
    imageUrls = [],
    coverImage,
    sku,
    stock,
    minStock,
    status = "Available",
    customizationOptions = {
      allowEngraving: false,
      maxEngravingLength: 20,
      allowSpecialInstructions: false,
      sizeOptions: [],
    },
    seoTitle,
    seoDescription,
    seoKeywords,
    slug,
    variants = [],
    isPublished,
    dimensions = {},
  } = formData;

  // --- Handle all image types for preview ---
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isBlob, setIsBlob] = useState(false);

  useEffect(() => {
    // Prefer coverImage, then imageUrls, then image
    let first = coverImage || (Array.isArray(imageUrls) && imageUrls[0]) || (Array.isArray(image) && image[0]);
    let revokeUrl = null;

    if (!first) {
      setPreviewUrl(null);
      setIsBlob(false);
      return;
    }

    if (typeof first === "string") {
      setPreviewUrl(first);
      setIsBlob(first.startsWith("blob:"));
      return;
    }

    if (first && typeof first === "object") {
      if (first.url) {
        setPreviewUrl(first.url);
        setIsBlob(first.url.startsWith("blob:"));
        return;
      }
      if (first.preview) {
        setPreviewUrl(first.preview);
        setIsBlob(first.preview.startsWith("blob:"));
        return;
      }
      if (first.file instanceof File) {
        const url = URL.createObjectURL(first.file);
        setPreviewUrl(url);
        setIsBlob(true);
        revokeUrl = url;
      }
    }

    // Only return a cleanup function if we created a blob URL
    return () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
    // eslint-disable-next-line
  }, [coverImage, JSON.stringify(imageUrls), JSON.stringify(image)]);

  const hasImage = !!previewUrl;

  // Price formatting
  const getPrettyPrice = () => {
    if (priceType === "fixed" && fixedPrice) {
      const price = Number(fixedPrice);
      return price > 0 ? `₹${price.toLocaleString("en-IN")}` : "Price not set";
    }
    return "Weight-based pricing";
  };
  const prettyPrice = getPrettyPrice();

  // Material or Gemstone display
  let materialOrGemstoneDisplay = "-";
  if (category === "Gemstone") {
    materialOrGemstoneDisplay = Array.isArray(gemstones) && gemstones.length > 0 ? gemstones.join(", ") : "-";
  } else if (material === "Mixed" && mixedMetals.length > 0) {
    materialOrGemstoneDisplay = `Mixed (${mixedMetals.join(", ")})`;
  } else if (material) {
    materialOrGemstoneDisplay = material;
  }

  // Status and publish
  const statusDisplay = status || "Available";
  const publishedDisplay = isPublished ? "Published" : "Draft";

  // Dimensions
  const dims = dimensions || {};
  const dimsDisplay =
    dims.length || dims.width || dims.height
      ? `${dims.length || "-"} × ${dims.width || "-"} × ${dims.height || "-"} mm`
      : "-";

  // Count stored files vs uploaded URLs for upload status
  const storedFilesCount = image.filter((item) =>
    item instanceof File || (item && typeof item === "object" && item.file instanceof File)
  ).length;
  const uploadedUrlsCount = (Array.isArray(imageUrls) ? imageUrls.length : 0) || image.filter((item) => typeof item === "string").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
            <FaBoxOpen className="text-white text-sm" />
          </div>
          <h3 className="text-lg font-bold text-primary">Product Preview</h3>
        </div>
        <div className="flex gap-2">
          <span
            className={`text-xs px-3 py-1 rounded-full border ${
              statusDisplay.toLowerCase() === "available"
                ? "border-emerald-400 text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-400/10"
                : "border-yellow-400 text-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-400/10"
            }`}
          >
            {statusDisplay}
          </span>
          <span
            className={`text-xs px-3 py-1 rounded-full border ${
              isPublished
                ? "border-blue-400 text-blue-700 dark:text-primary bg-blue-50 dark:bg-gold/10"
                : "border-yellow-400 text-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-400/10"
            }`}
          >
            {publishedDisplay}
          </span>
        </div>
      </div>

      {/* Upload Status Alert */}
      {storedFilesCount > 0 && (
        <div className="p-4 mx-5 mt-4 bg-amber-50/10 border border-amber-200/20 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <FaCloudUploadAlt />
            <span>
              {storedFilesCount} file(s) will be uploaded to products/{sku || "[SKU]"}/images/ folder when you save
            </span>
          </div>
        </div>
      )}

      {/* Ready to Save Notice */}
      <div className="p-4 mx-5 mt-2 bg-emerald-50/10 border border-emerald-200/20 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <FaCheckCircle />
          <span>
            Product is ready to save! Use the &quot;Save Product&quot; button below to upload images and create the product.
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-primary/10 border border-gray-200 dark:border-white/10 flex items-center justify-center"
        >
          {hasImage ? (
            <div className="relative w-full h-full">
              {isBlob ? (
                // Use regular img tag for blob URLs
                <img
                  src={previewUrl}
                  alt={name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    console.log("Image failed to load:", previewUrl);
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                // Use Next.js Image for regular URLs
                <Image
                  src={previewUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized // Add this for external URLs
                  onError={(e) => {
                    console.log("Image failed to load:", previewUrl);
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-secondary">
              <FaImage className="text-2xl opacity-50" />
              <span className="text-sm">No image selected</span>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-xl font-semibold text-primary">{name}</h4>
            <p className="text-sm text-secondary mt-1 line-clamp-3">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-secondary">Category</div>
              <div className="text-sm text-primary font-medium">
                {category || "Not specified"}
              </div>
            </div>
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-secondary">
                {category === "Gemstone" ? "Gemstone" : "Material"}
              </div>
              <div className="text-sm text-primary font-medium">
                {materialOrGemstoneDisplay}
              </div>
            </div>
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary">Price</span>
                <FaRupeeSign className="text-secondary/70" />
              </div>
              <div className="text-sm text-primary font-semibold">
                {prettyPrice}
              </div>
              {priceType === "weight-based" && weight && (
                <div className="text-xs text-secondary mt-1">
                  Approx. weight: {weight} g
                </div>
              )}
            </div>
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-secondary">SKU</div>
              <div className="text-sm text-primary font-medium">
                {sku || "Not generated"}
              </div>
            </div>
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-secondary">Stock</div>
              <div className="text-sm text-primary font-medium">
                {(typeof stock === "number" && stock >= 0) || stock
                  ? String(stock)
                  : "Not set"}
              </div>
            </div>
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-secondary">Min Stock</div>
              <div className="text-sm text-primary font-medium">
                {minStock || "-"}
              </div>
            </div>
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-secondary">Dimensions (mm)</div>
              <div className="text-sm text-primary font-medium">
                {dimsDisplay}
              </div>
            </div>
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-secondary">Weight (g)</div>
              <div className="text-sm text-primary font-medium">
                {weight || "-"}
              </div>
            </div>
          </div>

          {/* Image Upload Status */}
          <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
            <div className="text-xs text-secondary">Image Upload Status</div>
            <div className="text-sm text-primary font-medium">
              {uploadedUrlsCount} uploaded, {storedFilesCount} pending upload
            </div>
            {storedFilesCount > 0 && (
              <div className="text-xs text-amber-400 mt-1">
                Will upload to: products/{sku || "[SKU]"}/images/
              </div>
            )}
          </div>

          {Array.isArray(tags) && tags.length > 0 && (
            <div>
              <div className="text-xs text-secondary mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-white/15 bg-primary/10 text-secondary"
                  >
                    <FaTag className="text-[10px] opacity-70" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Customization preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-secondary">Engraving</div>
              <div className="text-sm text-primary font-medium">
                {customizationOptions.allowEngraving
                  ? `Allowed (max ${customizationOptions.maxEngravingLength} chars)`
                  : "Not allowed"}
              </div>
            </div>
            <div className="bg-primary/10 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-secondary">Special Instructions</div>
              <div className="text-sm text-primary font-medium">
                {customizationOptions.allowSpecialInstructions
                  ? "Allowed"
                  : "Not allowed"}
              </div>
            </div>
          </div>

          {Array.isArray(customizationOptions.sizeOptions) &&
            customizationOptions.sizeOptions.length > 0 && (
              <div>
                <div className="text-xs text-secondary mb-2">
                  Available Sizes
                </div>
                <div className="flex flex-wrap gap-2">
                  {customizationOptions.sizeOptions.map((s, i) => (
                    <span
                      key={`${s}-${i}`}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-white/15 bg-primary/10 text-secondary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Variants */}
          {Array.isArray(variants) && variants.length > 0 && (
            <div>
              <div className="text-xs text-secondary mb-2">Variants</div>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, i) => (
                  <span
                    key={v.sku || i}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-white/15 bg-primary/10 text-secondary"
                  >
                    {v.name || v.sku || `Variant ${i + 1}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-secondary mt-2">
            <FaCheckCircle className="text-emerald-500 dark:text-emerald-400" />
            <span>
              Preview complete. Images will be uploaded to organized folders when you save the product.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
