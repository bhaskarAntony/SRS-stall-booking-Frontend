import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckIcon,
  PaintBrushIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { eventService } from '../../services/eventService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import toast from 'react-hot-toast';

const AdminStallSetup = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [gridSize, setGridSize] = useState({ rows: 10, columns: 10 });
  const [selectedStalls, setSelectedStalls] = useState(new Set());
  const [stallCategories, setStallCategories] = useState({});
  const [selectionMode, setSelectionMode] = useState('select');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const categoriesById = React.useMemo(() => {
    const map = {};
    event?.categories?.forEach((c) => {
      map[c._id] = c;
    });
    return map;
  }, [event]);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEvent(id);
      const eventData = response.event;
      setEvent(eventData);

      if (eventData.stallLayout?.activeStalls) {
        const activeStalls = new Set();
        const categories = {};

        eventData.stallLayout.activeStalls.forEach((stall) => {
          const stallKey = `${stall.row}-${stall.column}`;
          activeStalls.add(stallKey);
          if (stall.category) {
            // Here we preserve full category object for now
            categories[stallKey] = stall.category;
          }
        });

        setSelectedStalls(activeStalls);
        setStallCategories(categories);
        setGridSize({
          rows: eventData.stallLayout.rows || 10,
          columns: eventData.stallLayout.columns || 10,
        });
      }
    } catch (e) {
      console.error('Failed to fetch event:', e);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stallKeyFrom = (row, col) => `${row}-${col}`;

  const handleStallToggle = (row, col) => {
    const key = stallKeyFrom(row, col);

    if (selectionMode === 'select') {
      const next = new Set(selectedStalls);
      if (next.has(key)) {
        next.delete(key);
        const nextCats = { ...stallCategories };
        delete nextCats[key];
        setStallCategories(nextCats);
      } else {
        next.add(key);
      }
      setSelectedStalls(next);
    } else if (selectionMode === 'category' && activeCategoryId) {
      if (selectedStalls.has(key)) {
        const cat = categoriesById[activeCategoryId];
        if (!cat) return;
        setStallCategories((prev) => ({
          ...prev,
          [key]: {
            _id: cat._id,
            name: cat.name,
            price: cat.price,
            color: cat.color,
          },
        }));
      }
    }
  };

  const handleMouseDown = (row, col) => {
    setIsDragging(true);
    handleStallToggle(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (!isDragging) return;
    if (selectionMode !== 'select') return;

    const key = stallKeyFrom(row, col);
    const next = new Set(selectedStalls);
    next.add(key);
    setSelectedStalls(next);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectAll = () => {
    const all = new Set();
    for (let r = 1; r <= gridSize.rows; r++) {
      for (let c = 1; c <= gridSize.columns; c++) {
        all.add(stallKeyFrom(r, c));
      }
    }
    setSelectedStalls(all);
  };

  const clearAll = () => {
    setSelectedStalls(new Set());
    setStallCategories({});
  };

  const applyCategoryBulk = (cat) => {
    if (!selectedStalls.size) {
      toast.error('Select stalls first');
      return;
    }
    const next = { ...stallCategories };
    selectedStalls.forEach((k) => {
      next[k] = { _id: cat._id, name: cat.name, price: cat.price, color: cat.color };
    });
    setStallCategories(next);
    toast.success(`Applied ${cat.name} to ${selectedStalls.size} stalls`);
  };

  const getStallVisual = (row, col) => {
    const key = stallKeyFrom(row, col);
    const selected = selectedStalls.has(key);
    const cat = stallCategories[key];

    if (cat) {
      return {
        bg: cat.color || '#F97316',
        border: selected ? '#111827' : 'transparent',
        text: '#FFFFFF',
        label: cat.name,
      };
    }

    if (selected) {
      return {
        bg: '#0EA5E9',
        border: '#111827',
        text: '#FFFFFF',
        label: '',
      };
    }

    return {
      bg: '#F3F4F6',
      border: '#E5E7EB',
      text: '#6B7280',
      label: '',
    };
  };

  const handleSave = async () => {
    if (!selectedStalls.size) {
      toast.error('Select at least one stall');
      return;
    }

    const uncategorized = Array.from(selectedStalls).filter(
      (k) => !stallCategories[k],
    );

    if (uncategorized.length) {
      toast.error(
        `Assign categories to all selected stalls (${uncategorized.length} remaining)`,
      );
      return;
    }

    try {
      setSaving(true);

      const activeStalls = Array.from(selectedStalls).map((key) => {
        const [rowStr, colStr] = key.split('-');
        const row = parseInt(rowStr, 10);
        const column = parseInt(colStr, 10);
        const cat = stallCategories[key];

        return {
          stallId: `R${row}-C${column}`,
          row,
          column,
          category: {
            name: cat.name,
            price: cat.price,
            color: cat.color,
          },
          isActive: true,
        };
      });

      await eventService.setupEventStalls(id, { activeStalls });
      toast.success(`Configured ${activeStalls.length} stalls`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="sm" text="Loading stall setup..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4 sm:pt-6">
        <ErrorMessage message={error} onRetry={fetchEvent} />
      </div>
    );
  }

  const totalStalls = gridSize.rows * gridSize.columns;
  const categorizedCount = Object.keys(stallCategories).length;
  const remaining = selectedStalls.size - categorizedCount;

  return (
    <div
      className="min-h-screen bg-slate-50"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/admin/events"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
                Stall layout
              </p>
              <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900 truncate">
                {event?.name}
              </h1>
              <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
                Tap and drag to select stalls, then apply categories.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <p className="hidden sm:inline text-[11px] text-slate-500">
              {selectedStalls.size} selected
            </p>
            <button
              onClick={handleSave}
              disabled={saving || !selectedStalls.size}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-60"
            >
              {saving ? (
                <LoadingSpinner size="xs" />
              ) : (
                <CheckIcon className="h-3.5 w-3.5" />
              )}
              <span>{saving ? 'Saving...' : 'Save layout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Seat map style grid */}
          <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Layout ({gridSize.rows} × {gridSize.columns})
                </p>
                <p className="text-[11px] text-slate-500">
                  Drag to select multiple stalls like a seat map.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  onClick={selectAll}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-700 hover:bg-slate-50"
                >
                  Select all
                </button>
                <button
                  onClick={clearAll}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-rose-600 hover:bg-rose-50"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="relative overflow-auto rounded-lg border border-slate-100 bg-slate-50/80 p-2 sm:p-3">
              {/* Column labels */}
              <div className="ml-8 flex justify-center gap-1 mb-1">
                {Array.from({ length: gridSize.columns }, (_, c) => (
                  <div
                    key={c}
                    className="w-7 h-4 sm:w-8 sm:h-4 text-[10px] text-slate-400 text-center"
                  >
                    {c + 1}
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                {Array.from({ length: gridSize.rows }, (_, r) => {
                  const row = r + 1;
                  return (
                    <div
                      key={row}
                      className="flex items-center gap-1 justify-center"
                    >
                      {/* Row label */}
                      <div className="w-6 text-[10px] text-slate-400 text-right pr-1">
                        {row}
                      </div>
                      {Array.from({ length: gridSize.columns }, (_, c) => {
                        const col = c + 1;
                        const key = stallKeyFrom(row, col);
                        const { bg, border, text } = getStallVisual(row, col);
                        return (
                          <button
                            key={key}
                            type="button"
                            onMouseDown={() => handleMouseDown(row, col)}
                            onMouseEnter={() => handleMouseEnter(row, col)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[9px] sm:text-[10px] font-medium focus:outline-none"
                            style={{
                              backgroundColor: bg,
                              borderColor: border,
                              borderWidth: 1.5,
                              color: text,
                            }}
                            title={key}
                          >
                            •
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Right panel: modes + categories + stats */}
          <section className="space-y-3 sm:space-y-4">
            {/* Mode */}
            <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-3.5">
              <p className="text-xs font-semibold text-slate-900 mb-2">
                Selection mode
              </p>
              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectionMode('select')}
                  className={`flex-1 rounded-full border px-2.5 py-1 ${
                    selectionMode === 'select'
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  Select stalls
                </button>
                <button
                  type="button"
                  onClick={() => setSelectionMode('category')}
                  className={`flex-1 rounded-full border px-2.5 py-1 ${
                    selectionMode === 'category'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  Apply category
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-3.5">
              <p className="text-xs font-semibold text-slate-900 mb-2">
                Categories
              </p>
              <div className="space-y-2">
                {event?.categories?.length ? (
                  event.categories.map((cat) => {
                    const active = activeCategoryId === cat._id;
                    return (
                      <div
                        key={cat._id}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setActiveCategoryId(
                              activeCategoryId === cat._id ? null : cat._id,
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white"
                          style={{ borderColor: cat.color }}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {cat.name}
                          </p>
                          <p className="mt-0.5 flex items-center text-[11px] text-slate-500">
                            <CurrencyRupeeIcon className="mr-1 h-3 w-3" />
                            {cat.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyCategoryBulk(cat)}
                          disabled={!selectedStalls.size}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          <PaintBrushIcon className="h-3 w-3" />
                          Apply
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[11px] text-slate-500">
                    No categories defined for this event.
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-3.5">
              <p className="text-xs font-semibold text-slate-900 mb-2">
                Summary
              </p>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total stalls</span>
                  <span className="font-medium text-slate-900">
                    {totalStalls}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected</span>
                  <span className="font-medium text-sky-700">
                    {selectedStalls.size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Categorized</span>
                  <span className="font-medium text-emerald-700">
                    {categorizedCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remaining</span>
                  <span className="font-medium text-orange-600">
                    {remaining > 0 ? remaining : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-3.5">
              <p className="text-xs font-semibold text-slate-900 mb-2">
                Legend
              </p>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded bg-slate-200 border border-slate-300" />
                  <span className="text-slate-600">Inactive</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded bg-sky-500 border border-slate-800" />
                  <span className="text-slate-600">Selected (no category)</span>
                </div>
                {event?.categories?.map((cat) => (
                  <div key={cat._id} className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded border"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-600">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminStallSetup;
