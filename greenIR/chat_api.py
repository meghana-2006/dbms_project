import os
from typing import List, Dict
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class ChatAPI:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=api_key)
        self.model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
    
    def generate(
        self,
        query: str,
        context_documents: List[Dict],
        max_tokens: int = 1024,
        temperature: float = 0.7
    ) -> str:
        """Generate a response using Groq API with retrieved context."""
        
        # Build context from retrieved documents
        context = "\n\n".join([
            f"Document {i+1} (from {doc['metadata'].get('source', 'unknown')}):\n{doc['content']}"
            for i, doc in enumerate(context_documents)
        ])
        
        # Create the prompt
        system_prompt = """You are a helpful AI assistant that answers questions based on the provided context documents. 
Always base your answers on the given context. If the context doesn't contain enough information to answer the question, 
say so clearly. Be concise and accurate."""
        
        user_prompt = f"""Context Documents:
{context}

Question: {query}

Please provide a clear and concise answer based on the context above."""
        
        try:
            # Call Groq API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            raise Exception(f"Error calling Groq API: {str(e)}")

# Global chat API instance
_chat_api = None

def get_chat_api() -> ChatAPI:
    """Get or create the global chat API instance."""
    global _chat_api
    if _chat_api is None:
        _chat_api = ChatAPI()
    return _chat_api

def generate_response(query: str, context_documents: List[Dict]) -> str:
    """Convenience function to generate a response."""
    chat_api = get_chat_api()
    return chat_api.generate(query, context_documents)
