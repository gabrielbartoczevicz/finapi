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
    const account = this.accounts.find(
      (account) => account.cpf === Number(cpf)
    );

    return account;
  }

  delete({ id }) {
    const accountIndex = this.accounts.findIndex(
      (account) => account.id === id
    );

    this.accounts.splice(accountIndex, 1);
  }
}

module.exports = AccountsRepository;
