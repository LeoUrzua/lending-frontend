import { AddLoan } from "@/components/add-loan"

export default function AddLoanForBorrowerPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <AddLoan borrowerId={params.id} />
    </div>
  )
}
