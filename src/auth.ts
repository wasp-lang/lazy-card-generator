import { defineUserSignupFields } from "wasp/server/auth";
import * as zod from "zod";

export function getGoogleConfig() {
	return {
		scopes: ["email", "profile"],
	};
}

const googleDataSchema = zod.object({
	profile: zod.object({
		name: zod.string(),
		email: zod.string(),
		picture: zod.string(),
	}),
});

function getGoogleData(data: unknown): zod.infer<typeof googleDataSchema> {
	const result = googleDataSchema.safeParse(data);
	if (!result.success) {
		throw new Error("Invalid Google data");
	}
	return result.data;
}

export const googleSignupFields = defineUserSignupFields({
	name: (data) => {
    const googleData = getGoogleData(data);
    return googleData.profile.name;
  },
	email: (data) => {
    const googleData = getGoogleData(data);
    return googleData.profile.email;
  },
  avatar: (data) => {
    const googleData = getGoogleData(data);
    return googleData.profile.picture;
  }
});
