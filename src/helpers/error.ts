import type { StatusCode } from "hono/utils/http-status";

import type { OpenAPIHono } from "@hono/zod-openapi";

export class CustomError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
		Object.setPrototypeOf(this, CustomError.prototype);
	}
}

export const initErrorHandling = (app: OpenAPIHono) => {
	app.notFound(c => c.json({ message: "Not Found" }, 404));
	app.onError((e, c) => {
		const errorStatus = (
			"status" in e && typeof e.status === "number" ? e.status : 500
		) as StatusCode;
		return c.json({ message: e.message || "Internal Server Error" }, errorStatus);
	});
};
