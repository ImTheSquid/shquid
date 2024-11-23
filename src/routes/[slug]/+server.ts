import { error, redirect, type RequestEvent } from '@sveltejs/kit';

export async function GET({ url, platform }: RequestEvent) {
	const stripped = url.pathname.replaceAll('/', '');
	console.log(stripped);
	const kv = platform?.env.SHQUID_KV as KVNamespace;
	console.log(await kv.get(stripped));
	console.log(await kv.list());

	const value = await kv.get(stripped);
	if (value) {
		return redirect(302, value);
	}

	return error(404, 'Invalid short link');
}
