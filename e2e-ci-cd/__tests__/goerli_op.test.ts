import { test } from '../fixtures/testContextFixture';


const ZKBOB_ADDRESS_BOB_OP_GOERLI = process.env.ZKBOB_ADDRESS_BOB_OP_GOERLI as string;

test.beforeEach(async ({metamask, zkAccount}) => {
    await metamask.importWallet()
    await metamask.addCustomNetworks()
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
  
  
  test.describe('BOB pool', () => {
      test('Deposit BOB', async ({ OperationsWithToken }) => {
        await OperationsWithToken.GoToDepositTab()
        await OperationsWithToken.SelectGoerliOPNetwork()
        await OperationsWithToken.SelectBOBOPGoerli()
        await OperationsWithToken.InputAmount()
        await OperationsWithToken.button_Deposit()
        await OperationsWithToken.TheCheckingTheDepositSent()
      });
    
      test.only('Transfer BOB', async ({ OperationsWithToken }) => {
        await OperationsWithToken.GoToTransferTab()
        await OperationsWithToken.SelectGoerliOPNetwork()
        await OperationsWithToken.SelectBOBOPGoerli()
        await OperationsWithToken.InputAmountTransferTab()
        await OperationsWithToken.EnterzkBOBAddress(ZKBOB_ADDRESS_BOB_OP_GOERLI)
        await OperationsWithToken.button_Transfer()
        await OperationsWithToken.button_Confirm()
        await OperationsWithToken.CheckTransfer()
      });
  
      test('Withdraw BOB', async ({ OperationsWithToken }) => {
          // ...
        });
    });