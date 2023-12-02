export const obscureEmail = (email: string) => {
  const [username, domain] = email.split('@');
  const obscuredUsername = username.slice(0, 3) + '*'.repeat(username.length - 3);
  return `${obscuredUsername}@${domain}`;
}