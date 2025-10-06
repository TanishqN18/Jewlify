"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaStar, FaHashtag, FaTags, FaCubes, FaRupeeSign, FaPercent, FaPenFancy, FaEye, FaEyeSlash, FaGlobe, FaLock } from "react-icons/fa";

export default function StepVarient({
  formData = {},
  onChange,
  errors = {},
}) {
  const variants = useMemo(
    () => (Array.isArray(formData.variants) ? formData.variants : []),
    [formData.variants]
  );
  const customizationOptions = formData.customizationOptions || {
    allowEngraving: false,
    maxEngravingLength: 20,
    allowSpecialInstructions: false,
    sizeOptions: [],
  };

  const [sizeInput, setSizeInput] = useState("");

  const update = (key, val) => onChange && onChange(key, val);
  const updateVariants = (next) => update("variants", next);
  const updateCustomization = (next) => update("customizationOptions", next);

  const addVariant = () => {
    const v = {
      id: Date.now(),
      name: "",
      sku: "",
      attributes: { size: "", color: "" },
      priceAdjType: "flat", // flat | percent
      priceAdj: 0,
      stock: 0,
      weightDiff: 0,
      isDefault: variants.length === 0, // first one default
    };
    updateVariants([...(variants || []), v]);
  };

  const removeVariant = (idx) => {
    const next = variants.filter((_, i) => i !== idx);
    // ensure at least one default if any remaining
    if (next.length && !next.some(v => v.isDefault)) {
      next[0].isDefault = true;
    }
    updateVariants(next);
  };

  const updateField = (idx, key, value) => {
    const next = variants.map((v, i) => (i === idx ? { ...v, [key]: value } : v));
    updateVariants(next);
  };

  const updateAttr = (idx, key, value) => {
    const next = variants.map((v, i) =>
      i === idx ? { ...v, attributes: { ...(v.attributes || {}), [key]: value } } : v
    );
    updateVariants(next);
  };

  const setDefault = (idx) => {
    const next = variants.map((v, i) => ({ ...v, isDefault: i === idx }));
    updateVariants(next);
  };

  const suggestedSkuPrefix = useMemo(() => (formData.sku ? `${formData.sku}-` : ""), [formData.sku]);

  // Local duplicate SKU detection (within variants)
  const duplicateSkuSet = useMemo(() => {
    const map = new Map();
    for (const v of variants) {
      const s = (v.sku || "").trim();
      if (!s) continue;
      map.set(s, (map.get(s) || 0) + 1);
    }
    return new Set([...map.entries()].filter(([_, c]) => c > 1).map(([s]) => s));
  }, [variants]);

  const addSize = () => {
    const s = sizeInput.trim();
    if (!s) return;
    const next = Array.from(new Set([...(customizationOptions.sizeOptions || []), s]));
    updateCustomization({ ...customizationOptions, sizeOptions: next });
    setSizeInput("");
  };

  const removeSize = (idx) => {
    const next = (customizationOptions.sizeOptions || []).filter((_, i) => i !== idx);
    updateCustomization({ ...customizationOptions, sizeOptions: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="space-y-6"
    >
      {/* Product Variants Section */}
      <div className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-primary dark:text-primary">Product Variants</h3>
              <p className="text-primary dark:text-secondary text-sm">Add size, color, stock, and price adjustments</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 text-white dark:text-primary font-semibold shadow-lg hover:shadow-blue-200 dark:hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            <FaPlus className="text-xs" />
            <span className="text-sm">Add Variant</span>
          </button>
        </div>

        {errors?.variants && (
          <p className="text-xs text-red-400 mb-4">{errors.variants}</p>
        )}

        {/* Variants List */}
        <div className="space-y-4">
          {(variants || []).map((v, idx) => {
            const isDup = v.sku && duplicateSkuSet.has(v.sku.trim());
            return (
              <motion.div
                key={v.id ?? idx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border p-4 md:p-5 backdrop-blur-sm
                  bg-gradient-to-r from-primary/20 to-primary/10
                  ${v.isDefault ? "border-blue-400/50 dark:border-gold/60" : "border-white/20"}
                  text-primary dark:text-primary`}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-white/15 bg-gray-100 dark:bg-black text-primary dark:text-secondary">
                      Variant #{idx + 1}
                    </span>
                    {v.isDefault && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-400/10">
                        <FaStar className="text-[10px]" /> Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!v.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefault(idx)}
                        className="text-xs px-3 py-1 rounded-lg border border-gray-300 dark:border-white/15 text-primary dark:text-secondary hover:text-gray-900 dark:hover:text-primary hover:border-gray-400 dark:hover:border-white/30 transition-all"
                      >
                        Make Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="text-xs px-3 py-1 rounded-lg border border-red-400/30 text-red-500 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    >
                      <span className="inline-flex items-center gap-1"><FaTrash className="text-[10px]" /> Remove</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">Name</label>
                    <input
                      type="text"
                      value={v.name || ""}
                      onChange={(e) => updateField(idx, "name", e.target.value)}
                      placeholder="e.g. Size 6 - Red"
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all text-sm"
                    />
                  </div>

                  {/* SKU */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-secondary mb-2">SKU</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={v.sku || ""}
                        onChange={(e) => updateField(idx, "sku", e.target.value)}
                        placeholder={`${suggestedSkuPrefix}VAR${idx + 1}`}
                        className={`w-full bg-gradient-to-r from-primary/20 to-primary/10 border rounded-xl pl-9 pr-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none transition-all text-sm
                          ${isDup ? "border-red-400 focus:border-red-400 shadow-red-400/20" : "border-white/20 focus:border-gold focus:shadow-gold/20"}`}
                      />
                      <FaHashtag className="absolute left-3 top-3.5 text-secondary/60" />
                    </div>
                    {isDup && <p className="text-xs text-red-400 mt-1">Duplicate variant SKU</p>}
                  </div>

                  {/* Stock */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-secondary mb-2">Stock</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        value={v.stock ?? 0}
                        onChange={(e) => updateField(idx, "stock", parseInt(e.target.value || "0"))}
                        placeholder="0"
                        className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl pl-9 pr-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-gold/20 hover:shadow-md transition-all text-sm"
                      />
                      <FaCubes className="absolute left-3 top-3.5 text-secondary/60" />
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">Size</label>
                    <input
                      type="text"
                      value={v.attributes?.size || ""}
                      onChange={(e) => updateAttr(idx, "size", e.target.value)}
                      placeholder="e.g. 6 / 7 / 8 or S / M / L"
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all text-sm"
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">Color</label>
                    <input
                      type="text"
                      value={v.attributes?.color || ""}
                      onChange={(e) => updateAttr(idx, "color", e.target.value)}
                      placeholder="e.g. Red / Gold / Silver"
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all text-sm"
                    />
                  </div>

                  {/* Weight Diff (g) */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">Weight Difference (g)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={v.weightDiff ?? 0}
                      onChange={(e) => updateField(idx, "weightDiff", parseFloat(e.target.value || "0"))}
                      placeholder="0"
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all text-sm"
                    />
                  </div>

                  {/* Price Adjustment Type */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">Price Adjustment Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateField(idx, "priceAdjType", "flat")}
                        className={`px-3 py-2 rounded-xl border text-sm flex items-center justify-center gap-2 transition-all
                          ${v.priceAdjType === "flat"
                            ? "border-gold/60 bg-gold/10 text-primary"
                            : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
                      >
                        <FaRupeeSign className="text-xs" /> Flat
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField(idx, "priceAdjType", "percent")}
                        className={`px-3 py-2 rounded-xl border text-sm flex items-center justify-center gap-2 transition-all
                          ${v.priceAdjType === "percent"
                            ? "border-gold/60 bg-gold/10 text-primary"
                            : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
                      >
                        <FaPercent className="text-xs" /> Percent
                      </button>
                    </div>
                  </div>

                  {/* Price Adjustment Value */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">Price Adjustment Value</label>
                    <input
                      type="number"
                      step="0.01"
                      value={v.priceAdj ?? 0}
                      onChange={(e) => updateField(idx, "priceAdj", parseFloat(e.target.value || "0"))}
                      placeholder={v.priceAdjType === "percent" ? "e.g. 5 for 5%" : "e.g. 250"}
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {!variants?.length && (
          <div className="mt-4 text-sm text-primary dark:text-secondary">
            No variants yet. Click &quot;Add Variant&quot; to create your first one.
          </div>
        )}
      </div>

      {/* Customization Options Section */}
      <div className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <FaPenFancy className="text-secondary" />
          <h4 className="text-lg font-bold text-primary">Customization Options</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Allow Engraving buttons */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-3">Allow Engraving</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateCustomization({ ...customizationOptions, allowEngraving: true })}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all
                  ${customizationOptions.allowEngraving
                    ? "border-gold/60 bg-gold/10 text-primary"
                    : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
              >
                Enabled
              </button>
              <button
                type="button"
                onClick={() => updateCustomization({ ...customizationOptions, allowEngraving: false })}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all
                  ${!customizationOptions.allowEngraving
                    ? "border-white/40 bg-primary/10 text-primary"
                    : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
              >
                Disabled
              </button>
            </div>
          </div>

          {/* Max Engraving Length */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">Max Engraving Length</label>
            <input
              type="number"
              min={1}
              value={customizationOptions.maxEngravingLength ?? 20}
              onChange={(e) =>
                updateCustomization({ ...customizationOptions, maxEngravingLength: parseInt(e.target.value || "1") })
              }
              className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-gold/20 transition-all text-sm"
            />
          </div>

          {/* Allow Special Instructions */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-3">Allow Special Instructions</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  updateCustomization({ ...customizationOptions, allowSpecialInstructions: true })
                }
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all
                  ${customizationOptions.allowSpecialInstructions
                    ? "border-gold/60 bg-gold/10 text-primary"
                    : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
              >
                Enabled
              </button>
              <button
                type="button"
                onClick={() =>
                  updateCustomization({ ...customizationOptions, allowSpecialInstructions: false })
                }
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all
                  ${!customizationOptions.allowSpecialInstructions
                    ? "border-white/40 bg-primary/10 text-primary"
                    : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
              >
                Disabled
              </button>
            </div>
          </div>
        </div>

        {/* Size Options */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-secondary mb-3">Size Options</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(customizationOptions.sizeOptions || []).map((s, i) => (
              <span
                key={`${s}-${i}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-white/20 bg-primary/10 text-secondary"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSize(i)}
                  className="w-4 h-4 rounded-full bg-white/20 text-secondary hover:bg-white/30 hover:text-primary transition-all flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="Add size (e.g. 6, 7, 8 or S, M, L)"
              className="flex-1 bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-gold/20 transition-all text-sm"
            />
            <button
              type="button"
              onClick={addSize}
              className="px-4 py-3 rounded-xl border border-white/20 text-secondary hover:text-primary hover:border-white/40 transition-all text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Visibility Settings Section */}
      <div className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <FaEye className="text-secondary" />
          <h4 className="text-lg font-bold text-primary">Visibility Settings</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Status */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-3">Product Status</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => update("status", "Available")}
                className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-center gap-2 font-medium transition-all
                  ${formData.status === "Available"
                    ? "border-emerald-400/70 bg-emerald-400/10 text-primary"
                    : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
              >
                <FaEye className="text-xs" /> Available
              </button>
              <button
                type="button"
                onClick={() => update("status", "Discontinued")}
                className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-center gap-2 font-medium transition-all
                  ${formData.status === "Discontinued"
                    ? "border-red-400/70 bg-red-400/10 text-primary"
                    : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
              >
                <FaEyeSlash className="text-xs" /> Discontinued
              </button>
            </div>
          </div>

          {/* Published Status */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-3">Published Status</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => update("isPublished", true)}
                className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-center gap-2 font-medium transition-all
                  ${formData.isPublished
                    ? "border-blue-400/70 bg-blue-400/10 text-primary"
                    : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
              >
                <FaGlobe className="text-xs" /> Published
              </button>
              <button
                type="button"
                onClick={() => update("isPublished", false)}
                className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-center gap-2 font-medium transition-all
                  ${!formData.isPublished
                    ? "border-yellow-400/70 bg-yellow-400/10 text-primary"
                    : "border-white/20 text-secondary hover:text-primary hover:border-white/40"}`}
              >
                <FaLock className="text-xs" /> Draft
              </button>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-6 p-4 rounded-xl border border-white/20 bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-400/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FaEye className="text-blue-400 text-xs" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-primary mb-2">Visibility Info</h5>
              <ul className="text-xs space-y-1 text-secondary">
                <li>• <strong className="text-primary">Available + Published:</strong> Product is live and visible to customers</li>
                <li>• <strong className="text-primary">Available + Draft:</strong> Product is ready but hidden from public</li>
                <li>• <strong className="text-primary">Discontinued:</strong> Product is no longer available for purchase</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}