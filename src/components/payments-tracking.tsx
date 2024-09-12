'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from 'lucide-react'

// Mock data for payments
const initialPayments = [
  { id: 1, loanId: 1, borrowerId: 1, borrowerName: "Alice Johnson", amount: 500, date: "2023-06-01" },
  { id: 2, loanId: 1, borrowerId: 1, borrowerName: "Alice Johnson", amount: 500, date: "2023-07-01" },
  { id: 3, loanId: 2, borrowerId: 2, borrowerName: "Bob Smith", amount: 300, date: "2023-06-15" },
  { id: 4, loanId: 3, borrowerId: 3, borrowerName: "Charlie Brown", amount: 200, date: "2023-06-30" },
]

// Mock data for loans
const loans = [
  { id: 1, borrowerId: 1, borrowerName: "Alice Johnson", totalAmount: 5000, outstandingBalance: 4000 },
  { id: 2, borrowerId: 2, borrowerName: "Bob Smith", totalAmount: 3000, outstandingBalance: 2700 },
  { id: 3, borrowerId: 3, borrowerName: "Charlie Brown", totalAmount: 2000, outstandingBalance: 1800 },
]

export function PaymentsTracking() {
  const [payments, setPayments] = useState(initialPayments)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPayment, setNewPayment] = useState({ loanId: '', amount: '', date: '' })

  const totalOutstandingBalance = loans.reduce((total, loan) => total + loan.outstandingBalance, 0)

  const handleAddPayment = () => {
    if (!newPayment.loanId || !newPayment.amount || !newPayment.date) {
      alert("Please fill in all fields")
      return
    }

    const loan = loans.find(l => l.id === parseInt(newPayment.loanId))
    if (!loan) {
      alert("Invalid loan selected")
      return
    }

    const newPaymentObj = {
      id: payments.length + 1,
      loanId: parseInt(newPayment.loanId),
      borrowerId: loan.borrowerId,
      borrowerName: loan.borrowerName,
      amount: parseFloat(newPayment.amount),
      date: newPayment.date,
    }

    setPayments([...payments, newPaymentObj])
    setNewPayment({ loanId: '', amount: '', date: '' })
    setIsAddDialogOpen(false)
  }

  const groupPaymentsByLoan = () => {
    return payments.reduce((grouped, payment) => {
      (grouped[payment.loanId] = grouped[payment.loanId] || []).push(payment)
      return grouped
    }, {})
  }

  const groupPaymentsByBorrower = () => {
    return payments.reduce((grouped, payment) => {
      (grouped[payment.borrowerId] = grouped[payment.borrowerId] || []).push(payment)
      return grouped
    }, {})
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Payments Tracking</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Payment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Payment</DialogTitle>
                <DialogDescription>
                  Enter the details of the new payment here. Click save when you&#39;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="loan" className="text-right">
                    Loan
                  </Label>
                  <Select onValueChange={(value) => setNewPayment({ ...newPayment, loanId: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select loan" />
                    </SelectTrigger>
                    <SelectContent>
                      {loans.map((loan) => (
                        <SelectItem key={loan.id} value={loan.id.toString()}>
                          {loan.borrowerName} - ${loan.totalAmount}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddPayment}>Save Payment</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Total Outstanding Balance</h3>
            <span className="text-2xl font-bold text-green-600">${totalOutstandingBalance.toFixed(2)}</span>
          </div>
          <Tabs defaultValue="byLoan">
            <TabsList>
              <TabsTrigger value="byLoan">By Loan</TabsTrigger>
              <TabsTrigger value="byBorrower">By Borrower</TabsTrigger>
            </TabsList>
            <TabsContent value="byLoan">
              {Object.entries(groupPaymentsByLoan()).map(([loanId, loanPayments]) => (
                <Card key={loanId} className="mb-4">
                  <CardHeader>
                    <CardTitle>Loan ID: {loanId}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Borrower</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loanPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.borrowerName}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="byBorrower">
              {Object.entries(groupPaymentsByBorrower()).map(([borrowerId, borrowerPayments]) => (
                <Card key={borrowerId} className="mb-4">
                  <CardHeader>
                    <CardTitle>{borrowerPayments[0].borrowerName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Loan ID</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {borrowerPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.loanId}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
