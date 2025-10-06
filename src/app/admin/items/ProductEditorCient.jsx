'use client';
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaImage, FaUpload, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-toastify";
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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [originalForm, setOriginalForm] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  const [form, setForm] = useState(() => ({
    name: "",
    description: "",
    category: "",
    material: "",
    mixedMetals: [],
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

  // Helper function to get proper image URL
  const getImageSrc = useCallback((imageItem) => {
    if (!imageItem) return null;

    // Handle string URLs (direct URLs)
    if (typeof imageItem === 'string') {
      // Check if it's a valid URL
      if (imageItem.startsWith('http') || imageItem.startsWith('/')) {
        return imageItem;
      }
      return null;
    }

    // Handle object with various URL properties
    if (imageItem && typeof imageItem === 'object') {
      // Fetch from the database path
      if (imageItem.path) return `/products/${imageItem.sku}/images/${imageItem.path}`; // Adjusted path

      // Cloudinary response
      if (imageItem.secure_url) return imageItem.secure_url;
      if (imageItem.url) return imageItem.url;
      
      // File preview
      if (imageItem.preview) return imageItem.preview;
      
      // MongoDB stored format
      if (imageItem.src) return imageItem.src;
    }

    // Handle File objects
    if (imageItem instanceof File) {
      return URL.createObjectURL(imageItem);
    }

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
          toast.error("Error loading product details."); // Toast notification
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      }
    };

    loadInitialData();
  }, [initialProduct, productId]);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      toast.success("Product updated successfully!");
      setEditing(false);
      setOriginalForm(form);
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (e) {
      console.error("Save error:", e);
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(originalForm);
    setEditing(false);
    toast.info("Changes cancelled");
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
    const primaryImageSrc = getImageSrc(form.image?.[0]);

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
              <Stat label="Price Type" value={form.priceType} />
              <Stat
                label="Price / Weight"
                value={
                  form.priceType === "fixed"
                    ? `₹${Number(form.fixedPrice || 0).toLocaleString("en-IN")}`
                    : `${form.weight || 0} g`
                }
              />
              <Stat label="Stock" value={form.stock} />
              <Stat label="Min Stock" value={form.minStock} />
              <Stat label="SKU" value={form.sku} />
              <Stat
                label="Dimensions"
                value={`${form.dimensions.length || "-"} × ${form.dimensions.width || "-"} × ${form.dimensions.height || "-"}`}
              />
              <Stat label="Variants" value={form.variants.length} />
              <Stat label="Engraving" value={form.customizationOptions.allowEngraving ? "Yes" : "No"} />
            </div>
          </div>
        </div>

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
            {["Rings","Necklaces","Earrings","Bracelets","Bangles","Pendants"].map(c => 
              <option key={c} value={c}>{c}</option>
            )}
          </ModernSelect>
        </Input>

        <Input label="Material" required>
          <ModernSelect
            value={form.material}
            onChange={(e) => setField("material", e.target.value)}
            disabled={!editing}
          >
            <option value="">Select Material</option>
            {["Gold","Silver","Platinum","Diamond","Mixed"].map(m => 
              <option key={m} value={m}>{m}</option>
            )}
          </ModernSelect>
        </Input>

        <Input label="Status" required>
          <ModernSelect
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            disabled={!editing}
          >
            {["Available","Low Stock","Out of Stock","Discontinued"].map(s => 
              <option key={s} value={s}>{s}</option>
            )}
          </ModernSelect>
        </Input>

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

        {form.material === "Mixed" && (
          <div className="md:col-span-2">
            <Input label="Mixed Metals">
              <ModernInput
                value={form.mixedMetals.join(", ")}
                onChange={(e) =>
                  setField("mixedMetals", e.target.value.split(",").map(v => v.trim()).filter(Boolean))
                }
                disabled={!editing}
                placeholder="e.g. Gold, Silver, Platinum"
              />
            </Input>
          </div>
        )}
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
              onChange={(e) => setField("priceType", e.target.value)}
            >
              <option value="fixed">Fixed Price</option>
              <option value="weight-based">Weight Based</option>
            </ModernSelect>
          </Input>
          
          {form.priceType === "fixed" && (
            <Input label="Fixed Price (₹)" required>
              <ModernInput
                type="number"
                value={form.fixedPrice}
                disabled={!editing}
                onChange={(e) => setField("fixedPrice", e.target.value)}
                placeholder="0.00"
              />
            </Input>
          )}
          
          {form.priceType === "weight-based" && (
            <Input label="Weight (grams)" required>
              <ModernInput
                type="number"
                value={form.weight}
                disabled={!editing}
                onChange={(e) => setField("weight", e.target.value)}
                placeholder="0.00"
              />
            </Input>
          )}
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
            disabled={true}
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

  const renderMedia = () => (
    <motion.div key="media" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-6">
      <SectionCard title="Media Gallery" cols={1}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-semibold text-primary">Current Images ({form.image?.length || 0})</h5>
            {editing && (
              <div className="flex items-center gap-2 text-xs text-secondary">
                <FaUpload className="text-gold" />
                <span>Edit mode: You can upload new images below</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {form.image && form.image.length > 0 ? (
              form.image.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-primary/5">
                  <ProductImage imageSrc={getImageSrc(img)} alt={`Product image ${idx + 1}`} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
                      <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                        Image {idx + 1}
                      </span>
                      {idx === 0 && (
                        <span className="text-gold text-xs bg-gold/20 px-2 py-1 rounded">
                          Main Image
                        </span>
                      )}
                      <button
                        onClick={() => {
                          // Handle image deletion
                          const updatedImages = form.image.filter((_, i) => i !== idx);
                          setField("image", updatedImages);
                          toast.success("Image deleted successfully!");
                        }}
                        className="text-white hover:text-gold transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-secondary border-2 border-dashed border-white/10 rounded-xl">
                <FaImage className="text-4xl opacity-40 mx-auto mb-4" />
                <p className="text-sm mb-2">No images uploaded yet</p>
                <p className="text-xs opacity-70">
                  {editing ? "Use the upload section below to add images" : "Enable editing mode to upload images"}
                </p>
              </div>
            )}
          </div>
        </div>

        {editing && (
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FaUpload className="text-gold" />
              <h5 className="text-sm font-semibold text-primary">Upload New Images</h5>
              <Badge color="amber">Editing Mode</Badge>
            </div>
            
            <StepMedia
  formData={{ 
    image: form.image || [],
    sku: form.sku
  }}
  onChange={(field, value) => {
    if (field === 'image') {
      setField('image', value); // Update the image field directly
    } else {
      setField(field, value);
    }
  }}
  onNestedChange={(parent, field, value) => setNested(parent, field, value)}
  uploadMode="immediate"
  showInstructions={true}
/>
          </div>
        )}
      </SectionCard>
    </motion.div>
  );

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
                    className="px-6 py-3 rounded-xl bg-black/20 hover:bg-black/30 text-black font-semibold border border-black/20 transition-all hover:scale-105"
                  >
                    <FaTimes className="inline mr-2" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-400 text-white font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:scale-100"
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