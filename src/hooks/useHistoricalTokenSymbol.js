import { useMemo } from 'react';
import { HistoryTransactionType } from 'zkbob-client-js';

export default (currentPool, historyItem) => {
  return useMemo(() => {
    if (currentPool.migrations?.length > 0) {
      const migration = currentPool.migrations.find(migration => migration.timestamp > historyItem.timestamp);
      if (migration) return migration.prevTokenSymbol;
    }
    const isWrapped = currentPool.isNative && historyItem.type === HistoryTransactionType.Deposit;
    return (isWrapped ? 'W' : '') + currentPool.tokenSymbol;
  }, [currentPool, historyItem.type, historyItem.timestamp]);
}
