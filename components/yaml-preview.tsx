"use client"

import * as yaml from "js-yaml"
import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

interface YAMLPreviewProps {
  formData: any
  showHeader?: boolean
  validationErrors?: string[]
}

export function YAMLPreview({ formData, showHeader = true, validationErrors = [] }: YAMLPreviewProps) {
  const [yamlContent, setYamlContent] = useState("")

  useEffect(() => {
    try {
      // Clean up null/empty values before generating YAML
      const cleanData = JSON.parse(
        JSON.stringify(formData, (key, value) => {
          if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
            return undefined
          }
          return value
        }),
      )

      const generated = yaml.dump(cleanData, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
      })
      setYamlContent(generated)
    } catch (error) {
      setYamlContent("# Error generating YAML")
    }
  }, [formData])

  return (
    <div className="h-full bg-muted/30">
      {showHeader && (
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 z-10">
          <h2 className="text-lg font-semibold">YAML Preview</h2>
          <p className="text-sm text-muted-foreground">Live preview of your SZGF file</p>
        </div>
      )}
      <div className="p-6 space-y-4">
        {validationErrors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                {validationErrors.length} validation error{validationErrors.length !== 1 ? "s" : ""}
              </span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              {validationErrors.slice(0, 3).map((error, i) => (
                <li key={i}>{error}</li>
              ))}
              {validationErrors.length > 3 && (
                <li className="text-muted-foreground/70">
                  ...and {validationErrors.length - 3} more (check console)
                </li>
              )}
            </ul>
          </div>
        )}
        <pre className="font-mono text-sm bg-card rounded-lg p-4 overflow-x-auto border border-border">
          <code>{yamlContent}</code>
        </pre>
      </div>
    </div>
  )
}
