import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'; //
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Download, Loader2, ArrowLeft, Layers, RotateCcw, Trash2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTierStore } from '../../store/useTierStore';
import TierRow from './TierRow';
import DraggableSearchResult from '../search/DraggableSearchResult';
import type { Movie, Tier } from '../../types';
import { useScreenshot } from '../../hooks/useScreenshot';

export default function TierBoard() {
  const moviesPool = useTierStore((state) => state.moviesPool);
  const tiers = useTierStore((state) => state.tiers);
  const addMovieToTier = useTierStore((state) => state.addMovieToTier);
  const updateTierMovies = useTierStore((state) => state.updateTierMovies);
  const removeFromPool = useTierStore((state) => state.removeFromPool);
  
  const resetTierList = useTierStore((state) => state.resetTierList);
  const resetAll = useTierStore((state) => state.resetAll);
  
  const { takeScreenshot, isDownloading } = useScreenshot();
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

  useEffect(() => {
    document.title = "WatchTier - My Ranking Board";
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function findTier(id: string | number): Tier | undefined {
    const tierById = tiers.find((t) => t.id === id);
    if (tierById) return tierById;
    return tiers.find((t) => t.movies.some((m) => m.id === id));
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const data = active.data.current;
    if (data?.movie) {
      setActiveMovie(data.movie);
    } else {
      const allMovies = tiers.flatMap((t) => t.movies);
      const found = allMovies.find((m) => m.id === active.id);
      if (found) setActiveMovie(found);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveMovie(null);

    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (active.data.current?.type === 'POOL_ITEM' || active.data.current?.type === 'SEARCH_ITEM') {
      const movie = active.data.current.movie as Movie;
      const targetTier = findTier(overId);
      if (targetTier) addMovieToTier(movie, targetTier.id);
      return;
    }

    const activeTier = findTier(activeId);
    const overTier = findTier(overId);

    if (!activeTier || !overTier) return;

    if (activeTier.id === overTier.id) {
      const oldIndex = activeTier.movies.findIndex((m) => m.id === activeId);
      const newIndex = overTier.movies.findIndex((m) => m.id === overId);
      if (oldIndex !== newIndex && newIndex !== -1) {
        const newMovies = arrayMove(activeTier.movies, oldIndex, newIndex);
        updateTierMovies(activeTier.id, newMovies);
      }
    } else {
      const movieToMove = activeTier.movies.find((m) => m.id === activeId);
      if (!movieToMove) return;
      
      const newActiveTierMovies = activeTier.movies.filter((m) => m.id !== activeId);
      updateTierMovies(activeTier.id, newActiveTierMovies);

      const newOverTierMovies = [...overTier.movies];
      const overIndex = overTier.movies.findIndex((m) => m.id === overId);
      if (overIndex >= 0) newOverTierMovies.splice(overIndex, 0, movieToMove);
      else newOverTierMovies.push(movieToMove);
      updateTierMovies(overTier.id, newOverTierMovies);
    }
  }

  const hasRankedMovies = tiers.some(t => t.movies.length > 0);
  const hasAnyMovies = moviesPool.length > 0 || hasRankedMovies;
  const totalRankedCount = tiers.reduce((sum, t) => sum + t.movies.length, 0);

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="relative min-h-screen pb-20 bg-background">
        
        {/* Background Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-primary/8 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[800px] h-[800px] bg-secondary/8 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-12">
          
          {/* --- HEADER --- */}
          <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 pb-8 border-b border-white/5 animate-fade-in-up">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-6 w-full xl:w-auto">
              <Link 
                to="/" 
                className="p-3.5 rounded-2xl bg-surface hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105 border border-white/5 shadow-lg group"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Link>
              <div className="text-left space-y-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Ranking Board
                </h1>
                <div className="flex items-center gap-3 text-sm">
                  <p className="text-slate-500 font-medium">Drag and drop to organize your tier list</p>
                  {totalRankedCount > 0 && (
                    <>
                      <span className="text-slate-700">•</span>
                      <span className="text-primary font-bold">{totalRankedCount} Ranked</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3 w-full xl:w-auto">
              {/* Reset Ranking */}
              <button
                onClick={() => window.confirm('Reset all ranking positions? (Movies will return to collection)') && resetTierList()}
                disabled={!hasRankedMovies}
                className="btn-secondary flex-1 xl:flex-initial disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
                title="Reset Ranking"
              >
                <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
                <span className="hidden sm:inline text-sm font-semibold">Reset</span>
              </button>

              {/* Delete All */}
              <button
                onClick={() => window.confirm('Delete EVERYTHING? This cannot be undone!') && resetAll()}
                disabled={!hasAnyMovies}
                className="btn-secondary hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed flex-1 xl:flex-initial group"
                title="Delete Everything"
              >
                <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline text-sm font-semibold">Clear All</span>
              </button>

              <div className="hidden xl:block w-px h-10 bg-white/10" />

              {/* Export Button (Primary) */}
              <button
                onClick={() => takeScreenshot('tier-list-export')}
                disabled={isDownloading || !hasRankedMovies}
                className="btn-primary px-8 py-3 flex items-center gap-2.5 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex-1 xl:flex-initial"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                <span className="text-sm font-bold tracking-wide">Save as Image</span>
              </button>
            </div>
          </header>

          {/* --- TIER BOARD AREA --- */}
          <div 
            id="tier-list-export"
            className="rounded-[32px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-1.5 shadow-2xl animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="p-8 md:p-10 bg-[#0B0E14]/95 backdrop-blur-xl rounded-[28px] border border-white/5 space-y-2">
              {/* Tier Rows */}
              {tiers.map((tier, index) => (
                <div 
                  key={tier.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <TierRow tier={tier} />
                </div>
              ))}
              
              {/* Watermark Section */}
              <div className="pt-8 mt-6 border-t border-white/5">
                <div className="flex items-center justify-center gap-4 opacity-15">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-white to-transparent" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[11px] font-black tracking-[0.5em] uppercase text-white">
                      WatchTier
                    </span>
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-white to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* --- UNRANKED COLLECTION --- */}
          <section className="pt-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 rounded-2xl text-white shadow-lg">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Unranked Collection
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {moviesPool.length} {moviesPool.length === 1 ? 'item' : 'items'} ready to rank
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              {hasAnyMovies && (
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="flex flex-col items-end">
                    <span className="text-slate-500 font-medium">Ranked</span>
                    <span className="text-xl font-black text-primary">{totalRankedCount}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col items-end">
                    <span className="text-slate-500 font-medium">Unranked</span>
                    <span className="text-xl font-black text-secondary">{moviesPool.length}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Collection Grid */}
            {moviesPool.length === 0 ? (
              <div className="glass-panel rounded-3xl p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10 bg-transparent">
                <div className="w-20 h-20 bg-surface/50 rounded-3xl flex items-center justify-center mb-6 text-slate-600 border border-white/5">
                  <Layers className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Collection Empty</h4>
                <p className="text-slate-500 font-medium mb-8 max-w-md">
                  Start adding movies from the discovery page to build your tier list
                </p>
                <Link 
                  to="/" 
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-bold transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Discover Movies</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 p-1">
                {moviesPool.map((movie, index) => (
                  <div 
                    key={movie.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* OPTIMASI: Kirim removeFromPool langsung */}
                    {/* DraggableSearchResult mengharapkan (id: number) => void */}
                    <DraggableSearchResult 
                      movie={movie}
                      onRemove={removeFromPool} 
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeMovie ? (
          <div className="w-32 rotate-6 scale-125 shadow-2xl shadow-black/80 cursor-grabbing ring-4 ring-primary/60 rounded-xl overflow-hidden animate-pulse">
            <img 
              src={`${activeMovie.poster_path}?v=1`} 
              alt={activeMovie.title}
              className="w-full h-full object-cover" 
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}