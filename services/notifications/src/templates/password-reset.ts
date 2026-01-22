export const passwordResetTemplate = (params: { resetUrl: string }) => `
<h2>Reset your password</h2>
<p>You requested a password reset.</p>
<p>
  <a href="${params.resetUrl}">
    Reset password
  </a>
</p>
<p>This link will expire in 1 hour.</p>
`;
