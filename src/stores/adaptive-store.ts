'use client';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {INITIAL_LETTERS, LETTER_ORDER} from '@/lib/adaptive-practice';
interface AdaptiveStore {
  unlockedCount: number;
  unlockThrough: (count:number) => void;
  reset: () => void;
}
export const useAdaptiveStore = create<AdaptiveStore>()(persist((set) => ({
  unlockedCount: INITIAL_LETTERS,
  unlockThrough: count => set(state => ({unlockedCount: Math.max(state.unlockedCount, Math.min(LETTER_ORDER.length, count))})),
  reset: () => set({unlockedCount: INITIAL_LETTERS}),
}), {name:'aloo-adaptive-practice',skipHydration:true}));
