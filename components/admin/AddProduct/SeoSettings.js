"use client";

import { motion } from "framer-motion";
import { FaGlobe, FaLink, FaTag, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function SeoSettings({
  formData = {},
  onChange,
  errors = {},
}) {
  const title = formData.seoTitle || "";
  const description = formData.seoDescription || "";
  const slug = formData.slug || "";

  const titleLength = title.length;
  const descLength = description.length;

  const handleChange = (key, value) => {
    onChange && onChange(key, value);
  };

  const handleSlugInput = (value) => {
    const normalized = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    onChange && onChange("slug", normalized);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-primary">SEO Settings</h3>
          <p className="text-secondary text-sm">Improve search visibility for this product</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Meta Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-secondary">Meta Title</label>
            <span className={`text-xs ${titleLength > 60 ? "text-red-400" : "text-secondary"}`}>
              {titleLength}/60
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => handleChange("seoTitle", e.target.value)}
              placeholder="Diamond Ring | Luxury Collection"
              className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm"
            />
            <FaTag className="absolute right-3 top-3.5 text-secondary/60" />
          </div>
          {errors?.seoTitle && (
            <p className="text-xs text-red-400 mt-1">{errors.seoTitle}</p>
          )}
          <p className="text-xs text-secondary mt-1">
            Aim for 50–60 characters. Include primary keywords and product name.
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-secondary">Meta Description</label>
            <span className={`text-xs ${descLength > 160 ? "text-red-400" : "text-secondary"}`}>
              {descLength}/160
            </span>
          </div>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => handleChange("seoDescription", e.target.value)}
            placeholder="Elegant 18k gold ring with solitaire diamond, perfect for engagements and special occasions."
            className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm resize-none"
          />
          {errors?.seoDescription && (
            <p className="text-xs text-red-400 mt-1">{errors.seoDescription}</p>
          )}
          <p className="text-xs text-secondary mt-1">
            Summarize the product in one sentence and include keywords. Keep under 160 characters.
          </p>
        </div>

        {/* URL Slug */}
        <div>
          <label className="block text-sm font-semibold text-secondary mb-2">URL Slug</label>
          <div className="flex items-stretch">
            <span className="px-3 py-3 bg-primary/10 border border-white/20 border-r-0 rounded-l-xl text-secondary text-sm">
              /products/
            </span>
            <div className="relative flex-1">
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugInput(e.target.value)}
                placeholder="diamond-ring"
                className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-r-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm"
              />
              <FaLink className="absolute right-3 top-3.5 text-secondary/60" />
            </div>
          </div>
          {errors?.slug && <p className="text-xs text-red-400 mt-1">{errors.slug}</p>}
          <p className="text-xs text-secondary mt-1">
            Use lowercase letters, numbers, and hyphens. Avoid special characters.
          </p>
        </div>
      </div>

      {/* Navigation */}
      {/* <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-primary hover:bg-white/5 hover:border-white/40 transition-all"
        >
          <FaChevronLeft className="text-xs" />
          <span className="text-sm font-semibold">Previous</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold via-yellow-500 to-amber-600 text-primary font-semibold shadow-lg hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.99] transition-all"
        >
          <span className="text-sm">Next</span>
          <FaChevronRight className="text-xs" />
        </button>
      </div> */}
    </motion.div>
  );
}
