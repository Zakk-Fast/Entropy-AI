"use client";

export const LoadingScreen = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading Entropy AI...</span>
        </div>
      </div>
    </div>
  );
};
