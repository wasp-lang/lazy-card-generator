export function parseReplicateOutput(outputLines: string[]): string {
	return outputLines
		.map((line) => line.replace(/\\n/g, "\n"))
		.join("")
		.trimEnd();
}
