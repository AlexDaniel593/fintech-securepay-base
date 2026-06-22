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
      const { fromAccountId, toAccountId, amount } = req.body;

      if (!fromAccountId || !toAccountId || amount === undefined) {
        return res.status(400).json({
          error: 'Petición incorrecta',
          message: 'Los campos fromAccountId, toAccountId y amount son requeridos en el cuerpo de la petición.'
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

