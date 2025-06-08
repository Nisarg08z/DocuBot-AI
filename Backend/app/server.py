from fastapi import FastAPI, Query, Path
from app.queue.connection import queue
from app.queue.worker import process_query, ingest_website_task

app = FastAPI()

@app.get('/')
def root():
    return {"status": 'Server is up and running'}

@app.post('/chat')
def chat(query: str = Query(..., description="Chat Message")):
    job = queue.enqueue(process_query, query)
    return {"status": "queued", "job_id": job.id}

@app.post('/ingest-website')
def ingest_website(url: str = Query(..., description="Website URL")):
    job = queue.enqueue(ingest_website_task, url)
    return {"status": "queued", "job_id": job.id}

@app.get("/result/{job_id}")
def get_result(job_id: str = Path(..., description="Job ID")):
    job = queue.fetch_job(job_id=job_id)
    result = job.return_value()
    return {"result": result}