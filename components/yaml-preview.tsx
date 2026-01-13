"use client"

import * as yaml from "js-yaml"
import { useEffect, useState } from "react"

interface YAMLPreviewProps {
  formData: any
  showHeader?: boolean
}

export function YAMLPreview({ formData, showHeader = true }: YAMLPreviewProps) {
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
      <div className="p-6">
        <pre className="font-mono text-sm bg-card rounded-lg p-4 overflow-x-auto border border-border">
          <code>{yamlContent}</code>
        </pre>
      </div>
    </div>
  )
}
