export function formatDate(date: string, includeRelative = false) {
	const currentDate = new Date();

	if (!date.includes("T")) {
		date = `${date}T00:00:00`;
	}

	const targetDate = new Date(date);
	const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
	const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
	const daysAgo = currentDate.getDate() - targetDate.getDate();

	let formattedRelative = "";

	if (yearsAgo > 0) {
		formattedRelative = yearsAgo === 1 ? "1 rok temu" : `${yearsAgo} lat temu`;
	} else if (monthsAgo > 0) {
		formattedRelative =
			monthsAgo === 1 ? "1 miesiąc temu" : `${monthsAgo} miesięcy temu`;
	} else if (daysAgo > 0) {
		formattedRelative = daysAgo === 1 ? "1 dzień temu" : `${daysAgo} dni temu`;
	} else {
		formattedRelative = "Dzisiaj";
	}

	const fullDate = targetDate.toLocaleString("pl-PL", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	if (!includeRelative) {
		return fullDate;
	}

	return `${fullDate} (${formattedRelative})`;
}
