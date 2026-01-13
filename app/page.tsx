"use client"

import { useState } from "react"
import { SZGFForm } from "@/components/szgf-form"
import { YAMLPreview } from "@/components/yaml-preview"
import { Header } from "@/components/header"
import { YAMLDrawer } from "@/components/yaml-drawer"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Home() {
  const [formData, setFormData] = useState<any>({
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

  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header formData={formData} setFormData={setFormData} isMobile={!!isMobile} />
      <div className="flex flex-1 overflow-hidden">
        <div className={isMobile ? "w-full overflow-y-auto" : "w-1/2 overflow-y-auto border-r border-border"}>
          <SZGFForm formData={formData} setFormData={setFormData} />
        </div>
        {!isMobile && (
          <div className="w-1/2 overflow-y-auto">
            <YAMLPreview formData={formData} />
          </div>
        )}
      </div>
      {isMobile && <YAMLDrawer formData={formData} setFormData={setFormData} />}
    </div>
  )
}
