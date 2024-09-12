'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { addBorrower } from '@/lib/data'

export default function AddBorrowerForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [score, setScore] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      if (!name || !phoneNumber) {
        throw new Error('Please fill in all required fields')
      }

      const scoreValue = score ? parseFloat(score) : null

      await addBorrower(name, phoneNumber, scoreValue)
      toast.success('Borrower added successfully')
      router.push('/borrowers')
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="score">Score</Label>
            <Input
              id="score"
              type="number"
              step="0.01"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Borrower'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
