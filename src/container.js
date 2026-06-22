/**
 * Contenedor de composición manual (Pure DI).
 * Instancia los servicios de bajo nivel y los inyecta en el servicio principal.
 */
const StateStorageService = require('./services/state-storage.service');
const FinancialVerificationService = require('./services/financial-verification.service');
const ConsoleNotificationService = require('./services/console-notification.service');
const TransactionService = require('./services/transaction.service');

const stateStorageService = new StateStorageService();
const financialVerificationService = new FinancialVerificationService(stateStorageService);
const consoleNotificationService = new ConsoleNotificationService();

const transactionService = new TransactionService({
  financialVerificationService,
  stateStorageService,
  consoleNotificationService
});

module.exports = {
  transactionService
};
