"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { SKILLS, INDUSTRIES } from "@/lib/constants"

interface CreateIdeaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onIdeaCreated?: (idea: any) => void
}

export function CreateIdeaDialog({
  open,
  onOpenChange,
  onIdeaCreated,
}: CreateIdeaDialogProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to create ideas",
        variant: "destructive",
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          skills: selectedSkills,
          industries: selectedIndustries,
        }),
      })

      if (!response.ok) throw new Error("Failed to create idea")

      const idea = await response.json()
      onIdeaCreated?.(idea)
      setTitle("")
      setDescription("")
      setSelectedSkills([])
      setSelectedIndustries([])
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating idea:", error)
      toast({
        title: "Error",
        description: "Failed to create idea",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Idea</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Popover open={isSkillsOpen} onOpenChange={setIsSkillsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isSkillsOpen}
                  className="w-full justify-between"
                >
                  {selectedSkills.length === 0
                    ? "Select skills..."
                    : `${selectedSkills.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search skills..." />
                  <CommandEmpty>No skill found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {SKILLS.map((skill) => (
                      <CommandItem
                        key={skill}
                        onSelect={() => toggleSkill(skill)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSkills.includes(skill)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {skill}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Popover
              open={isIndustriesOpen}
              onOpenChange={setIsIndustriesOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isIndustriesOpen}
                  className="w-full justify-between"
                >
                  {selectedIndustries.length === 0
                    ? "Select industries..."
                    : `${selectedIndustries.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search industries..." />
                  <CommandEmpty>No industry found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {INDUSTRIES.map((industry) => (
                      <CommandItem
                        key={industry}
                        onSelect={() => toggleIndustry(industry)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedIndustries.includes(industry)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {industry}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedIndustries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedIndustries.map((industry) => (
                  <Badge
                    key={industry}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => toggleIndustry(industry)}
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Idea"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
