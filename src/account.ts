type Transaction = {
  type: "Deposit" | "Sake" | "Transfer" | "Performance";
  value: number;
  date: Date;
  detail?: string;
};

export class BankAccount {
  accountNumber: string;
  name: string;
  cpf: string;
  balance: number;
  transactions: Transaction[];
}
