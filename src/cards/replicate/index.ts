// Should not be imported on the client side

import Replicate from "replicate";
import { parseReplicateOutput } from "./text";
import { env } from "../../env";

const replicateApiKey = env.REPLICATE_API_KEY;

export const replicate = new Replicate({
	// Get your token from https://replicate.com/account
	auth: replicateApiKey,
});

export async function getLlama3Output(prompt: string): Promise<string> {
	const input = {
		prompt,
		prompt_template:
			"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
	};

	const output = (await replicate.run("meta/meta-llama-3-70b-instruct", {
		input,
	})) as string[];

	return parseReplicateOutput(output);
}

export async function getSDXLImage(
	{
		prompt,
		negativePrompt,
	}: {
		prompt: string;
		negativePrompt?: string;
	}
): Promise<string> {
	const input = {
		prompt,
		negative_prompt: negativePrompt,
	};

	const output = (await replicate.run(
		"bytedance/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a",
		{
			input,
		},
	)) as string[];

	return output[0];
}
