from flask import Flask
from flask_restful import Api, Resource
from api import Search
from file_processor import ProcessFile
from textSplitter import TextSplitter



def run():
    app = Flask(__name__)
    api = Api(app)
    
    # fileProcessor = ProcessFile()
    # splitter = TextSplitter()
    # docs = fileProcessor.extract("2502.18639v1.pdf")
    # splits = splitter.split_text(docs)
    
    api.add_resource(Search, "/search", resource_class_kwargs={})
    return app

def main():
    app = run()
    app.run(debug=True, host="localhost", port=5004) 
    
if __name__ == "__main__":
    main()