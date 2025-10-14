"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { clientAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ClientSelectorProps {
  value: string
  onValueChange: (value: string) => void
  onAddNew: () => void
}

export function ClientSelector({ value, onValueChange, onAddNew }: ClientSelectorProps) {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const data = await clientAPI.getAll()
      setClients(data)
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onValueChange} disabled={loading}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={loading ? "Loading clients..." : "Select client"} />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client._id} value={client._id}>
              {client.name} - {client.companyName}
              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                client.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                client.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {client.riskLevel} Risk
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button variant="outline" size="icon" onClick={onAddNew}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}