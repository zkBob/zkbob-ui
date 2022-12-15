export interface MetamaskNotificationMethods {
  grantAccess(): Promise<void>;
  confirmSignatureRequest?(): Promise<void>;
  rejectSignatureRequest?(): Promise<void>;
  confirmPermissionToSpend?(): Promise<void>;
  rejectPermissionToSpend?(): Promise<void>;
  acceptAccess?(): Promise<void>;
  confirmTransaction?(): Promise<void>;
  rejectTransaction?(): Promise<void>;
  allowToAddNetwork?(): Promise<void>;
  rejectToAddNetwork?(): Promise<void>;
  allowToSwitchNetwork?(): Promise<void>;
  rejectToSwitchNetwork?(): Promise<void>;
  allowToAddAndSwitchNetwork?(): Promise<void>;
  confirmApproveRequest?(): Promise<void>;
}
