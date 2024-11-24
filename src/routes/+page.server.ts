import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (events) => {
	const session = await events.locals.auth();
	console.log(session);

	// Load all owned targets (or all targets if is main user)

	return {
		session
	};
};
