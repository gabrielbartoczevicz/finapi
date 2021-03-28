const { v4: uuid } = require("uuid");

class AccountsRepository {
  constructor() {
    this.accounts = [];
  }

  save(account) {
    const { id } = account;

    if (!id) {
      Object.assign(account, { id: uuid() });

      this.accounts.push(account);

      return account;
    }

    const accountIndex = this.accounts.findIndex(
      (toFindAccount) => toFindAccount.id === id
    );

    this.accounts[accountIndex] = account;

    return this.accounts[accountIndex];
  }

  findByCPF(cpf) {
    const account = this.accounts.find((account) => account.cpf === cpf);

    return account;
  }

  findById(id) {
    const account = this.accounts.find((account) => account.id === id);

    return account;
  }
}

module.exports = AccountsRepository;
