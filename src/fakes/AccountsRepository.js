const { v4: uuid } = require('uuid');

class AccountsRepository {
  constructor() {
    this.accounts = [];
  }

  save({ cpf, name, statements }) {
    const account = {};
    
    Object.assign(account, { id: uuid(), cpf, name, statements });

    this.accounts.push(account);

    return account;
  }
}

module.exports = AccountsRepository;