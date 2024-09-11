'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, User } from 'lucide-react'
import Link from 'next/link'

// Mock data for borrowers
const initialBorrowers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "123-456-7890", score: 85 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "234-567-8901", score: 72 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", phone: "345-678-9012", score: 93 },
  { id: 4, name: "Diana Prince", email: "diana@example.com", phone: "456-789-0123", score: 68 },
]

export function BorrowerManagement() {
  const [borrowers, setBorrowers] = useState(initialBorrowers)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBorrowers = borrowers.filter(borrower =>
    borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrower.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Borrower Management</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
            <Input
              type="text"
              placeholder="Search borrowers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Performance Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBorrowers.map((borrower) => (
                <TableRow key={borrower.id}>
                  <TableCell className="font-medium">{borrower.name}</TableCell>
                  <TableCell>{borrower.email}</TableCell>
                  <TableCell>{borrower.phone}</TableCell>
                  <TableCell className={getScoreColor(borrower.score)}>
                    {borrower.score}
                  </TableCell>
                  <TableCell>
                    <Link href={`/borrowers/${borrower.id}`} passHref>
                      <Button variant="outline" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </Link>
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