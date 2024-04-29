export const getGreetingCardPrompt = (
	prompt: string,
): string => `Write a greeting card text for the following topic: "${prompt}". Make it clever.

Return it as plain text, no quotes, no extra syntax. Return only the greeting card text. Max chars: 80!`;

export const getImageDescriptionPrompt = ({
  originalUserPrompt,
	poem,
}: {
	originalUserPrompt: string;
	poem: string;
}): string => `Based on the text I'll provide, give me a nice artwork to go alongside it. Describe it in a way of short list of features of the artwork. Use descriptive language so someone could paint it. Only respond with the description, no extra syntax. Max words: 30

Context: ${originalUserPrompt}

Text:
${poem}`;
