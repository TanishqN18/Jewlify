"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaFeatherAlt, FaAlignLeft, FaBoxes, FaGem, FaChevronDown, FaRuler, FaPlus, FaTimes, FaTag } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function StepBasicInfo({
  formData = {},
  onChange,
  onNestedChange,
  errors = {},
}) {
  const [isClient, setIsClient] = useState(false);
  const name = formData.name || "";
  const description = formData.description || "";
  const category = formData.category || "";
  const material = formData.material || "";
  const mixedMetals = formData.mixedMetals || [];
  const gemstones = formData.gemstones || []; // Add gemstones

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [categoryPosition, setCategoryPosition] = useState({ top: 0, left: 0, width: 0 });
  const [materialPosition, setMaterialPosition] = useState({ top: 0, left: 0, width: 0 });

  const categoryRef = useRef(null);
  const materialRef = useRef(null);

  const handle = (key, val) => onChange && onChange(key, val);

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate dropdown position
  const updateCategoryPosition = () => {
    if (categoryRef.current) {
      const rect = categoryRef.current.getBoundingClientRect();
      setCategoryPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const updateMaterialPosition = () => {
    if (materialRef.current) {
      const rect = materialRef.current.getBoundingClientRect();
      setMaterialPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickingOnCategoryDropdown = event.target.closest('[data-dropdown="category"]');
      const clickingOnMaterialDropdown = event.target.closest('[data-dropdown="material"]');
      
      if (!clickingOnCategoryDropdown && categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (!clickingOnMaterialDropdown && materialRef.current && !materialRef.current.contains(event.target)) {
        setMaterialOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { value: "Rings", label: "Rings", icon: "💍" },
    { value: "Necklaces", label: "Necklaces", icon: "📿" },
    { value: "Earrings", label: "Earrings", icon: "👂" },
    { value: "Bracelets", label: "Bracelets", icon: "🔗" },
    { value: "Bangles", label: "Bangles", icon: "⭕" },
    { value: "Pendants", label: "Pendants", icon: "🏷️" },
    { value: "Other", label: "Other", icon: "✨" }
  ];

  const materials = [
    { value: "Gold", label: "Gold", color: "text-yellow-400", icon: "🟡" },
    { value: "Silver", label: "Silver", color: "text-gray-300", icon: "⚪" },
    { value: "Platinum", label: "Platinum", color: "text-gray-100", icon: "🔘" },
    { value: "Diamond", label: "Diamond", color: "text-blue-200", icon: "💎" },
    { value: "Mixed", label: "Mixed Metal", color: "text-purple-400", icon: "🌈" },
    { value: "Gemstone", label: "Gemstone", color: "text-emerald-400", icon: "💎" }, // Add Gemstone
    { value: "Other", label: "Other", icon: "✨" }
  ];

  const mixedMetalOptions = [
    { value: "Gold-Silver", label: "Gold & Silver", colors: ["bg-yellow-400", "bg-gray-300"] },
    { value: "Gold-Platinum", label: "Gold & Platinum", colors: ["bg-yellow-400", "bg-gray-100"] },
    { value: "Silver-Platinum", label: "Silver & Platinum", colors: ["bg-gray-300", "bg-gray-100"] },
    { value: "Gold-Silver-Platinum", label: "Gold, Silver & Platinum", colors: ["bg-yellow-400", "bg-gray-300", "bg-gray-100"] },
    { value: "Gold-Rose Gold", label: "Gold & Rose Gold", colors: ["bg-yellow-400", "bg-pink-400"] },
    { value: "White Gold-Yellow Gold", label: "White Gold & Yellow Gold", colors: ["bg-gray-100", "bg-yellow-400"] }
  ];

  // Add gemstone options
  const gemstoneOptions = [
    { value: "Ruby", label: "Ruby", color: "bg-red-500" },
    { value: "Sapphire", label: "Sapphire", color: "bg-blue-500" },
    { value: "Emerald", label: "Emerald", color: "bg-green-500" },
    { value: "Opal", label: "Opal", color: "bg-purple-300" },
    { value: "Topaz", label: "Topaz", color: "bg-yellow-300" },
    { value: "Amethyst", label: "Amethyst", color: "bg-purple-500" },
    { value: "Pearl", label: "Pearl", color: "bg-gray-100" },
    { value: "Other", label: "Other", color: "bg-gray-400" }
  ];

  const handleMixedMetalChange = (metalCombination) => {
    const updatedMixedMetals = mixedMetals.includes(metalCombination)
      ? mixedMetals.filter(metal => metal !== metalCombination)
      : [...mixedMetals, metalCombination];
    handle("mixedMetals", updatedMixedMetals);
  };

  // Add gemstone change handler
  const handleGemstoneChange = (gemstone) => {
    const updatedGemstones = gemstones.includes(gemstone)
      ? gemstones.filter(gem => gem !== gemstone)
      : [...gemstones, gemstone];
    handle("gemstones", updatedGemstones);
  };

  // Category Portal Dropdown
  const CategoryDropdown = () => {
    if (!isClient || !categoryOpen) return null;

    return createPortal(
      <>
        <div 
          className="fixed inset-0 z-[9998]"
          onClick={() => setCategoryOpen(false)}
        />
        
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          data-dropdown="category"
          className="fixed z-[9999] rounded-xl overflow-hidden
                     bg-gradient-to-br from-secondary/95 via-secondary to-primary/20 
                     backdrop-blur-md border border-white/30 shadow-2xl max-h-64 overflow-y-auto
                     scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
          style={{
            top: categoryPosition.top,
            left: categoryPosition.left,
            width: categoryPosition.width,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {categories.map((option) => {
            const active = category === option.value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handle("category", option.value);
                  setCategoryOpen(false);
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-all duration-200 border-l-2
                  ${active
                    ? "bg-gold/20 border-gold/80 text-primary shadow-lg"
                    : "border-transparent text-secondary hover:bg-primary/20 hover:text-primary hover:border-gold/40"}`}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="font-medium">
                  {option.label}
                </span>
              </button>
            );
          })}
        </motion.div>
      </>,
      document.body
    );
  };

  // Material Portal Dropdown
  const MaterialDropdown = () => {
    if (!isClient || !materialOpen) return null;

    return createPortal(
      <>
        <div 
          className="fixed inset-0 z-[9998]"
          onClick={() => setMaterialOpen(false)}
        />
        
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          data-dropdown="material"
          className="fixed z-[9999] rounded-xl overflow-hidden
                     bg-gradient-to-br from-secondary/95 via-secondary to-primary/20 
                     backdrop-blur-md border border-white/30 shadow-2xl max-h-64 overflow-y-auto
                     scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
          style={{
            top: materialPosition.top,
            left: materialPosition.left,
            width: materialPosition.width,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {materials.map((option) => {
            const active = material === option.value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handle("material", option.value);
                  if (option.value !== "Mixed") {
                    handle("mixedMetals", []);
                  }
                  if (option.value !== "Gemstone") {
                    handle("gemstones", []);
                  }
                  setMaterialOpen(false);
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-all duration-200 border-l-2
                  ${active
                    ? "bg-gold/20 border-gold/80 text-primary shadow-lg"
                    : "border-transparent text-secondary hover:bg-primary/20 hover:text-primary hover:border-gold/40"}`}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="font-medium">
                  {option.label}
                </span>
              </button>
            );
          })}
        </motion.div>
      </>,
      document.body
    );
  };

  const CustomDropdown = ({
    value,
    placeholder,
    icon,
    isOpen,
    onClick,
    error,
    dropdownRef
  }) => (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl pl-10 pr-10 py-3 text-primary cursor-pointer focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all text-sm flex items-center justify-between"
      >
        <span className={value ? "text-primary" : "text-secondary/60"}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-secondary/60" />
        </motion.div>
      </div>

      {icon && (
        <div className="absolute left-3 top-3.5 text-secondary/60 pointer-events-none">
          {icon}
        </div>
      )}

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );

  const handleTagAdd = () => {
    const tags = formData.tags || [];
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onChange("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagRemove = (index) => {
    const tags = formData.tags || [];
    onChange("tags", tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleDimensionChange = (dimension, value) => {
    if (onNestedChange) {
      onNestedChange("dimensions", dimension, value);
    } else {
      const newDimensions = {
        ...formData.dimensions,
        [dimension]: value
      };
      onChange("dimensions", newDimensions);
    }
  };

  if (!isClient) {
    return (
      <div className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl relative">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded"></div>
          <div className="h-4 bg-white/5 rounded w-2/3"></div>
          <div className="space-y-3">
            <div className="h-12 bg-white/10 rounded"></div>
            <div className="h-20 bg-white/10 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-white/10 rounded"></div>
              <div className="h-12 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl relative"
      >
        <div className="flex items-center gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-primary">Basic Information</h3>
            <p className="text-secondary text-sm">
              Enter the core details of your product
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">
              Product Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => handle("name", e.target.value)}
                placeholder="Product name (e.g. Classic Band, Silver Pendant)"
                className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all text-sm"
                suppressHydrationWarning
              />
              <FaFeatherAlt className="absolute left-3 top-3.5 text-secondary/60" />
            </div>
            {errors?.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">
              Description
            </label>
            <div className="relative">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => handle("description", e.target.value)}
                placeholder="Short description highlighting materials, design, and key features"
                className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all text-sm resize-none"
                suppressHydrationWarning
              />
              <FaAlignLeft className="absolute left-3 top-3.5 text-secondary/60" />
            </div>
            {errors?.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category and Material */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Category
              </label>
              <CustomDropdown
                value={category}
                placeholder="Select Category"
                icon={<FaBoxes />}
                isOpen={categoryOpen}
                onClick={() => {
                  if (!categoryOpen) updateCategoryPosition();
                  setCategoryOpen(!categoryOpen);
                  setMaterialOpen(false);
                }}
                error={errors?.category}
                dropdownRef={categoryRef}
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Material
              </label>
              <CustomDropdown
                value={material}
                placeholder="Select Material"
                icon={<FaGem />}
                isOpen={materialOpen}
                onClick={() => {
                  if (!materialOpen) updateMaterialPosition();
                  setMaterialOpen(!materialOpen);
                  setCategoryOpen(false);
                }}
                error={errors?.material}
                dropdownRef={materialRef}
              />
            </div>
          </div>

          {/* Mixed Metal Options */}
          <AnimatePresence>
            {material === "Mixed" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-primary/10 border border-white/10 rounded-xl p-4"
              >
                <label className="block text-sm font-semibold text-secondary mb-3">
                  Select Metal Combinations
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mixedMetalOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleMixedMetalChange(option.value)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        mixedMetals.includes(option.value)
                          ? "border-gold/60 bg-gold/10 text-primary"
                          : "border-white/15 text-secondary hover:text-primary hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {option.colors.map((color, index) => (
                            <div
                              key={index}
                              className={`w-3 h-3 rounded-full ${color}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => handle("mixedMetals", [])}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                  >
                    Clear All
                  </button>
                </div>
                {mixedMetals.length > 0 && (
                  <div className="mt-3 p-2 bg-primary/10 rounded-lg">
                    <p className="text-xs text-secondary">
                      Selected: {mixedMetals.join(", ")}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gemstone Options */}
          <AnimatePresence>
            {material === "Gemstone" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-primary/10 border border-white/10 rounded-xl p-4"
              >
                <label className="block text-sm font-semibold text-secondary mb-3">
                  Select Gemstones
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gemstoneOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleGemstoneChange(option.value)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        gemstones.includes(option.value)
                          ? "border-gold/60 bg-gold/10 text-primary"
                          : "border-white/15 text-secondary hover:text-primary hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => handle("gemstones", [])}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                  >
                    Clear All
                  </button>
                </div>
                {gemstones.length > 0 && (
                  <div className="mt-3 p-2 bg-primary/10 rounded-lg">
                    <p className="text-xs text-secondary">
                      Selected: {gemstones.join(", ")}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dimensions Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-primary">
              <FaRuler className="text-gold" />
              Dimensions (mm)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  Length (mm)
                </label>
                <input
                  type="number"
                  value={formData.dimensions?.length || ""}
                  onChange={(e) => handleDimensionChange("length", e.target.value)}
                  className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold transition-all"
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  Width (mm)
                </label>
                <input
                  type="number"
                  value={formData.dimensions?.width || ""}
                  onChange={(e) => handleDimensionChange("width", e.target.value)}
                  className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold transition-all"
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  Height (mm)
                </label>
                <input
                  type="number"
                  value={formData.dimensions?.height || ""}
                  onChange={(e) => handleDimensionChange("height", e.target.value)}
                  className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold transition-all"
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                  suppressHydrationWarning
                />
              </div>
            </div>
            <p className="text-xs text-secondary/70">
              Enter physical dimensions of the jewelry piece for shipping and display purposes
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-primary">
              <FaTag className="text-gold" />
              Tags
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold transition-all"
                placeholder="Add tags (e.g., wedding, engagement, luxury)"
                suppressHydrationWarning
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="px-6 py-3 bg-gradient-to-r from-gold/20 to-gold/30 hover:from-gold/30 hover:to-gold/40 text-gold border border-gold/40 rounded-xl transition-all hover:scale-105 flex items-center gap-2"
                suppressHydrationWarning
              >
                <FaPlus className="text-sm" />
                Add
              </button>
            </div>

            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold border border-gold/40 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(index)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Portal Dropdowns */}
      <AnimatePresence>
        {categoryOpen && <CategoryDropdown />}
      </AnimatePresence>
      
      <AnimatePresence>
        {materialOpen && <MaterialDropdown />}
      </AnimatePresence>
    </>
  );
}

