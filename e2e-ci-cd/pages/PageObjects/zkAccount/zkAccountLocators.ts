const button_zkAccount = '//button[text()="Get started!"]';
const button_Agree = '//button[text()="Agree"]';
const button_CreateWithSecretRecoveryPhrase = '//button[text()="secret recovery phrase"]';
const button_CreateWithWeb3Wallet = '//button[text()="MetaMask or WalletConnect"]';
const button_Continue = '//button[text()="Continue"]';
const button_Verify = '//button[text()="Verify"]';
const button_MetaMaskWallet = '//div/span[text()="MetaMask"]';
const button_ConnectWallet = '//span[text()="Create account"]//..//button[text()="Connect wallet"]';
const button_GenerateKey = '//button[text()="Generate key"]';
const button_RestoreAccount = '//button[text()="Restore account"]';

export const zkAccountElementsLocators = {
    button_zkAccount,
    button_Agree,
    button_CreateWithSecretRecoveryPhrase,
    button_CreateWithWeb3Wallet,
    button_Continue,
    button_Verify,
    button_MetaMaskWallet,
    button_ConnectWallet,
    button_GenerateKey,
    button_RestoreAccount
}


const input_NewPassword = '//input[@type="password"][@placeholder="Password 6+ characters"]';
const input_RepeatPassword = '//input[@type="password"][@placeholder="Verify password"]';
export const zkAccountCreatePasswordLocators= {
    input_NewPassword,
    input_RepeatPassword
}