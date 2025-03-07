interface ChunkStoreType {
  chunkStore: {
    id: string | null;
    name: string;
    totalChunks: number;
    chunkArray: Buffer[];
  } | null;
  currentChunkSet: {
    id: string | null;
    totalChunks: number;
    chunkArray: Buffer[];
  } | null;

  setChunkStore: (chunkStore: any) => void;
  resetChunkStore: () => void;
  setCurrentChunkSet: (currentChunkSet: any) => void;
  resetCurrentChunkSet: () => void;
}