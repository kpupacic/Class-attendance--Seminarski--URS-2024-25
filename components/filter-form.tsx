"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { FilterState } from "@/app/types"

type FilterFormProps = {
  title: string
  onSubmit: (filters: FilterState) => void
  buttonText: string
  subjects: any[]
  subjectTypes: any[]
  groups: any[]
}

export function FilterForm({ title, onSubmit, buttonText, subjects, subjectTypes, groups }: FilterFormProps) {
  const [selectedType, setSelectedType] = useState("")
  const [subject, setSubject] = useState("")
  const [group, setGroup] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      type: selectedType,
      subject,
      group,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-medium">Predmet</label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Odaberi predmet" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subj) => (
                  <SelectItem key={subj.id} value={subj.id}>
                    {subj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Tip nastave</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Odaberi tip nastave" />
              </SelectTrigger>
              <SelectContent>
                {subjectTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Grupa</label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Odaberi grupu" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {buttonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}