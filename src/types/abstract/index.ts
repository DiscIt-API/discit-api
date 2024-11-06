import type * as types from "discit-types";

import { discQuerySchema } from "@helpers";
import { z } from "@hono/zod-openapi";

export type TBase = {
	created_at: Date;
	updated_at: Date;
};

export type TDisc = types.TDisc;

export type TDiscQuery = z.infer<typeof discQuerySchema>;

export type TBag = types.TBag;
