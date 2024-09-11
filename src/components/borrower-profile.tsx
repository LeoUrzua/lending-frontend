'use client'

import React from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

// Mock function to fetch borrower details
const fetchBorrowerDetails = (id: number) => {
  // In a real application, this would be an API call
  return {
    id,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "123-456-7890",
    score: 85,
    loanHistory: [
      { id: 1, amount: 5000, startDate: "2023-01-15", endDate: "2023-07-15", status: "Completed" },
      { id: 2, amount: 3000, startDate: "2023-08-01", endDate: "2024-02-01", status: "Active" },
      { id: 3, amount: 2000, startDate: "2022-06-01", endDate: "2022-12-01", status: "Completed" },
    ]
  }
}

export function BorrowerProfile() {
  const id = 1
  const borrower = fetchBorrowerDetails(Number(id))

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/borrowers" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Borrower Management
        </Button>
      </Link>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Borrower Profile: {borrower.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold flex items-center">
                <Mail className="mr-2 h-4 w-4" /> Email
              </h3>
              <p>{borrower.email}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center">
                <Phone className="mr-2 h-4 w-4" /> Phone
              </h3>
              <p>{borrower.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold">Performance Score</h3>
              <p className={getScoreColor(borrower.score)}>{borrower.score}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Loan History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrower.loanHistory.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.id}</TableCell>
                  <TableCell>${loan.amount.toFixed(2)}</TableCell>
                  <TableCell>{loan.startDate}</TableCell>
                  <TableCell>{loan.endDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      loan.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      loan.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loan.status}
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
