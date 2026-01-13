"use client"

import { YAMLActions } from "@/components/yaml-actions"
import { Toaster } from "@/components/ui/toaster"

interface HeaderProps {
  formData: any
  setFormData: (data: any) => void
  isMobile?: boolean
}

export function Header({ formData, setFormData, isMobile = false }: HeaderProps) {
  return (
    <>
      <header className="border-b border-border bg-card px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">SZGF Generator</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Standardized ZZZ Guide Format</p>
          </div>
          {!isMobile && <YAMLActions formData={formData} setFormData={setFormData} />}
        </div>
      </header>
      <Toaster />
    </>
  )
}
