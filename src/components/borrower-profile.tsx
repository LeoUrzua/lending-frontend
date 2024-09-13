'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Mail, Phone, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getBorrower, getLoansByBorrowerId } from '@/lib/data'
import toast, { Toaster } from 'react-hot-toast'

interface Borrower {
  id: string
  name: string
  email: string
  phoneNumber: string
  score: number | null
}

interface Loan {
  id: string
  amount: number
  startDate: string
  dueDate: string
  status: string
}

interface BorrowerProfileProps {
  borrowerId: string
}

export function BorrowerProfile({ borrowerId }: BorrowerProfileProps) {
  const [borrower, setBorrower] = useState<Borrower | null>(null)
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBorrowerData = async () => {
      try {
        const borrowerData = await getBorrower(borrowerId)
        setBorrower(borrowerData)

        const loansData = await getLoansByBorrowerId(borrowerId)
        setLoans(loansData)
      } catch (error) {
        toast.error('Error al obtener los datos del prestatario')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrowerData()
  }, [borrowerId])

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!borrower) {
    return <div>Prestatario no encontrado</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <Link href="/borrowers" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Gestión de Prestatarios
        </Button>
      </Link>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Perfil del Prestatario: {borrower.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold flex items-center">
                <Mail className="mr-2 h-4 w-4" /> Correo Electrónico
              </h3>
              <p>{borrower.email}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center">
                <Phone className="mr-2 h-4 w-4" /> Teléfono
              </h3>
              <p>{borrower.phoneNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">Puntuación de Desempeño</h3>
              <p className={getScoreColor(borrower.score)}>{borrower.score !== null ? borrower.score : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Historial de Préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha de Inicio</TableHead>
                <TableHead>Fecha de Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>${loan.amount.toFixed(2)}</TableCell>
                  <TableCell>{loan.startDate}</TableCell>
                  <TableCell>{loan.dueDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      loan.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                      loan.status.toLowerCase() === 'active' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loan.status === 'completed' ? 'Completado' : 
                       loan.status === 'active' ? 'Activo' : 'Pendiente'}
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

