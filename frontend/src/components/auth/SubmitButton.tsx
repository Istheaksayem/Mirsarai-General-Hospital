import React from "react";

interface SubmitButtonProps {
  text: string;
  isSubmitting?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, isSubmitting = false }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full bg-tertiary text-black px-6 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-primary/40 transform hover:-translate-y-0.5 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
        }`}
    >
      {isSubmitting ? "Please wait..." : text}
    </button>
  );
};

export default SubmitButton;
