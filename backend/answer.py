from haystack import Document
from haystack import Pipeline
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever
from haystack.components.readers import ExtractiveReader
from haystack.components.embedders import SentenceTransformersDocumentEmbedder
from haystack.components.writers import DocumentWriter
from haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever
from haystack.components.readers import ExtractiveReader
from haystack.components.embedders import SentenceTransformersTextEmbedder


class Answer:
    def __init__(self, model):
        self.document_store = InMemoryDocumentStore()
        retriever = InMemoryEmbeddingRetriever(document_store=self.document_store)
        reader = ExtractiveReader()
        reader.warm_up()

        extractive_qa_pipeline = Pipeline()

        extractive_qa_pipeline.add_component(instance=SentenceTransformersTextEmbedder(model=model), name="embedder")
        extractive_qa_pipeline.add_component(instance=retriever, name="retriever")
        extractive_qa_pipeline.add_component(instance=reader, name="reader")

        extractive_qa_pipeline.connect("embedder.embedding", "retriever.query_embedding")
        extractive_qa_pipeline.connect("retriever.documents", "reader.documents")
        
        model = "sentence-transformers/multi-qa-mpnet-base-dot-v1"

        # document_store = InMemoryDocumentStore()

        self.indexing_pipeline = Pipeline()

        self.indexing_pipeline.add_component(instance=SentenceTransformersDocumentEmbedder(model=model), name="embedder")
        self.indexing_pipeline.add_component(instance=DocumentWriter(document_store=self.document_store), name="writer")
        self.indexing_pipeline.connect("embedder.documents", "writer.documents")
        
        self.qa_pipeline = extractive_qa_pipeline

    def give_answer(self, query, data):
        print("data", data)
        documents = [Document(content=text) for text in data]
        print(documents, 121)
        self.indexing_pipeline.run({"documents": documents})
        
        
        
        result = self.qa_pipeline.run(
            data={"embedder": {"text": query}, "retriever": {"top_k": 3}, "reader": {"query": query, "top_k": 1}}
        )
        print("result", result["reader"]["answers"][0].data, 122)
        return result["reader"]["answers"][0].data
    