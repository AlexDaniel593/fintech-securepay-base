/**
 * Servicio de almacenamiento de estados (State Storage).
 * Única responsabilidad: gestionar la base de datos en memoria y el historial.
 */
class StateStorageService {
  constructor() {
    this.usersDb = [
      { id: 'usr_001', email: 'estudiante.alpha@espe.edu.ec', accountAlpha: 'ACC-12345', balance: 1500.00 },
      { id: 'usr_002', email: 'docente.beta@espe.edu.ec', accountAlpha: 'ACC-67890', balance: 350.50 }
    ];
    this.transactionsHistory = [];
  }

  findUserByAccount(accountId) {
    return this.usersDb.find(u => u.accountAlpha === accountId);
  }

  updateBalances(sender, receiver, amount) {
    sender.balance -= amount;
    receiver.balance += amount;
  }

  createTransactionRecord(from, to, amount) {
    return {
      transactionId: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      from,
      to,
      amount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString()
    };
  }

  saveTransaction(transaction) {
    this.transactionsHistory.push(transaction);
    return transaction;
  }

  getAccountBalance(accountId) {
    const account = this.findUserByAccount(accountId);
    if (!account) {
      throw new Error(`La cuenta '${accountId}' no existe.`);
    }
    return {
      accountId: account.accountAlpha,
      email: account.email,
      balance: account.balance
    };
  }
}

module.exports = StateStorageService;
