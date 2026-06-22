/**
 * Servicio principal de transacciones (orquestador).
 * Aplica Inversión de Dependencias (DIP): recibe los servicios de bajo nivel
 * por constructor en lugar de crearlos internamente.
 */
class TransactionService {
  constructor({ financialVerificationService, stateStorageService, consoleNotificationService }) {
    this.verifier = financialVerificationService;
    this.storage = stateStorageService;
    this.notifier = consoleNotificationService;
  }

  executeTransfer(fromAccountId, toAccountId, amount) {
    // 1. Verificación financiera (SRP: delegado)
    const { sender, receiver } = this.verifier.validateTransfer(fromAccountId, toAccountId, amount);

    // 2. Actualización de estados (SRP: delegado)
    this.storage.updateBalances(sender, receiver, amount);

    // 3. Registro de la transacción (SRP: delegado)
    const newTransaction = this.storage.createTransactionRecord(fromAccountId, toAccountId, amount);
    this.storage.saveTransaction(newTransaction);

    // 4. Notificaciones (SRP: delegado)
    this.notifier.notifyDebit(sender, amount, fromAccountId);
    this.notifier.notifyCredit(receiver, amount, fromAccountId);

    return {
      success: true,
      message: 'Transferencia ejecutada con éxito',
      transaction: newTransaction,
      balanceRestante: sender.balance
    };
  }

  getAccountBalance(accountId) {
    return this.storage.getAccountBalance(accountId);
  }
}

module.exports = TransactionService;
