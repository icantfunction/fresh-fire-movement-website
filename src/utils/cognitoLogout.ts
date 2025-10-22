export const cognitoLogout = () => {
  const clientId = "5a0jpdmleoq56l76otr1udlue5";
  const logoutUri = window.location.origin;
  const cognitoDomain = "https://ffdm-admin.auth.us-east-1.amazoncognito.com";
  
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};
