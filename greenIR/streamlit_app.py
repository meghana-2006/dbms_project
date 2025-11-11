import streamlit as st
import requests
from pathlib import Path
import sys

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent))

from retriever import retrieve_documents
from chat_api import generate_response

# Page configuration
st.set_page_config(
    page_title="GreenIR - RAG System",
    page_icon="🌱",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main-header {
        font-size: 3rem;
        color: #2E7D32;
        text-align: center;
        margin-bottom: 2rem;
    }
    .source-box {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
        border-left: 4px solid #2E7D32;
    }
    .score-badge {
        background-color: #2E7D32;
        color: white;
        padding: 0.2rem 0.5rem;
        border-radius: 0.3rem;
        font-size: 0.8rem;
    }
    </style>
""", unsafe_allow_html=True)

# Header
st.markdown('<h1 class="main-header">🌱 GreenIR</h1>', unsafe_allow_html=True)
st.markdown('<p style="text-align: center; color: #666;">Retrieval-Augmented Generation System</p>', unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.header("⚙️ Settings")
    
    top_k = st.slider(
        "Number of documents to retrieve",
        min_value=1,
        max_value=10,
        value=3,
        help="How many relevant documents to retrieve for context"
    )
    
    st.divider()
    
    st.header("📊 System Info")
    
    # Try to get vector store stats
    try:
        from vector_store import VectorStore
        vs = VectorStore()
        vs.load()
        stats = vs.get_stats()
        
        st.metric("Total Vectors", stats['total_vectors'])
        st.metric("Total Documents", stats['total_documents'])
        st.metric("Vector Dimension", stats['dimension'])
    except Exception as e:
        st.warning("Vector store not initialized. Please run ingestion first.")
    
    st.divider()
    
    st.markdown("""
    ### 📖 How to use:
    1. Make sure documents are ingested
    2. Enter your question
    3. View the AI-generated answer
    4. Check the source documents
    """)

# Main content
st.header("💬 Ask a Question")

# Query input
query = st.text_input(
    "Enter your question:",
    placeholder="What would you like to know?",
    label_visibility="collapsed"
)

# Search button
if st.button("🔍 Search", type="primary", use_container_width=True):
    if not query:
        st.warning("Please enter a question.")
    else:
        with st.spinner("Searching and generating response..."):
            try:
                # Retrieve documents
                retrieved_docs = retrieve_documents(query, top_k=top_k)
                
                if not retrieved_docs:
                    st.error("No relevant documents found. Please check if documents are ingested.")
                else:
                    # Generate response
                    answer = generate_response(query, retrieved_docs)
                    
                    # Display answer
                    st.subheader("✨ Answer")
                    st.markdown(answer)
                    
                    # Display sources
                    st.subheader("📚 Source Documents")
                    
                    for i, doc in enumerate(retrieved_docs):
                        with st.expander(f"📄 Source {i+1}: {doc['metadata'].get('source', 'Unknown')}"):
                            col1, col2 = st.columns([3, 1])
                            
                            with col1:
                                st.markdown(f"**Chunk {doc['metadata'].get('chunk_id', 'N/A')} of {doc['metadata'].get('total_chunks', 'N/A')}**")
                            
                            with col2:
                                score = doc.get('score', 0.0)
                                st.markdown(f'<span class="score-badge">Score: {score:.4f}</span>', unsafe_allow_html=True)
                            
                            st.markdown("---")
                            st.text(doc['content'][:500] + "..." if len(doc['content']) > 500 else doc['content'])
            
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")
                st.info("Make sure you have:\n1. Run the ingestion script\n2. Set up your GROQ_API_KEY in .env file")

# Footer
st.divider()
st.markdown("""
<div style="text-align: center; color: #666; padding: 2rem;">
    <p>Built with FastAPI, FAISS, Groq, and Streamlit</p>
</div>
""", unsafe_allow_html=True)
