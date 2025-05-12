from flask import request

    
class UploadFile:
    def __init__(self, fileProcessor, splitter, embedder):
        self.fileProcessor = fileProcessor
        self.splitter = splitter
        self.embedder = embedder
        
    def post(self):
        query = request.json.get("query")
        
        docs = self.fileProcessor.extract("2502.18639v1.pdf")
        splits, pages = self.splitter.split_text(docs)
        embeddings = self.embedder.embed(splits, pages)
        
        self.embedder.embeddings.extend(embeddings)
        self.embedder.chunks.extend(splits)
        
        query = "what are DNA’s nitrogenous bases?"
        
        results = self.embedder.similarity(query, embeddings)
        print("results", [splits[i] for i in results])
        return None, 200
    
class Search:
    def __init__(self, embedder):
        self.embedder = embedder
    
    def post(self):
        query = request.json.get("query")
        print("query", query)
        
        results = self.embedder.similarity(query, self.embedder.embeddings)
        print("results", [self.embedder.splits[i] for i in results])
        return None, 200