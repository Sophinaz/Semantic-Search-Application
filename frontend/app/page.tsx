"use client";

import type React from "react";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [resultsquestion, setResultsquestion] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5004/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert(`File "${file.name}" uploaded successfully`);
    } catch (error) {
      alert("File upload failed");
      console.error(error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch("http://localhost:5004/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data || []);
      console.log(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryResult.trim()) return;
    setIsAnswering(true);

    try {
      const response = await fetch("http://localhost:5004/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "query": queryResult }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      console.log("data", data)
      setResultsquestion((prev) => [
        ...prev,
        [data || queryResult, data.page || "N/A"],
      ]);
      setQueryResult("");
    } catch (error) {
      console.error("Request error:", error);
    } finally {
      setIsAnswering(false);
    }
  };




  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-medium mb-8 text-center">
          Semantic Search
        </h1>

        {/* File Upload */}
        <div className="mb-8">
          <div className="border border-gray-200 rounded-lg p-4 mb-2">
            <Input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="mb-2"
            />
            <Button onClick={handleUpload} disabled={!file} className="w-full cursor-pointer">
              {file ? `Upload "${file.name}"` : "Upload File"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Supported formats: PDF, DOCX, TXT
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your documents..."
              className="flex-1"
            />
            <Button className=" cursor-pointer" type="submit" disabled={isSearching || !query.trim()}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        {/* Results */}
        <div className="space-y-4">
          {results.length > 0 && (
            <h2 className="text-lg font-medium mb-2">
              Results ({results.length})
            </h2>
          )}

          {results.map((result, index) => (
            <Card key={index} className="p-4 border border-gray-200">
              <p className="text-sm text-gray-600 my-1">{result[0]}</p>
              <div className="text-xs text-gray-500">• Page {result[1]}</div>
            </Card>
          ))}

          {query && results.length === 0 && !isSearching && (
            <p className="text-center text-gray-500 py-8">
              No results found. Try a different search term.
            </p>
          )}
        </div>

        {/* Text Input (instead of File Upload) */}
        <div className="mb-8 mt-24">
          <h1 className="text-center text-2xl font-semibold mt-24">Get An Answer</h1>
          <div className="border border-gray-200 rounded-lg p-4 mt-24 mb-2 flex gap-2">
            <Input
              type="text"
              value={queryResult}
              onChange={(e) => setQueryResult(e.target.value)}
              placeholder="Type your question or text here..."
              className="flex-1"
            />
            <Button
              onClick={handleAnswer}
              disabled={isAnswering || !queryResult.trim()}
              className="w-32 cursor-pointer"
            >
              {isAnswering ? "Answering..." : "Answer"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Type your question and click Answer
          </p>
        </div>

        <div className="space-y-4">

          {resultsquestion.map((result, index) => (
            <Card key={index} className="p-4 border border-gray-200">
              <p className="text-sm text-gray-600 my-1">{result[0]}</p>
              <div className="text-xs text-gray-500">• Page {result[1]}</div>
            </Card>
          ))}

          {query && resultsquestion.length === 0 && !isAnswering && (
            <p className="text-center text-gray-500 py-8">
              No result found. Try a different search term.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
