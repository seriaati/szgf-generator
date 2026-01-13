"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { YAMLPreview } from "@/components/yaml-preview"
import { YAMLActions } from "@/components/yaml-actions"
import { Toaster } from "@/components/ui/toaster"
import { FileCode2 } from "lucide-react"

interface YAMLDrawerProps {
  formData: any
  setFormData: (data: any) => void
}

export function YAMLDrawer({ formData, setFormData }: YAMLDrawerProps) {
  const [open, setOpen] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg h-14 w-14 p-0 z-40 md:hidden"
        aria-label="Open YAML Preview"
      >
        <FileCode2 className="h-6 w-6" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[90vh] w-full p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>YAML Preview</SheetTitle>
            <SheetDescription>View and export your SZGF guide</SheetDescription>
          </SheetHeader>

          <div className="border-b border-border">
            <YAMLActions
              formData={formData}
              setFormData={setFormData}
              isMobile={true}
              onValidationChange={setValidationErrors}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <YAMLPreview formData={formData} showHeader={false} validationErrors={validationErrors} />
          </div>
        </SheetContent>
      </Sheet>

      <Toaster />
    </>
  )
}
