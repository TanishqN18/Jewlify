"use client";

import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaSave, FaTimes, FaSpinner } from "react-icons/fa";

export default function DesktopSaveBar({
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
      className="hidden lg:block sticky bottom-0 w-full border-t border-white/10 backdrop-blur-md"
    >
      <div className="bg-gradient-to-t from-secondary/95 via-secondary/90 to-secondary/80 shadow-[0_-8px_24px_rgba(0,0,0,0.25)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="text-sm text-secondary">
            Step {step} of {totalSteps}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={handleCancel}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-secondary hover:text-primary hover:border-white/30 transition-all"
              aria-label="Cancel"
            >
              <FaTimes className="text-xs opacity-80 group-hover:opacity-100" />
              <span className="text-sm font-medium">Cancel</span>
            </button>

            <button
              type="button"
              onClick={handlePrev}
              disabled={!canGoPrev || loading}
              className="inline-flex items-center gap-2 px-4 py-2  rounded-xl border border-white/15 text-primary hover:border-white/30 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous step"
            >
              <FaChevronLeft className="text-xs" />
              <span className="text-sm font-semibold">Previous</span>
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className="group inline-flex items-center gap-3 px-6 py-2 rounded-xl bg-gradient-to-r from-green-300 via-emerald-500 to-green-600 text-primary font-semibold shadow-lg hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Save product"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="group-hover:rotate-6 transition-transform" />
                    <span>Save Product</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext || loading}
                className="group inline-flex items-center gap-3 px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 text-primary font-semibold shadow-lg hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Next step"
              >
                <span>Next</span>
                <FaChevronRight className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
