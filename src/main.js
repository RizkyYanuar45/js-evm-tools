import { printInfo, printBalance, printMessage, sleep } from "./utils.js";
import dotenv from "dotenv";
import Web3 from "web3";
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl =
  "https://evmos-testnet.lava.build/lava-referer-afc6c9c8-0e06-4756-a1ba-3132dfe8a36c/";
const chainId = "9000";

const contractAddress = "CONTRACT-ADDRESS-HERE";
const contractABI = "CONTRACT-ABI-HERE";

const tokenAddress = "TOKEN-ADDRESS-HERE";
const tokenABI = "TOKEN-ABI-HERE";

const recipientAddresses = [
  "0x6c1e308Bc5Cc26F2596d7373c4e3616D5f67324b",
  "0xEb6AC4d33607C2493874e5aE257E296832C3F5B0",
  "0x9d95070239C1a547F078e8Dd291f6a43EB0E79ee",
];

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);
web3.eth.defaultChain = chainId;

const account = web3.eth.accounts.privateKeyToAccount(privateKey);

// gas
const gasLimit = 50000;

const amount = "0.000001";

var gasSpent = 0;

// Transfer gas
async function transferGas(message) {
  let data = "";
  // check if a message is provided, in that case convert it to hex and put it in data field
  if (message !== undefined) {
    data = Buffer.from(message, "utf-8").toString("hex");
  }
  const recipientAddress = recipientAddresses[Math.floor(Math.random() * 3)];

  try {
    const txObject = {
      from: account.address,
      to: recipientAddress,
      value: web3.utils.toWei(amount, "ether"), // Amount in Wei
      data: data,
      gas: gasLimit,
      gasPrice: await web3.eth.getGasPrice(),
    };

    const signedTx = await account.signTransaction(txObject);
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    gasSpent += printInfo(receipt, "gasTransfer");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Transfer ERC20 tokens
async function transferERC20() {
  //pick a random address from the list
  const recipientAddress = recipientAddresses[Math.floor(Math.random() * 3)];
  const tokenAmount = web3.utils.toWei(amount, "ether"); // Amount in Wei
  const data = tokenABI.methods
    .transfer(recipientAddress, tokenAmount)
    .encodeABI();

  try {
    const txObject = {
      from: account.address,
      to: tokenAddress,
      data: data,
      gas: gasLimit,
      gasPrice: await web3.eth.getGasPrice(),
    };

    const signedTx = await account.signTransaction(txObject);
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    gasSpent += printInfo(receipt, "erc20Transfer");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function contractInteraction() {
  const asset = "CONTRACT-ADDRESS-HERE";
  const amountToDeposit = web3.utils.toWei(amount, "ether"); // Amount in Wei
  const onBehalfOf = account.address;

  const data = contractABI.methods.deposit(asset, amountToDeposit).encodeABI();

  try {
    const txObject = {
      from: account.address,
      to: contractAddress,
      data: data,
      gas: gasLimit,
      gasPrice: await web3.eth.getGasPrice(),
    };

    const signedTx = await account.signTransaction(txObject);
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    gasSpent += printInfo(receipt, "deposit");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Actions to be performed
async function performAllActions() {
  await transferGas();
  //await wrap();
  //await contractInteraction()
  //await sendMessage("Hello, this is a message from the future.")
  //await transferERC20();
}

async function main(interactions) {
  printBalance(web3, account);
  for (let index = 1; index <= interactions; index++) {
    printMessage("Iteration " + index);
    await performAllActions();
    if (index + 1 <= interactions) {
      await sleep(1000 * (Math.floor(Math.random() * 100) + 1));
    }
  }
  printMessage(
    "Total gas used: " + web3.utils.fromWei(gasSpent.toString(), "ether")
  );
}

main(process.argv[2]);
