import { getAverageColor } from 'fast-average-color-node';

export async function getImageAverageColor(
	imageFile: Buffer,
): Promise<string> {
	const result = await getAverageColor(imageFile);

	return result.hex;
}
