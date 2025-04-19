import { Env } from "@constants";

const IS_PROD = Bun.env.BUN_ENV === Env.Production || Bun.env.NODE_ENV === Env.Production;

const PORT = Number.parseInt(Bun.env.PORT ?? (IS_PROD ? "8080" : "5000"));

const API_KEY = Bun.env.API_KEY;

const MONGO_URI = IS_PROD
	? Bun.env.MONGO_URI
	: (Bun.env.MONGO_URI ?? "mongodb://localhost:27017/discit");

if (!MONGO_URI) throw new Error("MONGO_URI env var is required in production mode");

export const Config = {
	PORT,
	API_KEY,
	MONGO_URI
};
