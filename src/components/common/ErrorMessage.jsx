import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 text-center mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;