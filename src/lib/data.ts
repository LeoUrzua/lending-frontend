import { format } from 'date-fns';
import { supabase } from './supabase'

interface AddLoanDTO {
    borrowerId: string;
    amount: number;
    interestRate: number;
    startDate: Date;
    dueDate: Date;
    status: string;
}

export interface Borrower {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    score: number;
}

interface Loan {
    id: string;
    borrowerName: string;
    amount: number;
    interestRate: number;
    startDate: string;
    dueDate: string;
    status: string;
}

export async function getBorrowers() {
    const { data, error } = await supabase
        .from('borrowers')
        .select('*')
    if (error) throw error


    return data.map((borrower) => ({
        id: borrower.id,
        name: borrower.name,
        phoneNumber: borrower.phone_number,
        score: borrower.score,
    }))
}

export async function addBorrower(name: string, phoneNumber: string, score?: number) {
    const { data, error } = await supabase
        .from('borrowers')
        .insert({ name, phone_number: phoneNumber, score })
        .single()
    if (error) throw error
    return data
}

export async function getBorrower(id: string): Promise<Borrower | null> {
    const { data, error } = await supabase
        .from('borrowers')
        .select('*')
        .eq('id', id)
        .single()
    if (error) throw error

    if (!data) return null

    return {
        id: data.id,
        name: data.name,
        phoneNumber: data.phone_number,
        score: data.score,
    }
}

export async function getLoansByBorrowerId(borrowerId: string): Promise<Loan[]> {
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
        `)
        .eq('borrower_id', borrowerId)
    if (error) throw error

    return data.map((loan) => ({
        id: loan.id,
        borrowerName: loan.borrower.name,
        amount: loan.amount,
        interestRate: loan.interest_rate,
        startDate: format(new Date(loan.start_date), 'yyyy-MM-dd'),
        dueDate: format(new Date(loan.due_date), 'yyyy-MM-dd'),
        status: loan.status,
    }))
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
