const MAX_ALLOWED_YEARS = 200;

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function simpleDateValidator(
	day: number,
	month: number,
	year?: number
): boolean {
	if (year) {
		const today = new Date();
		const yearDiff = Math.abs(year - today.getUTCFullYear());
		if (yearDiff > MAX_ALLOWED_YEARS || yearDiff < 2) {
			return false;
		}
	}
	switch (month) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			return day >= 1 && day <= 31;
		case 4:
		case 6:
		case 9:
		case 11:
			return day >= 1 && day <= 30;
		case 2:
			if (year && (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)))
				return day >= 1 && day <= 29;
			else return day >= 1 && day <= 28;
		default:
			return false;
	}
}

export function simpleDateString(
	day: number,
	month: number,
	year: number
): string {
	const dayString = day.toString();
	let dayEnding = "th";
	if (dayString.endsWith("1")) dayEnding = "st";
	else if (dayString.endsWith("2")) dayEnding = "nd";
	else if (dayString.endsWith("3")) dayEnding = "rd";
	return `${dayString}${dayEnding} of ${MONTH_NAMES[month - 1]}, ${year}`;
}

export function delay(ms: number): Promise<void> {
	return new Promise((res, _) => setTimeout(res, ms));
}
