import type { Session } from '@auth/sveltekit';
import type { IDSession } from '../types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (events) => {
	const session = (await events.locals.auth()) as (IDSession | Session) | null;
	console.log(session);

	// Load all owned targets (or all targets if is main user)
	if (session?.user) {
		let target: number | null = null;
		if ('email' in session.user && session.user.email === process.env.GITHUB_EMAIL) {
			// Do nothing here
		} else if ('id' in session.user) {
			if (session.user.id !== Number(process.env.PASSPORT_NUMBER)) {
				// Regular load
				target = session.user.id;
			}
		} else {
			return { session, links: null };
		}

		// If target null, load all IDs
		// If target == 1, also load
	}

	return {
		session: null,
		links: null
	};
};
