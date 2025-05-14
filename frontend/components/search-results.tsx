"use client"

import { ThumbsUp, ThumbsDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface SearchResult {
  id: string
  title: string
  content: string
  pageNumber: number
  relevanceScore: number
  documentName: string
  userRating?: "up" | "down"
}

interface SearchResultsProps {
  results: SearchResult[]
  onRateResult: (id: string, rating: "up" | "down") => void
}

export default function SearchResults({ results, onRateResult }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-800 shadow-md h-[500px]">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
          <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-medium mb-2">No results yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search results will appear here after you ask a question.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Top Results</h2>
        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">{result.title}</h3>
                  <Badge variant="outline" className="ml-2">
                    {Math.round(result.relevanceScore * 100)}%
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{result.content}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    <span className="mr-2">{result.documentName}</span>
                    <span>Page {result.pageNumber}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={result.userRating === "up" ? "default" : "ghost"}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => onRateResult(result.id, "up")}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>Relevant</span>
                    </Button>
                    <Button
                      variant={result.userRating === "down" ? "default" : "ghost"}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => onRateResult(result.id, "down")}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      <span>Not Relevant</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
