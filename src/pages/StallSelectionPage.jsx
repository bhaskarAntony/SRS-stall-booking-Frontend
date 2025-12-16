// src/pages/StallSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { eventService } from '../services/eventService';
import { useBookingStore } from '../store/bookingStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import toast from 'react-hot-toast';

/**
 * Small inline StallGrid with full orange/blue ticket style
 * Uses status fields: status: 'available' | 'booked' | 'locked-other'
 */
// const StallGrid = ({
//   stalls,
//   layout,
//   selectedStalls,
//   lockedStalls,
//   onStallSelect,
//   readonly,
// }) => {
//   const isSelected = (stallId) =>
//     selectedStalls.some((s) => s.stallId === stallId);
//   const isLockedByYou = (stallId) =>
//     lockedStalls && lockedStalls.includes(stallId);

//   const getStallClasses = (stall) => {
//     const base =
//       'flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border text-[11px] sm:text-xs font-semibold transition-colors';

//     if (stall.status === 'booked') {
//       return (
//         base +
//         ' bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed line-through'
//       );
//     }

//     if (stall.status === 'locked-other') {
//       return (
//         base +
//         ' bg-amber-200 border-amber-300 text-amber-900 cursor-not-allowed'
//       );
//     }

//     if (isLockedByYou(stall.stallId)) {
//       return (
//         base +
//         ' bg-emerald-500 border-emerald-500 text-white shadow-[0_0_0_1px_rgba(16,185,129,0.5)]'
//       );
//     }

//     if (isSelected(stall.stallId)) {
//       return (
//         base +
//         ' bg-orange-500 border-orange-500 text-white shadow-[0_0_0_1px_rgba(249,115,22,0.5)]'
//       );
//     }

//     // available
//     return (
//       base +
//       ' bg-slate-50 border-slate-300 text-slate-700 hover:bg-orange-50 hover:border-orange-300 cursor-pointer'
//     );
//   };

//   const handleClick = (stall) => {
//     if (readonly) return;
//     if (stall.status === 'booked' || stall.status === 'locked-other') return;
//     onStallSelect(stall);
//   };

//   const rows = Array.from({ length: layout.rows || 0 }, (_, r) => r + 1);
//   const cols = Array.from({ length: layout.columns || 0 }, (_, c) => c + 1);

//   return (
//     <div className="inline-flex flex-col gap-2 bg-slate-50 rounded-2xl px-4 py-4 border border-slate-200">
//       {rows.map((row) => (
//         <div key={row} className="flex gap-2 justify-center">
//           {cols.map((col) => {
//             const stall =
//               stalls.find((s) => s.row === row && s.column === col) || null;

//             if (!stall) {
//               return (
//                 <div
//                   key={`${row}-${col}`}
//                   className="h-10 w-10 sm:h-11 sm:w-11"
//                 />
//               );
//             }

//             return (
//               <button
//                 key={stall.stallId}
//                 type="button"
//                 onClick={() => handleClick(stall)}
//                 className={getStallClasses(stall)}
//               >
//                 {stall.stallId}
//               </button>
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

