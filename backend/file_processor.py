from PyPDF2 import PdfReader
from langchain_community.document_loaders import PyPDFLoader

class ProcessFile:
    def __init__(self):
        pass


    def extract(self, file_path):
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        return docs
    