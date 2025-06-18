type ToastId = string;

export const toasts: {
	id: ToastId;
	content: string;
}[] = $state([]);

const addToast = (content: string) => {
	const id: ToastId = Math.floor(Math.random() * 1_000_000_000).toString(16);
	const newToast = {
		id,
		content
	};

	toasts.unshift(newToast);
	if (toasts.length > 3) {
		toasts.splice(3);
	}

	setInterval(() => {
		for (let i = 0; i < toasts.length; i++) {
			if (toasts[i].id == id) {
				toasts.splice(i, 1);
				return;
			}
		}
	}, 2500);

	return newToast;
};

export const toast = {
	toast: addToast
};
