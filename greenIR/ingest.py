import os
from pathlib import Path
from typing import List, Dict
import PyPDF2
from sentence_transformers import SentenceTransformer
from vector_store import VectorStore

class DocumentIngester:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.embedding_model = SentenceTransformer(model_name)
        self.vector_store = VectorStore()
    
    def read_text_file(self, file_path: str) -> str:
        """Read content from a text file."""
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def read_pdf_file(self, file_path: str) -> str:
        """Read content from a PDF file."""
        text = ""
        with open(file_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Split text into overlapping chunks."""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            if chunk:
                chunks.append(chunk)
        
        return chunks
    
    def ingest_document(self, file_path: str) -> int:
        """Ingest a single document and add to vector store."""
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Read document based on file type
        if file_path.suffix.lower() == '.pdf':
            content = self.read_pdf_file(str(file_path))
        elif file_path.suffix.lower() in ['.txt', '.md']:
            content = self.read_text_file(str(file_path))
        else:
            raise ValueError(f"Unsupported file type: {file_path.suffix}")
        
        # Chunk the document
        chunks = self.chunk_text(content)
        
        # Generate embeddings
        embeddings = self.embedding_model.encode(chunks, show_progress_bar=True)
        
        # Prepare metadata
        metadata = [
            {
                "source": str(file_path.name),
                "chunk_id": i,
                "total_chunks": len(chunks)
            }
            for i in range(len(chunks))
        ]
        
        # Add to vector store
        self.vector_store.add_documents(chunks, embeddings, metadata)
        
        return len(chunks)
    
    def ingest_directory(self, directory_path: str) -> Dict[str, int]:
        """Ingest all supported documents from a directory."""
        directory = Path(directory_path)
        results = {}
        
        if not directory.exists():
            raise FileNotFoundError(f"Directory not found: {directory}")
        
        supported_extensions = ['.txt', '.pdf', '.md']
        
        for file_path in directory.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in supported_extensions:
                try:
                    num_chunks = self.ingest_document(str(file_path))
                    results[str(file_path.name)] = num_chunks
                    print(f"✓ Ingested {file_path.name}: {num_chunks} chunks")
                except Exception as e:
                    print(f"✗ Failed to ingest {file_path.name}: {str(e)}")
                    results[str(file_path.name)] = 0
        
        # Save the vector store
        self.vector_store.save()
        
        return results

def main():
    """Main function to ingest documents from sample_docs folder."""
    ingester = DocumentIngester()
    
    sample_docs_path = Path(__file__).parent / "sample_docs"
    
    print("Starting document ingestion...")
    results = ingester.ingest_directory(str(sample_docs_path))
    
    print("\n=== Ingestion Summary ===")
    total_chunks = sum(results.values())
    print(f"Total files processed: {len(results)}")
    print(f"Total chunks created: {total_chunks}")
    print("\nVector store saved successfully!")

if __name__ == "__main__":
    main()
