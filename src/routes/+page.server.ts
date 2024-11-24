import type { Session } from '@auth/sveltekit';
import type { IDSession } from '../types';
import type { PageServerLoad } from './$types';
import { getLinksCollection, type Link } from '$lib';

export const load: PageServerLoad = async (events) => {
	const session = (await events.locals.auth()) as (IDSession | Session) | null;

	const coll = await getLinksCollection();

	// Load all owned targets (or all targets if is main user)
	if (session?.user) {
		let target: string | null = null;
		if ('email' in session.user && session.user.email === process.env.GITHUB_EMAIL) {
			// Do nothing here
		} else if ('id' in session.user) {
			if (session.user.id !== Number(process.env.PASSPORT_NUMBER)) {
				// Regular load
				target = session.user.id?.toString() ?? 'NOID';
			}
		} else {
			return { session, links: null };
		}

		// If target null, load all IDs
		// If target == 1, also load the specific users's private stuff
		return {
			session,
			links: (await coll
				.find(target ? { $or: [{ target }, { priv: false }] } : {})
				.project({ _id: 0 })
				.toArray()) as Link[]
		};
	}

	return {
		session: null,
		links: (await coll.find({ priv: false }).project({ _id: 0 }).toArray()) as Link[]
	};
};
