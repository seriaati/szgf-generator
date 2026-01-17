"use client"

import { YAMLActions } from "@/components/yaml-actions"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ExternalLink } from "lucide-react"

interface HeaderProps {
  formData: any
  setFormData: (data: any) => void
  isMobile?: boolean
  onValidationChange?: (errors: string[]) => void
}

export function Header({ formData, setFormData, isMobile = false, onValidationChange }: HeaderProps) {
  return (
    <>
      <header className="border-b border-border bg-card px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">SZGF Generator</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Standardized ZZZ Guide Format</p>
            </div>
            <div className="flex gap-3 items-center">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://link.seria.moe/hb-dc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <span>Discord Server</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://github.com/seriaati/zzz-guides" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <span>GitHub</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </div>
          {!isMobile && (
            <YAMLActions formData={formData} setFormData={setFormData} onValidationChange={onValidationChange} />
          )}
        </div>
      </header>
      <Toaster />
    </>
  )
}
