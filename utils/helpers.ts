import gaussian from 'gaussian';
import { GraphPoint } from 'react-native-graph';

abstract class helpers {
	private static weightedRandom(mean: number, variance: number) {
		const distribution = gaussian(mean, variance)
		// Take a random sample using inverse transform sampling method.
		return distribution.ppf(Math.random());
	}

	static generateRandomGraphData(length: number): GraphPoint[] { 
		return Array<number>(length)
			.fill(0)
			.map((_, index) => ({
				date: new Date(
					new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * index
				),
				value: this.weightedRandom(10, Math.pow(index + 1, 2)),
			}));
	};
}

export default helpers;
