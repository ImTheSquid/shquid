import type { Session } from '@auth/sveltekit';
import type { IDProfile, IDSession } from '../types';
import type { PageServerLoad } from './$types';
import { getLinksCollection, trustedPassportIds, type Link } from '$lib';
import { error, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async (
	events
): Promise<{ ownerId: string | null; links: Link[] | null; isAdmin: boolean }> => {
	const session = (await events.locals.auth()) as (IDSession | Session) | null;

	const coll = await getLinksCollection();

	// Load all owned targets (or all targets if is main user)
	if (session?.user) {
		// Try-catch in case of invalid passport
		try {
			const target = getOwner(session);
			const nonNullTarget = getOwner(session, false);

			// If target null, load all IDs
			// If target == 1, also load the specific users's private stuff
			return {
				ownerId: nonNullTarget ?? 'impossible',
				links: (
					(await coll
						.find(target ? { $or: [{ target }, { priv: false }] } : {})
						.project({ _id: 0 })
						.toArray()) as Link[]
				).toSorted(sortFn),
				isAdmin: target === null
			};
		} catch {
			return {
				ownerId: null,
				links: null,
				isAdmin: false
			};
		}
	}

	return {
		ownerId: null,
		links: ((await coll.find({ priv: false }).project({ _id: 0 }).toArray()) as Link[]).toSorted(
			sortFn
		),
		isAdmin: false
	};
};

function sortFn(a: Link, b: Link): number {
	if (a.key < b.key) {
		return -1;
	} else if (a.key > b.key) {
		return 1;
	}
	return 0;
}

// Returns null if admin
function getOwner(
	session: { user: IDProfile } | Session,
	insertNull: boolean = true
): string | null {
	if (!session.user) {
		throw Error('No user data to get owner!');
	}

	if ('email' in session.user && 'login' in session.user) {
		if (session.user.email === process.env.GITHUB_EMAIL && insertNull) {
			return null;
		}
		return session.user.login?.toString() ?? 'NOGHID';
	} else {
		if (session.user.id === Number(process.env.PASSPORT_NUMBER) && insertNull) {
			return null;
		}
		if (!trustedPassportIds.includes(Number(session.user.id))) {
			throw Error('Untrusted passport!');
		}
		return session.user.id?.toString() ?? 'NOID';
	}
}

export const actions = {
	create: async ({ request, locals, fetch }) => {
		const session = await locals.auth();
		if (!(session && session.user)) {
			error(401, 'getouttahere');
		}

		const owner = getOwner(session, false) as string;

		const data = await request.formData();
		const key = data.get('key');
		const target = data.get('target');
		const priv = !!data.get('priv');

		// Make sure key is free first
		const { free }: { free: boolean } = await (await fetch(`/api/free?key=${key}`)).json();

		if (!free) {
			error(400, 'Route already exists!');
		}

		(await getLinksCollection()).insertOne({ key, target, owner, priv, hits: 0 });
	},
	update: async ({ locals, request, fetch }) => {
		const session = await locals.auth();
		if (!(session && session.user)) {
			error(401, 'No!!!!!!!!! You are not authorized!!!!!!');
		}

		const owner = getOwner(session);

		const data = await request.formData();
		const oldKey = data.get('oldKey');
		const key = data.get('key');
		const target = data.get('target');
		const priv = data.get('priv')?.toString() === 'true';

		// If key has changed, make sure key is free first
		if (oldKey !== key) {
			const { free }: { free: boolean } = await (await fetch(`/api/free?key=${key}`)).json();

			if (!free) {
				error(400, 'Route already exists!');
			}
		}

		await (
			await getLinksCollection()
		).findOneAndUpdate(owner ? { key: oldKey, owner } : { key: oldKey }, {
			$set: { target, priv, key }
		});
	},
	delete: async ({ locals, request }) => {
		const session = await locals.auth();
		if (!(session && session.user)) {
			error(401, "You don't get to delete anything");
		}

		const owner = getOwner(session);

		const data = await request.formData();
		const key = data.get('key');

		(await getLinksCollection()).findOneAndDelete(owner ? { key, owner } : { key });
	}
} satisfies Actions;
