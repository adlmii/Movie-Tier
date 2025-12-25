import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import type { Movie } from '../../types';

export default function DraggableSearchResult({ movie }: { movie: Movie }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `search-${movie.id}`,
    data: { movie, type: 'SEARCH_ITEM' },
  });

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      layoutId={`search-${movie.id}`} 
      
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', damping: 12 }}
      
      className={`relative aspect-[2/3] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing border border-slate-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 transition-all ${
        isDragging ? 'opacity-40 grayscale ring-2 ring-blue-500/50' : 'opacity-100'
      }`}
    >
      <img
        src={`${movie.poster_path}?v=1`}
        alt={movie.title}
        
        crossOrigin="anonymous"
        
        className="w-full h-full object-cover pointer-events-none"
      />
      
      {/* Overlay Judul */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-4">
        <p className="text-xs text-center text-white font-medium truncate">
          {movie.title}
        </p>
      </div>
    </motion.div>
  );
}