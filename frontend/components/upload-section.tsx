"use client"

import type React from "react"

import { useState } from "react"
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

type UploadStatus = "idle" | "uploading" | "success" | "error"

interface FileWithStatus {
  file: File
  status: UploadStatus
  progress: number
  id: string
}

export default function UploadSection() {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        status: "idle" as UploadStatus,
        progress: 0,
        id: crypto.randomUUID(),
      }))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const uploadFiles = async () => {
    if (files.length === 0 || files.every((f) => f.status === "success")) return

    setIsUploading(true)

    // Update each file's status to uploading
    setFiles((prev) => prev.map((f) => (f.status === "idle" ? { ...f, status: "uploading" } : f)))

    // Simulate uploading each file
    for (const fileWithStatus of files) {
      if (fileWithStatus.status !== "uploading") continue

      try {
        // Simulate upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          setFiles((prev) => prev.map((f) => (f.id === fileWithStatus.id ? { ...f, progress } : f)))
        }

        // In a real app, you would upload the file to your backend here
        // const formData = new FormData()
        // formData.append('file', fileWithStatus.file)
        // const response = await fetch('/api/upload', { method: 'POST', body: formData })

        // Mark as success
        setFiles((prev) =>
          prev.map((f) => (f.id === fileWithStatus.id ? { ...f, status: "success", progress: 100 } : f)),
        )
      } catch (error) {
        console.error("Upload error:", error)
        setFiles((prev) => prev.map((f) => (f.id === fileWithStatus.id ? { ...f, status: "error", progress: 0 } : f)))
      }
    }

    setIsUploading(false)
    toast({
      title: "Upload complete",
      description: "Your documents have been processed and are ready for searching.",
    })
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <File className="h-5 w-5 text-slate-500" />
    }
  }

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Upload Documents</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Upload PDF, DOCX, or TXT files to build your knowledge base
          </p>
        </div>

        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 mb-6 text-center">
          <Upload className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
            Drag and drop your files here, or click to browse
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
            Supported formats: PDF, DOCX, TXT (Max 50MB per file)
          </p>
          <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
            Select Files
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Files ({files.length})</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {files.map((fileWithStatus) => (
                <div key={fileWithStatus.id} className="flex items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                  {getStatusIcon(fileWithStatus.status)}
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{fileWithStatus.file.name}</p>
                    <p className="text-xs text-slate-500">{(fileWithStatus.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    {fileWithStatus.status === "uploading" && (
                      <Progress value={fileWithStatus.progress} className="h-1 mt-1" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileWithStatus.id)}
                    disabled={isUploading && fileWithStatus.status === "uploading"}
                    className="ml-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={uploadFiles}
            disabled={isUploading || files.length === 0 || files.every((f) => f.status === "success")}
            className="w-full sm:w-auto"
          >
            {isUploading ? "Uploading..." : "Upload and Process Files"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
