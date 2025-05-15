from flask import Flask
from flask_restful import Api, Resource
from api import UploadFile, Search, Answerapi
from file_processor import ProcessFile
from textSplitter import TextSplitter
from embedding import Embedding
from answer import Answer
import numpy as np
import pickle
from flask_cors import CORS



def run():
    app = Flask(__name__)
    CORS(app)
    api = Api(app)
    
    fileProcessor = ProcessFile()
    splitter = TextSplitter()
    embedder = Embedding("sentence-transformers/all-mpnet-base-v2")
    
    answer = Answer("sentence-transformers/multi-qa-mpnet-base-dot-v1")
    
    with open("data/embeddings.pkl", "wb") as f:
        data = np.empty((0, 768), dtype=np.float32)
        pickle.dump(data, f)
    with open("data/chunks.pkl", "wb") as f:
        data = []
        pickle.dump(data, f)

    api.add_resource(UploadFile, "/upload", resource_class_kwargs={"fileProcessor": fileProcessor, "splitter": splitter, "embedder": embedder})
    api.add_resource(Search, "/search", resource_class_kwargs={"embedder": embedder})
    api.add_resource(Answerapi, "/answer", resource_class_kwargs={"answer": answer, "embedder": embedder})
    return app




def main():
    app = run()
    app.run(debug=True, host="localhost", port=5004) 
    
if __name__ == "__main__":
    main()