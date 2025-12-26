import { useEffect, useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { useTierStore } from '../../store/useTierStore';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 500); 
  
  const searchMovies = useTierStore((state) => state.searchMovies);
  const isLoading = useTierStore((state) => state.isLoading);

  useEffect(() => {
    searchMovies(debouncedQuery);
  }, [debouncedQuery, searchMovies]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 relative z-20 px-4 md:px-0">
      <div 
        className={`relative group transition-all duration-500 ${
          isFocused ? 'scale-[1.02]' : 'scale-100'
        }`}
      >
        {/* Animated Gradient Border / Glow */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur opacity-20 transition duration-1000 group-hover:opacity-50 ${isFocused ? 'opacity-70 blur-md' : ''}`} />
        
        <div className="relative flex items-center bg-[#0B0E14] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Icon Kiri */}
          <div className="pl-6 text-slate-500">
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5 text-primary" />
            ) : (
              <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-primary' : ''}`} />
            )}
          </div>

          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search specific movies..."
            className="w-full py-5 px-4 bg-transparent text-lg text-white placeholder-slate-600 focus:outline-none font-medium tracking-wide"
          />
          
          {/* Icon Kanan (Decoration) */}
          <div className="pr-6">
            <Sparkles className={`w-5 h-5 transition-colors duration-500 ${isFocused ? 'text-yellow-400' : 'text-slate-700'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}