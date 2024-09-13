import AddBorrowerForm from '@/components/AddBorrowerForm'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddBorrowerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/borrowers" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Prestatarios
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Añadir Nuevo Prestatario</h1>
      <AddBorrowerForm />
    </div>
  )
}
