import { test } from '../fixtures/testContextFixture';

test.beforeEach(async ({metamask, zkAccount}) => {
    await metamask.importWallet()
    await metamask.showTestNetworks()
    await zkAccount.open('/')
    await zkAccount.button_GetStarted()
    await zkAccount.button_CreateNewZkAccount()
    await zkAccount.button_UseWeb3wallet()
    await zkAccount.ConnectMetaMaskWallet()
    await zkAccount.button_SignMessage()
    await zkAccount.button_SetPassword()
    await zkAccount.CreatePassword()
    await zkAccount.CheckAccount() 
  });
  
  
  test.describe('ETH pool', () => {
      test('Deposit WETH', async ({ OperationsWithToken }) => {
          await OperationsWithToken.GoToDepositTab()
          await OperationsWithToken.SelectGoerliNetwork()
          await OperationsWithToken.SelectETH()
          await OperationsWithToken.DepositInputAmount()
          await OperationsWithToken.button_DepositETH()
          await OperationsWithToken.TheCheckingTheDepositSent()
      });
    
      test('Transfer ETH', async ({ OperationsWithToken }) => {
        // ...
      });
  
      test('Withdraw ETH', async ({ OperationsWithToken }) => {
          // ...
        });
    });
    
    
    test.describe('USDC pool', () => {
        test.only('Deposit USDC', async ({ OperationsWithToken }) => {
            await OperationsWithToken.GoToDepositTab()
            await OperationsWithToken.SelectGoerliNetwork()
            await OperationsWithToken.SelectUSDC()
            await OperationsWithToken.DepositInputAmount()
            await OperationsWithToken.button_Deposit()
            await OperationsWithToken.TheCheckingTheDepositSent()
        });
        
        test('Transfer USDC', async ({ OperationsWithToken }) => {
            // ...
        });

        test('Withdraw USDC', async ({ OperationsWithToken }) => {
            // ...
            });
        });

        test.describe('USDM pool', () => {
            test.only('Deposit USDM', async ({ OperationsWithToken }) => {
                await OperationsWithToken.GoToDepositTab()
                await OperationsWithToken.SelectGoerliNetwork()
                await OperationsWithToken.SelectUSDM()
                await OperationsWithToken.DepositInputAmount()
                await OperationsWithToken.button_Deposit()
                await OperationsWithToken.TheCheckingTheDepositSent()
            });
          
            test('Transfer USDM', async ({ OperationsWithToken }) => {
              // ...
            });
        
            test('Withdraw USDM', async ({ OperationsWithToken }) => {
                // ...
              });
          });