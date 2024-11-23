import { error, redirect, type RequestEvent } from '@sveltejs/kit';

interface Value {
	target: string;
	hits: number;
}

export async function GET({ url, platform }: RequestEvent) {
	const stripped = url.pathname.substring(1);
	console.log(stripped);
	const kv = platform?.env.SHQUID_KV as KVNamespace;
	console.log(await kv.get(stripped));
	console.log(await kv.list());

	// Handle special paths for Auth.js
	if (stripped === 'auth' || stripped.startsWith('auth/callback')) {
		throw new Error('This route should not be handled here.'); // Or redirect as needed
	}

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
