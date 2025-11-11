# 🌱 GreenIR - Retrieval-Augmented Generation System

A powerful RAG (Retrieval-Augmented Generation) system built with FastAPI, FAISS, Groq, and Streamlit. GreenIR allows you to ingest documents, create vector embeddings, and query them using natural language with AI-powered responses.

## 🚀 Features

- **Document Ingestion**: Support for PDF and text files
- **Vector Search**: Fast similarity search using FAISS
- **AI-Powered Responses**: Generate contextual answers using Groq's LLM API
- **REST API**: FastAPI backend for programmatic access
- **Interactive UI**: Beautiful Streamlit frontend for easy querying
- **Semantic Embeddings**: Uses sentence-transformers for high-quality embeddings

## 📁 Project Structure

```
greenIR/
│
├── app.py                # FastAPI backend
├── ingest.py              # Document ingestion & embedding
├── retriever.py           # Retrieval from FAISS
├── vector_store.py        # FAISS index management
├── chat_api.py            # Groq chat completion functions
├── streamlit_app.py       # Streamlit frontend UI
│
├── sample_docs/           # Folder for PDF/text files
│   └── sample1.txt
│
├── data/                  # Folder for FAISS index and metadata
│
├── requirements.txt
├── .env.example
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Groq API key ([Get one here](https://console.groq.com))

### Setup Steps

1. **Clone or navigate to the project directory**:
   ```bash
   cd greenIR
   ```

2. **Install pip (if not already installed)**:
   ```bash
   python3 -m ensurepip --upgrade
   ```

3. **Install dependencies**:
   ```bash
   pip3 install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your_actual_api_key_here
   ```

## 📚 Usage

### Step 1: Ingest Documents

Place your PDF or text files in the `sample_docs/` folder, then run:

```bash
python3 ingest.py
```

This will:
- Read all documents from `sample_docs/`
- Split them into chunks
- Generate embeddings
- Store them in the FAISS vector database

### Step 2: Run the Application

#### Option A: Streamlit UI (Recommended)

```bash
streamlit run streamlit_app.py
```

Then open your browser to `http://localhost:8501`

#### Option B: FastAPI Backend

```bash
python3 app.py
```

API will be available at `http://localhost:8000`

**API Endpoints**:
- `GET /` - Health check
- `POST /query` - Query documents
  ```json
  {
    "query": "What is sustainable agriculture?",
    "top_k": 3
  }
  ```

### Step 3: Query Your Documents

**Using Streamlit UI**:
1. Enter your question in the text box
2. Click "Search"
3. View the AI-generated answer and source documents

**Using API**:
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is sustainable agriculture?", "top_k": 3}'
```

## 🔧 Configuration

### Embedding Model

Default: `all-MiniLM-L6-v2` (384 dimensions, fast and efficient)

To change, modify the `model_name` parameter in:
- `ingest.py` → `DocumentIngester.__init__()`
- `retriever.py` → `Retriever.__init__()`

### Groq Model

Default: `llama-3.1-70b-versatile`

Available models:
- `llama-3.1-70b-versatile` (best quality)
- `llama-3.1-8b-instant` (faster)
- `mixtral-8x7b-32768` (large context)

Change in `.env`:
```
GROQ_MODEL=llama-3.1-8b-instant
```

### Chunking Parameters

In `ingest.py` → `chunk_text()`:
- `chunk_size`: Number of words per chunk (default: 500)
- `overlap`: Overlapping words between chunks (default: 50)

## 📊 How It Works

1. **Ingestion Phase**:
   - Documents are read and split into overlapping chunks
   - Each chunk is converted to a vector embedding using sentence-transformers
   - Embeddings are stored in a FAISS index for fast similarity search

2. **Query Phase**:
   - User query is converted to a vector embedding
   - FAISS finds the most similar document chunks
   - Retrieved chunks are sent to Groq's LLM as context
   - LLM generates a natural language answer based on the context

## 🧪 Testing

Test the ingestion:
```bash
python3 ingest.py
```

Test the retriever:
```python
from retriever import retrieve_documents
results = retrieve_documents("What is sustainable agriculture?", top_k=3)
print(results)
```

Test the API:
```bash
# Start the server
python3 app.py

# In another terminal
curl http://localhost:8000/health
```

## 🐛 Troubleshooting

**Issue**: `GROQ_API_KEY not found`
- **Solution**: Make sure you've created a `.env` file with your API key

**Issue**: `No existing vector store found`
- **Solution**: Run `python3 ingest.py` first to create the vector database

**Issue**: `ModuleNotFoundError`
- **Solution**: Install dependencies with `pip3 install -r requirements.txt`

**Issue**: Slow embedding generation
- **Solution**: First run downloads the model (~80MB). Subsequent runs are faster.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add support for more document types
- Improve chunking strategies
- Enhance the UI
- Add more retrieval methods

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- **FAISS**: Facebook AI Similarity Search
- **Groq**: Fast LLM inference
- **Sentence Transformers**: High-quality embeddings
- **FastAPI**: Modern web framework
- **Streamlit**: Beautiful data apps

---

Built with ❤️ for the AI community
