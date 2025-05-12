from PyPDF2 import PdfReader
from langchain_community.document_loaders import PyPDFLoader

class ProcessFile:
    def __init__(self):
        pass


    def extract(self, file_path):
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        # print(docs[0].page_content)
        # print(docs[0].metadata)
        # print(docs[0].metadata["page"])
        return docs
    
        textWithPages = []
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page in range(len(reader.pages)):
                text = reader.pages[page].extract_text()
                if text:
                    textWithPages.append({"page": page + 1, "text": text})
        return textWithPages