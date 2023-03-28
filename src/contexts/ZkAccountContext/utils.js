import { ethers } from 'ethers';
import { HistoryTransactionType } from 'zkbob-client-js';

export function splitDirectDeposits(history) {
  const result = [];
  history.forEach(item => {
    if (item.type === HistoryTransactionType.DirectDeposit) {
      item.actions.forEach(action => {
        result.push({
          ...item,
          actions: [action],
        });
      });
    } else {
      result.push(item);
    }
  });
  return result;
}

export function aggregateFees(history) {
  const result = [];
  let i = 0;
  while (i < history.length) {
    let sum = ethers.constants.Zero;
    while (i < history.length && history[i].type === HistoryTransactionType.AggregateNotes) {
      sum = sum.add(history[i].fee);
      i++;
    }
    if (i < history.length) {
      if (!sum.isZero()) {
        result.push({
          ...history[i],
          fee: sum.add(history[i].fee)
        });
      } else {
        result.push(history[i]);
      }
    }
    i++;
  }
  return result;
}
