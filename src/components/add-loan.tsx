'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, Loader2 } from 'lucide-react'
import { format, addMonths } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import { getBorrowers, addLoan } from '@/lib/data'
import Link from 'next/link'

interface AddLoanProps {
  borrowerId?: string;
}

export function AddLoan({ borrowerId }: AddLoanProps) {
  const router = useRouter()
  const [selectedBorrower, setSelectedBorrower] = useState(borrowerId || '')
  const [borrowers, setBorrowers] = useState([])
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(addMonths(new Date(), 1))
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchBorrowersData = async () => {
      try {
        const data = await getBorrowers()
        setBorrowers(data)
      } catch (error) {
        toast.error('No se pudo obtener la lista de prestatarios')
      }
    }
    fetchBorrowersData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      if (!selectedBorrower || !loanAmount || !interestRate || !startDate || !dueDate) {
        throw new Error('Por favor complete todos los campos')
      }

      const amount = parseFloat(loanAmount)
      const rate = parseFloat(interestRate)

      if (amount <= 0 || rate <= 0) {
        throw new Error('El monto y la tasa de interés deben ser mayores a cero')
      }

      await addLoan({
        borrowerId: selectedBorrower,
        amount,
        interestRate: rate,
        startDate,
        dueDate,
        status: 'Active'
      }
      )
      toast.success('Préstamo añadido con éxito')
      router.push('/dashboard')
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <Button variant="ghost" onClick={() => router.push('/borrowers')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Prestatarios
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Añadir Nuevo Préstamo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="borrower">Prestatario</Label>
              <Select value={selectedBorrower} onValueChange={setSelectedBorrower} disabled={!!borrowerId}>
                <SelectTrigger id="borrower">
                  <SelectValue placeholder="Seleccione un prestatario" />
                </SelectTrigger>
                <SelectContent>
                  {borrowers.map((borrower) => (
                    <SelectItem key={borrower.id} value={borrower.id}>
                      {borrower.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!borrowerId && (             
                 <Link href="/borrowers/add" passHref>
                    <Button type="button" variant="outline" className="mt-2">
                      Añadir Nuevo Prestatario
                    </Button>
                 </Link>)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto del Préstamo</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Ingrese el monto del préstamo"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Tasa de Interés (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="Ingrese la tasa de interés"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Seleccione una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : <span>Seleccione una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enviar
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => router.push('/borrowers')}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
