/**
 * Servicio de verificación financiera.
 * Única responsabilidad: validar reglas de negocio antes de una transferencia.
 */
class FinancialVerificationService {
  constructor(stateStorageService) {
    this.storage = stateStorageService;
  }

  validateTransfer(fromAccountId, toAccountId, amount) {
    const sender = this.storage.findUserByAccount(fromAccountId);
    if (!sender) {
      throw new Error(`Error de validación: La cuenta origen '${fromAccountId}' no existe en la base de datos.`);
    }

    const receiver = this.storage.findUserByAccount(toAccountId);
    if (!receiver) {
      throw new Error(`Error de validación: La cuenta destino '${toAccountId}' no existe en la base de datos.`);
    }

    if (amount <= 0) {
      throw new Error('Error de validación: El monto a transferir debe ser mayor a cero.');
    }

    if (sender.balance < amount) {
      throw new Error(`Saldo insuficiente: La cuenta '${fromAccountId}' tiene $${sender.balance}, requiere $${amount}.`);
    }

    return { sender, receiver };
  }
}

module.exports = FinancialVerificationService;
