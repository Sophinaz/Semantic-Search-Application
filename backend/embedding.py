from sentence_transformers import SentenceTransformer
from sentence_transformers import util

class Embedding:
    def __init__(self, model_path):
        self.model = SentenceTransformer(model_path)


    def embed(self, splits, pages):
        print("model", self.model)
        embeddings = self.model.encode(splits)

        # cosine_scores = util.pytorch_cos_sim(embeddings, embeddings)

        # top_k = 5
        # results = []
        # for i in range(len(cosine_scores)):
        #     top_results = torch.topk(cosine_scores[i], k=top_k+1)
        #     results.append(top_results)
        print(embeddings)
        return embeddings
    
    def similarity(self, query, embeddings):
        query_embedding = self.model.encode(query)
        similarities = util.cos_sim(query_embedding, embeddings)
        top_results = similarities.argsort(descending=True)
        # for i in range(3):
        #     result = top_results[i]
        #     print("result", result)
        return top_results[0][:5]