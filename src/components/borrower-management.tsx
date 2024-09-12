'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Search, DollarSign, User, ArrowLeft } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { getBorrowers } from '@/lib/data'
import Link from 'next/link'

interface Borrower {
  id: string;
  name: string;
  phoneNumber: string;
  score?: number;
}

export function BorrowerManagement() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const data = await getBorrowers()
        setBorrowers(data)
      } catch (error) {
        toast.error('Failed to fetch borrowers')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBorrowers()
  }, [])

  const filteredBorrowers = borrowers.filter(borrower =>
    borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrower.phoneNumber.includes(searchTerm)
  )

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main
        </Button>
      </Link>
      <Toaster position="top-right" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Borrower Management</CardTitle>
          <Link href="/borrowers/add" passHref>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Borrower
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search borrowers..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBorrowers.map((borrower) => (
                  <TableRow key={borrower.id}>
                    <TableCell className="font-medium">{borrower.name}</TableCell>
                    <TableCell>{borrower.phoneNumber}</TableCell>
                    <TableCell className={getScoreColor(borrower.score || 0)}>
                    {borrower.score}
                  </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/borrowers/${borrower.id}`} passHref>
                          <Button variant="outline" size="sm">
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/borrowers/${borrower.id}/add-loan`} passHref>
                          <Button variant="outline" size="sm">
                            <DollarSign className="mr-2 h-4 w-4" /> Add Loan
                          </Button>
                        </Link>
                      </div>
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
