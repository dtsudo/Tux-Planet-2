
// REVIEW ME

let Enemy_Background_Explode: { getEnemy: (xMibi: number, yMibi: number, scalingFactorScaled: number, displayAngleScaled: number, enemyId: number, renderOnTop?: boolean) => IEnemy } = {} as any;

((function () {
	let onCollideFunction = function () { return false; };

	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		frameCount: number,
		scalingFactorScaled: number,
		displayAngleScaled: number,
		enemyId: number,
		renderOnTop: boolean | undefined): IEnemy {

		let thisEnemyArray: IEnemy[] | null = null;

		let processFrame: processFrameFunction = function (thisObj, enemyMapping, rngSeed: number, nextEnemyId, difficulty, playerState, soundOutput) {

			if (frameCount === 0)
				soundOutput.playSound(GameSound.StandardDeath, 100);

			frameCount++;

			if (frameCount >= 15)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rngSeed,
					shouldEndLevel: false
				};

			if (thisEnemyArray === null)
				thisEnemyArray = [thisObj];

			return {
				enemies: thisEnemyArray,
				nextEnemyId: nextEnemyId,
				newRngSeed: rngSeed,
				shouldEndLevel: false
			};
		};

		let getHitboxes = function () {
			return null;
		};

		let getDamageboxes = function () {
			return null;
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, frameCount, scalingFactorScaled, displayAngleScaled, enemyId, renderOnTop);
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCount / 3);

			displayOutput.drawImageRotatedClockwise(
				GameImage.ExplodeF2,
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
			getHitboxes,
			getDamageboxes,
			onCollideWithPlayer: onCollideFunction,
			onCollideWithPlayerBullet: onCollideFunction,
			onScreenWipe: function () { },
			render
		};
	};

	Enemy_Background_Explode.getEnemy = function (xMibi: number, yMibi: number, scalingFactorScaled: number, displayAngleScaled: number, enemyId: number, renderOnTop?: boolean): IEnemy {
		return getEnemy(xMibi, yMibi, 0, scalingFactorScaled, displayAngleScaled, enemyId, renderOnTop);
	};
})());
