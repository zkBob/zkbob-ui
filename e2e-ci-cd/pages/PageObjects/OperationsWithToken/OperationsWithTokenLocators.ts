const tab_deposit = '//div[text()="Deposit"]';
const tab_transfer = '//div[text()="Transfer"]';
const tab_withdraw = '//div[text()="Withdraw"]';
const tab_history = '//div[text()="History"]';


const button_deposit = '//button[text()="Deposit"]';
const button_transfer = '//button[@data-ga-id="initiate-operation-transfer"]';
const button_withdraw = '//button[text()="Withdraw"]';
const button_confirm = '//button[contains(text(), "Confirm")]';
const button_sign_in = '//button[text()="Sign in"]';

const enter_web3_address = '//input[@placeholder="Enter Sepolia address of receiver"]';
const input_amount_in_deposit_tab = '//span[text()="Deposit"]/ancestor::div//input[@placeholder="0"]';
const input_amount_in_transfer_tab = '//span[text()="Transfer"]/ancestor::div//input[@placeholder="0"]';
const input_amount_in_withdraw_tab = '//span[text()="Withdraw"]/ancestor::div//input[@placeholder="0"]';
const input_amount = '//button[text()="Enter amount"]';
const input_password = '//input[@placeholder="Password"]';
const enter_receiver_address = '//div//textarea[@placeholder="Enter address of zkBob receiver"]';


export const OperationsWithTokenElementsLocators = {
    tab_deposit,
    button_deposit,
    button_transfer,
    button_withdraw,
    tab_transfer,
    tab_withdraw,
    tab_history,
    enter_receiver_address,
    input_amount,
    input_amount_in_deposit_tab,
    input_amount_in_transfer_tab,
    input_amount_in_withdraw_tab,
    enter_web3_address,
    button_confirm,
    input_password,
    button_sign_in
}

