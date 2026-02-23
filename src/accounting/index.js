"use strict";

const readline = require("readline");

const OP_TOTAL = "TOTAL ";
const OP_CREDIT = "CREDIT";
const OP_DEBIT = "DEBIT ";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (promptText) =>
  new Promise((resolve) => {
    rl.question(promptText, (answer) => resolve(answer));
  });

let storageBalanceCents = 100000;

const dataProgram = (operationType, balanceCents) => {
  if (operationType === "READ") {
    return storageBalanceCents;
  }

  if (operationType === "WRITE") {
    storageBalanceCents = balanceCents;
    return storageBalanceCents;
  }

  return storageBalanceCents;
};

const formatMoney = (cents) => (cents / 100).toFixed(2);

const parseAmountToCents = (input) => {
  const trimmed = input.trim();

  if (!/^\d+(\.\d{0,2})?$/.test(trimmed)) {
    return 0;
  }

  const value = Number(trimmed);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value * 100);
};

const operations = async (operationType) => {
  if (operationType === OP_TOTAL) {
    const finalBalance = dataProgram("READ");
    console.log(`Current balance: ${formatMoney(finalBalance)}`);
    return;
  }

  if (operationType === OP_CREDIT) {
    const amountInput = await question("Enter credit amount: ");
    const amountCents = parseAmountToCents(amountInput);
    let finalBalance = dataProgram("READ");
    finalBalance += amountCents;
    dataProgram("WRITE", finalBalance);
    console.log(`Amount credited. New balance: ${formatMoney(finalBalance)}`);
    return;
  }

  if (operationType === OP_DEBIT) {
    const amountInput = await question("Enter debit amount: ");
    const amountCents = parseAmountToCents(amountInput);
    let finalBalance = dataProgram("READ");

    if (finalBalance >= amountCents) {
      finalBalance -= amountCents;
      dataProgram("WRITE", finalBalance);
      console.log(`Amount debited. New balance: ${formatMoney(finalBalance)}`);
    } else {
      console.log("Insufficient funds for this debit.");
    }
  }
};

const showMenu = () => {
  console.log("--------------------------------");
  console.log("Account Management System");
  console.log("1. View Balance");
  console.log("2. Credit Account");
  console.log("3. Debit Account");
  console.log("4. Exit");
  console.log("--------------------------------");
};

const main = async () => {
  let continueFlag = true;

  while (continueFlag) {
    showMenu();
    const choiceInput = await question("Enter your choice (1-4): ");
    const userChoice = Number.parseInt(choiceInput.trim(), 10);

    if (userChoice === 1) {
      await operations(OP_TOTAL);
    } else if (userChoice === 2) {
      await operations(OP_CREDIT);
    } else if (userChoice === 3) {
      await operations(OP_DEBIT);
    } else if (userChoice === 4) {
      continueFlag = false;
    } else {
      console.log("Invalid choice, please select 1-4.");
    }
  }

  console.log("Exiting the program. Goodbye!");
  rl.close();
};

main();
