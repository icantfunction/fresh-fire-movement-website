export const cognitoLogout = () => {
  const clientId = "s4b5hmn7ha98njtkcs23ikdp3";
  const logoutUri = window.location.origin;
  const cognitoDomain = "https://us-east-1tkryybz2t.auth.us-east-1.amazoncognito.com";
  
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};
