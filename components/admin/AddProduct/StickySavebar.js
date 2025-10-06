"use client";

import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaSave, FaTimes, FaSpinner } from "react-icons/fa";

export default function StickySaveBar({
  step = 1,
  totalSteps = 5,
  onPrevious,
  onNext,
  onSave,
  onCancel,
  onStepChange, // fallback to change step here
  loading = false,
  canGoNext = true,
  canGoPrev = true,
}) {
  const isLastStep = step >= totalSteps;

  const handleCancel = () => {
    if (onCancel) return onCancel();
    if (typeof window !== "undefined") window.history.back();
  };

  const handlePrev = () => {
    if (onPrevious) return onPrevious();
    if (onStepChange) onStepChange(Math.max(1, step - 1));
  };

  const handleNext = () => {
    if (onNext) return onNext();
    if (onStepChange) onStepChange(Math.min(totalSteps, step + 1));
  };

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="relative bg-gradient-to-t from-secondary/95 via-secondary/90 to-secondary/80 backdrop-blur-lg border-t border-white/10 shadow-[0_-8px_24px_rgba(0,0,0,0.25)]">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-secondary">Step {step} of {totalSteps}</div>
            <div className="text-sm font-semibold text-primary">
              {isLastStep ? "Review & Save" : "Continue to next step"}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="p-2 rounded-lg border border-white/15 text-secondary hover:text-primary hover:border-white/30 transition-all"
            aria-label="Cancel"
          >
            <FaTimes className="text-xs" />
          </button>

          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev || loading}
            className="px-3 py-2 rounded-lg border border-white/15 text-primary hover:border-white/30 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Previous step"
          >
            <div className="flex items-center gap-1">
              <FaChevronLeft className="text-xs" />
              <span className="text-xs font-semibold">Prev</span>
            </div>
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={onSave}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold via-yellow-500 to-amber-600 text-primary font-semibold shadow-lg hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Save product"
            >
              <div className="flex items-center gap-2">
                {loading ? <FaSpinner className="animate-spin text-sm" /> : <FaSave className="text-sm" />}
                <span className="text-sm">{loading ? "Saving..." : "Save"}</span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext || loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 text-primary font-semibold shadow-lg hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Next step"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">Next</span>
                <FaChevronRight className="text-sm" />
              </div>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
