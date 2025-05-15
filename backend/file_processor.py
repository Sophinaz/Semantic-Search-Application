from PyPDF2 import PdfReader
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import Docx2txtLoader
from langchain_community.document_loaders import TextLoader

class ProcessFile:
    def __init__(self):
        pass


    def extract(self, file):
        file_extension = file.lower().split('.')[-1]
        if file_extension == "pdf":
            loader = PyPDFLoader(file)
            docs = loader.load()
            return docs
        elif file_extension == "docx":
            loader = Docx2txtLoader(file)
            docs =loader.load() 
            return docs
        elif file_extension == "txt":
            loader = TextLoader(file)
            docs = loader.load()
            return docs
        else:
            raise ValueError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.")
    