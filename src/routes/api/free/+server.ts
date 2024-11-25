import { getLinksCollection } from '$lib';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ url }: RequestEvent) {
	const key = url.searchParams.get('key');
	if (!key) {
		error(400, 'key param not included in query');
	}

	const coll = await getLinksCollection();

	return json({ free: (await coll.countDocuments({ key })) === 0 });
}
