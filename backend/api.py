from flask import request

class Search:
    def __init__(self, fileProcessor, splitter, embed):
        self.fileProcessor = fileProcessor
        self.splitter = splitter
        self.embed = embed
        
    def post(self):
        docs = self.fileProcessor.extract("2502.18639v1.pdf")
        splits, pages = self.splitter.split_text(docs)
        return None, 200