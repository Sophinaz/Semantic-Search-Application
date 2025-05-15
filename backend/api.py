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
        file = request.files['file']
        file_path = f"./uploads/{file.filename}"
        file.save(file_path)
        try:
            docs = self.fileProcessor.extract(file_path)

            splits, pages = self.splitter.split_text(docs)
            embeddings = self.embedder.embed(splits, pages)
        except Exception as e:
            return {"error": str(e)}, 400
        


        with open('data/embeddings.pkl', 'rb') as f:
            data = pickle.load(f)
        with open("data/embeddings.pkl", "wb") as f:
            data = np.concatenate((data, embeddings), axis=0)
            pickle.dump(data, f)

        with open('data/chunks.pkl', 'rb') as f:
            data = pickle.load(f)
        with open("data/chunks.pkl", "wb") as f:
            data.extend([[splits[i], pages[i]] for i in range(len(splits))])
            pickle.dump(data, f)

        return {"success": "true"}, 200
    
class Search(Resource):
    def __init__(self, embedder):
        self.embedder = embedder
    
    def post(self):
        query = request.json.get("query")

        with open("data/embeddings.pkl", "rb") as f:
            embeddings = pickle.load(f)
        with open("data/chunks.pkl", "rb") as f:
            splits = pickle.load(f)
        
        print("s", splits, type(splits), embeddings, type(embeddings))
        results = self.embedder.similarity(query, embeddings)
        return [[splits[i][0], splits[i][1]] for i in results], 200