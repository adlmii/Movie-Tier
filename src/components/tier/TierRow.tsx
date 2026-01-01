import { useCallback } from 'react'; //
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import type { Tier, Movie } from '../../types';
import DraggableMovie from './DraggableMovie';
import { cn } from '../../lib/utils';
import { useTierStore } from '../../store/useTierStore';

interface TierRowProps {
  tier: Tier;
}

export default function TierRow({ tier }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: tier.id,
  });

  const unrankMovie = useTierStore((state) => state.unrankMovie);
  const handleUnrank = useCallback((movie: Movie) => {
    unrankMovie(movie, tier.id);
  }, [tier.id, unrankMovie]); // Dependensi: hanya jika tier.id berubah (jarang)

  return (
    <div className="flex w-full mb-4 rounded-xl overflow-hidden border border-white/5 bg-gradient-to-r from-surface/40 to-surface/20 backdrop-blur-sm group hover:border-white/10 transition-all duration-500 shadow-lg hover:shadow-xl">
      
      {/* LABEL TIER (S, A, B...) */}
      <div className="w-20 md:w-24 flex-shrink-0 flex items-center justify-center relative overflow-hidden border-r border-white/5 bg-black/20">
        
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 opacity-[0.2] transition-opacity duration-500 group-hover:opacity-30" 
          style={{ 
            background: `linear-gradient(135deg, ${tier.color}40 0%, ${tier.color}10 100%)`
          }} 
        />
        
        {/* Accent Border */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:w-1.5"
          style={{ backgroundColor: tier.color }} 
        />
        
        {/* Tier Label */}
        <div className="relative z-10 flex flex-col items-center gap-0.5">
          <span 
            className="text-4xl md:text-5xl font-black tracking-tighter transform transition-all duration-500 group-hover:scale-110 not-italic"
            style={{ 
              color: tier.color,
              textShadow: `0 0 20px ${tier.color}40`,
              WebkitTextStroke: '0.5px rgba(0,0,0,0.2)'
            }}
          >
            {tier.label}
          </span>
          <div 
            className="h-0.5 w-6 rounded-full opacity-60 transition-all duration-500 group-hover:w-10"
            style={{ backgroundColor: tier.color }}
          />
        </div>
      </div>

      {/* DROP ZONE */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-wrap gap-3 p-3 md:p-4 min-h-[120px] transition-all duration-500 relative",
          isOver && "bg-white/[0.03] shadow-[inset_0_0_50px_rgba(255,255,255,0.05)] border-l-2 border-l-primary/50"
        )}
      >
        <SortableContext 
          items={tier.movies.map((m) => m.id)} 
          strategy={horizontalListSortingStrategy}
        >
          {tier.movies.map((movie) => (
            <div key={movie.id} className="w-20 md:w-28 transition-all duration-300 hover:scale-105">
              {/* OPTIMASI: Kirim handleUnrank langsung */}
              <DraggableMovie 
                movie={movie} 
                onRemove={handleUnrank}
              />
            </div>
          ))}
        </SortableContext>
        
        {/* Empty State */}
        {tier.movies.length === 0 && !isOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-1.5 opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.1]">
              <span 
                className="text-2xl md:text-3xl font-black tracking-[0.2em] select-none"
                style={{ color: tier.color }}
              >
                DROP
              </span>
            </div>
          </div>
        )}

        {/* Drag Over Indicator */}
        {isOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="px-6 py-3 rounded-xl border-2 border-dashed animate-pulse"
              style={{ borderColor: `${tier.color}60`, backgroundColor: `${tier.color}10` }}
            >
              <span 
                className="text-lg font-bold tracking-wider"
                style={{ color: tier.color }}
              >
                Rank It
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}