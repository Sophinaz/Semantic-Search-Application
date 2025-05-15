# Semantic Search Platform

This platform allows users to upload documents (currently supports PDF, DOCX, and TXT files), index their content using semantic embeddings, and then perform search queries to find relevant information. The platform maintains chat history for contextual follow-up questions.

## Usage

### Setup

1.  **Install Dependencies:**
    Ensure you have Python installed on your system. Then, install the necessary libraries using pip:

    ```bash
    pip install PyPDF2 python-docx sentence-transformers langchain numpy pickle
    ```

2.  **Download Sentence Transformer Model:**
    The platform uses a Sentence Transformer model to generate semantic embeddings. The default model is `all-mpnet-base-v2`. If you want to use a different model, you'll need to change the model name in the code (in the `main.py` file). The first time you run the code, the specified model will be downloaded automatically.

### Uploading Documents

1.  **Place Documents:** Put the document files you want to upload in the input field from the client side.
2.  **Upload the document:** Hit the upload button that is found below the input field.
3.  **Embedding Generation:** The script will process each file, extract text, split it into chunks, generate embeddings for each chunk using the Sentence Transformer model, and store these embeddings along with page numbers and file names in pickle files (`embeddings.pickle` and `chunks.pickle` by default). This process might take some time depending on the number and size of your documents.

### Searching

1.  **Put your query in the input field:** There is a search text input field where you can input your query.
2.  **search:** click the search button.
3.  **Search Results:** The script will:
    * Load the pre-computed embeddings from the `embeddings.pickle` file.
    * Encode your search query using the same Sentence Transformer model.
    * Calculate the cosine similarity between your query embedding and all the document chunk embeddings.
    * Retrieve and print the top most similar document chunks, along with their similarity scores, page numbers, and the file they originated from.

### Supported File Types

The platform currently supports the following file types for indexing:

* `.pdf`
* `.docx`
* `.txt`

You can extend the `extract_text` function in the code to support other file formats by integrating appropriate libraries for those formats.
