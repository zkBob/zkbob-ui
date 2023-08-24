import { test } from '../fixtures/testContextFixture';


const ZKBOB_ADDRESS_USDM_GOERLI = process.env.ZKBOB_ADDRESS_USDM_GOERLI as string;
const ZKBOB_ADDRESS_USDC_GOERLI = process.env.ZKBOB_ADDRESS_USDC_GOERLI as string;
const ZKBOB_ADDRESS_ETH_GOERLI = process.env.ZKBOB_ADDRESS_ETH_GOERLI as string;

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
        await OperationsWithToken.SelectETHGoerli()
        await OperationsWithToken.InputAmount()
        await OperationsWithToken.button_DepositETH()
        await OperationsWithToken.TheCheckingTheDepositSent()
      });
    
      test.only('Transfer ETH', async ({ OperationsWithToken }) => {
        await OperationsWithToken.GoToTransferTab()
        await OperationsWithToken.SelectGoerliNetwork()
        await OperationsWithToken.SelectETHGoerli()
        await OperationsWithToken.InputAmountTransferTab()
        await OperationsWithToken.EnterzkBOBAddress(ZKBOB_ADDRESS_ETH_GOERLI)
        await OperationsWithToken.button_Transfer()
        await OperationsWithToken.button_Confirm()
        await OperationsWithToken.CheckTransfer()
      });
  
      test('Withdraw ETH', async ({ OperationsWithToken }) => {
          // ...
        });
    });
    
    
    test.describe('USDC pool', () => {
        test('Deposit USDC', async ({ OperationsWithToken }) => {
            await OperationsWithToken.GoToDepositTab()
            await OperationsWithToken.SelectGoerliNetwork()
            await OperationsWithToken.SelectUSDCGoerli()
            await OperationsWithToken.InputAmount()
            await OperationsWithToken.button_Deposit()
            await OperationsWithToken.TheCheckingTheDepositSent()
        });
        
        test.only('Transfer USDC', async ({ OperationsWithToken }) => {
            await OperationsWithToken.GoToTransferTab()
            await OperationsWithToken.SelectGoerliNetwork()
            await OperationsWithToken.SelectUSDCGoerli()
            await OperationsWithToken.InputAmountTransferTab()
            await OperationsWithToken.EnterzkBOBAddress(ZKBOB_ADDRESS_USDC_GOERLI)
            await OperationsWithToken.button_Transfer()
            await OperationsWithToken.button_Confirm()
            await OperationsWithToken.CheckTransfer()
        });

        test('Withdraw USDC', async ({ OperationsWithToken }) => {
            // ...
            });
        });

        test.describe('USDM pool', () => {
            test('Deposit USDM', async ({ OperationsWithToken }) => {
                await OperationsWithToken.GoToDepositTab()
                await OperationsWithToken.SelectGoerliNetwork()
                await OperationsWithToken.SelectUSDMGoerli()
                await OperationsWithToken.InputAmount()
                await OperationsWithToken.button_Deposit()
                await OperationsWithToken.TheCheckingTheDepositSent()
            });
          
            test.only('Transfer USDM', async ({ OperationsWithToken }) => {
                await OperationsWithToken.GoToTransferTab()
                await OperationsWithToken.SelectGoerliNetwork()
                await OperationsWithToken.SelectUSDMGoerli()
                await OperationsWithToken.InputAmountTransferTab()
                await OperationsWithToken.EnterzkBOBAddress(ZKBOB_ADDRESS_USDM_GOERLI)
                await OperationsWithToken.button_Transfer()
                await OperationsWithToken.button_Confirm()
                await OperationsWithToken.CheckTransfer()
            });
        
            test('Withdraw USDM', async ({ OperationsWithToken }) => {
                // ...
              });
          });