const StallGrid = ({
  stalls,
  layout,
  selectedStalls,
  lockedStalls,
  onStallSelect,
  readonly,
}) => {
  const isSelected = (stallId) =>
    selectedStalls.some((s) => s.stallId === stallId);
  const isLockedByYou = (stallId) =>
    lockedStalls && lockedStalls.includes(stallId);

  const getStallState = (stall) => {
    if (!stall) return 'empty';
    if (stall.status === 'booked') return 'booked';
    if (stall.status === 'locked-other') return 'locked-other';
    if (isLockedByYou(stall.stallId)) return 'locked-you';
    if (isSelected(stall.stallId)) return 'selected';
    return 'available';
  };

  const getClasses = (state) => {
    const base =
      'flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border text-[11px] sm:text-xs font-semibold transition-colors';
    switch (state) {
      case 'booked':
        return (
          base +
          ' bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed line-through'
        );
      case 'locked-other':
        return (
          base +
          ' bg-amber-100 border-amber-200 text-amber-800 cursor-not-allowed'
        );
      case 'locked-you':
        return (
          base +
          ' bg-emerald-500 border-emerald-500 text-white shadow-[0_0_0_1px_rgba(16,185,129,0.5)]'
        );
      case 'selected':
        return (
          base +
          ' bg-orange-500 border-orange-500 text-white shadow-[0_0_0_1px_rgba(249,115,22,0.5)]'
        );
      case 'available':
        return (
          base +
          ' bg-slate-50 border-slate-300 text-slate-700 hover:bg-orange-50 hover:border-orange-300 cursor-pointer'
        );
      case 'empty':
      default:
        return (
          base +
          ' bg-slate-100 border-slate-200 text-slate-300 cursor-default'
        );
    }
  };

  const handleClick = (stall, state) => {
    if (readonly) return;
    if (!stall) return;
    if (state === 'booked' || state === 'locked-other') return;
    onStallSelect(stall);
  };

  const rows = Array.from({ length: layout.rows || 0 }, (_, r) => r + 1);
  const cols = Array.from({ length: layout.columns || 0 }, (_, c) => c + 1);

  return (
    <div className="inline-flex flex-col gap-1.5 bg-slate-50 rounded-2xl px-4 py-4 border border-slate-200">
      {rows.map((row) => (
        <div key={row} className="flex gap-1.5 justify-center">
          {cols.map((col) => {
            // adapt this matching to your data shape (row/column or stallId)
            const stall =
              stalls.find((s) => s.row === row && s.column === col) || null;
            const state = getStallState(stall);
            return (
              <button
                key={stall?.stallId || `${row}-${col}`}
                type="button"
                onClick={() => handleClick(stall, state)}
                className={getClasses(state)}
              >
                {stall ? stall.stallId : ''}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const StallSelectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedStalls,
    setSelectedStalls,
    lockStalls,
    releaseStalls,
    getLockedStalls,
    lockedStalls,
    lockExpiry,
    totalAmount,
    setCurrentEvent,
  } = useBookingStore();

  const [event, setEvent] = useState(null);
  const [stalls, setStalls] = useState([]);
  const [layout, setLayout] = useState({ rows: 10, columns: 10 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lockingStalls, setLockingStalls] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetchEventStalls();
    getLockedStalls(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!lockExpiry) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = lockExpiry - now;

      if (diff <= 0) {
        setTimeLeft(null);
        releaseStalls(id);
        toast.error('Stall selection expired. Please select again.');
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockExpiry, id, releaseStalls]);

  const fetchEventStalls = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventResponse, stallsResponse] = await Promise.all([
        eventService.getEvent(id),
        eventService.getEventStalls(id),
      ]);

      setEvent(eventResponse.event);
      setStalls(stallsResponse.stalls || []);
      setLayout(stallsResponse.layout || { rows: 10, columns: 10 });
      setCategories(stallsResponse.categories || []);
      setCurrentEvent(eventResponse.event);
    } catch (err) {
      console.error('Failed to fetch event stalls:', err);
      setError('Failed to load stall information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStallSelect = (stall) => {
    if (lockedStalls && lockedStalls.length > 0) {
      toast.error(
        'You already have locked stalls. Proceed to checkout or release them first.',
      );
      return;
    }

    const already = selectedStalls.some((s) => s.stallId === stall.stallId);

    if (already) {
      setSelectedStalls(
        selectedStalls.filter((s) => s.stallId !== stall.stallId),
      );
    } else {
      setSelectedStalls([...selectedStalls, stall]);
    }
  };

  const handleLockStalls = async () => {
    if (selectedStalls.length === 0) {
      toast.error('Please select at least one stall.');
      return;
    }

    setLockingStalls(true);
    const stallIds = selectedStalls.map((s) => s.stallId);
    const result = await lockStalls(stallIds, id);

    if (result.success) {
      toast.success(`${stallIds.length} stalls locked for 5 minutes.`);
    } else {
      toast.error(result.message);
    }

    setLockingStalls(false);
  };

  const handleReleaseStalls = async () => {
    const result = await releaseStalls(id);

    if (result.success) {
      toast.success('Stalls released successfully.');
      await fetchEventStalls();
    } else {
      toast.error(result.message);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="sm" text="Loading stall information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-4 sm:pt-6">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
          <ErrorMessage message={error} onRetry={fetchEventStalls} />
        </div>
      </div>
    );
  }

  const hasLocked = lockedStalls && lockedStalls.length > 0;
  const displayStalls = hasLocked
    ? stalls.filter((s) => lockedStalls.includes(s.stallId))
    : selectedStalls;

  const totalStalls = event?.stallLayout?.totalStalls || 0;
  const availableStallsCount = event?.availableStalls ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
                Stall selection
              </p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {event?.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Tap on the layout to choose your stalls. Orange = selected, green = locked.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {timeLeft && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 border border-amber-100">
                <ClockIcon className="h-3.5 w-3.5" />
                <span>Time left: {timeLeft}</span>
              </div>
            )}
            <p className="hidden sm:block text-[11px] text-slate-500">
              {availableStallsCount} of {totalStalls} stalls available
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 pb-24 sm:pb-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-5">
            {/* Grid */}
            <section className="xl:col-span-3 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-900">
                    Stall layout ({layout.rows} × {layout.columns})
                  </p>
                  <p className="text-[11px] text-slate-500 hidden sm:block">
                    Drag horizontally if layout is wide
                  </p>
                </div>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-max flex justify-center">
                    <StallGrid
                      stalls={stalls}
                      layout={layout}
                      onStallSelect={handleStallSelect}
                      selectedStalls={selectedStalls}
                      lockedStalls={lockedStalls || []}
                      readonly={hasLocked}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Side column */}
            <aside className="space-y-3">
              {/* Legend */}
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-900 mb-2.5">
                  Legend
                </h3>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm border border-slate-300 bg-slate-50" />
                    <span className="text-slate-600">Available</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm border border-orange-500 bg-orange-500" />
                    <span className="text-slate-600">Selected</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm border border-emerald-500 bg-emerald-500" />
                    <span className="text-slate-600">Locked by you</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm border border-amber-300 bg-amber-200" />
                    <span className="text-slate-600">Held by others</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm border border-slate-300 bg-slate-200" />
                    <span className="text-slate-600">Booked</span>
                  </div>
                </div>
              </div>

              {/* Categories (color legend for pricing) */}
              {categories && categories.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2.5">
                    Stall categories
                  </h3>
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-[12px] font-medium text-slate-900">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[12px] text-slate-700">
                          ₹{cat.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selection summary */}
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-900 mb-2.5">
                  {hasLocked ? 'Locked stalls' : 'Selected stalls'}
                </h3>

                {displayStalls && displayStalls.length > 0 ? (
                  <>
                    <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                      {displayStalls.map((stall) => (
                        <div
                          key={stall.stallId}
                          className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2"
                        >
                          <div>
                            <p className="text-[12px] font-medium text-slate-900">
                              {stall.stallId}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {stall.category?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[12px] font-semibold text-slate-900">
                              ₹
                              {stall.category?.price
                                ? stall.category.price.toLocaleString()
                                : 0}
                            </p>
                            {hasLocked && (
                              <CheckIcon className="h-3.5 w-3.5 text-emerald-600 mx-auto mt-0.5" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-200 mt-3 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-slate-900">
                          Total amount
                        </span>
                        <div className="flex items-center text-lg font-bold text-emerald-600">
                          <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                          <span>{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="py-4 text-center text-[12px] text-slate-500">
                    No stalls selected yet.
                  </p>
                )}
              </div>

              {/* Desktop actions */}
              <div className="hidden sm:block space-y-2">
                {hasLocked ? (
                  <>
                    <button
                      type="button"
                      onClick={handleProceedToCheckout}
                      className="w-full inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Proceed to checkout
                    </button>
                    <button
                      type="button"
                      onClick={handleReleaseStalls}
                      className="w-full rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Release & reselect
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleLockStalls}
                      disabled={
                        selectedStalls.length === 0 || lockingStalls
                      }
                      className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {lockingStalls
                        ? 'Locking stalls...'
                        : selectedStalls.length > 0
                        ? `Lock ${selectedStalls.length} stall${
                            selectedStalls.length > 1 ? 's' : ''
                          }`
                        : 'Lock stalls'}
                    </button>
                    {selectedStalls.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedStalls([])}
                        className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Clear selection
                      </button>
                    )}
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="sm:hidden fixed inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur px-3 py-2.5"  style={{bottom:"63px"}}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500">
              {displayStalls.length} stall
              {displayStalls.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center text-sm font-semibold text-emerald-600">
              <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
              <span>{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {hasLocked ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReleaseStalls}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-[11px] font-medium text-rose-700"
              >
                Release
              </button>
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="rounded-full bg-emerald-600 px-4 py-1.5 text-[11px] font-semibold text-white"
              >
                Checkout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {selectedStalls.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedStalls([])}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-700"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={handleLockStalls}
                disabled={
                  selectedStalls.length === 0 || lockingStalls
                }
                className="rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {lockingStalls ? 'Locking...' : 'Lock & continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StallSelectionPage;
