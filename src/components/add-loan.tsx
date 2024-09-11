'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

// Mock data for existing borrowers
const existingBorrowers = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Brown' },
]

export function AddLoan() {
  const router = useRouter()
  const [selectedBorrower, setSelectedBorrower] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [isNewBorrowerDialogOpen, setIsNewBorrowerDialogOpen] = useState(false)
  const [newBorrower, setNewBorrower] = useState({ name: '', phone: '', email: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log({ selectedBorrower, loanAmount, startDate })
    // After successful submission, redirect to the dashboard
    router.push('/dashboard')
  }

  const handleAddNewBorrower = () => {
    // Here you would typically send the new borrower data to your backend
    console.log(newBorrower)
    // Close the dialog and reset the form
    setIsNewBorrowerDialogOpen(false)
    setNewBorrower({ name: '', phone: '', email: '' })
    // In a real app, you might want to add the new borrower to the list and select them
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Loan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="borrower">Borrower</Label>
              <Select value={selectedBorrower} onValueChange={setSelectedBorrower}>
                <SelectTrigger id="borrower">
                  <SelectValue placeholder="Select a borrower" />
                </SelectTrigger>
                <SelectContent>
                  {existingBorrowers.map((borrower) => (
                    <SelectItem key={borrower.id} value={borrower.id}>
                      {borrower.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <Dialog>
                      <DialogTrigger asChild onClick={() => setIsNewBorrowerDialogOpen(true)}>
                        <span className="text-blue-500">+ Add New Borrower</span>
                      </DialogTrigger>
                    </Dialog>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter loan amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">Submit</Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => router.push('/dashboard')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isNewBorrowerDialogOpen} onOpenChange={setIsNewBorrowerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Borrower</DialogTitle>
            <DialogDescription>
              Enter the details of the new borrower below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newBorrowerName">Name</Label>
              <Input
                id="newBorrowerName"
                value={newBorrower.name}
                onChange={(e) => setNewBorrower({ ...newBorrower, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newBorrowerPhone">Phone</Label>
              <Input
                id="newBorrowerPhone"
                type="tel"
                value={newBorrower.phone}
                onChange={(e) => setNewBorrower({ ...newBorrower, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newBorrowerEmail">Email</Label>
              <Input
                id="newBorrowerEmail"
                type="email"
                value={newBorrower.email}
                onChange={(e) => setNewBorrower({ ...newBorrower, email: e.target.value })}
                required
              />
            </div>
            <Button onClick={handleAddNewBorrower} className="w-full">
              Add Borrower
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
