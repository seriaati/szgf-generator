import { useState } from "react"
import { Header } from "@/components/header"
import { SZGFForm } from "@/components/szgf-form"
import { YAMLPreview } from "@/components/yaml-preview"
import { YAMLDrawer } from "@/components/yaml-drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { defaultFormData, type FormData } from "@/lib/form-data"

export default function App() {
    const [formData, setFormData] = useState<FormData>(defaultFormData)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const isMobile = useIsMobile()

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header
                formData={formData}
                setFormData={setFormData}
                isMobile={!!isMobile}
                onValidationChange={setValidationErrors}
            />
            <div className="flex flex-1 overflow-hidden">
                <div className={isMobile ? "w-full overflow-y-auto" : "w-1/2 overflow-y-auto border-r border-border"}>
                    <SZGFForm formData={formData} setFormData={setFormData} />
                </div>
                {!isMobile && (
                    <div className="w-1/2 overflow-y-auto">
                        <YAMLPreview formData={formData} validationErrors={validationErrors} />
                    </div>
                )}
            </div>
            {isMobile && <YAMLDrawer formData={formData} setFormData={setFormData} />}
        </div>
    )
}
