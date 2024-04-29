// Should not be imported on the client side

import { createClient } from "@supabase/supabase-js";
import type { GreetingCard } from "wasp/entities";
import { env } from "../env";

export const supabase = createClient(
	env.SUPABASE_PROJECT_URL,
	env.SUPABASE_KEY,
);

const supabaseCardsBucket = env.SUPABASE_CARDS_BUCKET;

export async function saveGreetingCardImageToSupabase(
	imageFile: Blob,
	card: GreetingCard,
): Promise<string> {
	const imagePath = `greeting-cards/${card.id}.png`;

	const { data: uploadData, error: uploadError } = await supabase.storage
		.from(supabaseCardsBucket)
		.upload(imagePath, imageFile, {
			cacheControl: "3600",
			upsert: true,
		});

	if (uploadError) {
		throw uploadError;
	}

	const { data: publicUrlData } = supabase.storage
		.from(supabaseCardsBucket)
		.getPublicUrl(uploadData.path);

	return publicUrlData.publicUrl;
}
