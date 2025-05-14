from langchain_text_splitters import RecursiveCharacterTextSplitter

class TextSplitter:
    def __init__(self):
        pass
    
    def split_text(self, docs):
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=350, chunk_overlap=30, separators=["\n\n", "\n", ". ", " ", ""])
        all_splits = text_splitter.split_documents(docs)
        texts_only = [page.page_content for page in all_splits]
        pages_only = [page.metadata["page"] for page in all_splits]

        return texts_only, pages_only