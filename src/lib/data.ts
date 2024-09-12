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

interface AddLoanDTO {
    borrowerId: string;
    amount: number;
    interestRate: number;
    startDate: Date;
    dueDate: Date;
    status: string;
}

export async function addLoan({
    borrowerId,
    amount,
    interestRate,
    startDate,
    dueDate,
    status,
}: AddLoanDTO) {
    const { data, error } = await supabase
        .from('loans')
        .insert({
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

export async function getLoans() {
    const { data, error } = await supabase
        .from('loans')
        .select(`
            id,
            amount,
            interest_rate,
            start_date,
            due_date,
            status,
            borrower: borrower_id (name)
        `);

    if (error) throw error;

    const loans = data.map((loan) => ({
        id: loan.id,
        borrowerName: loan.borrower.name,
        amount: loan.amount,
        interestRate: loan.interest_rate,
        startDate: loan.start_date,
        dueDate: loan.due_date,
        status: loan.status,
    }));

    return loans;
}
