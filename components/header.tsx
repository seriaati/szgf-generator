"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, Upload, FileUp, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import * as yaml from "js-yaml"
import { useRef } from "react"

interface HeaderProps {
  formData: any
  setFormData: (data: any) => void
}

export function Header({ formData, setFormData }: HeaderProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    return `# yaml-language-server: $schema=../../schema.json\n${yamlContent}`
  }

  const handleDownload = () => {
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

  return (
    <>
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">SZGF Generator</h1>
            <p className="text-sm text-muted-foreground">Standardized ZZZ Guide Format</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClearForm}>
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
        </div>
      </header>
      <input ref={fileInputRef} type="file" accept=".yml,.yaml" className="hidden" onChange={handleImportFile} />
      <Toaster />
    </>
  )
}
