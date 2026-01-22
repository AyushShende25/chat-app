export const verifyEmailTemplate = (params: {
	verifyUrl: string;
}) => `<h2>Verify your email</h2>
<p>
  <a href="${params.verifyUrl}">
    Verify email
  </a>
</p>
<p>This link will expire in 1 hour.</p>`;
