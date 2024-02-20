import web3 from "web3";

function printInfo(receipt, type) {
  let l1Fee = parseInt(receipt.l1Fee, 16);
  switch (type) {
    case "gasTransfer":
      printMessage(
        "Gas transfer to " + receipt.to + " successful.\nTransaction hash:",
        receipt.transactionHash
      );
      break;
    case "sendMessage":
      printMessage(
        "Message sent to " + receipt.to + ".\nTransaction hash:",
        receipt.transactionHash
      );
      break;
    case "deposit":
      printMessage(
        "Deposit successful.\nTransaction hash:",
        receipt.transactionHash
      );
      break;
    case "mint":
      printMessage(
        "Mint of " + receipt.to + " successful.\nTransaction hash:",
        receipt.transactionHash
      );
      break;
    case "erc20Transfer":
      printMessage(
        "ERC20 " + receipt.to + " sent succesfull.\nTransaction hash:",
        receipt.transactionHash
      );
      break;
    case "wrap":
      printMessage(
        "Wrap succesfull.\nTransaction hash:",
        receipt.transactionHash
      );
      break;
    default:
      printMessage(
        "Transaction successful.\nTransaction hash:",
        receipt.transactionHash
      );
      break;
  }
  printMessage(
    "Fee spent: " + web3.utils.fromWei(l1Fee.toString(), "ether") + " MNT"
  );
  printMessage(
    "-----------------------------------------------------------------------------------"
  );
  return l1Fee;
}

// function printBalance(account) {
//   // Get the balance of the account
//   web3.eth
//     .getBalance(account.address)
//     .then((balance) => {
//       printMessage(
//         `Account balance: ${web3.utils.fromWei(balance, "ether")} ETH`
//       );
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }
function printBalance(web3, account) {
  // Get the balance of the account
  web3.eth
    .getBalance(account.address)
    .then((balance) => {
      console.log(
        `Account balance: ${web3.utils.fromWei(balance, "ether")} ETH`
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function printMessage(message) {
  console.log(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { printInfo, printBalance, printMessage, sleep };
