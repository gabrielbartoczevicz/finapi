const express = require("express");

const AccountsRepository = require("./fakes/AccountsRepository");

const app = express();

app.use(express.json());

const accountsRepository = new AccountsRepository();

function checkIfAccountExistsMiddleware(request, response, next) {
  const { cpf } = request.headers;

  const account = accountsRepository.findByCPF(cpf);

  if (!account) {
    return response.status(403).json({ message: "Account not found" });
  }

  request.account = account;

  return next();
}

function getBalanceFromAccount(account) {
  const { statement } = account;

  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    }

    return acc - operation.amount;
  }, 0);

  return balance;
}

app.post("/accounts", (request, response) => {
  const { cpf, name } = request.body;

  let account = accountsRepository.findByCPF(cpf);

  if (account) {
    return response.status(422).json({ message: `CPF ${cpf} already in use` });
  }

  account = accountsRepository.save({
    cpf,
    name,
    statement: [],
  });

  return response.sendStatus(201);
});

app.use(checkIfAccountExistsMiddleware);

app.get("/account", (request, response) => {
  const { account } = request;

  return response.json(account);
});

app.put("/account", (request, response) => {
  const { account } = request;
  const { name } = request.body;

  account.name = name;

  accountsRepository.save(account);

  return response.sendStatus(200);
});

app.get("/statement", (request, response) => {
  const { account } = request;
  const { date } = request.query;

  if (!date) {
    return response.json(account.statement);
  }

  const dateFormat = new Date(`${date} 00:00`);

  const statement = account.statement.filter(
    (statement) =>
      statement.created_at.toDateString() === dateFormat.toDateString()
  );

  return response.json(statement);
});

app.post("/deposit", (request, response) => {
  const { description, amount } = request.body;

  const { account } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  account.statement.push(statementOperation);

  accountsRepository.save(account);

  return response.sendStatus(201);
});

app.post("/withdraw", (request, response) => {
  const { amount } = request.body;

  const { account } = request;

  const balance = getBalanceFromAccount(account);

  if (balance < amount) {
    return response.status(422).json({ message: "Insufficient balance" });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  account.statement.push(statementOperation);

  accountsRepository.save(account);

  return response.sendStatus(201);
});

app.listen(3333, () => console.log("Server started at :3333"));
