from fastapi import FastAPI
from pydantic import BaseModel
from langchain.vectorstores import Qdrant
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.schema import Document
from bs4 import BeautifulSoup
import requests
import os, time
from langchain.text_splitter import RecursiveCharacterTextSplitter

app = FastAPI()

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class URLRequest(BaseModel):
    url: str

class QARequest(BaseModel):
    question: str
    collection: str

def fetch_text_from_url(url):
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    for script in soup(["script", "style"]): 
        script.extract()
    return soup.get_text()

def create_vector_store_from_text(text, collection_name):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)
    docs = [Document(page_content=c, metadata={"chunk_id": i}) for i, c in enumerate(chunks)]
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=OPENAI_API_KEY)
    return Qdrant.from_documents(docs, embeddings, collection_name=collection_name, url=QDRANT_URL)

@app.post("/process_url")
def process_url(payload: URLRequest):
    content = fetch_text_from_url(payload.url)
    collection_name = f"webdocs_{int(time.time())}"
    create_vector_store_from_text(content, collection_name)
    return {"message": "Processed", "collection": collection_name}

@app.post("/ask")
def ask_question(payload: QARequest):
    vector_store = Qdrant(
        collection_name=payload.collection,
        embeddings=OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=OPENAI_API_KEY),
        url=QDRANT_URL,
    )
    matches = vector_store.similarity_search(payload.question, k=5)
    context = "\n\n".join(f"[Chunk {m.metadata['chunk_id']}] {m.page_content}" for m in matches)
    prompt = f"""
Answer the question based on the website content:

{context}

User question: {payload.question}
Always reference the chunk ID.
"""
    llm = ChatOpenAI(model="gpt-4.1-mini", temperature=0.1, openai_api_key=OPENAI_API_KEY)
    response = llm.predict(prompt)
    return {"answer": response, "sources": [{"chunk_id": m.metadata["chunk_id"], "content": m.page_content} for m in matches]}
