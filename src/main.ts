import { BankAccount } from "./account";

class CreateAccountBank {
  private accounts: BankAccount[] = [];
  private nextAccount = 1;
  private accountformated(): string {
    return this.nextAccount.toString().padStart(4, "0000");
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
    };

    this.accounts.push(account);
    this.nextAccount++;
    return account;
  }

  getAllAccount(): BankAccount[] {
    return this.accounts;
  }
}

const client: CreateAccountBank = new CreateAccountBank();
console.log(client.AddAccount("Rafael", "484798895217"));
console.log(client.AddAccount("Rafa", "484444444447"));
console.log(client.AddAccount("Rafael", "484798895217"));
console.log(client.getAllAccount());
