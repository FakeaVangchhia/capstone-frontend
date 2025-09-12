// This file has been intentionally neutralized.
// The React app now proxies chat requests to the Django backend,
// which handles RAG and LLM replies. Keeping this stub to avoid confusion.

export type RAGAnswer = { answer: string; sources: { id: string; preview: string }[] };

export const rag = {
  async answer(_q: string): Promise<RAGAnswer> {
    return { answer: "", sources: [] };
  },
};
