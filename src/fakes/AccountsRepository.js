const { v4: uuid } = require('uuid');

class AccountsRepository {
  constructor() {
    this.accounts = [];
  }

  save({ cpf, name, statement }) {
    const account = {};
    
    Object.assign(account, { id: uuid(), cpf, name, statement });

    this.accounts.push(account);

    return account;
  }

  findByCPF(cpf) {
    const account = this.accounts.find(account => account.cpf === cpf);

    return account;
  }

  findById(id) {
    const account = this.accounts.find(account => account.id === id);

    return account;
  }
}

module.exports = AccountsRepository;