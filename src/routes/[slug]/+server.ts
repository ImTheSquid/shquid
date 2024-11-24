import {
	getLinksCollection,
	trustedPassportIds,
	type Link,
	type UpdateRequest as LinkRequest
} from '$lib';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import type { WithId } from 'mongodb';
import type { IDProfile } from '../../types';
import type { Session } from '@auth/sveltekit';

export async function GET({ params: { slug } }: RequestEvent) {
	const stripped = slug;

	const coll = await getLinksCollection();

	const value = (await coll.findOne({ key: stripped })) as WithId<Link> | null;
	if (value) {
		await coll.findOneAndUpdate({ _id: value._id }, { $inc: { hits: 1 } });
		return redirect(302, value.target);
	}

	error(404, 'Invalid short link');
}

// Returns null if admin
function getOwner(
	session: { user: IDProfile } | Session,
	insertNull: boolean = true
): string | null {
	if (!session.user) {
		throw Error('No user data to get owner!');
	}

	if ('email' in session.user) {
		if (session.user.email === process.env.GITHUB_EMAIL && insertNull) {
			return null;
		}
		return session.user.email ?? 'NOEMAIL';
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

export async function POST({ locals, params: { slug }, request }: RequestEvent) {
	const session = await locals.auth();
	if (!(session && session.user)) {
		error(401, 'getouttahere');
	}

	const owner = getOwner(session, false) as string;

	const { target, priv }: LinkRequest = await request.json();

	await (
		await getLinksCollection()
	).insertOne({ key: slug ?? 'NULL', target, hits: 0, owner, priv } satisfies Link);
}

export async function PUT({ locals, params: { slug }, request }: RequestEvent) {
	const session = await locals.auth();
	if (!(session && session.user)) {
		error(401, 'No!!!!!!!!! You are not authorized!!!!!!');
	}

	const owner = getOwner(session);

	const { target, priv }: LinkRequest = await request.json();

	await (
		await getLinksCollection()
	).findOneAndUpdate(owner ? { key: slug, owner } : { key: slug }, {
		$set: { target, priv }
	});
}

export async function DELETE({ locals, params: { slug } }: RequestEvent) {
	const session = await locals.auth();
	if (!(session && session.user)) {
		error(401, "You don't get to delete anything");
	}

	const owner = getOwner(session);

	(await getLinksCollection()).findOneAndDelete(owner ? { key: slug, owner } : { key: slug });
}
