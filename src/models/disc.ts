import { Schema, model } from "mongoose";

import { BaseSchema, CustomError, filterDiscsByQuery, projection } from "@helpers";
import type { TDisc, TDiscQuery } from "@types";

const DiscModel = model<TDisc>(
	"Disc",
	new Schema<TDisc>({
		id: {
			type: String,
			required: true,
			index: true
		},
		name: {
			type: String,
			required: true
		},
		brand: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		speed: {
			type: String,
			required: true,
			index: true
		},
		glide: {
			type: String,
			required: true,
			index: true
		},
		turn: {
			type: String,
			required: true,
			index: true
		},
		fade: {
			type: String,
			required: true,
			index: true
		},
		stability: {
			type: String,
			required: true
		},
		link: {
			type: String,
			required: false
		},
		pic: {
			type: String,
			required: false
		},
		name_slug: {
			type: String,
			required: true,
			index: true
		},
		brand_slug: {
			type: String,
			required: true,
			index: true
		},
		category_slug: {
			type: String,
			required: true,
			index: true
		},
		stability_slug: {
			type: String,
			required: true,
			index: true
		},
		color: {
			type: String,
			required: false
		},
		background_color: {
			type: String,
			required: false
		}
	}).add(BaseSchema)
);

const discCache: { discs: TDisc[] } = {
	discs: []
};

const getDiscData = () => discCache.discs;

const refreshDiscCache = async () => {
	const discs = await DiscModel.find({}, projection).sort({ name: 1 });
	discCache.discs = discs;
	return discs;
};

const getDiscs = (query?: TDiscQuery) => {
	const discs = getDiscData();
	if (query) return filterDiscsByQuery(discs, query);
	return discs;
};

const assertDiscExists = (id: string) => {
	const discs = getDiscData();
	if (discs?.length > 0) {
		const disc = discs.find(d => d.id === id);
		if (disc) return disc;
	}
	throw new CustomError(`Disc with id '${id}' not found`, 404);
};

const insertDiscs = async (discs: TDisc[]) => {
	await DiscModel.insertMany(discs);
	const allDiscs = refreshDiscCache();
	return allDiscs;
};

const deleteAllDiscs = async () => {
	await DiscModel.deleteMany();
	discCache.discs = [];
};

export const Disc = {
	getDiscData,
	refreshDiscCache,
	getDiscs,
	assertDiscExists,
	insertDiscs,
	deleteAllDiscs
};
