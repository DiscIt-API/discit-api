import { bagSchema } from "discit-types";

import { assertIsRequestAuthorized, authHeaderSchema, resMessageSchema } from "@helpers";
import { type OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { Bag } from "@models";

export const initBagRoutes = (app: OpenAPIHono) => {
	// get all bags (optionally filter by user_id) (bearer auth secured)
	app.openapi(
		createRoute({
			method: "get",
			path: "/bag",
			request: {
				headers: authHeaderSchema,
				query: z.object({ user_id: z.string().optional() })
			},
			responses: {
				200: {
					content: { "application/json": { schema: z.array(bagSchema) } },
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
			assertIsRequestAuthorized(authorization);
			const { user_id } = c.req.valid("query");
			const bags = await Bag.getBags(user_id);
			return c.json(bags, 200);
		}
	);

	// get bag by id (bearer auth secured)
	app.openapi(
		createRoute({
			method: "get",
			path: "/bag/:id",
			request: {
				headers: authHeaderSchema,
				params: z.object({ id: z.string() })
			},
			responses: {
				200: {
					content: { "application/json": { schema: bagSchema } },
					description: "OK"
				},
				401: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Unauthorized"
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
		async c => {
			const { authorization } = c.req.valid("header");
			assertIsRequestAuthorized(authorization);
			const { id } = c.req.valid("param");
			const bag = await Bag.assertBagExists(id);
			return c.json(bag, 200);
		}
	);

	// create new bag (bearer auth secured)
	app.openapi(
		createRoute({
			method: "post",
			path: "/bag",
			request: {
				headers: authHeaderSchema,
				body: {
					content: {
						"application/json": {
							schema: z.object({ user_id: z.string(), name: z.string() })
						}
					},
					required: true
				}
			},
			responses: {
				201: {
					content: { "application/json": { schema: bagSchema } },
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
			assertIsRequestAuthorized(authorization);
			const { user_id, name } = c.req.valid("json");
			const bag = await Bag.createBag(user_id, name);
			return c.json(bag, 201);
		}
	);

	// add disc to bag (bearer auth secured)
	app.openapi(
		createRoute({
			method: "patch",
			path: "/bag/add-disc",
			request: {
				headers: authHeaderSchema,
				body: {
					content: {
						"application/json": {
							schema: z.object({ id: z.string(), disc_id: z.string() })
						}
					},
					required: true
				}
			},
			responses: {
				200: {
					content: { "application/json": { schema: bagSchema } },
					description: "OK"
				},
				400: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Bad Request"
				},
				401: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Unauthorized"
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
		async c => {
			const { authorization } = c.req.valid("header");
			assertIsRequestAuthorized(authorization);
			const { id, disc_id } = c.req.valid("json");
			const bag = await Bag.addDiscToBag(id, disc_id);
			return c.json(bag, 200);
		}
	);

	// remove disc from bag (bearer auth secured)
	app.openapi(
		createRoute({
			method: "patch",
			path: "/bag/remove-disc",
			request: {
				headers: authHeaderSchema,
				body: {
					content: {
						"application/json": {
							schema: z.object({ id: z.string(), disc_id: z.string() })
						}
					},
					required: true
				}
			},
			responses: {
				200: {
					content: { "application/json": { schema: bagSchema } },
					description: "OK"
				},
				400: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Bad Request"
				},
				401: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Unauthorized"
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
		async c => {
			const { authorization } = c.req.valid("header");
			assertIsRequestAuthorized(authorization);
			const { id, disc_id } = c.req.valid("json");
			const bag = await Bag.removeDiscFromBag(id, disc_id);
			return c.json(bag, 200);
		}
	);

	// update bag name (bearer auth secured)
	app.openapi(
		createRoute({
			method: "patch",
			path: "/bag",
			request: {
				headers: authHeaderSchema,
				body: {
					content: {
						"application/json": {
							schema: z.object({
								id: z.string(),
								name: z.string(),
								user_id: z.optional(z.string())
							})
						}
					},
					required: true
				}
			},
			responses: {
				200: {
					content: { "application/json": { schema: bagSchema } },
					description: "OK"
				},
				400: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Bad Request"
				},
				401: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Unauthorized"
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
		async c => {
			const { authorization } = c.req.valid("header");
			assertIsRequestAuthorized(authorization);
			const { id, name, user_id } = c.req.valid("json");
			const bag = await Bag.updateBagName(id, name, user_id);
			return c.json(bag, 200);
		}
	);

	// delete bag by id (bearer auth secured)
	app.openapi(
		createRoute({
			method: "delete",
			path: "/bag/:id",
			request: {
				headers: authHeaderSchema,
				params: z.object({ id: z.string() })
			},
			responses: {
				200: {
					content: { "application/json": { schema: bagSchema } },
					description: "OK"
				},
				401: {
					content: { "application/json": { schema: resMessageSchema } },
					description: "Unauthorized"
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
		async c => {
			const { authorization } = c.req.valid("header");
			assertIsRequestAuthorized(authorization);
			const { id } = c.req.valid("param");
			const bag = await Bag.deleteBag(id);
			return c.json(bag, 200);
		}
	);
};
