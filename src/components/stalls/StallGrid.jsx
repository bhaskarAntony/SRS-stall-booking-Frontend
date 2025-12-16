import React from 'react';

const StallGrid = ({ 
  stalls = [], 
  layout = { rows: 10, columns: 10 }, 
  onStallSelect, 
  selectedStalls = [],
  readonly = false 
}) => {
  const { rows, columns } = layout;

  const getStallByPosition = (row, col) => {
    return stalls.find(s => s.row === row && s.column === col);
  };

  const getStallStatus = (stall) => {
    if (!stall) return 'inactive';
    return stall.status || 'available';
  };

  const isSelected = (stallId) => {
    return selectedStalls.some(s => s.stallId === stallId);
  };

  const getStallColor = (stall, status, selected) => {
    if (selected) return 'bg-purple-500 text-white border-purple-600';
    
    if (status === 'inactive') return 'bg-gray-200 border-gray-300 cursor-not-allowed';
    if (status === 'booked') return 'bg-red-500 text-white border-red-600 cursor-not-allowed';
    if (status === 'locked') return 'bg-yellow-500 text-white border-yellow-600 cursor-not-allowed';
    if (status === 'blocked') return 'bg-gray-500 text-white border-gray-600 cursor-not-allowed';
    
    // Available stalls - color by category
    const categoryColor = stall?.category?.color || '#3B82F6';
    return `border-2 cursor-pointer hover:opacity-80 transition-opacity text-white`
      + ` ${getCategoryColorClass(categoryColor)}`;
  };

  const getCategoryColorClass = (color) => {
    const colorMap = {
      '#EF4444': 'bg-red-500 border-red-600', // Red
      '#3B82F6': 'bg-blue-500 border-blue-600', // Blue  
      '#10B981': 'bg-green-500 border-green-600', // Green
      '#F59E0B': 'bg-amber-500 border-amber-600', // Amber
      '#8B5CF6': 'bg-violet-500 border-violet-600', // Violet
      '#EC4899': 'bg-pink-500 border-pink-600', // Pink
    };
    return colorMap[color] || 'bg-blue-500 border-blue-600';
  };

  const handleStallClick = (stall, row, col) => {
    if (readonly || !onStallSelect) return;
    
    if (!stall || stall.status !== 'available') return;
    
    onStallSelect(stall, row, col);
  };

  const renderGrid = () => {
    const grid = [];
    
    for (let row = 1; row <= rows; row++) {
      const rowStalls = [];
      
      for (let col = 1; col <= columns; col++) {
        const stall = getStallByPosition(row, col);
        const status = getStallStatus(stall);
        const selected = stall && isSelected(stall.stallId);
        const stallId = stall?.stallId || `R${row}-C${col}`;
        
        rowStalls.push(
          <div
            key={`${row}-${col}`}
            onClick={() => handleStallClick(stall, row, col)}
            className={`
              w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12
              flex items-center justify-center
              text-xs font-medium
              rounded border-2
              ${getStallColor(stall, status, selected)}
            `}
            title={stall ? 
              `${stallId} - ${stall.category?.name || 'No Category'} - ₹${stall.category?.price || 0}` : 
              'Inactive'
            }
          >
            <span className="hidden sm:block text-xs">{row}-{col}</span>
            <span className="sm:hidden">•</span>
          </div>
        );
      }
      
      grid.push(
        <div key={row} className="flex justify-center space-x-1">
          {rowStalls}
        </div>
      );
    }
    
    return grid;
  };

  return (
    <div className="space-y-1">
      {renderGrid()}
    </div>
  );
};

export default StallGrid;