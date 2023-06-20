import { TIMEOUTS } from '../../constants';
import BasePage from '../base';
import { approveElements, confirmationElements } from './confirmationElements';
import { MetamaskNotificationMethods } from './interfaces';
import {
  confirmPageElements,
  notificationPageElements,
} from './notificationElements';

export default class MetamaskNotification extends BasePage implements MetamaskNotificationMethods {
  async grantAccess(): Promise<void> {
    await this.page.locator(notificationPageElements.nextButton).click({ timeout: TIMEOUTS.big });
    await this.page.locator(notificationPageElements.connectButton).click({ timeout: TIMEOUTS.big });
    // await this.page.locator(notificationPageElements.allowToSwitchNetwork).click({ timeout: TIMEOUTS.big });
  }

  async allowToSwitchNetwork(): Promise<void> {
    await this.page.locator(confirmationElements.footer.approveButton).click();
  }

  async allowToAddAndSwitchNetwork(): Promise<void> {
    await this.page.locator(confirmationElements.footer.approveButton).click();
    await this.page.locator(confirmationElements.footer.approveButton).click();
  }

  async confirmTransaction(): Promise<void> {
    await this.page.locator(confirmPageElements.confirmButton).click();
  }

  async rejectTransaction(): Promise<void> {
    await this.page.locator(confirmPageElements.rejectButton).click();
  }

  async confirmApproveRequest(): Promise<void> {
    await this.page.locator(approveElements.approveFooter.approveButton).click();
  }
}
