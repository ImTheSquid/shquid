import { getLinksCollection, type Link } from '$lib';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import type { WithId } from 'mongodb';

export async function GET({ params: { slug, extra } }: RequestEvent) {
	const stripped = slug;

	const coll = await getLinksCollection();

	const value = (await coll.findOne({ key: stripped })) as WithId<Link> | null;
	if (value) {
		await coll.findOneAndUpdate({ _id: value._id }, { $inc: { hits: 1 } });
		return redirect(302, value.target + '/' + extra);
	}

	error(404, 'Invalid short link');
}
