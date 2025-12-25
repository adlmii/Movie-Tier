import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import type { Movie } from '../../types';
import { cn } from '../../lib/utils';

interface DraggableMovieProps {
  movie: Movie;
}

export default function DraggableMovie({ movie }: DraggableMovieProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: movie.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative aspect-[2/3] bg-slate-800 rounded-md overflow-hidden cursor-grab active:cursor-grabbing border border-transparent hover:border-white/50 transition-colors",
        isDragging && "opacity-20 z-0"
      )}
    >
      <motion.img
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }}
        layoutId={`movie-${movie.id}`} 
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        
        src={movie.poster_path}
        alt={movie.title}
        className="w-full h-full object-cover pointer-events-none"
      />
      
      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}