import { BankAccount } from "./account";

export class AccountBank {
  private accounts: BankAccount[] = [];
  private nextAccount = 1;
  private accountformated(): string {
    return this.nextAccount.toString().padStart(4, "0000");
  }
  private calculateDays(date1: Date, date2: Date): number {
    const diffMonth = date2.getTime() - date1.getTime();
    const diffDays = Math.floor(diffMonth / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  AddAccount(name: string, cpf: string): BankAccount | null {
    const exist = this.accounts.find((client) => client.cpf === cpf);

    if (exist) {
      return null;
    }
    const account: BankAccount = {
      accountNumber: this.accountformated(),
      name,
      cpf,
      balance: 0,
      transactions: [],
    };

    this.accounts.push(account);
    this.nextAccount++;
    return account;
  }

  getAllAccount(): BankAccount[] {
    return this.accounts;
  }

  getByAccountNumber(accountNumber: string): BankAccount | undefined {
    return this.accounts.find(
      (account) => account.accountNumber === accountNumber
    );
  }

  depositBalance(
    accountNumber: string,
    balanceCents: number
  ): BankAccount | null {
    if (balanceCents <= 0) return null;

    const account = this.getByAccountNumber(accountNumber);
    if (!account) return null;

    account.balance += balanceCents;

    account.transactions.push({
      type: "Deposit",
      value: balanceCents,
      date: new Date("2025-03-23"),
      detail: `Foi feito um depósito de ${balanceCents}R$.`,
    });

    account.balance = parseFloat(account.balance.toFixed(2));
    return account;
  }

  sakeBalance(accountNumber: string, balanceCents: number): BankAccount | null {
    if (balanceCents <= 0) return null;

    const account = this.getByAccountNumber(accountNumber);
    if (!account) return null;

    if (account.balance < balanceCents) return null;

    account.balance -= balanceCents;

    account.transactions.push({
      type: "Sake",
      value: balanceCents,
      date: new Date(),
      detail: `Foi feito um saque de ${balanceCents}R$.`,
    });

    account.balance = parseFloat(account.balance.toFixed(2));
    return account;
  }

  transferBalance(
    accountOrigin: string,
    accountDestiny: string,
    balanceCents: number
  ): BankAccount[] | null {
    if (balanceCents <= 0) return null;

    const accountO = this.getByAccountNumber(accountOrigin);
    const accountD = this.getByAccountNumber(accountDestiny);
    if (!accountO || !accountD) return null;

    if (accountO.balance < balanceCents) return null;

    accountO.balance -= balanceCents;
    accountO.transactions.push({
      type: "Transfer",
      value: balanceCents,
      date: new Date(),
      detail: `A conta ${accountO.accountNumber}, Transferiu ${balanceCents}R$ para a conta ${accountD.accountNumber}`,
    });

    accountD.balance += balanceCents;
    accountD.transactions.push({
      type: "Transfer",
      value: balanceCents,
      date: new Date(),
      detail: `A conta ${accountD.accountNumber}, recebeu ${balanceCents}R$ da conta ${accountO.accountNumber}`,
    });

    return [accountO, accountD];
  }

  calculatebalance() {
    const today = new Date();

    this.accounts.map((account) => {
      if (account.transactions.length === 0) return null;

      const lastTransactions =
        account.transactions[account.transactions.length - 1];
      const lastDate = new Date(lastTransactions.date);
      const daysMovement = this.calculateDays(lastDate, today);

      let totalBonus = false;
      if (daysMovement > 0) {
        for (let i = 1; i <= daysMovement; i++) {
          const performance = account.balance * 0.0005;
          if (performance > 0) {
            account.balance += performance;
            account.transactions.push({
              type: "Performance",
              value: performance,
              date: new Date(),
            });
          }

          if (i === 30 && !totalBonus) {
            const bonus = account.balance * 0.005;
            if (bonus > 0) {
              account.balance += bonus;
              account.transactions.push({
                type: "Performance",
                value: bonus,
                date: new Date(),
              });
              totalBonus = true;
            }
          }
        }
      }
      account.balance = parseFloat(account.balance.toFixed(2));
      console.log(account.balance);
      return account;
    });
  }
}
