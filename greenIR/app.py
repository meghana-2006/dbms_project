from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from retriever import retrieve_documents
from chat_api import generate_response

app = FastAPI(title="GreenIR - RAG System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

class QueryResponse(BaseModel):
    answer: str
    sources: List[dict]

@app.get("/")
async def root():
    return {"message": "GreenIR RAG System API", "status": "running"}

@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    try:
        # Retrieve relevant documents
        retrieved_docs = retrieve_documents(request.query, top_k=request.top_k)
        
        if not retrieved_docs:
            raise HTTPException(status_code=404, detail="No relevant documents found")
        
        # Generate response using Groq
        answer = generate_response(request.query, retrieved_docs)
        
        # Format sources
        sources = [
            {
                "content": doc["content"],
                "metadata": doc.get("metadata", {}),
                "score": doc.get("score", 0.0)
            }
            for doc in retrieved_docs
        ]
        
        return QueryResponse(answer=answer, sources=sources)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
