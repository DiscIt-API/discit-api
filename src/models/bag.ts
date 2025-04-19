import { Schema, model } from "mongoose";

import { BaseSchema, CustomError, newId, projection } from "@helpers";
import { Disc } from "@models";
import type { TBag } from "@types";

const BagModel = model<TBag>(
	"Bag",
	new Schema<TBag>({
		id: {
			type: String,
			required: false,
			default: () => newId(),
			index: true
		},
		name: {
			type: String,
			required: true,
			index: true
		},
		user_id: {
			type: String,
			required: true,
			index: true
		},
		discs: {
			type: [
				{
					type: String
				}
			],
			required: false,
			default: []
		}
	}).add(BaseSchema)
);

const getBags = (user_id?: string) => BagModel.find(user_id ? { user_id } : {}, projection);

const createBag = async (user_id: string, name: string) => {
	const existingBag = await BagModel.findOne({ user_id, name });
	if (existingBag) throw new CustomError(`You already have a bag named '${name}'`, 400);
	return BagModel.create({ user_id, name });
};

const assertBagExists = async (id: string) => {
	const bag = await BagModel.findOne({ id });
	if (!bag) throw new CustomError(`Bag with id '${id}' not found`, 404);
	return bag;
};

const addDiscToBag = async (id: string, disc_id: string) => {
	const bag = await assertBagExists(id);
	Disc.assertDiscExists(disc_id);
	if (bag.discs.includes(disc_id))
		throw new CustomError(`Bag already contains disc with id '${disc_id}'`, 400);
	bag.discs.push(disc_id);
	await BagModel.updateOne({ id }, bag);
	return bag;
};

const removeDiscFromBag = async (id: string, disc_id: string) => {
	const bag = await assertBagExists(id);
	Disc.assertDiscExists(disc_id);
	if (!bag.discs.includes(disc_id))
		throw new CustomError(`Bag does not contain disc with id '${disc_id}'`, 400);
	bag.discs = bag.discs.filter(discId => discId !== disc_id);
	await BagModel.updateOne({ id }, bag);
	return bag;
};

const updateBagName = async (id: string, name: string) => {
	const bag = await assertBagExists(id);
	bag.name = name;
	await BagModel.updateOne({ id }, bag);
	return bag;
};

const deleteBag = async (id: string) => {
	const bag = await assertBagExists(id);
	await BagModel.deleteOne({ id });
	return bag;
};

export const Bag = {
	getBags,
	assertBagExists,
	createBag,
	addDiscToBag,
	removeDiscFromBag,
	updateBagName,
	deleteBag
};
