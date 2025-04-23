import fastify from "fastify";
import { BankAccount } from "./account";
import { AccountBank } from "./account-bank";

const bank = fastify();
const accountBank = new AccountBank();

bank.post("/accounts", async (request, reply) => {
  accountBank.calculatebalance();
  const { name } = request.body as BankAccount;
  const { cpf } = request.body as BankAccount;
  accountBank.AddAccount(name, cpf);
});

bank.get("/accounts", async (request, reply) => {
  accountBank.calculatebalance();

  return accountBank.getAllAccount();
});

bank.get("/accounts/:accountNumber", async (request, reply) => {
  accountBank.calculatebalance();
  const { accountNumber } = request.params as { accountNumber: string };
  const account = accountBank.getByAccountNumber(accountNumber);

  if (!account) {
    return reply.code(404).send({ error: "Conta não encontrada!" });
  }
  return account;
});

bank.post("/accounts/:accountNumber/deposit", async (request, reply) => {
  accountBank.calculatebalance();
  const { accountNumber } = request.params as { accountNumber: string };
  const { balance } = request.body as { balance: number };
  const account = accountBank.depositBalance(accountNumber, balance);

  if (!account) {
    return reply.code(404).send({ error: "Conta não encontrada!" });
  }
  return account;
});

bank.post("/accounts/:accountNumber/sake", async (request, reply) => {
  accountBank.calculatebalance();

  const { accountNumber } = request.params as { accountNumber: string };
  const { balance } = request.body as { balance: number };
  const account = accountBank.sakeBalance(accountNumber, balance);

  if (!account) {
    return reply.code(404).send({ error: "Conta não encontrada!" });
  }
  return account;
});

bank.post("/accounts/transfer", async (request, reply) => {
  accountBank.calculatebalance();
  const { accountOrigin } = request.body as { accountOrigin: string };
  const { accountDestiny } = request.body as { accountDestiny: string };
  const { balance } = request.body as { balance: number };
  const account = accountBank.transferBalance(
    accountOrigin,
    accountDestiny,
    balance
  );
  if (!account) {
    return reply.code(404).send({ error: "Contas não encontradas" });
  }
  return account;
});

bank.listen({ port: 8080 }, (error, address) => {
  if (error) throw error;
  console.log(`O servidor está rodando em ${address}`);
});
