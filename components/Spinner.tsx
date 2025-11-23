import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-400 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
};