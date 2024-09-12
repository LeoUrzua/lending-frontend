'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Search } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { getLoans } from '@/lib/data'
import Link from 'next/link'

interface Loan {
  id: string;
  borrowerName: string;
  amount: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
  status: string;
}

export function LoanManagement() {
  const router = useRouter()
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getLoans()
        setLoans(data)
      } catch (error) {
        toast.error('Failed to fetch loans')
      } finally {
        setIsLoading(false)
      }
    }
    fetchLoans()
  }, [])

  const filteredLoans = loans.filter(loan =>
    loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Loan Management</CardTitle>
          <Link href="/add-loan" passHref>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Loan
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.borrowerName}</TableCell>
                    <TableCell>${loan.amount.toFixed(2)}</TableCell>
                    <TableCell>{loan.interestRate}%</TableCell>
                    <TableCell>{new Date(loan.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{loan.status}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/loans/${loan.id}`)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
