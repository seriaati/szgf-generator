"use client"

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Check, ChevronsUpDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface Character {
  code: string
  EN: string
  rank: number
  icon: string
  camp: number
}

interface Weapon {
  EN: string
  rank: number
  type: number
  icon: string
}

interface DriveDisc {
  id: string
  EN: {
    name: string
    desc2: string
    desc4: string
  }
  icon: string
}

interface SZGFFormProps {
  formData: any
  setFormData: (data: any) => void
}

export function SZGFForm({ formData, setFormData }: SZGFFormProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loadingCharacters, setLoadingCharacters] = useState(true)
  const [characterComboOpen, setCharacterComboOpen] = useState(false)
  const [weaponsList, setWeaponsList] = useState<Weapon[]>([])
  const [loadingWeapons, setLoadingWeapons] = useState(true)
  const [weaponComboOpen, setWeaponComboOpen] = useState<{ [key: number]: boolean }>({})
  const [driveDiscsList, setDriveDiscsList] = useState<DriveDisc[]>([])
  const [loadingDriveDiscs, setLoadingDriveDiscs] = useState(true)
  const [discComboOpen, setDiscComboOpen] = useState<{ [key: string]: boolean }>({})
  const [teamCharComboOpen, setTeamCharComboOpen] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch("https://api.hakush.in/zzz/data/character.json")
        const data = await response.json()
        // Convert object to array of characters
        const charactersArray = Object.values(data) as Character[]
        // Sort by English name for better UX
        charactersArray.sort((a, b) => a.EN.localeCompare(b.EN))
        setCharacters(charactersArray)
      } catch (error) {
        console.error("Failed to fetch characters:", error)
      } finally {
        setLoadingCharacters(false)
      }
    }

    fetchCharacters()
  }, [])

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const response = await fetch("https://api.hakush.in/zzz/data/weapon.json")
        const data = await response.json()
        // Convert object to array of weapons
        const weaponsArray = Object.values(data) as Weapon[]
        // Sort by rank (descending) then by English name
        weaponsArray.sort((a, b) => {
          if (b.rank !== a.rank) return b.rank - a.rank
          return a.EN.localeCompare(b.EN)
        })
        setWeaponsList(weaponsArray)
      } catch (error) {
        console.error("Failed to fetch weapons:", error)
      } finally {
        setLoadingWeapons(false)
      }
    }

    fetchWeapons()
  }, [])

  useEffect(() => {
    const fetchDriveDiscs = async () => {
      try {
        const response = await fetch("https://api.hakush.in/zzz/data/equipment.json")
        const data = await response.json()
        // Convert object to array of drive discs with IDs
        const driveDiscsArray = Object.entries(data).map(([id, disc]) => ({
          ...(disc as Omit<DriveDisc, "id">),
          id,
        })) as DriveDisc[]
        // Sort by English name
        driveDiscsArray.sort((a, b) => a.EN.name.localeCompare(b.EN.name))
        setDriveDiscsList(driveDiscsArray)
      } catch (error) {
        console.error("Failed to fetch drive discs:", error)
      } finally {
        setLoadingDriveDiscs(false)
      }
    }

    fetchDriveDiscs()
  }, [])

  const updateField = (path: string, value: any) => {
    const keys = path.split(".")
    const newData = { ...formData }
    let current: any = newData

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    setFormData(newData)
  }

  const addArrayItem = (path: string, template: any) => {
    const keys = path.split(".")
    const newData = { ...formData }
    let current: any = newData

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }

    const array = current[keys[keys.length - 1]] || []
    current[keys[keys.length - 1]] = [...array, template]
    setFormData(newData)
  }

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split(".")
    const newData = { ...formData }
    let current: any = newData

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }

    const array = [...current[keys[keys.length - 1]]]
    array.splice(index, 1)
    current[keys[keys.length - 1]] = array
    setFormData(newData)
  }

  const updateArrayItem = (path: string, index: number, field: string, value: any) => {
    const keys = path.split(".")
    const newData = { ...formData }
    let current: any = newData

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }

    const array = [...current[keys[keys.length - 1]]]
    array[index] = { ...array[index], [field]: value }
    current[keys[keys.length - 1]] = array
    setFormData(newData)
  }

  const weapons = formData.weapons || []
  const skills = formData.skills || []
  const mindscapes = formData.mindscapes || []
  const discsFourPieces = formData.discs?.four_pieces || []
  const discsTwoPieces = formData.discs?.two_pieces || []
  const discsExtraSections = formData.discs?.extra_sections || []
  const mainStats = formData.stat?.main_stats || []
  const statExtraSections = formData.stat?.extra_sections || []
  const skillPriorities = formData.skill_priority?.priorities || []
  const teams = formData.team?.teams || []
  const teamExtraSections = formData.team?.extra_sections || []

  return (
    <div className="p-6 space-y-6">
      <Accordion type="multiple" defaultValue={["basic", "character"]} className="w-full">
        {/* Basic Information */}
        <AccordionItem value="basic">
          <AccordionTrigger className="text-lg font-semibold">Basic Information</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => updateField("author", e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_updated">Last Updated *</Label>
              <Input
                id="last_updated"
                type="date"
                value={formData.last_updated}
                onChange={(e) => updateField("last_updated", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the purpose and content of this guide..."
                rows={8}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Character */}
        <AccordionItem value="character">
          <AccordionTrigger className="text-lg font-semibold">Character *</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="char-name">Character Name *</Label>
              <Popover open={characterComboOpen} onOpenChange={setCharacterComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={characterComboOpen}
                    className="w-full justify-between"
                    disabled={loadingCharacters}
                  >
                    {loadingCharacters ? (
                      "Loading characters..."
                    ) : formData.character.name ? (
                      <span className="flex items-center">
                        {(() => {
                          const selectedChar = characters.find((char) => char.EN === formData.character.name)
                          const iconUrl = selectedChar?.icon
                            ? `https://api.hakush.in/zzz/UI/${selectedChar.icon.replace("IconRole", "IconRoleCrop")}.webp`
                            : null
                          return (
                            <>
                              {iconUrl && (
                                <img
                                  src={iconUrl}
                                  alt={selectedChar?.EN}
                                  className="mr-2 h-6 w-6 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                  }}
                                />
                              )}
                              {selectedChar?.EN}
                            </>
                          )
                        })()}
                      </span>
                    ) : (
                      "Select a character..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-100 p-0">
                  <Command>
                    <CommandInput placeholder="Search character..." />
                    <CommandList>
                      <CommandEmpty>No character found.</CommandEmpty>
                      <CommandGroup>
                        {characters.map((char) => {
                          // Convert IconRole01 to IconRoleCrop01.webp
                          const iconUrl = char.icon
                            ? `https://api.hakush.in/zzz/UI/${char.icon.replace("IconRole", "IconRoleCrop")}.webp`
                            : null
                          return (
                            <CommandItem
                              key={char.code}
                              value={char.EN}
                              onSelect={() => {
                                updateField("character.name", formData.character.name === char.EN ? "" : char.EN)
                                setCharacterComboOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.character.name === char.EN ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {iconUrl && (
                                <img
                                  src={iconUrl}
                                  alt={char.EN}
                                  className="mr-2 h-8 w-8 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                  }}
                                />
                              )}
                              <span>
                                {char.EN} ({char.rank === 3 ? "A" : "S"}-rank)
                              </span>
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="char-rarity">Rarity *</Label>
              <Select
                value={String(formData.character.rarity)}
                onValueChange={(value) => updateField("character.rarity", Number(value))}
              >
                <SelectTrigger id="char-rarity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 (A-rank)</SelectItem>
                  <SelectItem value="5">5 (S-rank)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="char-banner">Banner URL (optional)</Label>
              <p className="text-xs text-muted-foreground">If not provided, will use icon from hakush.in</p>
              <Input
                id="char-banner"
                value={formData.character.banner || ""}
                onChange={(e) => updateField("character.banner", e.target.value || null)}
                placeholder="https://..."
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Weapons */}
        <AccordionItem value="weapons">
          <AccordionTrigger className="text-lg font-semibold">Weapons ({weapons.length})</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {weapons.map((weapon: any, index: number) => (
              <Card key={index} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Weapon {index + 1}</h4>
                  <Button variant="ghost" size="sm" onClick={() => removeArrayItem("weapons", index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Popover
                    open={weaponComboOpen[index] || false}
                    onOpenChange={(open) => setWeaponComboOpen({ ...weaponComboOpen, [index]: open })}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={weaponComboOpen[index] || false}
                        className="w-full justify-between"
                        disabled={loadingWeapons}
                      >
                        {loadingWeapons ? (
                          "Loading weapons..."
                        ) : weapon.name ? (
                          <span className="flex items-center">
                            {(() => {
                              const selectedWeapon = weaponsList.find((w) => w.EN === weapon.name)
                              const iconUrl = selectedWeapon?.icon
                                ? `https://api.hakush.in/zzz/UI/${selectedWeapon.icon}.webp`
                                : null
                              return (
                                <>
                                  {iconUrl && (
                                    <img
                                      src={iconUrl}
                                      alt={selectedWeapon?.EN}
                                      className="mr-2 h-6 w-6 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none"
                                      }}
                                    />
                                  )}
                                  {selectedWeapon?.EN || weapon.name}
                                </>
                              )
                            })()}
                          </span>
                        ) : (
                          "Select a W-Engine..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-100 p-0">
                      <Command>
                        <CommandInput placeholder="Search W-Engine..." />
                        <CommandList>
                          <CommandEmpty>No W-Engine found.</CommandEmpty>
                          <CommandGroup>
                            {weaponsList.map((w, wIndex) => {
                              const iconUrl = w.icon ? `https://api.hakush.in/zzz/UI/${w.icon}.webp` : null
                              return (
                                <CommandItem
                                  key={wIndex}
                                  value={w.EN}
                                  onSelect={() => {
                                    updateArrayItem("weapons", index, "name", weapon.name === w.EN ? "" : w.EN)
                                    setWeaponComboOpen({ ...weaponComboOpen, [index]: false })
                                  }}
                                >
                                  <Check
                                    className={cn("mr-2 h-4 w-4", weapon.name === w.EN ? "opacity-100" : "opacity-0")}
                                  />
                                  {iconUrl && (
                                    <img
                                      src={iconUrl}
                                      alt={w.EN}
                                      className="mr-2 h-8 w-8 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none"
                                      }}
                                    />
                                  )}
                                  <span>
                                    {w.EN} ({w.rank === 2 ? "B" : w.rank === 3 ? "A" : "S"}-rank)
                                  </span>
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={weapon.description}
                    onChange={(e) => updateArrayItem("weapons", index, "description", e.target.value)}
                    placeholder="Why this weapon is recommended..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (optional)</Label>
                  <Input
                    value={weapon.title || ""}
                    onChange={(e) => updateArrayItem("weapons", index, "title", e.target.value || null)}
                    placeholder="e.g., Best W-Engine"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon URL (optional)</Label>
                  <p className="text-xs text-muted-foreground">If not provided, will use icon from hakush.in</p>
                  <Input
                    value={weapon.icon || ""}
                    onChange={(e) => updateArrayItem("weapons", index, "icon", e.target.value || null)}
                    placeholder="https://..."
                  />
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => addArrayItem("weapons", { name: "", description: "", title: null, icon: null })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Weapon
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="discs">
          <AccordionTrigger className="text-lg font-semibold">
            Drive Discs {formData.discs && "(Configured)"}
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {!formData.discs && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => updateField("discs", { four_pieces: [], two_pieces: [], extra_sections: [] })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Enable Disc Section
              </Button>
            )}
            {formData.discs && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Four-Piece Sets ({discsFourPieces.length})</h4>
                  </div>
                  {discsFourPieces.map((disc: any, index: number) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">4-Piece Set {index + 1}</h5>
                        <Button variant="ghost" size="sm" onClick={() => removeArrayItem("discs.four_pieces", index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Popover
                          open={discComboOpen[`four-${index}`] || false}
                          onOpenChange={(open) => setDiscComboOpen({ ...discComboOpen, [`four-${index}`]: open })}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={discComboOpen[`four-${index}`] || false}
                              className="w-full justify-between"
                              disabled={loadingDriveDiscs}
                            >
                              {loadingDriveDiscs ? (
                                "Loading drive discs..."
                              ) : disc.name ? (
                                <span className="flex items-center">
                                  {(() => {
                                    const selectedDisc = driveDiscsList.find((d) => d.EN.name === disc.name)
                                    const iconUrl = selectedDisc?.id
                                      ? `https://raw.githubusercontent.com/seriaati/zzz-guides/refs/heads/main/assets/drive_discs/single/${selectedDisc.id}.webp`
                                      : null
                                    return (
                                      <>
                                        {iconUrl && (
                                          <img
                                            src={iconUrl}
                                            alt={selectedDisc?.EN.name}
                                            className="mr-2 h-6 w-6 object-contain"
                                            onError={(e) => {
                                              e.currentTarget.style.display = "none"
                                            }}
                                          />
                                        )}
                                        {selectedDisc?.EN.name || disc.name}
                                      </>
                                    )
                                  })()}
                                </span>
                              ) : (
                                "Select a 4-piece set..."
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-100 p-0">
                            <Command>
                              <CommandInput placeholder="Search drive disc..." />
                              <CommandList>
                                <CommandEmpty>No drive disc found.</CommandEmpty>
                                <CommandGroup>
                                  {driveDiscsList.map((d, dIndex) => {
                                    const iconUrl = d.id
                                      ? `https://raw.githubusercontent.com/seriaati/zzz-guides/refs/heads/main/assets/drive_discs/single/${d.id}.webp`
                                      : null
                                    return (
                                      <CommandItem
                                        key={dIndex}
                                        value={d.EN.name}
                                        onSelect={() => {
                                          updateArrayItem(
                                            "discs.four_pieces",
                                            index,
                                            "name",
                                            disc.name === d.EN.name ? "" : d.EN.name
                                          )
                                          setDiscComboOpen({ ...discComboOpen, [`four-${index}`]: false })
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            disc.name === d.EN.name ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {iconUrl && (
                                          <img
                                            src={iconUrl}
                                            alt={d.EN.name}
                                            className="mr-2 h-8 w-8 object-contain"
                                            onError={(e) => {
                                              e.currentTarget.style.display = "none"
                                            }}
                                          />
                                        )}
                                        <span>{d.EN.name}</span>
                                      </CommandItem>
                                    )
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={disc.description}
                          onChange={(e) => updateArrayItem("discs.four_pieces", index, "description", e.target.value)}
                          placeholder="Why this set is recommended..."
                          rows={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon URL (optional)</Label>
                        <p className="text-xs text-muted-foreground">If not provided, will use icon from hakush.in</p>
                        <Input
                          value={disc.icon || ""}
                          onChange={(e) => updateArrayItem("discs.four_pieces", index, "icon", e.target.value || null)}
                          placeholder="https://..."
                        />
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => addArrayItem("discs.four_pieces", { name: "", description: "", icon: null })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add 4-Piece Set
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Two-Piece Sets ({discsTwoPieces.length})</h4>
                  </div>
                  {discsTwoPieces.map((disc: any, index: number) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">2-Piece Set {index + 1}</h5>
                        <Button variant="ghost" size="sm" onClick={() => removeArrayItem("discs.two_pieces", index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Name * (Can select 1-2 sets)</Label>
                        <Popover
                          open={discComboOpen[`two-${index}`] || false}
                          onOpenChange={(open) => setDiscComboOpen({ ...discComboOpen, [`two-${index}`]: open })}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={discComboOpen[`two-${index}`] || false}
                              className="w-full justify-between"
                              disabled={loadingDriveDiscs}
                            >
                              {loadingDriveDiscs ? (
                                "Loading drive discs..."
                              ) : disc.name ? (
                                <span className="flex items-center">
                                  {(() => {
                                    const selectedSets = disc.name.split(" / ")
                                    const selectedDiscs = selectedSets
                                      .map((name: string) => driveDiscsList.find((d: DriveDisc) => d.EN.name === name))
                                      .filter((d: DriveDisc | undefined): d is DriveDisc => d !== undefined)

                                    let iconUrl = null
                                    if (selectedDiscs.length === 2) {
                                      // Combined icon for two sets
                                      const ids = selectedDiscs.map((d: DriveDisc) => d.id).sort()
                                      iconUrl = `https://raw.githubusercontent.com/seriaati/zzz-guides/refs/heads/main/assets/drive_discs/combined/${ids[0]}_${ids[1]}.webp`
                                    } else if (selectedDiscs.length === 1) {
                                      // Single icon
                                      iconUrl = `https://raw.githubusercontent.com/seriaati/zzz-guides/refs/heads/main/assets/drive_discs/single/${selectedDiscs[0].id}.webp`
                                    }

                                    return (
                                      <>
                                        {iconUrl && (
                                          <img
                                            src={iconUrl}
                                            alt={disc.name}
                                            className="mr-2 h-6 w-6 object-contain"
                                            onError={(e) => {
                                              e.currentTarget.style.display = "none"
                                            }}
                                          />
                                        )}
                                        {disc.name}
                                      </>
                                    )
                                  })()}
                                </span>
                              ) : (
                                "Select 1-2 two-piece sets..."
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-100 p-0">
                            <Command>
                              <CommandInput placeholder="Search drive disc..." />
                              <CommandList>
                                <CommandEmpty>No drive disc found.</CommandEmpty>
                                <CommandGroup>
                                  {driveDiscsList.map((d, dIndex) => {
                                    const selectedSets = disc.name ? disc.name.split(" / ") : []
                                    const isSelected = selectedSets.includes(d.EN.name)
                                    const iconUrl = d.id
                                      ? `https://raw.githubusercontent.com/seriaati/zzz-guides/refs/heads/main/assets/drive_discs/single/${d.id}.webp`
                                      : null
                                    return (
                                      <CommandItem
                                        key={dIndex}
                                        value={d.EN.name}
                                        onSelect={() => {
                                          let newSets = [...selectedSets]
                                          if (isSelected) {
                                            // Remove the set
                                            newSets = newSets.filter((s) => s !== d.EN.name)
                                          } else {
                                            // Add the set (max 2)
                                            if (newSets.length < 2) {
                                              newSets.push(d.EN.name)
                                            }
                                          }
                                          updateArrayItem("discs.two_pieces", index, "name", newSets.join(" / "))
                                        }}
                                      >
                                        <Check
                                          className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                                        />
                                        {iconUrl && (
                                          <img
                                            src={iconUrl}
                                            alt={d.EN.name}
                                            className="mr-2 h-8 w-8 object-contain"
                                            onError={(e) => {
                                              e.currentTarget.style.display = "none"
                                            }}
                                          />
                                        )}
                                        <span>{d.EN.name}</span>
                                      </CommandItem>
                                    )
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground">
                          Selected: {disc.name || "None"} ({disc.name ? disc.name.split(" / ").length : 0}/2)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={disc.description}
                          onChange={(e) => updateArrayItem("discs.two_pieces", index, "description", e.target.value)}
                          placeholder="Why this set is recommended..."
                          rows={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon URL (optional)</Label>
                        <p className="text-xs text-muted-foreground">If not provided, will use icon from hakush.in</p>
                        <Input
                          value={disc.icon || ""}
                          onChange={(e) => updateArrayItem("discs.two_pieces", index, "icon", e.target.value || null)}
                          placeholder="https://..."
                        />
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => addArrayItem("discs.two_pieces", { name: "", description: "", icon: null })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add 2-Piece Set
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Extra Sections ({discsExtraSections.length})</h4>
                  {discsExtraSections.map((section: any, index: number) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">Section {index + 1}</h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem("discs.extra_sections", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => updateArrayItem("discs.extra_sections", index, "title", e.target.value)}
                          placeholder="Section title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={section.description}
                          onChange={(e) =>
                            updateArrayItem("discs.extra_sections", index, "description", e.target.value)
                          }
                          placeholder="Additional information..."
                          rows={5}
                        />
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => addArrayItem("discs.extra_sections", { title: "", description: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Extra Section
                  </Button>
                </div>

                <Button variant="destructive" size="sm" className="w-full" onClick={() => updateField("discs", null)}>
                  Remove Disc Section
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stats">
          <AccordionTrigger className="text-lg font-semibold">Stats {formData.stat && "(Configured)"}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {!formData.stat && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() =>
                  updateField("stat", { main_stats: [], sub_stats: "", baseline_stats: "", extra_sections: [] })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Enable Stats Section
              </Button>
            )}
            {formData.stat && (
              <>
                <div className="space-y-4">
                  <h4 className="font-medium">Main Stats ({mainStats.length})</h4>
                  {mainStats.map((stat: any, index: number) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <Label>Position (4, 5, or 6) *</Label>
                          <Select
                            value={String(stat.pos)}
                            onValueChange={(value) => updateArrayItem("stat.main_stats", index, "pos", Number(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4">Position 4</SelectItem>
                              <SelectItem value="5">Position 5</SelectItem>
                              <SelectItem value="6">Position 6</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeArrayItem("stat.main_stats", index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Stat Priority *</Label>
                        <Input
                          value={stat.stat_priority}
                          onChange={(e) => updateArrayItem("stat.main_stats", index, "stat_priority", e.target.value)}
                          placeholder="e.g., ATK% > CRIT DMG > CRIT RATE"
                        />
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => addArrayItem("stat.main_stats", { pos: 4, stat_priority: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Main Stat
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub-stats">Sub Stats Priority *</Label>
                  <Input
                    id="sub-stats"
                    value={formData.stat.sub_stats}
                    onChange={(e) => updateField("stat.sub_stats", e.target.value)}
                    placeholder="e.g., ATK% > CRIT DMG > CRIT RATE > PEN RATIO"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseline-stats">Baseline Stats *</Label>
                  <Textarea
                    id="baseline-stats"
                    value={formData.stat.baseline_stats}
                    onChange={(e) => updateField("stat.baseline_stats", e.target.value)}
                    placeholder="e.g., ATK: 2800+, CRIT RATE: 60%+, CRIT DMG: 120%+"
                    rows={6}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Extra Sections ({statExtraSections.length})</h4>
                  {statExtraSections.map((section: any, index: number) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">Section {index + 1}</h5>
                        <Button variant="ghost" size="sm" onClick={() => removeArrayItem("stat.extra_sections", index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => updateArrayItem("stat.extra_sections", index, "title", e.target.value)}
                          placeholder="Section title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={section.description}
                          onChange={(e) => updateArrayItem("stat.extra_sections", index, "description", e.target.value)}
                          placeholder="Additional information..."
                          rows={5}
                        />
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => addArrayItem("stat.extra_sections", { title: "", description: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Extra Section
                  </Button>
                </div>

                <Button variant="destructive" size="sm" className="w-full" onClick={() => updateField("stat", null)}>
                  Remove Stats Section
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skill-priority">
          <AccordionTrigger className="text-lg font-semibold">
            Skill Priority {formData.skill_priority && "(Configured)"}
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {!formData.skill_priority && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => updateField("skill_priority", { priorities: [], description: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Enable Skill Priority Section
              </Button>
            )}
            {formData.skill_priority && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="skill-priority-desc">Description</Label>
                  <Textarea
                    id="skill-priority-desc"
                    value={formData.skill_priority.description}
                    onChange={(e) => updateField("skill_priority.description", e.target.value)}
                    placeholder="Explain the skill priority..."
                    rows={6}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Priority Levels ({skillPriorities.length})</h4>
                  <p className="text-sm text-muted-foreground">
                    Each priority level can contain multiple skill types. Skills in the same level have equal priority.
                  </p>
                  {skillPriorities.map((priority: string[], index: number) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">Priority Level {index + 1}</h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem("skill_priority.priorities", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Skill Types</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["core", "basic", "dodge", "special", "chain", "assist"].map((skillType) => (
                            <div key={skillType} className="flex items-center space-x-2">
                              <Checkbox
                                id={`skill-${index}-${skillType}`}
                                checked={priority.includes(skillType)}
                                onCheckedChange={(checked) => {
                                  const newPriority = checked
                                    ? [...priority, skillType]
                                    : priority.filter((s) => s !== skillType)
                                  updateArrayItem("skill_priority.priorities", index, "", newPriority)
                                  // Update the entire item instead of a field
                                  const newData = { ...formData }
                                  newData.skill_priority.priorities[index] = newPriority
                                  setFormData(newData)
                                }}
                              />
                              <label
                                htmlFor={`skill-${index}-${skillType}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                              >
                                {skillType}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => addArrayItem("skill_priority.priorities", [])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Priority Level
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => updateField("skill_priority", null)}
                >
                  Remove Skill Priority Section
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills">
          <AccordionTrigger className="text-lg font-semibold">Skills ({skills.length})</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {skills.map((skill: any, index: number) => (
              <Card key={index} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Skill {index + 1}</h4>
                  <Button variant="ghost" size="sm" onClick={() => removeArrayItem("skills", index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={skill.title}
                    onChange={(e) => updateArrayItem("skills", index, "title", e.target.value)}
                    placeholder="Skill name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={skill.description}
                    onChange={(e) => updateArrayItem("skills", index, "description", e.target.value)}
                    placeholder="What the skill does... Use <basic>, <dodge>, <chain>, <special>, <assist>, <core> for button icons"
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Explanation *</Label>
                  <Textarea
                    value={skill.explanation}
                    onChange={(e) => updateArrayItem("skills", index, "explanation", e.target.value)}
                    placeholder="How to use this skill effectively..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Demo GIF URL (optional)</Label>
                  <Input
                    value={skill.demo || ""}
                    onChange={(e) => updateArrayItem("skills", index, "demo", e.target.value || null)}
                    placeholder="https://..."
                  />
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => addArrayItem("skills", { title: "", description: "", explanation: "", demo: null })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="teams">
          <AccordionTrigger className="text-lg font-semibold">Teams {formData.team && "(Configured)"}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {!formData.team && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => updateField("team", { teams: [], extra_sections: [] })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Enable Teams Section
              </Button>
            )}
            {formData.team && (
              <>
                <div className="space-y-4">
                  <h4 className="font-medium">Team Compositions ({teams.length})</h4>
                  {teams.map((team: any, index: number) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">Team {index + 1}</h5>
                        <Button variant="ghost" size="sm" onClick={() => removeArrayItem("team.teams", index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Team Name *</Label>
                        <Input
                          value={team.name}
                          onChange={(e) => updateArrayItem("team.teams", index, "name", e.target.value)}
                          placeholder="e.g., Hypercarry Team"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description (optional)</Label>
                        <Textarea
                          value={team.description || ""}
                          onChange={(e) => updateArrayItem("team.teams", index, "description", e.target.value || null)}
                          placeholder="Team strategy and synergy..."
                          rows={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Characters ({team.characters?.length || 0})</Label>
                        {(team.characters || []).map((char: any, charIndex: number) => (
                          <Card key={charIndex} className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Position {charIndex + 1}</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newData = { ...formData }
                                  newData.team.teams[index].characters.splice(charIndex, 1)
                                  setFormData(newData)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Selected ({(char.name || "").split(" / ").filter((n: string) => n.trim()).length}/3)
                              </Label>
                              <Popover
                                open={teamCharComboOpen[`${index}-${charIndex}`]}
                                onOpenChange={(open) =>
                                  setTeamCharComboOpen({ ...teamCharComboOpen, [`${index}-${charIndex}`]: open })
                                }
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                    disabled={loadingCharacters}
                                  >
                                    {loadingCharacters ? (
                                      "Loading characters..."
                                    ) : char.name ? (
                                      <span className="flex items-center flex-wrap gap-1 truncate">
                                        {char.name.split(" / ").map((name: string, idx: number) => {
                                          const selectedChar = characters.find((c) => c.EN === name.trim())
                                          const iconUrl = selectedChar?.icon
                                            ? `https://api.hakush.in/zzz/UI/${selectedChar.icon.replace(
                                                "IconRole",
                                                "IconRoleCrop"
                                              )}.webp`
                                            : null
                                          return (
                                            <span key={idx} className="flex items-center">
                                              {iconUrl && (
                                                <img
                                                  src={iconUrl}
                                                  alt={selectedChar?.EN}
                                                  className="mr-1 h-5 w-5 rounded-full object-cover"
                                                  onError={(e) => {
                                                    e.currentTarget.style.display = "none"
                                                  }}
                                                />
                                              )}
                                              {name.trim()}
                                              {idx < char.name.split(" / ").length - 1 && <span className="mx-1">/</span>}
                                            </span>
                                          )
                                        })}
                                      </span>
                                    ) : (
                                      "Select characters (up to 3)..."
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-100 p-0">
                                  <Command>
                                    <CommandInput placeholder="Search character..." />
                                    <CommandList>
                                      <CommandEmpty>No character found.</CommandEmpty>
                                      <CommandGroup>
                                        {characters.map((character) => {
                                          const iconUrl = character.icon
                                            ? `https://api.hakush.in/zzz/UI/${character.icon.replace(
                                                "IconRole",
                                                "IconRoleCrop"
                                              )}.webp`
                                            : null
                                          const selectedNames = (char.name || "")
                                            .split(" / ")
                                            .map((n: string) => n.trim())
                                            .filter((n: string) => n)
                                          const isSelected = selectedNames.includes(character.EN)
                                          const canSelect = selectedNames.length < 3 || isSelected
                                          return (
                                            <CommandItem
                                              key={character.code}
                                              value={character.EN}
                                              disabled={!canSelect}
                                              onSelect={() => {
                                                if (!canSelect && !isSelected) return
                                                const newData = { ...formData }
                                                let newNames = [...selectedNames]
                                                if (isSelected) {
                                                  // Remove character
                                                  newNames = newNames.filter((n) => n !== character.EN)
                                                } else {
                                                  // Add character
                                                  newNames.push(character.EN)
                                                }
                                                newData.team.teams[index].characters[charIndex].name =
                                                  newNames.join(" / ")
                                                setFormData(newData)
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                              />
                                              {iconUrl && (
                                                <img
                                                  src={iconUrl}
                                                  alt={character.EN}
                                                  className="mr-2 h-8 w-8 rounded-full object-cover"
                                                  onError={(e) => {
                                                    e.currentTarget.style.display = "none"
                                                  }}
                                                />
                                              )}
                                              <span className={!canSelect && !isSelected ? "opacity-50" : ""}>
                                                {character.EN} ({character.rank === 3 ? "A" : "S"}-rank)
                                              </span>
                                            </CommandItem>
                                          )
                                        })}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </Card>
                        ))}
                        {(team.characters?.length || 0) < 3 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            onClick={() => {
                              const newData = { ...formData }
                              if (!newData.team.teams[index].characters) {
                                newData.team.teams[index].characters = []
                              }
                              newData.team.teams[index].characters.push({ name: "" })
                              setFormData(newData)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Character Position
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => addArrayItem("team.teams", { name: "", description: null, characters: [] })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Extra Sections ({teamExtraSections.length})</h4>
                  {teamExtraSections.map((section: any, index: number) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">Section {index + 1}</h5>
                        <Button variant="ghost" size="sm" onClick={() => removeArrayItem("team.extra_sections", index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => updateArrayItem("team.extra_sections", index, "title", e.target.value)}
                          placeholder="Section title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={section.description}
                          onChange={(e) => updateArrayItem("team.extra_sections", index, "description", e.target.value)}
                          placeholder="Additional information..."
                          rows={5}
                        />
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => addArrayItem("team.extra_sections", { title: "", description: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Extra Section
                  </Button>
                </div>

                <Button variant="destructive" size="sm" className="w-full" onClick={() => updateField("team", null)}>
                  Remove Teams Section
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rotation">
          <AccordionTrigger className="text-lg font-semibold">
            Rotation {formData.rotation && "(Configured)"}
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {!formData.rotation && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => updateField("rotation", { title: "", description: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Enable Rotation Section
              </Button>
            )}
            {formData.rotation && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rotation-title">Title *</Label>
                  <Input
                    id="rotation-title"
                    value={formData.rotation.title}
                    onChange={(e) => updateField("rotation.title", e.target.value)}
                    placeholder="e.g., Optimal Rotation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rotation-desc">Description *</Label>
                  <Textarea
                    id="rotation-desc"
                    value={formData.rotation.description}
                    onChange={(e) => updateField("rotation.description", e.target.value)}
                    placeholder="Explain the skill rotation and combos..."
                    rows={10}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => updateField("rotation", null)}
                >
                  Remove Rotation Section
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Mindscapes */}
        <AccordionItem value="mindscapes">
          <AccordionTrigger className="text-lg font-semibold">Mindscapes ({mindscapes.length})</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {mindscapes.map((mindscape: any, index: number) => (
              <Card key={index} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Mindscape {index + 1}</h4>
                  <Button variant="ghost" size="sm" onClick={() => removeArrayItem("mindscapes", index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Number (1-6) *</Label>
                  <Select
                    value={String(mindscape.num)}
                    onValueChange={(value) => updateArrayItem("mindscapes", index, "num", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          M{n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={mindscape.description}
                    onChange={(e) => updateArrayItem("mindscapes", index, "description", e.target.value)}
                    placeholder="What this mindscape does and its importance..."
                    rows={3}
                  />
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => addArrayItem("mindscapes", { num: 1, description: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Mindscape
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
