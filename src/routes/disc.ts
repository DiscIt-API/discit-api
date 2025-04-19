import { discSchema } from "discit-types";

import {
	assertRequestIsAuthorized,
	authHeaderSchema,
	discQuerySchema,
	resMessageSchema
} from "@helpers";
import { type OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { Disc } from "@models";

export const initDiscRoutes = (app: OpenAPIHono) => {
	// get all discs (optionally filter by field)
	app.openapi(
		createRoute({
			method: "get",
			path: "/disc",
			request: {
				query: discQuerySchema
			},
			responses: {
				200: {
					content: { "application/json": { schema: z.array(discSchema) } },
					description: "OK"
				},
				500: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Internal Server Error"
				}
			}
		}),
		c => {
			const query = c.req.valid("query");
			const discs = Disc.getDiscs(query);
			return c.json(discs, 200);
		}
	);

	// get disc by id
	app.openapi(
		createRoute({
			method: "get",
			path: "/disc/:id",
			request: {
				params: z.object({ id: z.string() })
			},
			responses: {
				200: {
					content: { "application/json": { schema: discSchema } },
					description: "OK"
				},
				404: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Not Found"
				},
				500: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Internal Server Error"
				}
			}
		}),
		c => {
			const { id } = c.req.valid("param");
			const disc = Disc.assertDiscExists(id);
			return c.json(disc, 200);
		}
	);

	// insert discs (bearer auth secured)
	app.openapi(
		createRoute({
			method: "post",
			path: "/disc",
			request: {
				headers: authHeaderSchema,
				body: {
					content: { "application/json": { schema: z.array(discSchema) } },
					required: true
				}
			},
			responses: {
				201: {
					content: { "application/json": { schema: z.array(discSchema) } },
					description: "Created"
				},
				400: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Bad Request"
				},
				401: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Unauthorized"
				},
				500: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Internal Server Error"
				}
			}
		}),
		async c => {
			const { authorization } = c.req.valid("header");
			assertRequestIsAuthorized(authorization);
			const body = c.req.valid("json");
			const discs = await Disc.insertDiscs(body);
			return c.json(discs, 201);
		}
	);

	// delete all discs (bearer auth secured)
	app.openapi(
		createRoute({
			method: "delete",
			path: "/disc",
			request: {
				headers: authHeaderSchema
			},
			responses: {
				200: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "OK"
				},
				401: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Unauthorized"
				},
				500: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Internal Server Error"
				}
			}
		}),
		async c => {
			const { authorization } = c.req.valid("header");
			assertRequestIsAuthorized(authorization);
			await Disc.deleteAllDiscs();
			return c.json({ message: "All discs deleted successfully" }, 200);
		}
	);
};
