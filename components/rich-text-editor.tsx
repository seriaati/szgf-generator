"use client"

import * as React from "react"
import { useRef, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Bold, Italic, Underline, Strikethrough } from "lucide-react"
import { cn } from "@/lib/utils"

// Skill icon tags with their images
const skillTags = [
  { name: "Basic Attack", tag: "<basic>", icon: "https://api.hakush.in/zzz/UI/Icon_Normal.webp" },
  { name: "Dodge", tag: "<dodge>", icon: "https://api.hakush.in/zzz/UI/Icon_Evade.webp" },
  { name: "Chain", tag: "<chain>", icon: "https://api.hakush.in/zzz/UI/Icon_UltimateReady.webp" },
  { name: "Special", tag: "<special>", icon: "https://api.hakush.in/zzz/UI/Icon_SpecialReady.webp" },
  { name: "Assist", tag: "<assist>", icon: "https://api.hakush.in/zzz/UI/Icon_Switch.webp" },
  { name: "Core Skill", tag: "<core>", icon: "https://api.hakush.in/zzz/UI/Icon_CoreSkill.webp" },
] as const

// Markdown formatting options
const markdownFormats = [
  { name: "Bold", icon: Bold, prefix: "**", suffix: "**" },
  { name: "Italic", icon: Italic, prefix: "*", suffix: "*" },
  { name: "Underline", icon: Underline, prefix: "__", suffix: "__" },
  { name: "Strikethrough", icon: Strikethrough, prefix: "~~", suffix: "~~" },
] as const

interface RichTextEditorProps extends Omit<React.ComponentProps<typeof Textarea>, "onChange"> {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange, className, ...props }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Insert text at cursor position or wrap selected text
  const insertFormat = useCallback(
    (prefix: string, suffix: string = "") => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)

      let newValue: string
      let newCursorPos: number

      if (selectedText) {
        // Wrap selected text with formatting
        newValue = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)
        newCursorPos = end + prefix.length + suffix.length
      } else {
        // Insert formatting at cursor and place cursor between prefix and suffix
        newValue = value.substring(0, start) + prefix + suffix + value.substring(end)
        newCursorPos = start + prefix.length
      }

      onChange(newValue)

      // Restore focus and cursor position after state update
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      })
    },
    [value, onChange]
  )

  // Insert a tag at cursor position
  const insertTag = useCallback(
    (tag: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      const newValue = value.substring(0, start) + tag + value.substring(end)
      const newCursorPos = start + tag.length

      onChange(newValue)

      // Restore focus and cursor position after state update
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      })
    },
    [value, onChange]
  )

  return (
    <div className="space-y-2">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1">
        {/* Markdown Formatting Buttons */}
        <div className="flex items-center gap-0.5 rounded-md border bg-background p-0.5">
          {markdownFormats.map((format) => (
            <Tooltip key={format.name}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => insertFormat(format.prefix, format.suffix)}
                  className="size-7"
                >
                  <format.icon className="size-4" />
                  <span className="sr-only">{format.name}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{format.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Separator */}
        <div className="mx-1 h-6 w-px bg-border" />

        {/* Skill Icon Buttons */}
        <div className="flex items-center gap-0.5 rounded-md border bg-background p-0.5">
          {skillTags.map((skill) => (
            <Tooltip key={skill.tag}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => insertTag(skill.tag)}
                  className="size-7"
                >
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="size-4"
                  />
                  <span className="sr-only">{skill.name}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{skill.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(className)}
        {...props}
      />
    </div>
  )
}
