import { BorrowerProfile } from "@/components/borrower-profile"

export default function BorrowerProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <BorrowerProfile borrowerId={params.id} />
    </div>
  )
}
