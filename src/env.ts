import * as z from "zod";

const envSchema = z.object({
	GENERATE_GREETING_CARD_POEM_CONCURRENCY: z.coerce.number().default(1),
	GENERATE_GREETING_CARD_IMAGE_CONCURRENCY: z.coerce.number().default(1),
	GENERATE_GREETING_CARD_IMAGE_ADDED_DELAY: z.coerce.number().default(1000),
	GENERATE_GREETING_CARD_POEM_ADDED_DELAY: z.coerce.number().default(1000),
  CLEANUP_AFTER_SECONDS: z.coerce.number().default(3600),
	SUPABASE_PROJECT_URL: z.string({
		required_error: "SUPABASE_PROJECT_URL is required",
	}),
	SUPABASE_KEY: z.string({
		required_error: "SUPABASE_KEY is required",
	}),
	SUPABASE_CARDS_BUCKET: z.string({
		required_error: "SUPABASE_CARDS_BUCKET is required",
	}),
	REPLICATE_API_KEY: z.string({
		required_error: "REPLICATE_API_KEY is required",
	}),
});

function tryToParseEnv() {
	try {
		return envSchema.parse(process.env);
	} catch (e) {
		if (e instanceof z.ZodError) {
			for (const error of e.errors) {
				console.error(error.message);
			}
		} else {
			console.error(e);
		}

		process.exit(1);
	}
}

export const env = tryToParseEnv();
