import { GOOGLE_TOKEN, OPENAI_TOKEN } from '$env/static/private';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModelV1 } from 'ai';

const googleProvider = createGoogleGenerativeAI({
	apiKey: GOOGLE_TOKEN
});

const openaiProvider = createOpenAI({
	apiKey: OPENAI_TOKEN
});

const models: Record<string, () => LanguageModelV1> = {
	'gemini-2.0-flash': () => {
		return googleProvider('gemini-2.0-flash');
	},
	'gemini-2.5-flash': () => {
		return googleProvider('gemini-2.5-flash-preview-04-17', {});
	},
	'gemini-2.5-pro': () => {
		return googleProvider('gemini-2.5-pro-preview-05-06');
	},
	'gpt-4.1-nano': () => openaiProvider('gpt-4.1-nano')
};

export const getModel = (modelName: string) => {
	if (models[modelName]) {
		return models[modelName]();
	} else {
		return models['gemini-2.5-flash']();
	}
};
