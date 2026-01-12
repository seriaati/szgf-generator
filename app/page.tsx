"use client"

import { useState } from "react"
import { SZGFForm } from "@/components/szgf-form"
import { YAMLPreview } from "@/components/yaml-preview"
import { Header } from "@/components/header"

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header formData={formData} setFormData={setFormData} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 overflow-y-auto border-r border-border">
          <SZGFForm formData={formData} setFormData={setFormData} />
        </div>
        <div className="w-1/2 overflow-y-auto">
          <YAMLPreview formData={formData} />
        </div>
      </div>
    </div>
  )
}
