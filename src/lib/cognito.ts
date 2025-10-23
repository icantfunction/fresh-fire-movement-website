import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  IAuthenticationCallback
} from "amazon-cognito-identity-js";

// Cognito configuration
const REGION = import.meta.env.VITE_AWS_REGION || "us-east-1";
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || "us-east-1_TkrYyBz2T";
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || "5a0jpdmleoq56l76otr1udlue5";
console.log("COGNITO=", { region: REGION, userPoolId: USER_POOL_ID, clientId: CLIENT_ID });

// Use sessionStorage for token persistence
const Storage = {
  setItem: (key: string, value: string) => window.sessionStorage.setItem(key, value),
  getItem: (key: string) => window.sessionStorage.getItem(key),
  removeItem: (key: string) => window.sessionStorage.removeItem(key),
  clear: () => window.sessionStorage.clear()
};

// Initialize Cognito User Pool
export const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
  Storage
});

// Get current authenticated user
export const getCurrentUser = () => {
  return userPool.getCurrentUser();
};

// Parse JWT token to get claims
export const parseJwt = (token: string): any => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

// Get current session with callback
export const getCurrentSession = (
  onSuccess: (session: CognitoUserSession) => void,
  onError: () => void
) => {
  const user = getCurrentUser();
  if (!user) {
    onError();
    return;
  }

  user.getSession((err: Error | null, session: CognitoUserSession | null) => {
    if (err || !session?.isValid()) {
      onError();
      return;
    }
    onSuccess(session);
  });
};

// Get ID token from current session
export const getIdToken = (
  onSuccess: (token: string) => void,
  onError: (message: string) => void
) => {
  const user = getCurrentUser();
  if (!user) {
    onError("Not authenticated");
    return;
  }

  user.getSession((err: Error | null, session: CognitoUserSession | null) => {
    if (err || !session?.isValid()) {
      onError("Session expired. Please sign in again.");
      return;
    }
    onSuccess(session.getIdToken().getJwtToken());
  });
};

// Get Access token from current session
export const getAccessToken = (
  onSuccess: (token: string) => void,
  onError: (message: string) => void
) => {
  const user = getCurrentUser();
  if (!user) {
    onError("Not authenticated");
    return;
  }

  user.getSession((err: Error | null, session: CognitoUserSession | null) => {
    if (err || !session?.isValid()) {
      onError("Session expired. Please sign in again.");
      return;
    }
    onSuccess(session.getAccessToken().getJwtToken());
  });
};

// Sign in with phone number (as username) and password
export const signIn = (
  username: string,
  password: string,
  callbacks: {
    onSuccess: (session: CognitoUserSession) => void;
    onFailure: (error: string) => void;
    onNewPasswordRequired?: () => void;
    onMFARequired?: () => void;
  }
) => {
  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password
  });

  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  });

  const authCallbacks: IAuthenticationCallback = {
    onSuccess: callbacks.onSuccess,
    onFailure: (err) => callbacks.onFailure(err?.message || "Sign-in failed"),
    newPasswordRequired: () => {
      if (callbacks.onNewPasswordRequired) {
        callbacks.onNewPasswordRequired();
      } else {
        callbacks.onFailure("New password required. Please contact administrator.");
      }
    },
    mfaRequired: () => {
      if (callbacks.onMFARequired) {
        callbacks.onMFARequired();
      } else {
        callbacks.onFailure("MFA required but not configured.");
      }
    }
  };

  cognitoUser.authenticateUser(authDetails, authCallbacks);
};

// Sign out current user
export const signOut = () => {
  const user = getCurrentUser();
  if (user) {
    user.signOut();
  }
};

// Check if user is authenticated (synchronous check)
export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return user !== null;
};

// Get user info from current session
export const getUserInfo = (
  onSuccess: (email: string, username: string) => void,
  onError: () => void
) => {
  getCurrentSession(
    (session) => {
      const idToken = session.getIdToken().getJwtToken();
      const claims = parseJwt(idToken);
      const email = claims?.email || "";
      const username = claims?.["cognito:username"] || "";
      onSuccess(email, username);
    },
    onError
  );
};
