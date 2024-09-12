'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Download } from 'lucide-react'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import Link from 'next/link'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Mock data for cash flow
const cashFlowData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Income',
      data: [12000, 19000, 15000, 22000, 18000, 24000],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Expenses',
      data: [8000, 10000, 9000, 11000, 10000, 12000],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    },
  ],
}

// Mock data for overdue loans
const overdueLoanData = {
  labels: ['1-30 days', '31-60 days', '61-90 days', '90+ days'],
  datasets: [
    {
      data: [5000, 3000, 2000, 1000],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
    },
  ],
}

export function ReportingInsights() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [reportType, setReportType] = useState('cashFlow')

  const handleDownload = () => {
    // In a real application, this would generate and download the report
    alert('Downloading report...')
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDateRange(prev => ({ ...prev, [name]: value }))
  }

  const cashFlowOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cash Flow',
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Amount ($)',
        },
      },
    },
  }

  const overdueLoanOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Overdue Loans by Age',
      },
    },
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main
        </Button>
      </Link>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Reporting & Insights</CardTitle>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cashFlow">Cash Flow</SelectItem>
                  <SelectItem value="overdueLoans">Overdue Loans</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <div>
                  <Label htmlFor="dateFrom">From</Label>
                  <Input
                    id="dateFrom"
                    name="from"
                    type="date"
                    value={dateRange.from}
                    onChange={handleDateChange}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">To</Label>
                  <Input
                    id="dateTo"
                    name="to"
                    type="date"
                    value={dateRange.to}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {reportType === 'cashFlow' ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Cash Flow</h3>
              <Bar data={cashFlowData} options={cashFlowOptions} />
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Overdue Loans</h3>
              <div className="w-full md:w-1/2 mx-auto">
                <Pie data={overdueLoanData} options={overdueLoanOptions} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
