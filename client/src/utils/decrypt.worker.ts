import SnapshotService from "@services/snapshot/snapshotService";

// eslint-disable-next-line
const ctx: Worker = self as any;

ctx.addEventListener('message', (message: MessageEvent<IEncryptedExpense>) => {
  const expense = message.data;
  const encryptedAsString = atob(expense.data).split(",");
  const encryptedAsBytes = new Uint8Array(encryptedAsString.map(Number));

  console.log(encryptedAsString);
  console.log(encryptedAsBytes);

  SnapshotService.decryptData(encryptedAsBytes)
    .then((decryptedBytes) => {
      const decodedData = new TextDecoder().decode(decryptedBytes);
      const decryptedData = JSON.parse(decodedData);

      const decryptedExpense = {
        id: expense._id,
        walletId: expense.walletId,
        ...decryptedData,
      };

      postMessage(decryptedExpense);
    })
    .catch(console.error);
});
