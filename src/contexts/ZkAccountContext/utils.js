import { ethers } from 'ethers';
import { HistoryTransactionType } from 'zkbob-client-js';

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
