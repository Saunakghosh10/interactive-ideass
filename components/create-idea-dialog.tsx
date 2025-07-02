"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X, Plus, Lightbulb, Sparkles } from "lucide-react"

interface CreateIdeaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const suggestedSkills = [
  "AI",
  "Machine Learning",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "UX/UI Design",
  "Blockchain",
  "IoT",
  "Cloud Computing",
  "Cybersecurity",
  "Marketing",
  "Business Strategy",
  "Project Management",
  "Content Creation",
]

const suggestedIndustries = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "E-commerce",
  "Entertainment",
  "Environment",
  "Transportation",
  "Food & Beverage",
  "Real Estate",
  "Manufacturing",
  "Energy",
  "Agriculture",
  "Sports",
]

export function CreateIdeaDialog({ open, onOpenChange }: CreateIdeaDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState("")
  const [customIndustry, setCustomIndustry] = useState("")

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry],
    )
  }

  const addCustomSkill = () => {
    if (customSkill && !selectedSkills.includes(customSkill)) {
      setSelectedSkills((prev) => [...prev, customSkill])
      setCustomSkill("")
    }
  }

  const addCustomIndustry = () => {
    if (customIndustry && !selectedIndustries.includes(customIndustry)) {
      setSelectedIndustries((prev) => [...prev, customIndustry])
      setCustomIndustry("")
    }
  }

  const getMatchingSuggestions = () => {
    if (!title && !description) return []

    const text = (title + " " + description).toLowerCase()
    const suggestions = []

    // Simple keyword matching for skills
    if (text.includes("ai") || text.includes("artificial intelligence")) suggestions.push("AI", "Machine Learning")
    if (text.includes("web") || text.includes("website")) suggestions.push("Web Development")
    if (text.includes("mobile") || text.includes("app")) suggestions.push("Mobile Development")
    if (text.includes("design") || text.includes("ui") || text.includes("ux")) suggestions.push("UX/UI Design")
    if (text.includes("data") || text.includes("analytics")) suggestions.push("Data Science")
    if (text.includes("blockchain") || text.includes("crypto")) suggestions.push("Blockchain")

    return [...new Set(suggestions)]
  }

  const handleSubmit = () => {
    // Here you would typically save the idea to your backend
    console.log({
      title,
      description,
      skills: selectedSkills,
      industries: selectedIndustries,
    })

    // Reset form and close dialog
    setTitle("")
    setDescription("")
    setSelectedSkills([])
    setSelectedIndustries([])
    onOpenChange(false)
  }

  const matchingSuggestions = getMatchingSuggestions()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            Create New Idea
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Idea Title</Label>
            <Input
              id="title"
              placeholder="What's your big idea?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your idea in detail. What problem does it solve? How would it work?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {matchingSuggestions.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">AI Suggestions</span>
              </div>
              <p className="text-sm text-purple-700 mb-3">Based on your idea, we suggest these skills:</p>
              <div className="flex flex-wrap gap-2">
                {matchingSuggestions.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                    {selectedSkills.includes(skill) && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label>Required Skills</Label>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge key={skill} className="bg-purple-100 text-purple-800">
                  {skill}
                  <button
                    onClick={() => handleSkillToggle(skill)}
                    className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom skill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
              />
              <Button onClick={addCustomSkill} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills
                .filter((skill) => !selectedSkills.includes(skill))
                .map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Industry</Label>
            <div className="flex flex-wrap gap-2">
              {selectedIndustries.map((industry) => (
                <Badge key={industry} className="bg-blue-100 text-blue-800">
                  {industry}
                  <button
                    onClick={() => handleIndustryToggle(industry)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom industry"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomIndustry()}
              />
              <Button onClick={addCustomIndustry} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedIndustries
                .filter((industry) => !selectedIndustries.includes(industry))
                .map((industry) => (
                  <Badge
                    key={industry}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleIndustryToggle(industry)}
                  >
                    {industry}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title || !description}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Create Idea
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
