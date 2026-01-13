"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, Upload, FileUp, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import * as yaml from "js-yaml"
import { useRef, useState, useEffect } from "react"
import Ajv from "ajv"

interface YAMLActionsProps {
  formData: any
  setFormData: (data: any) => void
  isMobile?: boolean
  onValidationChange?: (errors: string[]) => void
}

export function YAMLActions({ formData, setFormData, isMobile = false, onValidationChange }: YAMLActionsProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [schema, setSchema] = useState<any>(null)

  // Notify parent of validation changes
  useEffect(() => {
    onValidationChange?.(validationErrors)
  }, [validationErrors, onValidationChange])

  // Fetch schema on mount
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/seriaati/zzz-guides/refs/heads/main/schema.json")
      .then((res) => res.json())
      .then((data) => setSchema(data))
      .catch((err) => console.error("Failed to fetch schema:", err))
  }, [])

  // Live validation whenever formData changes
  useEffect(() => {
    if (schema && isFormValid()) {
      validateFormData()
    }
  }, [formData, schema])

  const validateFormData = (): string[] | null => {
    const errors: string[] = []

    // Basic validation
    if (!formData.author) errors.push("Author is required")
    if (!formData.last_updated) errors.push("Last updated date is required")
    if (!formData.description) errors.push("Description is required")
    if (!formData.character?.name) errors.push("Character name is required")
    if (!formData.character?.rarity) errors.push("Character rarity is required")

    // JSON Schema validation if available
    if (schema) {
      const ajv = new Ajv({ allErrors: true, strict: false })
      const validate = ajv.compile(schema)

      // Clean data same way as YAML generation
      const cleanData = JSON.parse(
        JSON.stringify(formData, (_key, value) => {
          if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
            return undefined
          }
          return value
        }),
      )

      const valid = validate(cleanData)
      if (!valid && validate.errors) {
        validate.errors.forEach((error) => {
          const path = error.instancePath || "root"
          const message = error.message || "validation error"
          errors.push(`${path}: ${message}`)
        })
      }
    }

    setValidationErrors(errors)
    return errors.length === 0 ? null : errors
  }

  const isFormValid = () => {
    // Check required basic fields
    if (!formData.author || !formData.last_updated || !formData.description) {
      return false
    }
    // Check character required fields
    if (!formData.character?.name || !formData.character?.rarity) {
      return false
    }
    return true
  }

  const generateYAML = () => {
    // Clean up null/empty values
    const cleanData = JSON.parse(
      JSON.stringify(formData, (key, value) => {
        if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          return undefined
        }
        return value
      }),
    )

    const yamlContent = yaml.dump(cleanData, {
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
    })

    return `# yaml-language-server: $schema=../../schema.json\n\n${yamlContent}`
  }

  const handleDownload = () => {
    const errors = validateFormData()
    if (errors) {
      toast({
        title: "Validation Failed",
        description: "Please fix validation errors before downloading",
        variant: "destructive",
      })
      console.error("Validation errors:", errors)
      return
    }

    const yamlContent = generateYAML()
    const blob = new Blob([yamlContent], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formData.character.name || "guide"}.yml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded",
      description: "YAML file downloaded successfully",
    })
  }

  const handleCopy = async () => {
    const errors = validateFormData()
    if (errors) {
      toast({
        title: "Validation Failed",
        description: "Please fix validation errors before copying",
        variant: "destructive",
      })
      console.error("Validation errors:", errors)
      return
    }

    const yamlContent = generateYAML()
    await navigator.clipboard.writeText(yamlContent)
    toast({
      title: "Copied",
      description: "YAML content copied to clipboard",
    })
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const parsed = yaml.load(content) as any
        setFormData(parsed)
        toast({
          title: "Imported",
          description: "YAML file imported successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse YAML file",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handlePasteYAML = () => {
    const dialog = document.createElement("dialog")
    dialog.className = "rounded-lg p-6 max-w-2xl w-full backdrop:bg-black/50"
    dialog.innerHTML = `
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-foreground">Paste YAML Content</h2>
        <textarea id="yaml-paste-area" class="w-full h-64 p-3 border border-input rounded-lg font-mono text-sm bg-background text-foreground" placeholder="Paste your YAML content here..."></textarea>
        <div class="flex gap-2 justify-end">
          <button id="cancel-paste" class="px-4 py-2 rounded-lg border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground">Cancel</button>
          <button id="confirm-paste" class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">Import</button>
        </div>
      </div>
    `
    document.body.appendChild(dialog)
    dialog.showModal()

    const textarea = dialog.querySelector("#yaml-paste-area") as HTMLTextAreaElement
    const cancelBtn = dialog.querySelector("#cancel-paste")
    const confirmBtn = dialog.querySelector("#confirm-paste")

    cancelBtn?.addEventListener("click", () => {
      dialog.close()
      document.body.removeChild(dialog)
    })

    confirmBtn?.addEventListener("click", () => {
      try {
        const content = textarea.value
        const parsed = yaml.load(content) as any
        setFormData(parsed)
        toast({
          title: "Imported",
          description: "YAML content imported successfully",
        })
        dialog.close()
        document.body.removeChild(dialog)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse YAML content",
          variant: "destructive",
        })
      }
    })
  }

  const handleClearForm = () => {
    if (confirm("Are you sure you want to clear the entire form? This action cannot be undone.")) {
      setFormData({
        author: "",
        last_updated: new Date().toISOString().split("T")[0],
        character: {
          name: "",
          rarity: 5,
          banner: null,
        },
        description: "",
        weapons: [],
        discs: null,
        stat: null,
        skill_priority: null,
        skills: [],
        mindscapes: [],
        team: null,
        rotation: null,
      })
      toast({
        title: "Cleared",
        description: "Form has been cleared successfully",
      })
    }
  }

  if (isMobile) {
    return (
      <>
        <div className="flex flex-wrap gap-2 p-4">
          <Button variant="destructive" size="sm" onClick={handleClearForm} className="flex-1 min-w-30">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Form
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="flex-1 min-w-30">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          <Button variant="outline" size="sm" onClick={handlePasteYAML} className="flex-1 min-w-30">
            <FileUp className="h-4 w-4 mr-2" />
            Paste YAML
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!isFormValid()} className="flex-1 min-w-30">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={!isFormValid()} className="flex-1 min-w-30">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept=".yml,.yaml" className="hidden" onChange={handleImportFile} />
      </>
    )
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="destructive" size="sm" onClick={handleClearForm}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Form
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
        <Button variant="outline" size="sm" onClick={handlePasteYAML}>
          <FileUp className="h-4 w-4 mr-2" />
          Paste YAML
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!isFormValid()}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button size="sm" onClick={handleDownload} disabled={!isFormValid()}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      <input ref={fileInputRef} type="file" accept=".yml,.yaml" className="hidden" onChange={handleImportFile} />
    </>
  )
}
