import { supabase } from './supabase'

export async function getBorrowers() {
    const { data, error } = await supabase
        .from('borrowers')
        .select('*')
    if (error) throw error
    return data
}

export async function addBorrower(name: string, phoneNumber: string, score?: number) {
    const { data, error } = await supabase
        .from('borrowers')
        .insert({ name, phone_number: phoneNumber, score })
        .single()
    if (error) throw error
    return data
}

export async function addLoan(lenderId: string, borrowerId: string, amount: number, interestRate: number, startDate: Date, dueDate: Date, status: string) {
    const { data, error } = await supabase
        .from('Loans')
        .insert({
            lender_id: lenderId,
            borrower_id: borrowerId,
            amount,
            interest_rate: interestRate,
            start_date: startDate.toISOString(),
            due_date: dueDate.toISOString(),
            status
        })
        .single()
    if (error) throw error
    return data
}
