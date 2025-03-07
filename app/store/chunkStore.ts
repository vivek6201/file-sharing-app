import {create} from 'zustand';

export const useChunkStore = create<ChunkStoreType>(set => ({
  chunkStore: null,
  currentChunkSet: null,
  setChunkStore: chunkStore => set(() => ({chunkStore})),
  resetChunkStore: () => set(() => ({chunkStore: null})),
  setCurrentChunkSet: currentChunkSet => set(() => ({currentChunkSet})),
  resetCurrentChunkSet: () => set(() => ({currentChunkSet: null})),
}));
