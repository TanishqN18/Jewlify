'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaImage, FaUpload, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import dynamic from "next/dynamic";

// Import StepMedia component
const StepMedia = dynamic(() => import("../../../../components/admin/AddProduct/StepMedia"), { 
  ssr: false,
  loading: () => (
    <div className="p-8 rounded-xl border-2 border-dashed border-white/20 text-center text-secondary">
      <div className="animate-pulse">
        <FaImage className="text-4xl opacity-40 mx-auto mb-4" />
        <p className="text-sm">Loading media component...</p>
      </div>
    </div>
  )
});

const tabs = [
  "Overview",
  "Basic", 
  "Pricing",
  "Inventory",
  "Media",
  "Customization",
  "Variants",
  "SEO"
];

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } }
};

export default function ProductEditorClient({ initialProduct, productId }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [editing, setEditing] = useState(false); // Initialize editing state to false
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [originalForm, setOriginalForm] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('');

  const [form, setForm] = useState(() => ({
    name: "",
    description: "",
    category: "",
    material: "",
    mixedMetals: [],
    gemstones: [],
    priceType: "fixed",
    fixedPrice: "",
    weight: "",
    stock: "",
    minStock: "",
    sku: "",
    dimensions: { length: "", width: "", height: "" },
    status: "",
    image: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    slug: "",
    isPublished: true,
    variants: [],
    customizationOptions: {
      allowEngraving: false,
      maxEngravingLength: 20,
      allowSpecialInstructions: false,
      sizeOptions: []
    }
  }));

  const [rates, setRates] = useState({});

  // Helper function to get proper image URL
  const getImageSrc = useCallback((imageItem) => {
    if (!imageItem) return null;

    if (typeof imageItem === 'string') {
      if (imageItem.startsWith('http') || imageItem.startsWith('/')) return imageItem;
      return null;
    }

    if (imageItem && typeof imageItem === 'object') {
      // Prefer actual remote URLs first
      if (imageItem.secure_url) return imageItem.secure_url;
      if (imageItem.url) return imageItem.url;
      if (imageItem.preview) return imageItem.preview;
      if (imageItem.src) return imageItem.src;

      // Fallback: path + sku (avoid duplicating products/... if path already absolute)
      if (imageItem.path) {
        if (imageItem.path.startsWith('http')) return imageItem.path;
        if (imageItem.path.startsWith('/')) return imageItem.path;
        if (imageItem.sku) return `/products/${imageItem.sku}/images/${imageItem.path}`;
      }
    }

    if (imageItem instanceof File) return URL.createObjectURL(imageItem);
    return null;
  }, []);

  const fetchImages = async (sku) => {
    try {
      const response = await fetch(`/api/admin/products/fetch-images?sku=${sku}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      return data.images || [];
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      console.log(`Fetching product details for ID: ${productId}`); // Debug log
      const response = await fetch(`/api/admin/products/${productId}`);
      console.log('Response status:', response.status); // Debug log
      if (!response.ok) throw new Error('Failed to fetch product details');
      const data = await response.json();
      console.log('Fetched product details:', data); // Debug log
      return data; // Assuming the API returns the product details directly
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null; // Return null or handle the error as needed
    }
  };

  // Move this function outside of renderOverview and fix the rate structure
  const getWeightBasedPrice = useCallback(() => {
    const material = form.material;
    const weight = parseFloat(form.weight) || 0;
    
    if (!weight || !material || !rates) return null;
    
    // Map materials to rate properties from your API
    const materialToRateMap = {
      'gold': 'goldRate',
      'silver': 'silverRate',
      'platinum': 'goldRate', // fallback to gold rate if no platinum rate
    };
    
    const rateProperty = materialToRateMap[material.toLowerCase()];
    if (!rateProperty) return null;
    
    // Get the rate from the rates object structure returned by your API
    let currentRate = null;
    if (rates.rates && rates.rates[rateProperty]) {
      currentRate = rates.rates[rateProperty];
    } else if (rates[rateProperty]) {
      currentRate = rates[rateProperty];
    }
    
    if (!currentRate) return null;
    
    return currentRate * weight;
  }, [form.material, form.weight, rates]);

  // Update the fetchRates function to handle the API response structure
  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/rates');
      if (!res.ok) throw new Error('Failed to fetch rates');
      const data = await res.json();
      console.log('Fetched rates:', data); // Debug log
      setRates(data || {});
    } catch (e) {
      console.error('Error fetching rates:', e);
      setRates({});
    }
  }, []);

  // Load initial data and store original for cancel functionality
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true); // Set loading to true when starting to fetch data
      if (initialProduct) {
        try {
          // Fetch images and product details concurrently
          const [imagesFromApi, productDetailsResponse] = await Promise.all([
            fetchImages(initialProduct.sku),
            fetchProductDetails(productId)
          ]);

          if (productDetailsResponse) {
            const productDetails = productDetailsResponse.product;

            const formData = {
              ...form,
              ...productDetails,
              image: [...imagesFromApi, ...productDetails.image || []],
            };

            setForm(formData);
            setOriginalForm(formData);
            toast.success("Product details loaded successfully!"); // Toast notification
          } else {
            toast.error("Failed to fetch product details."); // Toast notification
          }
        } catch (error) {
          showToast("Error loading product details.", 'error'); // Toast notification
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      }
    };

    loadInitialData();
  }, [initialProduct, productId]);

  // Ensure SKU is set as soon as initialProduct is available
  useEffect(() => {
    if (!form.sku && initialProduct?.sku) {
      setForm(prev => ({ ...prev, sku: initialProduct.sku }));
    }
  }, [initialProduct?.sku]); 

  // Fetch rates on mount and when material changes
  useEffect(() => {
    fetchRates();
  }, [form.material, fetchRates]);

  // Render loading state with a better UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-8 rounded-xl border-2 border-dashed border-white/20 text-center text-secondary">
          <div className="animate-pulse">
            <FaImage className="text-4xl opacity-40 mx-auto mb-4" />
            <p className="text-sm">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const setNested = (parent, key, value) =>
    setForm(prev => ({ ...prev, [parent]: { ...prev[parent], [key]: value } }));

  const addVariant = () => {
    setField("variants", [
      ...form.variants,
      {
        id: Date.now(),
        name: "New Variant",
        sku: `${form.sku}-VAR${form.variants.length + 1}`,
        attributes: { size: "", color: "" },
        priceAdjType: "flat",
        priceAdj: 0,
        stock: 0,
        weightDiff: 0,
        isDefault: form.variants.length === 0
      }
    ]);
  };

  const updateVariant = (idx, patch) => {
    setField(
      "variants",
      form.variants.map((v, i) => (i === idx ? { ...v, ...patch } : v))
    );
  };

  const removeVariant = (idx) => {
    setField("variants", form.variants.filter((_, i) => i !== idx));
  };

  const toggleDefaultVariant = (idx) => {
    setField(
      "variants",
      form.variants.map((v, i) => ({ ...v, isDefault: i === idx }))
    );
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    const isSuccess = type === 'success';
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 bg-gradient-to-r ${
      isSuccess ? 'from-emerald-500 to-green-600' : 'from-red-500 to-pink-600'
    } text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-500 translate-x-full`;
    
    toast.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            ${isSuccess 
              ? '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>'
              : '<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>'
            }
          </svg>
        </div>
        <span class="font-semibold">${message}</span>
      </div>`;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.remove("translate-x-full"), 100);
    setTimeout(() => {
      toast.classList.add("translate-x-full");
      setTimeout(() => document.body.removeChild(toast), 500);
    }, isSuccess ? 3000 : 5000);
  };

  const handleSave = async () => {
    setSaving(true);
    showToast('Saving product...', 'info'); // Show saving toast

    try {
      const payload = {
        ...form,
        coverImage: form.coverImage || form.image?.[0] || ""
      };
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save product');

      showToast('Product saved successfully!', 'success'); // Success toast
      setEditing(false); // Reset editing state
      setOriginalForm(form);
      window.location.reload(); // Refresh the page
    } catch (e) {
      console.error("Save error:", e);
      showToast(e.message || "Error saving product. Please try again.", 'error'); // Error toast
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(originalForm);
    setEditing(false);
    showToast("Changes cancelled", 'info'); // Use showToast instead of toast
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product deleted successfully!");
      router.push("/admin/items");
    } catch (e) {
      toast.error(e.message || "Delete error");
    } finally {
      setDeleting(false);
    }
  };

  // Modern input components
  const SectionCard = ({ title, children, cols = 2 }) => (
    <motion.div
      variants={fade}
      className="bg-gradient-to-br from-secondary/70 via-secondary/60 to-secondary/50 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl shadow-black/10"
    >
      <h4 className="text-sm font-bold tracking-wide text-gold mb-6 uppercase flex items-center">
        <span className="w-2 h-2 bg-gold rounded-full mr-2"></span>
        {title}
      </h4>
      <div className={`grid gap-6 ${cols === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        {children}
      </div>
    </motion.div>
  );

  const Input = ({ label, error, children, required = false }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-primary">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );

  const ModernInput = ({ value, onChange, disabled, type = "text", placeholder, className = "" }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full bg-primary/10 border-2 ${
        disabled 
          ? 'border-white/10 text-secondary/70' 
          : 'border-white/20 hover:border-white/30 focus:border-gold'
      } rounded-xl px-4 py-3 text-sm text-primary placeholder-secondary/50 outline-none transition-all duration-200 ${
        !disabled && 'focus:shadow-lg focus:shadow-gold/20'
      } ${className}`}
    />
  );

  const ModernSelect = ({ value, onChange, disabled, children, className = "" }) => (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full bg-primary/10 border-2 ${
        disabled 
          ? 'border-white/10 text-secondary/70' 
          : 'border-white/20 hover:border-white/30 focus:border-gold'
      } rounded-xl px-4 py-3 text-sm text-primary outline-none transition-all duration-200 ${
        !disabled && 'focus:shadow-lg focus:shadow-gold/20'
      } ${className}`}
    >
      {children}
    </select>
  );

  const ModernTextarea = ({ value, onChange, disabled, rows = 4, placeholder, className = "" }) => (
    <textarea
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      placeholder={placeholder}
      className={`w-full bg-primary/10 border-2 ${
        disabled 
          ? 'border-white/10 text-secondary/70' 
          : 'border-white/20 hover:border-white/30 focus:border-gold'
      } rounded-xl px-4 py-3 text-sm text-primary placeholder-secondary/50 outline-none transition-all duration-200 resize-none ${
        !disabled && 'focus:shadow-lg focus:shadow-gold/20'
      } ${className}`}
    />
  );

  const ModernCheckbox = ({ checked, onChange, disabled, label }) => (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-5 h-5 rounded-lg border-2 border-white/20 bg-primary/10 text-gold focus:ring-gold focus:ring-2 disabled:opacity-50"
      />
      <span className="text-sm text-primary">{label}</span>
    </label>
  );

  const Badge = ({ children, color = "emerald" }) => {
    const colorClasses = {
      emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      amber: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      violet: "bg-violet-500/20 text-violet-300 border-violet-500/40",
      blue: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colorClasses[color] || colorClasses.emerald}`}>
        {children}
      </span>
    );
  };

  // Enhanced image display component
  const ProductImage = ({ imageSrc, alt, onError, className = "" }) => {
    const [imgError, setImgError] = useState(false);
    
    if (!imageSrc || imgError) {
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center text-secondary bg-primary/5 ${className}`}>
          <FaImage className="text-4xl opacity-40 mb-2" />
          <span className="text-sm">No Image</span>
          {imageSrc && imgError && (
            <span className="text-xs mt-1 text-red-400">Failed to load</span>
          )}
        </div>
      );
    }

    return (
      <Image
        src={imageSrc}
        alt={alt || "Product Image"}
        fill
        className={`object-cover ${className}`}
        unoptimized
        onError={(e) => {
          console.error('Image failed to load:', imageSrc);
          setImgError(true);
          onError && onError(e);
        }}
        onLoad={() => {
          setImgError(false);
        }}
      />
    );
  };

  const renderOverview = () => {
    const primaryImageSrc = getImageSrc(form.coverImage || form.image?.[0]);

    return (
      <motion.div
        key="overview"
        variants={fade}
        initial="hidden"
        animate="show"
        exit="exit"
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-80 aspect-square rounded-2xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-primary/20 to-primary/5">
            <ProductImage 
              imageSrc={primaryImageSrc}
              alt={form.name}
            />
            {form.image && form.image.length > 0 && (
              <button
                onClick={() => setShowImagePreview(true)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-all"
              >
                <FaEye />
              </button>
            )}
            {form.coverImage && (
              <div className="absolute bottom-3 left-3 bg-black/60 text-xs px-3 py-1 rounded-full text-gold border border-gold/40">
                Cover Image
              </div>
            )}
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3 flex-wrap">
              {form.name}
              <Badge color="amber">{form.status}</Badge>
              {form.isPublished ? <Badge color="emerald">PUBLISHED</Badge> : <Badge color="yellow">DRAFT</Badge>}
            </h2>
            <p className="text-secondary leading-relaxed">
              {form.description || "No description available."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge color="cyan">{form.category}</Badge>
              <Badge color="violet">{form.material}</Badge>
              {form.material === "Mixed" &&
                form.mixedMetals.map((m) => (
                  <Badge color="blue" key={m}>{m}</Badge>
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Weight" value={`${form.weight || 0} gm`} />
              <Stat
                label="Price"
                value={
                  form.priceType === "fixed"
                    ? `₹${Number(form.fixedPrice || 0).toLocaleString("en-IN")}`
                    : (
                      getWeightBasedPrice() !== null
                        ? `₹${Number(getWeightBasedPrice()).toLocaleString("en-IN")}`
                        : "Rate not available"
                    )
                }
              />
              <Stat label="Stock" value={form.stock || 0} />
              <Stat label="Min Stock" value={form.minStock || 0} />
              <Stat label="SKU" value={form.sku || "—"} />
              <Stat
                label="Dimensions"
                value={`${form.dimensions.length || "-"} × ${form.dimensions.width || "-"} × ${form.dimensions.height || "-"}`}
              />
              <Stat label="Variants" value={form.variants.length} />
              <Stat label="Engraving" value={form.customizationOptions.allowEngraving ? "Yes" : "No"} />
            </div>
          </div>
        </div>

        {/* Debug section - remove this after testing */}
        {editing && (
          <div className="bg-red-500/10 border border-red-400/30 p-3 rounded-lg text-xs text-red-300">
            <strong>Debug Info:</strong><br/>
            Material: {form.material}<br/>
            Weight: {form.weight}<br/>
            Price Type: {form.priceType}<br/>
            Rates: {JSON.stringify(rates)}<br/>
            Calculated Price: {getWeightBasedPrice()}
          </div>
        )}

        {/* Image Preview Modal */}
        <AnimatePresence>
          {showImagePreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setShowImagePreview(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowImagePreview(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-all"
                >
                  <FaTimes />
                </button>
                <div className="relative aspect-square max-h-[80vh]">
                  <ProductImage 
                    imageSrc={getImageSrc(form.image?.[previewImageIndex])}
                    alt={`${form.name} preview`}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const Stat = ({ label, value }) => (
    <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-4 border border-white/10">
      <p className="text-xs tracking-wide text-secondary uppercase mb-1">{label}</p>
      <p className="text-lg font-bold text-primary">{value}</p>
    </div>
  );

  const renderBasic = () => (
    <motion.div key="basic" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-6">
      <SectionCard title="Basic Information">
        <Input label="Product Name" required>
          <ModernInput
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            disabled={!editing}
            placeholder="Enter product name"
          />
        </Input>
        
        <Input label="Category" required>
          <ModernSelect
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            disabled={!editing}
          >
            <option value="">Select Category</option>
            {["Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Pendants", "Other"].map(c => 
              <option key={c} value={c}>{c}</option>
            )}
          </ModernSelect>
        </Input>

        <Input label="Material" required>
          <ModernSelect
            value={form.material}
            onChange={(e) => {
              setField("material", e.target.value);
              // Reset mixed metals and gemstones based on selected material
              if (e.target.value !== "Mixed") setField("mixedMetals", []);
              if (e.target.value !== "Gemstone") setField("gemstones", []);
            }}
            disabled={!editing}
          >
            <option value="">Select Material</option>
            {["Gold", "Silver", "Platinum", "Diamond", "Mixed", "Gemstone", "Other"].map(m => 
              <option key={m} value={m}>{m}</option>
            )}
          </ModernSelect>
        </Input>

        {/* Show Mixed Metals if "Mixed" is selected */}
        {form.material === "Mixed" && (
          <Input label="Mixed Metals">
            <ModernSelect
              value={form.mixedMetals[0] || ""}
              onChange={(e) => {
                const selected = e.target.value;
                setField("mixedMetals", [selected]);
              }}
              disabled={!editing}
            >
              <option value="">Select Mixed Metal</option>
              {['Gold-Silver', 'Gold-Platinum', 'Silver-Platinum', 'Gold-Silver-Platinum', 'Gold-Rose Gold', 'White Gold-Yellow Gold'].map(metal => 
                <option key={metal} value={metal}>{metal}</option>
              )}
              <option value="Custom">Custom</option>
            </ModernSelect>
            {form.mixedMetals[0] === "Custom" && (
              <ModernInput
                value={form.customMixedMetal || ""}
                onChange={(e) => setField("customMixedMetal", e.target.value)}
                disabled={!editing}
                placeholder="Enter custom mixed metal"
              />
            )}
          </Input>
        )}

        {/* Show Gemstones if "Gemstone" is selected */}
        {form.material === "Gemstone" && (
          <Input label="Gemstones">
            <ModernSelect
              value={form.gemstones[0] || ""}
              onChange={(e) => {
                const selected = e.target.value;
                setField("gemstones", [selected]);
              }}
              disabled={!editing}
            >
              <option value="">Select Gemstone</option>
              {['Ruby', 'Sapphire', 'Emerald', 'Opal', 'Topaz', 'Amethyst', 'Pearl', 'Other'].map(gemstone => 
                <option key={gemstone} value={gemstone}>{gemstone}</option>
              )}
              <option value="Custom">Custom</option>
            </ModernSelect>
            {form.gemstones[0] === "Custom" && (
              <ModernInput
                value={form.customGemstone || ""}
                onChange={(e) => setField("customGemstone", e.target.value)}
                disabled={!editing}
                placeholder="Enter custom gemstone"
              />
            )}
          </Input>
        )}

        <div className="md:col-span-2">
          <Input label="Description">
            <ModernTextarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              disabled={!editing}
              placeholder="Enter product description"
              rows={4}
            />
          </Input>
        </div>
      </SectionCard>
    </motion.div>
  );

  const renderPricing = () => (
    <motion.div key="pricing" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-6">
      <SectionCard title="Pricing Configuration" cols={1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Price Type" required>
            <ModernSelect
              value={form.priceType}
              disabled={!editing}
              onChange={(e) => {
                setField("priceType", e.target.value);
                // Reset fixed price when switching to weight-based
                if (e.target.value === "weight-based") {
                  setField("fixedPrice", ""); // Clear fixed price if switching to weight-based
                }
              }}
            >
              <option value="fixed">Fixed Price</option>
              <option value="weight-based">Weight Based</option>
            </ModernSelect>
          </Input>

          {/* Fixed Price Input */}
          <Input label="Fixed Price (₹)" required>
            <ModernInput
              type="number"
              value={form.fixedPrice}
              disabled={!editing || form.priceType === "weight-based"}
              onChange={(e) => setField("fixedPrice", e.target.value)}
              placeholder="0.00"
            />
          </Input>

          {/* Weight Input */}
          <Input label="Weight (grams)" required>
            <ModernInput
              type="number"
              value={form.weight}
              disabled={!editing}
              onChange={(e) => setField("weight", e.target.value)}
              placeholder="0.00"
            />
          </Input>
        </div>
      </SectionCard>
    </motion.div>
  );

  const renderInventory = () => (
    <motion.div key="inventory" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-6">
      <SectionCard title="Inventory & Dimensions">
        <Input label="Stock Quantity" required>
          <ModernInput
            type="number"
            value={form.stock}
            disabled={!editing}
            onChange={(e) => setField("stock", e.target.value)}
            placeholder="0"
          />
        </Input>
        
        <Input label="Minimum Stock" required>
          <ModernInput
            type="number"
            value={form.minStock}
            disabled={!editing}
            onChange={(e) => setField("minStock", e.target.value)}
            placeholder="5"
          />
        </Input>
        
        <Input label="SKU">
          <ModernInput
            value={form.sku}
            disabled={true} // Always read-only
            placeholder="Auto-generated"
          />
        </Input>
        
        <div className="md:col-span-2">
          <Input label="Dimensions (mm)">
            <div className="grid grid-cols-3 gap-4">
              <ModernInput
                type="number"
                value={form.dimensions.length}
                disabled={!editing}
                onChange={(e) => setNested("dimensions", "length", e.target.value)}
                placeholder="Length"
              />
              <ModernInput
                type="number"
                value={form.dimensions.width}
                disabled={!editing}
                onChange={(e) => setNested("dimensions", "width", e.target.value)}
                placeholder="Width"
              />
              <ModernInput
                type="number"
                value={form.dimensions.height}
                disabled={!editing}
                onChange={(e) => setNested("dimensions", "height", e.target.value)}
                placeholder="Height"
              />
            </div>
          </Input>
        </div>
      </SectionCard>
    </motion.div>
  );

  // Simple inline media manager (edit context)
  function InlineMediaManager({ sku, images, onChange }) {
    const [busy, setBusy] = useState(false);
    const [dragFrom, setDragFrom] = useState(null);
    const [dragOver, setDragOver] = useState(null);
    const fileRef = useRef(null);
    const lastCoverRef = useRef(images?.[0]);

    const effectiveSku = useMemo(() => {
      if (sku && sku.trim()) return sku.trim();
      for (const img of images || []) {
        const url = typeof img === 'string' ? img : (img?.secure_url || img?.url || "");
        if (url) {
          const m = url.match(/\/products\/([^/]+)\/images\//i);
          if (m) return m[1];
        }
      }
      return "";
    }, [sku, images]);

    const pushImages = (next) => {
      if (!Array.isArray(next)) return;
      onChange(next);
      setField('coverImage', next[0] || "");
      toast.info("Images added. Remember to save changes!"); // Add toast notification
    };

    const setImages = (next) => pushImages(next);

    const openPicker = () => fileRef.current?.click();

    const setCover = (idx) => {
      if (idx === 0) return;
      const next = [...images];
      const [spliced] = next.splice(idx, 1);
      next.unshift(spliced);
      setImages(next);
    };

    const removeAt = (idx) => {
      const next = images.filter((_, i) => i !== idx);
      setImages(next);
    };

    // Drag & drop reordering
    const onDragStart = (e, idx) => {
      setDragFrom(idx);
      e.dataTransfer.effectAllowed = "move";
    };
    const onDragEnter = (idx) => {
      if (idx !== dragOver) setDragOver(idx);
    };
    const onDragEnd = () => {
      if (dragFrom != null && dragOver != null && dragFrom !== dragOver) {
        const next = [...images];
        const [moved] = next.splice(dragFrom, 1);
        next.splice(dragOver, 0, moved);
        setImages(next);
      }
      setDragFrom(null);
      setDragOver(null);
    };

    // Upload helpers
    const getSignature = async (folder) => {
      const cleanFolder = folder.replace(/(^\/+)|(\.\.)/g, '');
      const timestamp = Math.round(Date.now() / 1000);
      const res = await fetch('/api/admin/products/cloudinary/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paramsToSign: {
            folder: cleanFolder,
            timestamp
          }
        })
      });
      const text = await res.text();
      if (!res.ok) {
        console.error('Signature endpoint failed', { status: res.status, body: text });
        toast.error('Signature request failed');
        throw new Error('Signature fetch failed');
      }
      let json;
      try { json = JSON.parse(text); } catch {
        console.error('Signature JSON parse error', text);
        throw new Error('Bad signature JSON');
      }
      if (!json.signature || !json.timestamp || !json.apiKey || !json.cloudName) {
        console.error('Incomplete signature payload', json);
        throw new Error('Incomplete signature payload');
      }
      return json;
    };

    const uploadFile = async (file) => {
      const folder = `products/${effectiveSku}/images`;
      const sig = await getSignature(folder); // throws if invalid
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', sig.apiKey);
      fd.append('timestamp', sig.timestamp);
      fd.append('signature', sig.signature);
      fd.append('folder', folder);

      const upl = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/upload`, {
        method: 'POST',
        body: fd
      });
      if (!upl.ok) {
        const errTxt = await upl.text();
        console.error('Cloudinary upload error', upl.status, errTxt);
        toast.error('Upload failed');
        throw new Error('Upload failed');
      }
      return upl.json();
    };

    const handleFiles = async (list) => {
      if (!list?.length) return;
      if (!effectiveSku) {
        toast.error('SKU not ready yet');
        return;
      }
      setBusy(true);
      try {
        const results = [];
        for (const file of Array.from(list)) {
          const res = await uploadFile(file);
          results.push(res.secure_url);
        }
        setImages([...(images || []), ...results]);
      } catch (e) {
        console.error(e);
        toast.error('Upload failed');
      } finally {
        setBusy(false);
      }
    };

    // Root drop zone
    const onRootDrop = (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      handleFiles(files);
    };
    const prevent = (e) => e.preventDefault();

    return (
      <div
        className="space-y-4"
        onDragOver={prevent}
        onDrop={onRootDrop}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          accept="image/*"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />

        {/* Header / Status */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={openPicker}
            disabled={!effectiveSku || busy}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-gold to-amber-500 text-black hover:opacity-90 disabled:opacity-40 shadow-md"
          >
            {busy ? 'Uploading…' : 'Upload Images'}
          </button>
          <div className="text-xs font-medium text-secondary flex items-center gap-3">
            <span>SKU: <span className="text-primary">{effectiveSku || 'waiting…'}</span></span>
            <span>{images.length} image{images.length !== 1 && 's'}</span>
            {busy && <span className="text-amber-400 animate-pulse">Processing…</span>}
          </div>
        </div>

        {/* Info panel */}
        <div className="rounded-xl bg-primary/5 border border-white/10 p-3 text-[11px] leading-relaxed text-secondary flex flex-wrap gap-x-6 gap-y-2">
          <span><strong>Tips:</strong> Drag to reorder • First image = Cover</span>
          <span>Recommended: 1200×1200 PNG/JPG</span>
          <span>You can drop files anywhere inside this box</span>
        </div>

        {!effectiveSku && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-xs text-red-300">
            Cannot upload until SKU is available.
          </div>
        )}

        {/* Empty */}
        {!images.length && (
          <div
            onClick={openPicker}
            className="cursor-pointer relative p-10 border-2 border-dashed border-white/15 rounded-2xl text-center text-sm text-secondary hover:border-gold/50 hover:bg-primary/5 transition"
          >
            <FaUpload className="mx-auto mb-3 text-2xl opacity-50" />
            <p className="font-medium text-primary">Click or Drop Images to Upload</p>
            <p className="mt-1 text-xs">PNG • JPG • WEBP</p>
          </div>
        )}

        {/* Grid */}
        {images.length > 0 && (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))' }}
          >
            {/* Add tile */}
            <button
              type="button"
              onClick={openPicker}
              className="aspect-square rounded-xl border-2 border-dashed border-white/15 hover:border-gold/60 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 text-secondary text-xs font-medium transition group"
            >
              <FaUpload className="text-lg opacity-50 group-hover:text-gold group-hover:opacity-100" />
              <span>Add</span>
            </button>

            {images.map((img, i) => {
              const url = typeof img === 'string'
                ? img
                : (img?.secure_url || img?.url || img?.path || '');
              const isCover = i === 0;
              const dragging = dragOver === i && dragFrom != null && dragFrom !== dragOver;

              return (
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => onDragStart(e, i)}
                  onDragEnter={() => onDragEnter(i)}
                  onDragEnd={onDragEnd}
                  className={`relative aspect-square rounded-xl overflow-hidden border group bg-primary/10
                    ${isCover ? 'border-gold shadow-lg shadow-gold/20' : 'border-white/10 hover:border-white/30'}
                    ${dragging ? 'ring-2 ring-gold/80 scale-[1.02]' : ''}
                    transition`}
                >
                  <img
                    src={url}
                    alt={`image-${i}`}
                    className="w-full h-full object-cover pointer-events-none"
                    onError={(e) => { e.currentTarget.style.opacity = 0.25; }}
                  />
                  {/* Cover badge */}
                  {isCover && (
                    <div className="absolute top-1 left-1 bg-gold text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 text-black">
                      ⭐ Cover
                    </div>
                  )}
                  {/* Drag hint */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/45 flex flex-col justify-between p-1 transition">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => removeAt(i)}
                        type="button"
                        className="bg-red-500/90 hover:bg-red-600 text-white rounded px-2 py-1 text-[10px]"
                        title="Remove"
                      >✕</button>
                    </div>
                    <div className="flex justify-between items-end">
                      {!isCover && (
                        <button
                          onClick={() => setCover(i)}
                          type="button"
                          className="bg-gold/90 hover:bg-gold text-black rounded px-2 py-1 text-[10px] font-semibold"
                          title="Set Cover"
                        >Set Cover</button>
                      )}
                      <span className="text-[10px] text-white/70 px-2 py-1 rounded bg-white/10">
                        Drag to reorder
                      </span>
                    </div>
                  </div>
                  {busy && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="h-6 w-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderMedia = () => {
    const productSku =
      (form.sku && form.sku.trim()) ||
      (initialProduct?.sku && initialProduct.sku.trim()) ||
      (initialProduct?.product?.sku && initialProduct.product.sku.trim()) ||
      "";

    return (
      <motion.div key="media" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-6">
        <SectionCard title="Media Gallery" cols={1}>
          {editing ? (
            <InlineMediaManager
              sku={productSku}
              images={form.image || []}
              onChange={(imgs) => setField('image', imgs)}
            />
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))' }}>
              {(form.image || []).map((img, i) => {
                const url = typeof img === 'string'
                  ? img
                  : (img?.secure_url || img?.url || img?.path || '');
                return (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-xl overflow-hidden border ${i === 0 ? 'border-gold' : 'border-white/10'} bg-primary/10`}
                  >
                    <img src={url} alt={`image-${i}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-gold text-[10px] font-semibold px-2 py-0.5 rounded text-black">
                        Cover
                      </div>
                    )}
                  </div>
                );
              })}
              {(!form.image || form.image.length === 0) && (
                <div className="col-span-full p-10 border-2 border-dashed border-white/15 rounded-2xl text-center text-sm text-secondary">
                  No images.
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </motion.div>
    );
  };

  const renderCustomization = () => (
    <motion.div key="customization" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-6">
      <SectionCard title="Customization Options">
        <div className="space-y-4">
          <ModernCheckbox
            checked={form.customizationOptions.allowEngraving}
            onChange={(e) => setNested("customizationOptions", "allowEngraving", e.target.checked)}
            disabled={!editing}
            label="Allow Engraving"
          />
        </div>
        
        <Input label="Max Engraving Length">
          <ModernInput
            type="number"
            disabled={!editing || !form.customizationOptions.allowEngraving}
            value={form.customizationOptions.maxEngravingLength}
            onChange={(e) => setNested("customizationOptions", "maxEngravingLength", e.target.value)}
            placeholder="20"
          />
        </Input>
        
        <div className="space-y-4">
          <ModernCheckbox
            checked={form.customizationOptions.allowSpecialInstructions}
            onChange={(e) => setNested("customizationOptions", "allowSpecialInstructions", e.target.checked)}
            disabled={!editing}
            label="Allow Special Instructions"
          />
        </div>
        
        <div className="md:col-span-2">
          <Input label="Size Options">
            <ModernInput
              disabled={!editing}
              value={form.customizationOptions.sizeOptions.join(", ")}
              onChange={(e) =>
                setNested(
                  "customizationOptions",
                  "sizeOptions",
                  e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                )
              }
              placeholder="S, M, L, XL"
            />
          </Input>
        </div>
      </SectionCard>
    </motion.div>
  );

  const renderVariants = () => (
    <motion.div key="variants" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-6">
      <SectionCard title="Product Variants" cols={1}>
        <div className="space-y-6">
          {form.variants.length === 0 && (
            <div className="text-center py-8 text-secondary">
              <p className="text-sm">No variants created yet.</p>
            </div>
          )}
          
          {form.variants.map((v, idx) => (
            <motion.div
              key={v.id}
              className="rounded-xl p-6 border border-white/10 bg-primary/5 space-y-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input label="Variant Name">
                  <ModernInput
                    value={v.name}
                    disabled={!editing}
                    onChange={(e) => updateVariant(idx, { name: e.target.value })}
                    placeholder="Variant name"
                  />
                </Input>
                
                <Input label="Size">
                  <ModernInput
                    value={v.attributes?.size || ''}
                    disabled={!editing}
                    onChange={(e) =>
                      updateVariant(idx, { attributes: { ...v.attributes, size: e.target.value } })
                    }
                    placeholder="Size"
                  />
                </Input>
                
                <Input label="Color">
                  <ModernInput
                    value={v.attributes?.color || ''}
                    disabled={!editing}
                    onChange={(e) =>
                      updateVariant(idx, { attributes: { ...v.attributes, color: e.target.value } })
                    }
                    placeholder="Color"
                  />
                </Input>
                
                <Input label="Price Adjustment">
                  <ModernInput
                    type="number"
                    value={v.priceAdj}
                    disabled={!editing}
                    onChange={(e) => updateVariant(idx, { priceAdj: e.target.value })}
                    placeholder="0"
                  />
                </Input>
                
                <Input label="Stock">
                  <ModernInput
                    type="number"
                    value={v.stock}
                    disabled={!editing}
                    onChange={(e) => updateVariant(idx, { stock: e.target.value })}
                    placeholder="0"
                  />
                </Input>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    v.isDefault
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                      : "bg-secondary/60 text-secondary border border-white/10 hover:bg-secondary/80"
                  }`}
                  disabled={!editing}
                  onClick={() => toggleDefaultVariant(idx)}
                >
                  {v.isDefault ? "DEFAULT VARIANT" : "Make Default"}
                </button>
                
                {editing && (
                  <button
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm border border-red-500/30 hover:bg-red-500/30 transition-all"
                    onClick={() => removeVariant(idx)}
                  >
                    Remove Variant
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          
          {editing && (
            <button
              type="button"
              onClick={addVariant}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border-2 border-dashed border-white/20 hover:border-white/30 transition-all"
            >
              <FaPlus className="text-sm" /> Add New Variant
            </button>
          )}
        </div>
      </SectionCard>
    </motion.div>
  );

  const renderSEO = () => (
    <motion.div key="seo" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-6">
      <SectionCard title="SEO & Publishing">
        <Input label="URL Slug">
          <ModernInput
            value={form.slug}
            disabled={!editing}
            onChange={(e) => setField("slug", e.target.value)}
            placeholder="product-url-slug"
          />
        </Input>
        
        <Input label="SEO Title">
          <ModernInput
            value={form.seoTitle}
            disabled={!editing}
            onChange={(e) => setField("seoTitle", e.target.value)}
            placeholder="SEO optimized title"
          />
        </Input>
        
        <div className="md:col-span-2">
          <Input label="SEO Description">
            <ModernTextarea
              value={form.seoDescription}
              disabled={!editing}
              onChange={(e) => setField("seoDescription", e.target.value)}
              placeholder="SEO meta description"
              rows={3}
            />
          </Input>
        </div>
        
        <div className="md:col-span-2">
          <Input label="SEO Keywords">
            <ModernInput
              value={form.seoKeywords}
              disabled={!editing}
              onChange={(e) => setField("seoKeywords", e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
          </Input>
        </div>
        
        <div className="space-y-4">
          <ModernCheckbox
            checked={form.isPublished}
            onChange={(e) => setField("isPublished", e.target.checked)}
            disabled={!editing}
            label="Published (visible to customers)"
          />
        </div>
      </SectionCard>
    </motion.div>
  );

  const tabContent = {
    Overview: renderOverview(),
    Basic: renderBasic(),
    Pricing: renderPricing(),
    Inventory: renderInventory(),
    Media: renderMedia(),
    Customization: renderCustomization(),
    Variants: renderVariants(),
    SEO: renderSEO()
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 space-y-6">
      {/* Overlay */}
      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">{overlayMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-secondary/80 via-secondary/70 to-secondary/60 backdrop-blur-xl rounded-2xl px-6 py-5 border border-white/20 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary font-semibold transition-all hover:scale-105"
          >
            <FaArrowLeft className="inline mr-2" /> Back
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-wide">
            {form.name || "Product Details"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 text-emerald-300 font-semibold border border-emerald-400/40 transition-all hover:scale-105"
            >
              <FaEdit className="inline mr-2" /> Edit Product
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 font-semibold border border-red-400/40 transition-all hover:scale-105 disabled:opacity-50"
          >
            <FaTrash className="inline mr-2" /> {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map(t => {
            const active = activeTab === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-3 rounded-xl font-semibold tracking-wide border transition-all ${
                  active
                    ? "bg-gradient-to-r from-yellow-300 to-amber-400 text-black border-gold shadow-lg shadow-gold/30"
                    : "bg-secondary/60 text-secondary border-white/10 hover:bg-secondary/80 hover:text-primary"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <AnimatePresence mode="wait">{tabContent[activeTab]}</AnimatePresence>
      </div>

      {/* Sticky Save Bar */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed left-0 right-0 bottom-0 z-50"
          >
            <div className="mx-auto max-w-6xl px-4 pb-4">
              <div className="rounded-2xl bg-gradient-to-r from-primary/95 to-gold/95 border border-white/30 backdrop-blur-xl shadow-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-black font-medium">Editing Mode Active</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-black font-semibold border border-black/20 transition-all hover:scale-105"
                  >
                    <FaTimes className="inline mr-2" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 border border-amber-100 text-white font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:scale-100"
                  >
                    <FaSave className="inline mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}