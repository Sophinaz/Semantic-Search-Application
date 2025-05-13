from flask import request
from flask_restful import Resource
import numpy as np
import pickle


    
class UploadFile(Resource):
    def __init__(self, fileProcessor, splitter, embedder):
        self.fileProcessor = fileProcessor
        self.splitter = splitter
        self.embedder = embedder
        
    def post(self):
        docs = self.fileProcessor.extract("2502.18639v1.pdf")
        splits, pages = self.splitter.split_text(docs)
        embeddings = self.embedder.embed(splits, pages)


        with open('embeddings.pkl', 'rb') as f:
            data = pickle.load(f)
        with open("embeddings.pkl", "wb") as f:
            data = np.concatenate((data, embeddings), axis=0)
            pickle.dump(data, f)

        with open('chunks.pkl', 'rb') as f:
            data = pickle.load(f)
        with open("chunks.pkl", "wb") as f:
            data.extend(splits)
            pickle.dump(data, f)

        return None, 200
    
class Search(Resource):
    def __init__(self, embedder):
        self.embedder = embedder
    
    def post(self):
        query = request.json.get("query")

        with open("embeddings.pkl", "rb") as f:
            embeddings = pickle.load(f)
        with open("chunks.pkl", "rb") as f:
            splits = pickle.load(f)
        
        results = self.embedder.similarity(query, embeddings)
        return [splits[i] for i in results], 200