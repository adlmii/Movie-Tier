import { create } from 'zustand';
import type { Movie, Tier, TierLabel } from '../types';
import { tmdb, IMAGE_BASE_URL } from '../lib/tmdb';

interface TierState {
  tiers: Tier[];
  searchResults: Movie[];
  isLoading: boolean;

  // Actions
  setSearchResults: (movies: Movie[]) => void;
  addMovieToTier: (movie: Movie, tierId: TierLabel) => void;
  updateTierMovies: (tierId: TierLabel, newMovies: Movie[]) => void;
  removeMovieFromTier: (movieId: number, tierId: TierLabel) => void;
  searchMovies: (query: string) => Promise<void>;
}

// Data awal Tier (S, A, B, C, D)
const initialTiers: Tier[] = [
  { id: 'S', label: 'S', color: '#ef4444', movies: [] }, // Merah
  { id: 'A', label: 'A', color: '#f97316', movies: [] }, // Orange
  { id: 'B', label: 'B', color: '#eab308', movies: [] }, // Kuning
  { id: 'C', label: 'C', color: '#84cc16', movies: [] }, // Hijau Muda
  { id: 'D', label: 'D', color: '#22c55e', movies: [] }, // Hijau Tua
];

export const useTierStore = create<TierState>((set) => ({
  tiers: initialTiers,
  searchResults: [],
  isLoading: false,

  setSearchResults: (movies) => set({ searchResults: movies }),

  // --- LOGIC ANTI-DUPLIKAT ---
  addMovieToTier: (movie, tierId) =>
    set((state) => {
      // 1. Cek apakah film ini SUDAH ADA di tier manapun?
      const sourceTier = state.tiers.find((t) => 
        t.movies.some((m) => m.id === movie.id)
      );

      // Jika sudah ada di tier yang SAMA dengan tujuan, tidak perlu lakukan apa-apa
      if (sourceTier && sourceTier.id === tierId) {
        return state;
      }

      // 2. Buat array tiers baru
      const newTiers = state.tiers.map((tier) => {
        // A. Jika ini Tier Tujuan -> Masukkan filmnya
        if (tier.id === tierId) {
          return { ...tier, movies: [...tier.movies, movie] };
        }
        
        // B. Jika ini Tier Lama (tempat film sebelumnya berada) -> Hapus filmnya
        if (tier.movies.find((m) => m.id === movie.id)) {
          return { ...tier, movies: tier.movies.filter((m) => m.id !== movie.id) };
        }

        // C. Tier lain -> Biarkan saja
        return tier;
      });

      return { tiers: newTiers };
    }),

  updateTierMovies: (tierId, newMovies) =>
    set((state) => ({
      tiers: state.tiers.map((tier) =>
        tier.id === tierId ? { ...tier, movies: newMovies } : tier
      ),
    })),

  removeMovieFromTier: (movieId, tierId) =>
    set((state) => ({
      tiers: state.tiers.map((tier) =>
        tier.id === tierId
          ? { ...tier, movies: tier.movies.filter((m) => m.id !== movieId) }
          : tier
      ),
    })),

  searchMovies: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ isLoading: true });

    try {
      const response = await tmdb.get('/search/movie', {
        params: { query: query },
      });

      const movies: Movie[] = response.data.results
        .filter((item: any) => item.poster_path)
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          poster_path: `${IMAGE_BASE_URL}${item.poster_path}`,
        }));

      set({ searchResults: movies });
    } catch (error) {
      console.error('Gagal mencari film:', error);
      set({ searchResults: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));