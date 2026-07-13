export interface PasswordResetDeliveryPort {
  send(input: { email: string; name: string; resetUrl: string }): Promise<void>;
}
