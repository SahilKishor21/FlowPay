"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export function FakeCurrencyChecklist() {
  const checks = [
    "Watermark visible when held against light",
    "Security thread present and correct",
    "Identification mark (Ashoka Pillar) tactile",
    "Optically Variable Ink (OVI) changes color",
    "Micro lettering clear with magnifying glass",
    "Bleed lines properly aligned",
    "Number panels match on both sides"
  ]

  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <AlertCircle className="h-5 w-5" />
          Fake Currency Detection Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox id={`check-${index}`} />
              <Label 
                htmlFor={`check-${index}`}
                className="text-sm font-normal cursor-pointer"
              >
                {check}
              </Label>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <p className="text-xs text-red-800 dark:text-red-200 font-semibold">
            ⚠️ If any check fails, DO NOT accept the note. Report to authorities immediately.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}