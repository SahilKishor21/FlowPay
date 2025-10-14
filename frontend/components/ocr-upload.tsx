"use client"

import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ocrAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface OCRUploadProps {
  onDataExtracted: (data: any) => void
}

export function OCRUpload({ onDataExtracted }: OCRUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload and extract
    setUploading(true)
    try {
      const result = await ocrAPI.extractCheque(file)
      
      toast({
        title: "✅ Cheque Scanned Successfully",
        description: `Extracted data with ${Math.round(result.confidence)}% confidence`,
      })

      onDataExtracted(result)
    } catch (error) {
      toast({
        title: "❌ OCR Failed",
        description: "Failed to extract data from cheque image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan Cheque (OCR)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {preview && (
            <div className="relative w-full h-48 border rounded-lg overflow-hidden">
              <img 
                src={preview} 
                alt="Cheque preview" 
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                    <p className="text-sm text-gray-500">Extracting data...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload cheque image</p>
                    <p className="text-xs text-gray-400">PNG, JPG (max 5MB)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="text-xs text-gray-500">
            <p className="font-semibold mb-1">Tips for best results:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Take photo in good lighting</li>
              <li>Ensure all text is clearly visible</li>
              <li>Avoid shadows and glare</li>
              <li>Keep cheque flat and straight</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}