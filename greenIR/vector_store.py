import os
import json
from pathlib import Path
from typing import List, Dict, Optional
import numpy as np
import faiss

class VectorStore:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(__file__).parent / data_dir
        self.data_dir.mkdir(exist_ok=True)
        
        self.index_path = self.data_dir / "faiss_index.bin"
        self.metadata_path = self.data_dir / "metadatas.json"
        self.documents_path = self.data_dir / "documents.json"
        
        self.index: Optional[faiss.IndexFlatL2] = None
        self.documents: List[str] = []
        self.metadata: List[Dict] = []
        self.dimension: Optional[int] = None
    
    def add_documents(
        self,
        documents: List[str],
        embeddings: np.ndarray,
        metadata: List[Dict]
    ):
        """Add documents with their embeddings to the vector store."""
        if len(documents) != len(embeddings) != len(metadata):
            raise ValueError("Documents, embeddings, and metadata must have the same length")
        
        # Initialize index if not exists
        if self.index is None:
            self.dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(self.dimension)
        
        # Convert embeddings to float32 (required by FAISS)
        embeddings = embeddings.astype('float32')
        
        # Add to index
        self.index.add(embeddings)
        
        # Store documents and metadata
        self.documents.extend(documents)
        self.metadata.extend(metadata)
    
    def search(self, query_embedding: np.ndarray, top_k: int = 3) -> List[Dict]:
        """Search for top-k most similar documents."""
        if self.index is None or self.index.ntotal == 0:
            return []
        
        # Ensure query embedding is 2D and float32
        if query_embedding.ndim == 1:
            query_embedding = query_embedding.reshape(1, -1)
        query_embedding = query_embedding.astype('float32')
        
        # Search
        distances, indices = self.index.search(query_embedding, min(top_k, self.index.ntotal))
        
        # Prepare results
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.documents):
                results.append({
                    "content": self.documents[idx],
                    "metadata": self.metadata[idx],
                    "score": float(dist)
                })
        
        return results
    
    def save(self):
        """Save the vector store to disk."""
        if self.index is not None and self.index.ntotal > 0:
            # Save FAISS index
            faiss.write_index(self.index, str(self.index_path))
            
            # Save documents and metadata as JSON
            with open(self.documents_path, 'w', encoding='utf-8') as f:
                json.dump(self.documents, f, indent=2, ensure_ascii=False)
            
            with open(self.metadata_path, 'w', encoding='utf-8') as f:
                json.dump(self.metadata, f, indent=2, ensure_ascii=False)
            
            print(f"Vector store saved: {self.index.ntotal} vectors")
        else:
            print("No vectors to save")
    
    def load(self):
        """Load the vector store from disk."""
        if not self.index_path.exists():
            print("No existing vector store found. Please run ingestion first.")
            return
        
        try:
            # Load FAISS index
            self.index = faiss.read_index(str(self.index_path))
            self.dimension = self.index.d
            
            # Load documents and metadata from JSON
            with open(self.documents_path, 'r', encoding='utf-8') as f:
                self.documents = json.load(f)
            
            with open(self.metadata_path, 'r', encoding='utf-8') as f:
                self.metadata = json.load(f)
            
            print(f"Vector store loaded: {self.index.ntotal} vectors")
        except Exception as e:
            print(f"Error loading vector store: {str(e)}")
            self.index = None
            self.documents = []
            self.metadata = []
    
    def clear(self):
        """Clear the vector store."""
        self.index = None
        self.documents = []
        self.metadata = []
        self.dimension = None
        
        # Remove files
        for path in [self.index_path, self.documents_path, self.metadata_path]:
            if path.exists():
                path.unlink()
        
        print("Vector store cleared")
    
    def get_stats(self) -> Dict:
        """Get statistics about the vector store."""
        return {
            "total_vectors": self.index.ntotal if self.index else 0,
            "dimension": self.dimension,
            "total_documents": len(self.documents),
            "total_metadata": len(self.metadata)
        }
