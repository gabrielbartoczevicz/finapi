const express = require("express");

const AccountsRepository = require("./fakes/AccountsRepository");

const app = express();

app.use(express.json());

const accountsRepository = new AccountsRepository();

function checkIfAccountExistsMiddleware(request, response, next) {
  const { token } = request.headers;

  const account = accountsRepository.findById(token);

  if (!account) {
    return response.status(403).json({ message: "Account not found" });
  }

  request.account = account;

  return next();
}

app.post("/accounts", (request, response) => {
  const { cpf, name } = request.body;

  let account = accountsRepository.findByCPF(cpf);

  if (account) {
    console.log("Account Found", account);

    return response.status(422).json({ message: `CPF ${cpf} already in use` });
  }

  account = accountsRepository.save({
    cpf,
    name,
    statement: [],
  });

  return response.json(account);
});

app.use(checkIfAccountExistsMiddleware);

app.get("/statement", (request, response) => {
  const { account } = request;

  return response.json(account.statement);
});

app.listen(3333, () => console.log("Server started at :3333"));
