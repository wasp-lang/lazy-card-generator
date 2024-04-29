import type {
	CreateGreetingCard,
	GetMyGreetingCards,
	GetGreetingCard,
} from "wasp/server/operations";
import type { GreetingCard } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
	type GenerateGreetingCardImage,
	type GenerateGreetingCardPoem,
	type CleanUpStaleGreetingCards,
	generateGreetingCardImage as generateGreetingCardImageJob,
} from "wasp/server/jobs";

import type { CreateNewCard } from "../schemas/cards";
import { getLlama3Output, getSDXLImage } from "./replicate";
import { getGreetingCardPrompt, getImageDescriptionPrompt } from "./prompts";
import { getImageAverageColor } from "./color";
import { saveGreetingCardImageToSupabase } from "./supabase";
import { env } from "../env";
import { sleep } from "../sleep";

const maxConcurentJobs = {
	generateGreetingCardPoem: env.GENERATE_GREETING_CARD_POEM_CONCURRENCY,
	generateGreetingCardImage: env.GENERATE_GREETING_CARD_IMAGE_CONCURRENCY,
};

export const createGreetingCard: CreateGreetingCard<
	CreateNewCard,
	{ id: string }
> = async (args, context) => {
	if (!context.user) {
		throw new HttpError(
			401,
			"You need to be logged in to create a greeting card.",
		);
	}

	const { GreetingCard } = context.entities;

	const newCard = await GreetingCard.create({
		data: {
			prompt: args.description,
			user: {
				connect: {
					id: context.user.id,
				},
			},
		},
	});

	return {
		id: newCard.id,
	};
};

export const getMyGreetingCards: GetMyGreetingCards<void, GreetingCard[]> =
	async (args, context) => {
		if (!context.user) {
			throw new HttpError(
				401,
				"You need to be logged in to view your greeting cards.",
			);
		}

		const { GreetingCard } = context.entities;

		const cards = await GreetingCard.findMany({
			where: {
				user: {
					id: context.user.id,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return cards;
	};

export const generateGreetingCardPoem: GenerateGreetingCardPoem<{}, void> =
	async (_args, context) => {
		const { GreetingCard } = context.entities;

		const card = await GreetingCard.findFirst({
			where: {
				status: "pending",
			},
		});

		if (!card) {
			return;
		}

		const activeJobs = await GreetingCard.count({
			where: {
				status: "generating-poem",
			},
		});

		if (activeJobs >= maxConcurentJobs.generateGreetingCardPoem) {
			// Wait for other jobs to finish
			console.log("Active jobs", activeJobs);
			return;
		}

		try {
			await GreetingCard.update({
				where: {
					id: card.id,
				},
				data: {
					status: "generating-poem",
				},
			});

			await sleep(env.GENERATE_GREETING_CARD_POEM_ADDED_DELAY);

			const output = await getLlama3Output(getGreetingCardPrompt(card.prompt));

			await GreetingCard.update({
				where: {
					id: card.id,
				},
				data: {
					status: "generated-poem",
					poem: output,
				},
			});
		} catch (error) {
			console.error("Error generating poem", error);
			await GreetingCard.update({
				where: {
					id: card.id,
				},
				data: {
					status: "error",
				},
			});
		}

		await generateGreetingCardImageJob.submit({});
	};

export const generateGreetingCardImage: GenerateGreetingCardImage<{}, void> =
	async (_args, context) => {
		const { GreetingCard } = context.entities;

		const card = await GreetingCard.findFirst({
			where: {
				status: "generated-poem",
			},
		});

		if (!card) {
			return;
		}

		const activeJobs = await GreetingCard.count({
			where: {
				status: "generating-image",
			},
		});

		if (activeJobs >= maxConcurentJobs.generateGreetingCardImage) {
			// Wait for other jobs to finish
			console.log("Active jobs", activeJobs);
			return;
		}

		try {
			if (!card.poem) {
				console.error("Card is missing poem", card);
				return;
			}

			await GreetingCard.update({
				where: {
					id: card.id,
				},
				data: {
					status: "generating-image",
				},
			});

			await sleep(env.GENERATE_GREETING_CARD_IMAGE_ADDED_DELAY);

			const imagePrompt = await getLlama3Output(
				getImageDescriptionPrompt({
					poem: card.poem,
					originalUserPrompt: card.prompt,
				}),
			);
			const imageUrl = await getSDXLImage({
				prompt: imagePrompt,
				// Avoid generating images with text and low quality
				negativePrompt: "worst quality, low quality, text",
			});

			const imageFile = await fetch(imageUrl).then((res) => res.blob());
			const averageColor = await getImageAverageColor(
				Buffer.from(await imageFile.arrayBuffer()),
			);

			const publicImageUrl = await saveGreetingCardImageToSupabase(
				imageFile,
				card,
			);
			await GreetingCard.update({
				where: {
					id: card.id,
				},
				data: {
					status: "finished",
					imagePrompt,
					imageUrl: publicImageUrl,
					imageAverageColor: averageColor,
				},
			});
		} catch (error) {
			console.error("Error generating image", error);
			await GreetingCard.update({
				where: {
					id: card.id,
				},
				data: {
					status: "error",
				},
			});
		}
	};

export const getGreetingCard: GetGreetingCard<{ id: string }, GreetingCard> =
	async (args, context) => {
		const { GreetingCard } = context.entities;

		const card = await GreetingCard.findUnique({
			where: {
				id: args.id,
			},
		});

		if (!card) {
			throw new HttpError(404, "Greeting card not found");
		}

		return card;
	};

export const cleanUpStaleGreetingCards: CleanUpStaleGreetingCards<{}, void> =
	async (_args, context) => {
		const { GreetingCard } = context.entities;

		const cards = await GreetingCard.findMany({
			where: {
				createdAt: {
					lt: new Date(Date.now() - 1000 * env.CLEANUP_AFTER_SECONDS),
				},
				status: {
					notIn: ["finished"],
				},
			},
		});

		if (cards.length === 0) {
			// Nothing to clean up
			return;
		}

		await GreetingCard.deleteMany({
			where: {
				id: {
					in: cards.map((card) => card.id),
				},
			},
		});

		console.log("Cleaned up", cards.length, "stale greeting cards");
	};
