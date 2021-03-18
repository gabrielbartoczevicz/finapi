const express = require('express');

const AccountsRepository = require('./fakes/AccountsRepository');

const app = express();

app.use(express.json());

const accountsRepository = new AccountsRepository();

app.post('/accounts', (request, response) => {
  const { cpf, name } = request.body;

  let account = accountsRepository.findByCPF(cpf);

  if (account) {
    console.log('Account Found', account);

    return response.status(422).json({ message: `CPF ${cpf} already in use` });
  }

  account = accountsRepository.save({
    cpf, 
    name,
    statement: []
  });

  console.log(account);

  return response.sendStatus(201);
});

app.get('/accounts/:id/statement', (request, response) => {
  const { id } = request.params;

  const account = accountsRepository.findById(id);

  if (!account) {
    return response.status(404).json({ message: `Account with ID ${id} not found` });
  }

  return response.json(account.statement);
});

app.listen(3333, () => console.log('Server started at :3333'));
