"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, MessageSquare, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SearchResults from "@/components/search-results"
import EmbeddingVisualization from "@/components/embedding-visualization"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface SearchResult {
  id: string
  title: string
  content: string
  pageNumber: number
  relevanceScore: number
  documentName: string
  userRating?: "up" | "down"
}

export default function SearchInterface() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: query,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setIsSearching(true)

    try {
      // In a real app, you would fetch results from your backend API
      // const response = await fetch('/api/search', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ query, conversationHistory: messages })
      // })
      // const data = await response.json()

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response data
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Introduction to Semantic Search",
          content:
            "Semantic search refers to search algorithms that consider the intent and contextual meaning of search phrases, rather than just keywords. This approach enables more relevant search results by understanding the semantics of the query.",
          pageNumber: 12,
          relevanceScore: 0.92,
          documentName: "Semantic_Search_Guide.pdf",
        },
        {
          id: "2",
          title: "Vector Embeddings",
          content:
            "Vector embeddings are numerical representations of words, phrases, or documents in a high-dimensional space. These embeddings capture semantic relationships, allowing similar concepts to be positioned closer together in the vector space.",
          pageNumber: 24,
          relevanceScore: 0.85,
          documentName: "NLP_Techniques.pdf",
        },
        {
          id: "3",
          title: "Context-Aware Systems",
          content:
            "Context-aware systems maintain and utilize information about the current situation to improve the relevance of results. In search applications, this includes tracking conversation history to better understand follow-up queries.",
          pageNumber: 37,
          relevanceScore: 0.78,
          documentName: "Advanced_Search_Systems.pdf",
        },
        {
          id: "4",
          title: "Relevance Feedback",
          content:
            "Relevance feedback is a technique where users provide feedback on search results, which the system then uses to improve future results. This creates a feedback loop that continuously enhances search quality.",
          pageNumber: 42,
          relevanceScore: 0.72,
          documentName: "User_Interaction_Design.pdf",
        },
        {
          id: "5",
          title: "Natural Language Processing",
          content:
            "NLP techniques enable computers to understand, interpret, and generate human language. These capabilities are fundamental to semantic search systems that need to process and analyze text data.",
          pageNumber: 8,
          relevanceScore: 0.68,
          documentName: "NLP_Techniques.pdf",
        },
      ]

      setResults(mockResults)

      // Add assistant response
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: `I found ${mockResults.length} relevant results for "${query}". The most relevant information comes from pages about semantic search, vector embeddings, and context-aware systems.`,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search failed",
        description: "There was an error processing your search. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
      setQuery("")
    }
  }

  const handleRateResult = (id: string, rating: "up" | "down") => {
    setResults((prev) => prev.map((result) => (result.id === id ? { ...result, userRating: rating } : result)))

    // In a real app, you would send this feedback to your backend
    // fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ resultId: id, rating })
    // })

    toast({
      title: rating === "up" ? "Marked as relevant" : "Marked as not relevant",
      description: "Thank you for your feedback. This helps improve search results.",
    })
  }

  const clearConversation = () => {
    setMessages([])
    setResults([])
    toast({
      title: "Conversation cleared",
      description: "Your conversation history has been reset.",
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-white dark:bg-slate-800 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Semantic Search</h2>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearConversation} className="flex items-center gap-1">
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Clear Conversation</span>
              </Button>
            )}
          </div>

          <ScrollArea className="h-[400px] mb-4 pr-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-lg font-medium mb-2">No conversation yet</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  Start by asking a question about your documents. The system will remember context for follow-up
                  questions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                          : "bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSearch} className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="pr-12"
              disabled={isSearching}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-1">
        <Tabs defaultValue="results">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="mt-0">
            <SearchResults results={results} onRateResult={handleRateResult} />
          </TabsContent>

          <TabsContent value="visualization" className="mt-0">
            <EmbeddingVisualization results={results} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
