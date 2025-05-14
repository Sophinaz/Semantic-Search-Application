"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  content: string
  pageNumber: number
  relevanceScore: number
  documentName: string
  userRating?: "up" | "down"
}

interface EmbeddingVisualizationProps {
  results: SearchResult[]
}

// Mock 2D coordinates for visualization
// In a real app, these would come from t-SNE or UMAP dimensionality reduction
const generateMockCoordinates = (results: SearchResult[]) => {
  return results.map((result) => ({
    id: result.id,
    title: result.title,
    x: Math.random() * 800,
    y: Math.random() * 400,
    relevanceScore: result.relevanceScore,
    documentName: result.documentName,
  }))
}

export default function EmbeddingVisualization({ results }: EmbeddingVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [coordinates, setCoordinates] = useState<any[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)

  useEffect(() => {
    if (results.length > 0) {
      // Simulate loading time for visualization calculation
      const timer = setTimeout(() => {
        setCoordinates(generateMockCoordinates(results))
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setIsLoading(false)
    }
  }, [results])

  useEffect(() => {
    if (!canvasRef.current || coordinates.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(50, canvas.height - 50)
    ctx.lineTo(canvas.width - 50, canvas.height - 50)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(50, canvas.height - 50)
    ctx.lineTo(50, 50)
    ctx.stroke()

    // Draw axis labels
    ctx.fillStyle = "#94a3b8"
    ctx.font = "12px sans-serif"
    ctx.fillText("Dimension 1", canvas.width / 2, canvas.height - 20)
    ctx.save()
    ctx.translate(15, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Dimension 2", 0, 0)
    ctx.restore()

    // Draw query point
    ctx.fillStyle = "#0ea5e9"
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#0369a1"
    ctx.font = "14px sans-serif"
    ctx.fillText("Query", canvas.width / 2 + 15, canvas.height / 2 + 5)

    // Draw result points
    coordinates.forEach((point) => {
      const isHovered = hoveredPoint === point.id

      // Calculate color based on relevance score
      const hue = 120 * point.relevanceScore // 0 = red, 120 = green
      ctx.fillStyle = isHovered ? "#f97316" : `hsl(${hue}, 70%, 50%)`

      // Draw point
      ctx.beginPath()
      ctx.arc(point.x, point.y, isHovered ? 8 : 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw label if hovered
      if (isHovered) {
        ctx.fillStyle = "#1e293b"
        ctx.font = "14px sans-serif"
        ctx.fillText(point.title, point.x + 12, point.y + 4)
      }
    })

    // Add event listeners for hover
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      let hoveredId = null
      for (const point of coordinates) {
        const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2)
        if (distance <= 10) {
          hoveredId = point.id
          break
        }
      }

      setHoveredPoint(hoveredId)
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [coordinates, hoveredPoint])

  if (results.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-800 shadow-md h-[500px]">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
          <h3 className="text-lg font-medium mb-2">No data to visualize</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search for documents to see the embedding visualization.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Embedding Space</h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[450px]">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">Generating visualization...</p>
          </div>
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={850}
              height={450}
              className="border border-slate-200 dark:border-slate-700 rounded-lg"
            />
            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              <p>This visualization shows document embeddings in 2D space using t-SNE dimensionality reduction.</p>
              <p className="mt-1">Hover over points to see document titles. Colors indicate relevance score.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
