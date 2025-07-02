interface Auth0UserProfile {
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

export class Auth0Service {
  private static readonly AUTH0_DOMAIN =
    process.env.AUTH0_DOMAIN || 'https://intellegin.us.auth0.com';

  static async getUserProfile(accessToken: string): Promise<Auth0UserProfile> {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(`${this.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user profile: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as Auth0UserProfile;
  }
}
