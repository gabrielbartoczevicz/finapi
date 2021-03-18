const express = require('express');

const AccountsRepository = require('./fakes/AccountsRepository');

const app = express();

app.use(express.json());

const accountsRepository = new AccountsRepository();

app.post('/accounts', (request, response) => {
  const { cpf, name } = request.body;

  let account = accountsRepository.findAccountByCPF(cpf);

  if (account) {
    console.log('Account Found', account);

    return response.status(422).json({ message: `CPF ${cpf} already in use` });
  }

  account = accountsRepository.save({
    cpf, 
    name,
    statements: []
  });

  console.log(account);

  return response.sendStatus(201);
});

app.listen(3333, () => console.log('Server started at :3333'));
