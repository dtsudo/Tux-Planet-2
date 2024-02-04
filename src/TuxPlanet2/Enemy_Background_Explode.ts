
let Enemy_Background_Explode: { getEnemy: ({ xMibi, yMibi, displayAngleScaled, scalingFactorScaled, renderOnTop, enemyId }: { xMibi: number, yMibi: number, displayAngleScaled: number, scalingFactorScaled: number, renderOnTop: boolean, enemyId: number }) => IEnemy } = {} as any;

((function () {
	let onCollideFunction = function () { return false; };

	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		displayAngleScaled: number,
		scalingFactorScaled: number,
		frameCount: number,
		renderOnTop: boolean,
		enemyId: number): IEnemy {

		let thisEnemyArray: IEnemy[] | null = null;

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput }) {

			if (frameCount === 0)
				soundOutput.playSound(GameSound.StandardDeath, 100);

			frameCount++;

			if (frameCount >= 15)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rngSeed
				};

			if (thisEnemyArray === null)
				thisEnemyArray = [thisObj];

			return {
				enemies: thisEnemyArray,
				nextEnemyId: nextEnemyId,
				newRngSeed: rngSeed
			};
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, displayAngleScaled, scalingFactorScaled, frameCount, renderOnTop, enemyId);
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCount / 3);

			displayOutput.drawImageRotatedClockwise(
				GameImage.ExplodeF,
				spriteNum * 24,
				0,
				24,
				24,
				(xMibi >> 10) - Math.floor(12 * scalingFactorScaled / 128),
				(yMibi >> 10) - Math.floor(12 * scalingFactorScaled / 128),
				displayAngleScaled,
				scalingFactorScaled);
		};

		return {
			getSnapshot,
			enemyId,
			isBullet: renderOnTop ? true : false,
			isBackground: renderOnTop ? false : true,
			processFrame,
			getHitboxes: function () { return null; },
			getDamageboxes: function () { return null; },
			onCollideWithPlayer: onCollideFunction,
			onCollideWithPlayerBullet: onCollideFunction,
			onScreenWipe: function () { },
			render
		};
	};

	Enemy_Background_Explode.getEnemy = function ({ xMibi, yMibi, displayAngleScaled, scalingFactorScaled, renderOnTop, enemyId }: { xMibi: number, yMibi: number, displayAngleScaled: number, scalingFactorScaled: number, renderOnTop: boolean, enemyId: number }): IEnemy {
		return getEnemy(xMibi, yMibi, displayAngleScaled, scalingFactorScaled, 0, renderOnTop, enemyId);
	};
})());
