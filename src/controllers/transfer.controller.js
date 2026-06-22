const Sentry = require('@sentry/node');

/**
 * Factory del controlador de transferencias.
 * Aplica DIP al recibir el servicio de transacciones por constructor.
 */
function createTransferController(transactionService) {
  /**
   * Endpoint para ejecutar una transferencia bancaria (Beta).
   * POST /v1/transfer-beta/execute
   *
   * Espera un cuerpo JSON con: { fromAccountId, toAccountId, amount }
   */
  function executeTransfer(req, res) {
    try {
      const { fromAccountId, toAccountId, amount, simulateDbFailure } = req.body;

      if (!fromAccountId || !toAccountId || amount === undefined) {
        return res.status(400).json({
          error: 'Petición incorrecta',
          message: 'Los campos fromAccountId, toAccountId y amount son requeridos en el cuerpo de la petición.'
        });
      }

      // Disparador de error operacional: fallo de conexión a la base de datos de saldos
      if (simulateDbFailure === true || simulateDbFailure === 'true') {
        const err = new Error('Conexión interrumpida con el Clúster de Datos SecurePay');
        Sentry.withScope((scope) => {
          scope.setTag('userId', req.user.sub);
          Sentry.captureException(err);
        });
        return res.status(500).json({
          error: 'Error interno del servidor',
          message: err.message
        });
      }

      const result = transactionService.executeTransfer(fromAccountId, toAccountId, Number(amount));
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        error: 'Error en la transacción',
        message: error.message
      });
    }
  }

  return {
    executeTransfer
  };
}

const { transactionService } = require('../container');
const transferController = createTransferController(transactionService);
transferController.createTransferController = createTransferController;
module.exports = transferController;
