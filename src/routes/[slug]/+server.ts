import { error, redirect, type RequestEvent } from '@sveltejs/kit';

interface Value {
	target: string;
	hits: number;
}

export async function GET({ url, platform }: RequestEvent) {
	const stripped = url.pathname.replaceAll('/', '');
	console.log(stripped);
	const kv = platform?.env.SHQUID_KV as KVNamespace;
	console.log(await kv.get(stripped));
	console.log(await kv.list());

	const value: Value | null = await kv.get(stripped, 'json');
	if (value) {
		value.hits += 1;
		await kv.put(stripped, JSON.stringify(value));
		return redirect(302, value.target);
	}

	return error(404, 'Invalid short link');
}

export async function PUT({ locals }: RequestEvent) {
	const session = await locals.auth();
	if (!(session && session.user)) {
		return error(401, 'No!!!!!!!!! You are not authorized!!!!!!');
	}

	const user = session.user;
}

export async function DELETE({ locals }: RequestEvent) {}
