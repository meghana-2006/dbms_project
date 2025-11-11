import os
import json
from pathlib import Path
from typing import List, Dict
import PyPDF2
import tiktoken
from groq import Groq
from vector_store import VectorStore
import numpy as np

class DocumentIngester:
    def __init__(self, groq_api_key: str = None, embedding_model: str = "groq-embed-1"):
        """
        Initialize the document ingester with Groq embeddings.
        
        Args:
            groq_api_key: Groq API key (if None, reads from environment)
            embedding_model: Embedding model name (placeholder: "groq-embed-1")
        """
        self.groq_api_key = groq_api_key or os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=self.groq_api_key)
        self.embedding_model = embedding_model
        self.vector_store = VectorStore()
        
        # Initialize tokenizer for token counting (using cl100k_base for GPT-like models)
        try:
            self.tokenizer = tiktoken.get_encoding("cl100k_base")
        except Exception:
            # Fallback to a default encoding
            self.tokenizer = tiktoken.get_encoding("gpt2")
    
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
    
    def count_tokens(self, text: str) -> int:
        """Count the number of tokens in a text string."""
        return len(self.tokenizer.encode(text))
    
    def chunk_text_by_tokens(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """
        Split text into chunks based on token count.
        
        Args:
            text: Input text to chunk
            chunk_size: Target number of tokens per chunk
            overlap: Number of overlapping tokens between chunks
        
        Returns:
            List of text chunks
        """
        # Encode the entire text into tokens
        tokens = self.tokenizer.encode(text)
        chunks = []
        
        # Create overlapping chunks
        start = 0
        while start < len(tokens):
            # Get chunk of tokens
            end = start + chunk_size
            chunk_tokens = tokens[start:end]
            
            # Decode tokens back to text
            chunk_text = self.tokenizer.decode(chunk_tokens)
            
            if chunk_text.strip():
                chunks.append(chunk_text.strip())
            
            # Move start position (with overlap)
            start += chunk_size - overlap
            
            # Break if we've processed all tokens
            if end >= len(tokens):
                break
        
        return chunks
    
    def get_groq_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Get embeddings from Groq API.
        
        Note: This is a placeholder implementation since Groq doesn't currently
        have a public embeddings API. In production, you would replace this with
        the actual Groq embeddings endpoint when available.
        
        For now, this generates mock embeddings for demonstration purposes.
        """
        print(f"⚠️  Note: Using placeholder embeddings (Groq embeddings API not yet available)")
        print(f"   Model: {self.embedding_model}")
        print(f"   Generating embeddings for {len(texts)} chunks...")
        
        # Placeholder: Generate random embeddings
        # In production, replace with actual Groq API call:
        # response = self.client.embeddings.create(
        #     model=self.embedding_model,
        #     input=texts
        # )
        # embeddings = np.array([item.embedding for item in response.data])
        
        # For now, generate consistent random embeddings based on text hash
        embedding_dim = 1536  # Standard embedding dimension
        embeddings = []
        
        for text in texts:
            # Use hash for reproducibility
            np.random.seed(hash(text) % (2**32))
            embedding = np.random.randn(embedding_dim).astype('float32')
            # Normalize the embedding
            embedding = embedding / np.linalg.norm(embedding)
            embeddings.append(embedding)
        
        return np.array(embeddings, dtype='float32')
    
    def ingest_file(self, file_path: str) -> int:
        """
        Ingest a single file: read, chunk, embed, and store.
        
        Args:
            file_path: Path to the file to ingest
        
        Returns:
            Number of chunks created
        """
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        print(f"\n📄 Processing: {file_path.name}")
        
        # Read document based on file type
        if file_path.suffix.lower() == '.pdf':
            content = self.read_pdf_file(str(file_path))
        elif file_path.suffix.lower() in ['.txt', '.md']:
            content = self.read_text_file(str(file_path))
        else:
            raise ValueError(f"Unsupported file type: {file_path.suffix}")
        
        print(f"   Content length: {len(content)} characters")
        print(f"   Token count: {self.count_tokens(content)} tokens")
        
        # Chunk the document by tokens
        chunks = self.chunk_text_by_tokens(content, chunk_size=500, overlap=50)
        print(f"   Created {len(chunks)} chunks")
        
        # Generate embeddings using Groq
        embeddings = self.get_groq_embeddings(chunks)
        
        # Prepare metadata with source and snippet
        metadata = []
        for i, chunk in enumerate(chunks):
            # Create a snippet (first 100 characters of the chunk)
            snippet = chunk[:100] + "..." if len(chunk) > 100 else chunk
            
            metadata.append({
                "source": str(file_path.name),
                "snippet": snippet,
                "chunk_id": i,
                "total_chunks": len(chunks),
                "token_count": self.count_tokens(chunk)
            })
        
        # Add to vector store
        self.vector_store.add_documents(chunks, embeddings, metadata)
        
        print(f"   ✓ Successfully ingested {len(chunks)} chunks")
        
        return len(chunks)
    
    def ingest_directory(self, directory_path: str) -> Dict[str, int]:
        """
        Ingest all supported documents from a directory.
        
        Args:
            directory_path: Path to directory containing documents
        
        Returns:
            Dictionary mapping filenames to number of chunks created
        """
        directory = Path(directory_path)
        results = {}
        
        if not directory.exists():
            raise FileNotFoundError(f"Directory not found: {directory}")
        
        supported_extensions = ['.txt', '.pdf', '.md']
        
        print(f"\n🔍 Scanning directory: {directory}")
        files = [f for f in directory.iterdir() 
                if f.is_file() and f.suffix.lower() in supported_extensions]
        
        print(f"   Found {len(files)} supported files")
        
        for file_path in files:
            try:
                num_chunks = self.ingest_file(str(file_path))
                results[str(file_path.name)] = num_chunks
            except Exception as e:
                print(f"   ✗ Failed to ingest {file_path.name}: {str(e)}")
                results[str(file_path.name)] = 0
        
        # Save the vector store
        print(f"\n💾 Saving vector store...")
        self.vector_store.save()
        
        return results

def main():
    """Main function to ingest documents from sample_docs folder."""
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv()
    
    # Initialize ingester
    try:
        ingester = DocumentIngester()
    except ValueError as e:
        print(f"❌ Error: {e}")
        print("   Please set GROQ_API_KEY in your .env file")
        return
    
    # Path to sample documents
    sample_docs_path = Path(__file__).parent / "sample_docs"
    
    if not sample_docs_path.exists():
        print(f"❌ Error: sample_docs directory not found at {sample_docs_path}")
        return
    
    print("=" * 60)
    print("🌱 GreenIR Document Ingestion")
    print("=" * 60)
    
    # Ingest all documents
    results = ingester.ingest_directory(str(sample_docs_path))
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 Ingestion Summary")
    print("=" * 60)
    
    total_chunks = sum(results.values())
    successful_files = sum(1 for count in results.values() if count > 0)
    
    print(f"   Total files processed: {len(results)}")
    print(f"   Successful: {successful_files}")
    print(f"   Failed: {len(results) - successful_files}")
    print(f"   Total chunks created: {total_chunks}")
    
    print("\n📁 Files processed:")
    for filename, chunk_count in results.items():
        status = "✓" if chunk_count > 0 else "✗"
        print(f"   {status} {filename}: {chunk_count} chunks")
    
    print("\n✅ Vector store saved successfully!")
    print(f"   Location: {Path(__file__).parent / 'data'}")

if __name__ == "__main__":
    main()
