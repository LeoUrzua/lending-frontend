'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, FileText, PlusCircle, BarChart } from 'lucide-react'
import Link from 'next/link'

// Mock data for top borrowers
const topBorrowers = [
  { id: 1, name: "Alice Johnson", score: 95, avatar: "/avatars/alice.jpg" },
  { id: 2, name: "Bob Smith", score: 88, avatar: "/avatars/bob.jpg" },
  { id: 3, name: "Charlie Brown", score: 82, avatar: "/avatars/charlie.jpg" },
]

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Loan Management Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234,567</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$98,765</div>
            <p className="text-xs text-muted-foreground">+5.4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$12,345</div>
            <p className="text-xs text-muted-foreground">3.2% of total lent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">152</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Borrowers by Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBorrowers.map((borrower) => (
                <div key={borrower.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={borrower.avatar} alt={borrower.name} />
                    <AvatarFallback>{borrower.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{borrower.name}</p>
                    <p className="text-sm text-muted-foreground">Score: {borrower.score}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Progress value={borrower.score} className="w-[60px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loan Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <span className="text-sm font-medium">Active Loans</span>
                <span className="ml-auto text-sm font-medium">70%</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                <span className="text-sm font-medium">Pending Approval</span>
                <span className="ml-auto text-sm font-medium">20%</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                <span className="text-sm font-medium">Overdue</span>
                <span className="ml-auto text-sm font-medium">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/add-loan" passHref>
          <Button className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Loan
          </Button>
        </Link>
        <Link href="/reports" passHref>
          <Button className="w-full">
            <BarChart className="mr-2 h-4 w-4" /> View Reports
          </Button>
        </Link>
        <Link href="/borrowers" passHref>
          <Button className="w-full">
            <Users className="mr-2 h-4 w-4" /> Manage Borrowers
          </Button>
        </Link>
        <Link href="/loans" passHref>
          <Button className="w-full">
            <FileText className="mr-2 h-4 w-4" /> Manage Loans
          </Button>
        </Link>
      </div>
    </div>
  )
}