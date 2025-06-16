import { getContext, setContext } from 'svelte';

const userContext: {
	messagesSent: number;
	messageLimit: number;
	threadList: {
		id: string;
		name: string;
	}[];
	currentThreadId: string;
	currentThreadName: string;
} = $state({
	messagesSent: 0,
	messageLimit: 10,
	currentThreadName: 'New Thread',
	currentThreadId: '',
	threadList: []
});

export const setUserContext = () => {
	setContext('userContext', userContext);
};

export const getUserContext = () => {
	return getContext('userContext') as typeof userContext;
};
