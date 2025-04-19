import { Config, CustomError } from "@helpers";

export const assertIsRequestAuthorized = (authorization: string | undefined) => {
	const token = authorization?.split("Bearer ")?.[1];
	if (!token)
		throw new CustomError(
			"Unauthorized - expected Authorization request header with Bearer token",
			401
		);
	if (token !== Config.API_KEY)
		throw new CustomError("Unauthorized - Bearer token does not match API_KEY value", 401);
	return true;
};
