from typing import List, Dict
from sentence_transformers import SentenceTransformer
from vector_store import VectorStore

class Retriever:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.embedding_model = SentenceTransformer(model_name)
        self.vector_store = VectorStore()
        self.vector_store.load()
    
    def retrieve(self, query: str, top_k: int = 3) -> List[Dict]:
        """Retrieve top-k most relevant documents for a query."""
        # Generate query embedding
        query_embedding = self.embedding_model.encode([query])[0]
        
        # Search in vector store
        results = self.vector_store.search(query_embedding, top_k=top_k)
        
        return results

# Global retriever instance
_retriever = None

def get_retriever() -> Retriever:
    """Get or create the global retriever instance."""
    global _retriever
    if _retriever is None:
        _retriever = Retriever()
    return _retriever

def retrieve_documents(query: str, top_k: int = 3) -> List[Dict]:
    """Convenience function to retrieve documents."""
    retriever = get_retriever()
    return retriever.retrieve(query, top_k=top_k)
