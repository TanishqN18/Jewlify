"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import StepNavigation from "../../../../components/admin/AddProduct/StepNaviagtion";
import StepBasicInfo from "../../../../components/admin/AddProduct/StepBasicInfo";
import StepPricing from "../../../../components/admin/AddProduct/StepPricing";
import StepMedia from "../../../../components/admin/AddProduct/StepMedia";
import SeoSettings from "../../../../components/admin/AddProduct/SeoSettings";
import ProductPreview from "../../../../components/admin/AddProduct/StepPreview";
import DesktopSaveBar from "../../../../components/admin/AddProduct/DesktopSavebar";
import StickySaveBar from "../../../../components/admin/AddProduct/StickySavebar";
import ProductVariants from "../../../../components/admin/AddProduct/StepVarient";
import VisibilitySettings from "../../../../components/admin/AddProduct/VissibilitySettings";

const TOTAL_STEPS = 6;

export default function AddItemPage() {
  const [step, setStep] = useState(1);
  const [loading, setSaving] = useState(false);
  const mediaUploadRef = useRef(null); // Reference to StepMedia's upload function

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    material: "",
    gemstones: [], // Add this missing field
    mixedMetals: [], // Add this missing field  
    tags: [],
    image: [],
    priceType: "fixed",
    fixedPrice: "",
    weight: "",
    stock: "",
    minStock: 5,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    slug: "",
    variants: [],
    status: "Available",
    isPublished: true,
    sku: "",
    dimensions: { length: "", width: "", height: "" },

    // Added: drives Order.items.customization defaults
    customizationOptions: {
      allowEngraving: false,
      maxEngravingLength: 20,
      allowSpecialInstructions: false,
      sizeOptions: [], // used to prefill selectable sizes on PDP/cart
    },
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNestedChange = (parent, child, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [child]: value },
    }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.material) newErrors.material = "Material is required";
        
        // Validate gemstones if material is Gemstone
        if (formData.material === "Gemstone" && (!formData.gemstones || formData.gemstones.length === 0)) {
          newErrors.gemstones = "Please select at least one gemstone";
        }
        
        // Validate mixed metals if material is Mixed
        if (formData.material === "Mixed" && (!formData.mixedMetals || formData.mixedMetals.length === 0)) {
          newErrors.mixedMetals = "Please select at least one metal combination";
        }
        break;
      case 2:
        if (formData.priceType === "fixed" && !formData.fixedPrice) {
          newErrors.fixedPrice = "Fixed price is required";
        }
        if (formData.priceType === "weight-based" && !formData.weight) {
          newErrors.weight = "Weight is required";
        }
        if (!formData.stock) newErrors.stock = "Stock quantity is required";
        break;
      case 4:
        // Add any necessary validation for SEO settings here
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  // Function to upload images to Cloudinary
  const uploadImagesToCloudinary = async () => {
    try {
      console.log('🚀 Starting image upload process...');
      console.log('📷 Current images:', formData.image);
      console.log('🏷️ Product SKU:', formData.sku);

      if (!formData.sku) {
        throw new Error('Product SKU is required for organized image upload');
      }

      // Check if StepMedia upload function is available
      if (!mediaUploadRef.current) {
        console.log('⚠️ No media upload function available, returning existing images');
        return formData.image; // Return existing images if no upload function
      }

      // Call the upload function from StepMedia
      const uploadedImages = await mediaUploadRef.current(formData.sku);
      console.log('✅ Images uploaded successfully:', uploadedImages);
      
      return uploadedImages;
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      throw error;
    }
  };

  // Save product with uploaded images
  const saveProductToDatabase = async (productData) => {
    try {
      console.log('💾 Saving product with data:', productData);

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors((prev) => ({ ...prev, sku: "SKU already exists" }));
          setStep(2);
        }
        throw new Error(data.error || data.message || 'Failed to save product');
      }

      console.log('✅ Product saved successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Product save failed:', error);
      throw error;
    }
  };

  // Main save function that handles the complete flow
  const handleSave = async () => {
    console.log("Save button clicked");
    console.log("Current formData:", formData); // Debug log
    setSaving(true);
    
    try {
      // Basic validations
      if (!validateStep(1) || !validateStep(2)) {
        console.log("Validation failed", errors);
        setSaving(false);
        return;
      }

      // Enforce SKU uniqueness before submit
      const sku = (formData.sku || "").trim();
      if (!sku) {
        console.log("SKU is required");
        setErrors((prev) => ({ ...prev, sku: "SKU is required" }));
        setStep(2);
        setSaving(false);
        return;
      }

      showToast('Checking SKU availability...', 'info');
      
      const chk = await fetch(`/api/admin/products/sku-available?sku=${encodeURIComponent(sku)}`, { cache: "no-store" });
      if (!chk.ok) throw new Error("SKU check failed");
      
      const { available } = await chk.json();
      if (!available) {
        console.log("SKU already exists");
        setErrors((prev) => ({ ...prev, sku: "SKU already exists" }));
        setStep(2);
        setSaving(false);
        return;
      }

      // Show uploading toast
      showToast('Uploading images to Cloudinary...', 'info');

      // First upload images to Cloudinary
      const uploadedImages = await uploadImagesToCloudinary();

      // Prepare submit data with uploaded images
      const submitData = {
        ...formData,
        imageUrls: uploadedImages,
        coverImage: uploadedImages[0] || "",
        gemstones: formData.gemstones || [], // Ensure gemstones are included
        mixedMetals: formData.mixedMetals || [], // Ensure mixedMetals are included
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

      console.log('📦 Final submit data:', submitData);

      // Show saving toast
      showToast('Saving product to database...', 'info');

      // Save product to database
      await saveProductToDatabase(submitData);

      // Success
      showToast('Product created successfully!', 'success');
      
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "/admin/items";
      }, 1500);

    } catch (err) {
      console.error('❌ Save process failed:', err);
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Validated next for in-step buttons
  const nextStep = () => {
    if (validateStep(step)) setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  // Plain navigation for save bars (no validation gate)
  const goNext = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const goPrev = () => setStep((prev) => Math.max(prev - 1, 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Step Navigation clicks (validate when moving forward)
  const handleStepClick = (stepNumber) => {
    if (stepNumber <= step) return setStep(stepNumber);
    if (validateStep(step)) setStep(stepNumber);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Step Navigation */}
      <div className="flex-shrink-0">
        <StepNavigation
          currentStep={step}
          steps={[
            "Basic Info",
            "Pricing",
            "Media",
            "SEO",
            "Variants",
            "Preview",
          ]}
          onStepClick={handleStepClick}
          setStep={setStep}
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={{ duration: 0.3 }}
            >
              <StepBasicInfo
                formData={formData}
                onChange={handleChange}
                errors={errors}
                onNext={nextStep}
                onPrevious={prevStep}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={{ duration: 0.3 }}
            >
              <StepPricing
                formData={formData}
                onChange={handleChange}
                onNestedChange={handleNestedChange}
                errors={errors}
                onNext={nextStep}
                onPrevious={prevStep}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={{ duration: 0.3 }}
            >
              <StepMedia
                formData={formData}
                onChange={handleChange}
                errors={errors}
                productSku={formData.sku} // Pass the SKU
                onUploadToCloudinary={mediaUploadRef} // Pass the ref
                uploadMode="deferred" // Use deferred mode
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={{ duration: 0.3 }}
            >
              <SeoSettings
                formData={formData}
                onChange={handleChange}
                errors={errors}
                onNext={nextStep}
                onPrevious={prevStep}
              />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={{ duration: 0.3 }}
            >
              <ProductVariants
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            </motion.div>
          )}

          {step === 6 && (
            <motion.div 
              key="step6" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={{ duration: 0.3 }}
            >
              <ProductPreview
                formData={formData}
                onSave={handleSave} // Ensure this is correctly passed
                loading={loading}
                onPrevious={prevStep}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Desktop Save Bar */}
      <div className="hidden lg:block">
        <DesktopSaveBar
          step={step}
          totalSteps={TOTAL_STEPS}
          onPrevious={goPrev}
          onNext={goNext}
          onSave={handleSave}
          loading={loading}
          canGoNext={step < TOTAL_STEPS}
          canGoPrev={step > 1}
          onStepChange={(s) => setStep(s)}
        />
      </div>

      {/* Mobile Sticky Save Bar */}
      <div className="lg:hidden">
        <StickySaveBar
          step={step}
          totalSteps={TOTAL_STEPS}
          onPrevious={goPrev}
          onNext={goNext}
          onSave={handleSave}
          loading={loading}
          canGoNext={step < TOTAL_STEPS}
          canGoPrev={step > 1}
          onStepChange={(s) => setStep(s)}
        />
      </div>
    </div>
  );
}
