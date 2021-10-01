const fs = require("fs");
// const readlineSync = require("readline-sync");

class Account {
  constructor(name) {
    this.name = name;
    this.balance = 0;
    this.transactionLog = [];
  }

  addToBalance(amount) {
    this.balance += amount;
  }

  removeFromBalance(amount) {
    this.balance -= amount;
  }

  addTransaction(transaction) {
    this.transactionLog.push(transaction);
  }
}

class Transaction {
  constructor(date, from, to, narrative, amount) {
    this.date = date;
    this.from = from;
    this.to = to;
    this.narrative = narrative;
    this.amount = amount;
  }
}

const transactionFileContent = fs.readFileSync(
  "./transactions2014.csv",
  "utf8"
);
const transactionsAsStrings = transactionFileContent.split("\n");
removeHeaderFromCSV(transactionsAsStrings);

const transactions = [];
const accounts = [];

for (let i = 0; i < transactionsAsStrings.length; i++) {
  const transactionAsArray = transactionsAsStrings[i].split(",");
  transactions.push(
    new Transaction(
      transactionAsArray[0],
      transactionAsArray[1],
      transactionAsArray[2],
      transactionAsArray[3],
      parseFloat(transactionAsArray[4])
    )
  );
}

for (let i = 0; i < transactions.length; i++) {
  const currentTransaction = transactions[i];
  const accountFrom = getOrCreateAccount(currentTransaction.from);
  const accountTo = getOrCreateAccount(currentTransaction.to);


  updateAccountBalance(accountFrom, accountTo, currentTransaction.amount);
  addToAccountTransactionLog(accountFrom, currentTransaction);
  addToAccountTransactionLog(accountTo, currentTransaction);
}

// FUNCTIONS
function removeHeaderFromCSV(csvFile) {
  csvFile.shift();
}

function getOrCreateAccount(accountName) {
  for (const account of accounts) {
    if (account.name === accountName) return account;
  }

  return createNewAccount(accountName);
}

function createNewAccount(accountName) {
  const newAccount = new Account(accountName);
  accounts.push(newAccount);

  return newAccount;
}

function updateAccountBalance(accountFrom, accountTo, amount) {
  accountFrom.removeFromBalance(amount);
  accountTo.addToBalance(amount);
}

function addToAccountTransactionLog(account, currentTransaction) {
  account.addTransaction(currentTransaction);
}