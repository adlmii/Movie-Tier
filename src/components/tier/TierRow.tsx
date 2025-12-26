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

  const handleUnrank = (movie: Movie) => {
    unrankMovie(movie, tier.id);
  };

  return (
    <div className="flex w-full mb-4 rounded-2xl overflow-hidden glass-panel group hover:border-white/10 transition-all duration-300">
      
      {/* LABEL TIER (S, A, B...) */}
      <div
        className="w-24 md:w-32 flex-shrink-0 flex items-center justify-center relative overflow-hidden"
      >
        <div 
            className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20" 
            style={{ backgroundColor: tier.color }} 
        />
        
        <div className="absolute left-0 top-0 bottom-0 w-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]" style={{ backgroundColor: tier.color }} />
        
        <span 
          className="text-5xl md:text-6xl font-black italic tracking-tighter drop-shadow-2xl transform transition-transform group-hover:scale-110"
          style={{ 
            color: tier.color,
            textShadow: `0 0 30px ${tier.color}40`
          }}
        >
          {tier.label}
        </span>
      </div>

      {/* DROP ZONE */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-wrap gap-3 p-4 min-h-[150px] transition-all duration-300 relative",
          // Efek visual saat drag item di atasnya
          isOver ? "bg-white/[0.02] shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]" : ""
        )}
      >
        <SortableContext 
          items={tier.movies.map((m) => m.id)} 
          strategy={horizontalListSortingStrategy}
        >
          {tier.movies.map((movie) => (
            <div key={movie.id} className="w-24 md:w-28 shadow-lg">
              <DraggableMovie 
                movie={movie} 
                onRemove={() => handleUnrank(movie)}
              />
            </div>
          ))}
        </SortableContext>
        
        {tier.movies.length === 0 && !isOver && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-4xl font-black text-white/5 tracking-[0.2em] select-none">
                DROP HERE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}