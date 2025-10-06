"use client";

export default function StepNavigation({
  currentStep = 1,
  steps = ["Basic Info", "Pricing", "Media", "SEO", "Variants", "Preview"],
  onStepClick,
  setStep, // fallback
}) {
  const progress =
    steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;

  const handleClick = (s) => {
    if (onStepClick) return onStepClick(s);
    if (setStep) setStep(s);
  };

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-primary/15 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Pills */}
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const step = index + 1;
          const isActive = currentStep === step;
          const isCompleted = currentStep > step;

          return (
            <div
              key={step}
              className="flex-1 flex items-center cursor-pointer group"
              onClick={() => handleClick(step)}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all ${
                  isActive
                    ? "bg-gold text-white border-gold shadow-md shadow-gold/30"
                    : isCompleted
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-secondary text-secondary border-white/10 group-hover:border-white/20"
                }`}
              >
                {isCompleted ? "✓" : step}
              </div>
              <span
                className={`ml-3 text-sm font-medium transition-colors ${
                  isActive ? "text-gold" : "text-secondary group-hover:text-primary"
                }`}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-primary/15 mx-3" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
