from PyPDF2 import PdfReader
from langchain_community.document_loaders import PyPDFLoader
from langchain.document_loaders import Docx2txtLoader
from langchain.document_loaders import TextLoader

class ProcessFile:
    def __init__(self):
        pass


    def extract(self, file):
        loader = PyPDFLoader(file)
        docs = loader.load()
        return docs
    