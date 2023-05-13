from fastapi import FastAPI

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from typing import List

import json
import aiofiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=FileResponse)
def redirect_index():
    return "static/index.html"

@app.get("/index", response_class=FileResponse)
def index():
    return "static/index.html"

@app.get('/hcheck')
def hcheck():
    return "OK"

