export interface Auth0Profile {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
  user_metadata?: any;
  app_metadata?: any;
}

interface UserData {
  auth0_id: string;
  email: string;
  full_name: string | null;
  given_name: string | null;
  family_name: string | null;
  picture_url: string | null;
  email_verified: boolean;
  user_metadata: any;
  app_metadata: any;
}

export function mapAuth0ProfileToUserData(
  jwtPayload: any,
  auth0Profile: Auth0Profile
): UserData {
  return {
    auth0_id: jwtPayload.sub,
    email: auth0Profile.email,
    full_name: auth0Profile.name ?? null,
    given_name: auth0Profile.given_name ?? null,
    family_name: auth0Profile.family_name ?? null,
    picture_url: auth0Profile.picture ?? null,
    email_verified: auth0Profile.email_verified ?? false,
    user_metadata: auth0Profile.user_metadata ?? null,
    app_metadata: auth0Profile.app_metadata ?? null,
  };
}

export function validateUserData(userData: UserData): void {
  if (!userData.email) {
    throw new Error('Email is required but not found in user profile');
  }

  if (!userData.auth0_id) {
    throw new Error('Auth0 ID is required but not found');
  }
}
