
type BossHealthDisplay = {
	getSnapshot: (thisObj: BossHealthDisplay) => BossHealthDisplay,
	processFrame: () => void,
	setHealthPercentage: (percent: number | null) => void,
	render: (displayOutput: IDisplayOutput) => void
}

let BossHealthDisplayUtil: { getDisplay: () => BossHealthDisplay } = {} as any;

((function () {
	let getDisplay = function (desiredHealthPercent: number | null, currentHealthPercent: number | null): BossHealthDisplay {

		let getSnapshot = function (thisObj: BossHealthDisplay) {
			return getDisplay(desiredHealthPercent, currentHealthPercent);
		};

		let processFrame = function () {

			if (desiredHealthPercent === null) {
				if (currentHealthPercent === null)
					return;

				if (currentHealthPercent === 0) {
					currentHealthPercent = null;
					return;
				}

				if (currentHealthPercent <= 5) {
					currentHealthPercent = 0;
					return;
				}

				currentHealthPercent -= 5;
				return;
			}

			if (currentHealthPercent === null) {
				currentHealthPercent = 0;
				return;
			}

			if (desiredHealthPercent < currentHealthPercent) {
				if (currentHealthPercent - desiredHealthPercent < 5) {
					currentHealthPercent = desiredHealthPercent;
					return;
				}

				currentHealthPercent -= 5;
				return;
			}

			if (desiredHealthPercent > currentHealthPercent) {
				let delta = desiredHealthPercent - currentHealthPercent;

				if (delta > 50) {
					currentHealthPercent += 20;
					return;
				}

				if (delta > 20) {
					currentHealthPercent += 10;
					return;
				}

				if (delta > 5) {
					currentHealthPercent += 5;
					return;
				}

				currentHealthPercent++;
				return;
			}
		};

		let setHealthPercentage = function (percent: number | null) {
			desiredHealthPercent = percent;
		};

		let render = function (displayOutput: IDisplayOutput) {

			if (currentHealthPercent === null)
				return;

			displayOutput.drawImageRotatedClockwise(
				GameImage.BossHealth,
				50,
				0,
				10,
				8,
				GlobalConstants.WINDOW_WIDTH - 60,
				500,
				0,
				128 * 3);

			for (let i = 0; i < 10; i++)
				displayOutput.drawImageRotatedClockwise(
					GameImage.BossHealth,
					0,
					0,
					10,
					8,
					GlobalConstants.WINDOW_WIDTH - 60,
					500 - 24 - 24 * i,
					0,
					128 * 3);

			let numPixelsOfHealth = Math.floor(currentHealthPercent * 80 / 100);

			for (let i = 0; i < numPixelsOfHealth; i++) {
				displayOutput.drawImageRotatedClockwise(
					GameImage.BossHealth,
					40,
					0,
					10,
					1,
					GlobalConstants.WINDOW_WIDTH - 60,
					260 + i * 3,
					0,
					128 * 3);
			}

			displayOutput.drawImageRotatedClockwise(
				GameImage.BossHealth,
				60,
				0,
				10,
				8,
				GlobalConstants.WINDOW_WIDTH - 60,
				260 - 24,
				0,
				128 * 3);

			displayOutput.drawImageRotatedClockwise(
				GameImage.Skull,
				0,
				0,
				16,
				16,
				GlobalConstants.WINDOW_WIDTH - 60 - 9,
				260 - 48,
				0,
				128 * 3);
		};

		return {
			getSnapshot,
			processFrame,
			setHealthPercentage,
			render
		};
	};

	BossHealthDisplayUtil.getDisplay = function (): BossHealthDisplay {
		return getDisplay(null, null);
	};
})());
