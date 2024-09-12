'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, Loader2 } from 'lucide-react'
import { format, addMonths } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import { getBorrowers, addLoan } from '@/lib/data'

interface AddLoanProps {
  borrowerId?: string;
}

export function AddLoan({ borrowerId }: AddLoanProps) {
  const router = useRouter()
  const [selectedBorrower, setSelectedBorrower] = useState(borrowerId || '')
  const [borrowers, setBorrowers] = useState([])
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(addMonths(new Date(), 1))
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchBorrowersData = async () => {
      try {
        const data = await getBorrowers()
        setBorrowers(data)
      } catch (error) {
        toast.error('Failed to fetch borrowers')
      }
    }
    fetchBorrowersData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      if (!selectedBorrower || !loanAmount || !interestRate || !startDate || !dueDate) {
        throw new Error('Please fill in all fields')
      }

      const amount = parseFloat(loanAmount)
      const rate = parseFloat(interestRate)

      if (amount <= 0 || rate <= 0) {
        throw new Error('Amount and interest rate must be greater than zero')
      }

      await addLoan(
        'current-user-id', // Replace with actual lender ID
        selectedBorrower,
        amount,
        rate,
        startDate,
        dueDate,
        'Active'
      )
      toast.success('Loan added successfully')
      router.push('/dashboard')
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <Button variant="ghost" onClick={() => router.push('/borrowers')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Borrowers
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Loan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="borrower">Borrower</Label>
              <Select value={selectedBorrower} onValueChange={setSelectedBorrower} disabled={!!borrowerId}>
                <SelectTrigger id="borrower">
                  <SelectValue placeholder="Select a borrower" />
                </SelectTrigger>
                <SelectContent>
                  {borrowers.map((borrower) => (
                    <SelectItem key={borrower.id} value={borrower.id}>
                      {borrower.name}
                    </SelectItem>
                  ))}
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
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="Enter interest rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
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
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
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
              <Button type="button" variant="outline" className="flex-1" onClick={() => router.push('/borrowers')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
