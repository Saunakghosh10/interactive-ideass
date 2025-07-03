import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Loader2 } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SKILLS, INDUSTRIES } from '@/lib/constants'

interface EditIdeaDialogProps {
  idea: {
    id: string
    title: string
    description: string
    skills: string[]
    industries: string[]
    author: {
      id: string
      name: string | null
      image: string | null
    }
    likes: {
      userId: string
    }[]
    _count: {
      comments: number
      likes: number
    }
    createdAt: string
    updatedAt: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: (updatedIdea: any) => void
}

export function EditIdeaDialog({
  idea,
  open,
  onOpenChange,
  onUpdate,
}: EditIdeaDialogProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [title, setTitle] = useState(idea.title)
  const [description, setDescription] = useState(idea.description)
  const [skills, setSkills] = useState<string[]>(idea.skills)
  const [industries, setIndustries] = useState<string[]>(idea.industries)
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(idea.title)
      setDescription(idea.description)
      setSkills(idea.skills)
      setIndustries(idea.industries)
    }
  }, [open, idea])

  const handleSubmit = async () => {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to edit ideas',
        variant: 'destructive',
      })
      return
    }

    if (!title.trim() || !description.trim()) {
      toast({
        title: 'Error',
        description: 'Title and description are required',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/ideas/${idea.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          skills,
          industries,
        }),
      })

      if (!response.ok) throw new Error('Failed to update idea')

      const updatedIdea = await response.json()
      onUpdate?.(updatedIdea)
      onOpenChange(false)

      toast({
        title: 'Success',
        description: 'Idea updated successfully',
      })
    } catch (error) {
      console.error('Error updating idea:', error)
      toast({
        title: 'Error',
        description: 'Failed to update idea',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkillSelect = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill])
    }
    setIsSkillsOpen(false)
  }

  const handleIndustrySelect = (industry: string) => {
    if (!industries.includes(industry)) {
      setIndustries((prev) => [...prev, industry])
    }
    setIsIndustriesOpen(false)
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
  }

  const removeIndustry = (industryToRemove: string) => {
    setIndustries((prev) =>
      prev.filter((industry) => industry !== industryToRemove)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Idea</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter idea title"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Popover open={isSkillsOpen} onOpenChange={setIsSkillsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-dashed"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search skills..." />
                  <CommandEmpty>No skill found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {SKILLS.filter((skill) => !skills.includes(skill)).map(
                      (skill) => (
                        <CommandItem
                          key={skill}
                          onSelect={() => handleSkillSelect(skill)}
                        >
                          {skill}
                        </CommandItem>
                      )
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Industries
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {industries.map((industry) => (
                <Badge
                  key={industry}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {industry}
                  <button
                    onClick={() => removeIndustry(industry)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Popover
              open={isIndustriesOpen}
              onOpenChange={setIsIndustriesOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-dashed"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Industry
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search industries..." />
                  <CommandEmpty>No industry found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {INDUSTRIES.filter(
                      (industry) => !industries.includes(industry)
                    ).map((industry) => (
                      <CommandItem
                        key={industry}
                        onSelect={() => handleIndustrySelect(industry)}
                      >
                        {industry}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Idea'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 