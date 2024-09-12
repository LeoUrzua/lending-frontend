'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'

// API functions
const API_BASE_URL = 'https://api.example.com' // Replace with your actual API base URL

async function fetchBorrowers(searchTerm: string) {
  const response = await fetch(`${API_BASE_URL}/api/borrowers?search=${searchTerm}`)
  if (!response.ok) throw new Error('Failed to fetch borrowers')
  return response.json()
}

async function addBorrower(borrower: { name: string; email: string; phone: string }) {
  const response = await fetch(`${API_BASE_URL}/api/borrowers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(borrower),
  })
  if (!response.ok) throw new Error('Failed to add borrower')
  return response.json()
}

async function addLoan(loan: { borrowerId: string; amount: number; startDate: string }) {
  const response = await fetch(`${API_BASE_URL}/api/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loan),
  })
  if (!response.ok) throw new Error('Failed to add loan')
  return response.json()
}

export function AddLoan() {
  const router = useRouter()
  const [selectedBorrower, setSelectedBorrower] = useState('')
  interface Borrower {
    id: string;
    name: string;
  }
  
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loanAmount, setLoanAmount] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [isNewBorrowerDialogOpen, setIsNewBorrowerDialogOpen] = useState(false)
  const [newBorrower, setNewBorrower] = useState({ name: '', phone: '', email: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchBorrowers(searchTerm)
          .then(setBorrowers)
          .catch(error => toast.error(error.message))
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      if (!selectedBorrower || !loanAmount || !startDate) {
        throw new Error('Please fill in all fields')
      }

      if (parseFloat(loanAmount) <= 0) {
        throw new Error('Loan amount must be greater than zero')
      }

      const loan = {
        borrowerId: selectedBorrower,
        amount: parseFloat(loanAmount),
        startDate: format(startDate, 'yyyy-MM-dd'),
      }

      await addLoan(loan)
      toast.success('Loan added successfully')
      router.push('/dashboard')
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNewBorrower = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      if (!newBorrower.name || !newBorrower.email || !newBorrower.phone) {
        throw new Error('Please fill in all fields for the new borrower')
      }

      const addedBorrower = await addBorrower(newBorrower)
      setSelectedBorrower(addedBorrower.id)
      setBorrowers(prevBorrowers => [...prevBorrowers, addedBorrower])
      setIsNewBorrowerDialogOpen(false)
      setNewBorrower({ name: '', phone: '', email: '' })
      toast.success('New borrower added successfully')
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
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
                  <SelectValue placeholder="Search for a borrower" />
                </SelectTrigger>
                <SelectContent>
                  <Input
                    placeholder="Search borrowers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  {borrowers.map((borrower) => (
                    <SelectItem key={borrower.id} value={borrower.id}>
                      {borrower.name}
                    </SelectItem>
                  ))}
                  {borrowers.length === 0 && searchTerm && (
                    <SelectItem value="new">
                      <Dialog>
                        <DialogTrigger asChild onClick={() => setIsNewBorrowerDialogOpen(true)}>
                          <span className="text-blue-500">+ Add &quot;{searchTerm}&quot; as new borrower</span>
                        </DialogTrigger>
                      </Dialog>
                    </SelectItem>
                  )}
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
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit
              </Button>
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
            <Button onClick={handleAddNewBorrower} className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Borrower
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
