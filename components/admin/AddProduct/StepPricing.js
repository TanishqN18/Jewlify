"use client";

import { useEffect, useRef, useState } from "react";
import { FaRupeeSign, FaBalanceScale, FaCubes, FaHashtag, FaCube } from "react-icons/fa";

export default function StepPricing({
  formData = {},
  onChange,
  onNestedChange, // kept for consistency if you need it later
  errors = {},
}) {
  const {
    name = "",
    priceType = "fixed", // "fixed" | "weight-based"
    fixedPrice = "",
    weight = "",
    stock = "",
    minStock = 5,
    sku = "",
  } = formData;

  const [skuStatus, setSkuStatus] = useState("idle"); // idle | checking | available | taken | error
  const [skuMsg, setSkuMsg] = useState("");
  const debounceRef = useRef(null);

  const handle = (key, val) => onChange && onChange(key, val);

  const handlePriceType = (val) => {
    handle("priceType", val);
    if (val === "fixed") handle("weight", "");
    if (val === "weight-based") handle("fixedPrice", "");
  };

  const generateSku = () => {
    const prefix = (name || "SKU").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "SKU";
    const random = Math.floor(10000 + Math.random() * 90000);
    handle("sku", `${prefix}-${random}`);
  };

  // Debounced uniqueness check
  useEffect(() => {
    if (!sku?.trim()) {
      setSkuStatus("idle");
      setSkuMsg("");
      return;
    }
    setSkuStatus("checking");
    setSkuMsg("Checking availability…");

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/products/sku-available?sku=${encodeURIComponent(sku.trim())}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("check failed");
        const data = await res.json();
        if (data.available) {
          setSkuStatus("available");
          setSkuMsg("SKU is available");
        } else {
          setSkuStatus("taken");
          setSkuMsg("SKU already exists");
        }
      } catch {
        setSkuStatus("error");
        setSkuMsg("Could not verify SKU");
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [sku]);

  return (
    <div className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-lg font-bold text-primary mb-4">Pricing & Inventory</h3>

      {/* Price Type */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button
          type="button"
          onClick={() => handlePriceType("fixed")}
          className={`px-4 py-2 rounded-xl border text-sm flex items-center justify-center gap-2 transition-all ${
            priceType === "fixed"
              ? "border-gold/60 bg-gold/10 text-primary"
              : "border-white/15 text-secondary hover:text-primary hover:border-white/30"
          }`}
        >
          <FaRupeeSign className="text-xs" /> Fixed Price
        </button>
        <button
          type="button"
          onClick={() => handlePriceType("weight-based")}
          className={`px-4 py-2 rounded-xl border text-sm flex items-center justify-center gap-2 transition-all ${
            priceType === "weight-based"
              ? "border-gold/60 bg-gold/10 text-primary"
              : "border-white/15 text-secondary hover:text-primary hover:border-white/30"
          }`}
        >
          <FaBalanceScale className="text-xs" /> Weight-based
        </button>
      </div>

      {/* Price Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fixed Price */}
        <div className={`${priceType !== "fixed" ? "opacity-60" : ""}`}>
          <label className="block text-sm font-semibold text-secondary mb-2">Fixed Price (₹)</label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              value={fixedPrice}
              disabled={priceType !== "fixed"}
              onChange={(e) => handle("fixedPrice", e.target.value)}
              placeholder="2500"
              className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl pl-9 pr-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 transition-all text-sm disabled:cursor-not-allowed"
            />
            <FaRupeeSign className="absolute left-3 top-3.5 text-secondary/60" />
          </div>
          {errors?.fixedPrice && <p className="text-xs text-red-400 mt-1">{errors.fixedPrice}</p>}
        </div>

        {/* Approx Weight - Always displayed */}
        <div>
          <label className="block text-sm font-semibold text-secondary mb-2">Approx Weight (g)</label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => handle("weight", e.target.value)}
              placeholder="5.20"
              className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl pl-9 pr-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 transition-all text-sm"
            />
            <FaBalanceScale className="absolute left-3 top-3.5 text-secondary/60" />
          </div>
          {errors?.weight && <p className="text-xs text-red-400 mt-1">{errors.weight}</p>}
        </div>
      </div>

      {/* Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Stock */}
        <div>
          <label className="block text-sm font-semibold text-secondary mb-2">Stock Quantity</label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => handle("stock", e.target.value)}
              placeholder="0"
              className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl pl-9 pr-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 transition-all text-sm"
            />
            <FaCubes className="absolute left-3 top-3.5 text-secondary/60" />
          </div>
          {errors?.stock && <p className="text-xs text-red-400 mt-1">{errors.stock}</p>}
        </div>

        {/* Minimum Stock Alert */}
        <div>
          <label className="block text-sm font-semibold text-secondary mb-2">Minimum Stock Alert</label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={minStock}
              onChange={(e) => handle("minStock", e.target.value)}
              placeholder="5"
              className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-white/20 rounded-xl pl-9 pr-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 transition-all text-sm"
            />
            <FaCube className="absolute left-3 top-3.5 text-secondary/60" />
          </div>
        </div>
      </div>

      {/* SKU */}
      <div className="mt-4">
        <label className="block text-sm font-semibold text-secondary mb-2">SKU</label>
        <div className="relative">
          <input
            type="text"
            value={sku}
            onChange={(e) => handle("sku", e.target.value)}
            placeholder="SKU-XXXXX"
            className={`w-full bg-gradient-to-r from-primary/20 to-primary/10 border rounded-xl pl-9 pr-28 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:shadow-lg transition-all text-sm
              ${
                skuStatus === "taken"
                  ? "border-red-400 focus:border-red-400 shadow-red-400/20"
                  : skuStatus === "available"
                  ? "border-emerald-400 focus:border-emerald-400 shadow-emerald-400/20"
                  : "border-white/20 focus:border-gold focus:shadow-gold/20"
              }`}
          />
          <FaHashtag className="absolute left-3 top-3.5 text-secondary/60" />
          <button
            type="button"
            onClick={generateSku}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-lg border border-white/15 text-secondary hover:text-primary hover:border-white/30 transition-all"
          >
            Generate
          </button>
        </div>
        <div className={`mt-1 text-xs ${
          skuStatus === "taken" ? "text-red-400" :
          skuStatus === "available" ? "text-emerald-300" :
          "text-secondary"
        }`}>
          {skuMsg}
        </div>
        {errors?.sku && <p className="text-xs text-red-400 mt-1">{errors.sku}</p>}
      </div>

      <p className="mt-3 text-xs text-secondary">
        For weight-based items, final price is computed from current metal rates during checkout.
      </p>
    </div>
  );
}
