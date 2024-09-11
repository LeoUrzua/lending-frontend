'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, DollarSign, Percent, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Mock function to fetch loan details
const fetchLoanDetails = (id: number) => {
  // In a real application, this would be an API call
  return {
    id,
    borrower: "Alice Johnson",
    amount: 5000,
    dueDate: "2023-12-31",
    status: "Active",
    interestRate: 8.5,
    startDate: "2023-01-01",
    paymentSchedule: [
      { id: 1, dueDate: "2023-02-01", amount: 450, status: "Paid" },
      { id: 2, dueDate: "2023-03-01", amount: 450, status: "Paid" },
      { id: 3, dueDate: "2023-04-01", amount: 450, status: "Paid" },
      { id: 4, dueDate: "2023-05-01", amount: 450, status: "Upcoming" },
      { id: 5, dueDate: "2023-06-01", amount: 450, status: "Upcoming" },
      { id: 6, dueDate: "2023-07-01", amount: 450, status: "Upcoming" },
    ]
  }
}

export function LoanDetails() {
  // const router = useRouter()
  // const [loan, setLoan] = useState(null)

  // useEffect(() => {
  //   if (router.isReady) {
  //     const { id } = router.query
  //     const loanData = fetchLoanDetails(Number(id))
  //     setLoan(loanData)
  //   }
  // }, [router.isReady, router.query])

  // if (!loan) {
  //   return <div className="container mx-auto p-4">Loading...</div>
  // }
  const loan = fetchLoanDetails(1);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600'
      case 'overdue':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/loans" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loan Management
        </Button>
      </Link>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Loan Details: #{loan.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Loan Amount</p>
                <p className="text-lg font-semibold">${loan.amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-lg font-semibold">{loan.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className={`text-lg font-semibold ${getStatusColor(loan.status)}`}>{loan.status}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Percent className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Interest Rate</p>
                <p className="text-lg font-semibold">{loan.interestRate}%</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-lg font-semibold">{loan.startDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Borrower</p>
                <p className="text-lg font-semibold">{loan.borrower}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loan.paymentSchedule.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
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
