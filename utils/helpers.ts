type GraphTimelineOptions = '3mo' | '1d' | '1w' | '1m' | '1y';

abstract class helpers {
	public static formatLargeNumber(num: number): string {
		if (isNaN(num)) return 'N/A';
	  
		const absNum = Math.abs(num);
	  
		if (absNum >= 1.0e+12) {
		  return (num / 1.0e+12).toFixed(2).replace(/\.00$/, '') + 'T';
		} else if (absNum >= 1.0e+9) {
		  return (num / 1.0e+9).toFixed(2).replace(/\.00$/, '') + 'B';
		} else if (absNum >= 1.0e+6) {
		  return (num / 1.0e+6).toFixed(2).replace(/\.00$/, '') + 'M';
		} else if (absNum >= 1.0e+3) {
		  return (num / 1.0e+3).toFixed(2).replace(/\.00$/, '') + 'K';
		} else {
		  return num.toString();
		}
	  }

	private static isLeapYear(year: number) {
		return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
	}

	private static getDaysInMonth(year: number, month: number) {
		return new Date(year, month + 1, 0).getDate();
	}

	private static getOneDayOldStart() {
		let today = new Date();
		let yesterday = new Date(today);
	
		yesterday.setDate(today.getDate() - 1);
	
		if (yesterday.getDate() < 1) {
			yesterday.setMonth(today.getMonth() - 1);
	
			if (yesterday.getMonth() === 1 && this.isLeapYear(yesterday.getFullYear())) {
				yesterday.setDate(29); // Leap year, February has 29 days
			} else {
				yesterday.setDate(this.getDaysInMonth(yesterday.getFullYear(), yesterday.getMonth())); // Get last day of the previous month
			}
		}
	
		return yesterday;
	}

	private static getOneHourOldStart() {
		const start = new Date();
		const newStartHour = start.getHours() === 0 ? 23 : start.getHours() - 1;
		start.setHours(newStartHour);
		return start;
	}

	private static getOneMonthOldStart() {
		let currentDate = new Date();
		let year = currentDate.getFullYear();
		let month = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
		let day = currentDate.getDate();

		// Adjust month and year if current month is January
		if (month === 1) {
			month = 12; // December of previous year
			year -= 1; // Previous year
		} else {
			month -= 1; // Previous month
		}

		// Adjust day if going from a month with 31 days to a month with 30 days
		if (day > 30 && (month === 4 || month === 6 || month === 9 || month === 11)) {
			day = 30; // Last day of the previous month
		}

		// Adjust day and month if going from March 1st in a leap year to February 29th in a non-leap year
		if (day > 28 && month === 3 && !this.isLeapYear(year)) {
			day = 28; // Last day of February in non-leap year
		}

		return new Date(year, month - 1, day); // Subtracting 1 from month to get zero-based month for Date constructor
	}

	private static getOneWeekOldStart() {
		let today = new Date();
		let oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

		// Handle crossing year boundary
		if (oneWeekAgo.getFullYear() < today.getFullYear()) {
			oneWeekAgo = new Date(today.getFullYear() - 1, 11, today.getDate() - 6);
		}

		// Handle end of February in leap years
		if (today.getMonth() === 2 && today.getDate() === 1 && this.isLeapYear(today.getFullYear())) {
			oneWeekAgo = new Date(today.getFullYear(), 1, 22);
		}

		// Handle end of months with 31 days
		if ([1, 3, 5, 7, 8, 10, 12].includes(today.getMonth() + 1) && today.getDate() === 1) {
			oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), 24);
		}

		// Handle end of months with 30 days
		if ([4, 6, 9, 11].includes(today.getMonth() + 1) && today.getDate() === 1) {
			oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), 23);
		}

		return oneWeekAgo;
	}

	private static getOneYearOldDate() {
		let today = new Date();
		let oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
		
		// Handle leap year
		if (today.getMonth() === 1 && today.getDate() === 29 && !this.isLeapYear(today.getFullYear() - 1)) {
			oneYearAgo = new Date(today.getFullYear() - 1, 2, 1);
		}
	
		return oneYearAgo;
	}

	static getStartDateForGraph(option: GraphTimelineOptions) {
		switch (option) {
			case '1d':
				return this.getOneDayOldStart();
			case '1m':
				return this.getOneMonthOldStart();
			case '1w':
				return this.getOneWeekOldStart();
			case '1y':
				return this.getOneYearOldDate();
			case '3mo':
				const today = new Date();
				const ninetyDaysAgo = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000));
				return ninetyDaysAgo;
			default:
				return this.getOneHourOldStart();
		}
	}
}

export default helpers;
