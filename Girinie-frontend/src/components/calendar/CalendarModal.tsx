import React from "react";
import LearningRate from "@/components/common/LearningRate";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  rate?: number;
  children?: React.ReactNode;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, rate, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          className="absolute right-4 top-4 text-2xl font-bold text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="mb-4 text-center text-xl font-semibold">캘린더 상세</h2>
        <div className="mb-4 flex justify-center">
          <LearningRate rate={rate} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default CalendarModal;
