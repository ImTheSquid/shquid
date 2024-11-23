import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

interface Value {
	target: string;
	hits: number;
}

export async function GET({ url }: RequestEvent) {
	const stripped = url.pathname.substring(1);

	const value = await redis.json.get<Value>(stripped);
	if (value) {
		value.hits += 1;
		await redis.set(stripped, value);
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
