import React from 'react';

const StallLegend = ({ categories = [] }) => {
  const legendItems = [
    { label: 'Available', color: 'bg-blue-500', description: 'Click to select' },
    { label: 'Selected', color: 'bg-purple-500', description: 'Your selection' },
    { label: 'Booked', color: 'bg-red-500', description: 'Already booked' },
    { label: 'Locked', color: 'bg-yellow-500', description: 'In process' },
    { label: 'Inactive', color: 'bg-gray-200', description: 'Not available' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
      
      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-600 mb-2">Categories:</p>
          <div className="grid grid-cols-1 gap-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    ₹{category.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Legend */}
      <div>
        <p className="text-xs text-gray-600 mb-2">Status:</p>
        <div className="grid grid-cols-1 gap-1">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded ${item.color} border`}></div>
              <div className="flex-1">
                <span className="text-xs font-medium text-gray-900">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  - {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StallLegend;