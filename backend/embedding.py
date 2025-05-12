from sentence_transformers import SentenceTransformer
from sentence_transformers import util

class Embedding:
    def __init__(self, model_path):
        self.model = SentenceTransformer(model_path)
        self.embeddings = []
        self.chunks = []


    def embed(self, splits, pages):
        embeddings = self.model.encode(splits)
        return embeddings
    
    def similarity(self, query, embeddings):
        query_embedding = self.model.encode(query)
        similarities = util.cos_sim(query_embedding, embeddings)
        top_results = similarities.argsort(descending=True)

        return top_results[0][:5]