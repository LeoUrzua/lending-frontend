'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Edit, Plus, Trash2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock data for active loans
const initialLoans = [
  { id: 1, borrower: "Alice Johnson", amount: 5000, dueDate: "2023-12-31", status: "Current" },
  { id: 2, borrower: "Bob Smith", amount: 3500, dueDate: "2023-11-15", status: "Late" },
  { id: 3, borrower: "Charlie Brown", amount: 2000, dueDate: "2024-01-20", status: "Current" },
  { id: 4, borrower: "Diana Prince", amount: 4500, dueDate: "2023-10-05", status: "Overdue" },
]

export function LoanManagement() {
  const [loans, setLoans] = useState(initialLoans)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newLoan, setNewLoan] = useState({ borrower: '', amount: '', dueDate: '', status: 'Current' })
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const handleAddLoan = () => {
    try {
      if (!newLoan.borrower || !newLoan.amount || !newLoan.dueDate) {
        throw new Error("Please fill in all fields")
      }
      const amount = parseFloat(newLoan.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount")
      }
      setLoans([...loans, { ...newLoan, id: loans.length + 1, amount: amount }])
      setNewLoan({ borrower: '', amount: '', dueDate: '', status: 'Current' })
      setIsAddDialogOpen(false)
      setAlert({ show: true, message: "The new loan has been successfully added.", type: 'success' })
    } catch (error) {
      setAlert({ show: true, message: error.message, type: 'error' })
    }
  }

  const handleDeleteLoan = (id: number) => {
    try {
      setLoans(loans.filter(loan => loan.id !== id))
      setAlert({ show: true, message: "The loan has been successfully deleted.", type: 'success' })
    } catch (error) {
      setAlert({ show: true, message: "Failed to delete the loan. Please try again.", type: 'error' })
    }
  }

  return (
    <div className="container mx-auto p-4">
      {alert.show && (
        <Alert variant={alert.type === 'error' ? "destructive" : "default"} className="mb-4">
          {alert.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      <Link href="/" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main
        </Button>
      </Link>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Loan Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Loan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Loan</DialogTitle>
                <DialogDescription>
                  Enter the details of the new loan here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="borrower" className="text-right">
                    Borrower
                  </Label>
                  <Input
                    id="borrower"
                    value={newLoan.borrower}
                    onChange={(e) => setNewLoan({ ...newLoan, borrower: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newLoan.amount}
                    onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newLoan.dueDate}
                    onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddLoan}>Save Loan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.borrower}</TableCell>
                  <TableCell>${loan.amount.toFixed(2)}</TableCell>
                  <TableCell>{loan.dueDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      loan.status === 'Current' ? 'bg-green-100 text-green-800' :
                      loan.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {loan.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/loans/${loan.id}`} passHref>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteLoan(loan.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
