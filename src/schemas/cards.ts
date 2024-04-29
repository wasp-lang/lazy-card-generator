import * as z from "zod";

export const CreateNewCardSchema = z.object({
	description: z
		.string()
		.min(5, "Description must be at least 5 characters")
		.max(100, "Description must be at most 100 characters"),
});

export type CreateNewCard = z.infer<typeof CreateNewCardSchema>;
