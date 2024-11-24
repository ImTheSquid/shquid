import { SvelteKitAuth } from '@auth/sveltekit';
import type { OAuth2Config } from '@auth/sveltekit/providers';
import GitHub from '@auth/sveltekit/providers/github';
import type { IDProfile } from './types';

export const PurdueHackersIDProvider: OAuth2Config<IDProfile> = {
	id: 'purduehackers-id',
	name: 'Purdue Hackers ID',
	type: 'oauth',
	authorization: {
		url: 'https://id.purduehackers.com/api/authorize',
		params: {
			scope: 'user:read'
		}
	},
	checks: [],
	token: {
		url: 'https://id.purduehackers.com/api/token'
	},
	client: {
		token_endpoint_auth_method: 'client_secret_post'
	},
	issuer: 'https://id.purduehackers.com/api',
	userinfo: {
		url: 'https://id.purduehackers.com/api/user'
	},
	clientId: 'shquid',
	clientSecret: '0'
};

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [GitHub, PurdueHackersIDProvider],
	trustHost: true,
	callbacks: {
		async jwt({ token, profile }) {
			if (profile) {
				token.profile = profile;
			}
			return token;
		},
		async session({ session, token }) {
			if (token.profile) {
				session.user = {
					...session.user,
					...token.profile
				};
			}
			return { ...session };
		}
	}
});
