from flask import Flask
from flask_restful import Api, Resource
from api import Search
from file_processor import ProcessFile
from textSplitter import TextSplitter
from embedding import Embedding


def run():
    app = Flask(__name__)
    api = Api(app)
    
    fileProcessor = ProcessFile()
    splitter = TextSplitter()
    embed = Embedding("sentence-transformers/all-mpnet-base-v2")
    
    docs = fileProcessor.extract("2502.18639v1.pdf")
    splits, pages = splitter.split_text(docs)
    embeddings = embed.embed(splits, pages)
    
    query = "what are DNA’s nitrogenous bases?"
    
    results = embed.similarity(query, embeddings)
    print("results", [splits[i] for i in results])

    
    api.add_resource(Search, "/search", resource_class_kwargs={"fileProcessor": fileProcessor, "splitter": splitter, "embed": embed})
    return app

def main():
    app = run()
    app.run(debug=True, host="localhost", port=5004) 
    
if __name__ == "__main__":
    main()