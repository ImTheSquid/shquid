import { MongoClient } from 'mongodb';

export interface Link {
	key: string;
	target: string;
	hits: number;
	owner: string;
	priv: boolean;
}

const client = new MongoClient(process.env.MONGODB_URL ?? 'NULL');

export async function getLinksCollection() {
	await client.connect();
	const db = client.db('shquid');
	const links = db.collection('links');
	return links;
}

// export const trustedPassportIds: number[] = [1];
