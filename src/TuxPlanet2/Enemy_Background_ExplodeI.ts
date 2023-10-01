
// REVIEW ME

let Enemy_Background_ExplodeI: { getEnemy: (xMibi: number, yMibi: number, scalingFactorScaled: number, displayAngleScaled: number, enemyId: number) => IEnemy } = {} as any;

((function () {
	let onCollideFunction = function () { return false; };

	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		frameCount: number,
		scalingFactorScaled: number,
		displayAngleScaled: number,
		enemyId: number): IEnemy {

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
			return getEnemy(xMibi, yMibi, frameCount, scalingFactorScaled, displayAngleScaled, enemyId);
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCount / 3);

			displayOutput.drawImageRotatedClockwise(
				GameImage.ExplodeI,
				spriteNum * 30,
				0,
				30,
				30,
				(xMibi >> 10) - Math.floor(15 * scalingFactorScaled / 128),
				(yMibi >> 10) - Math.floor(15 * scalingFactorScaled / 128),
				displayAngleScaled,
				scalingFactorScaled);
		};

		return {
			getSnapshot,
			enemyId,
			isBullet: false,
			isBackground: true,
			processFrame,
			getHitboxes,
			getDamageboxes,
			onCollideWithPlayer: onCollideFunction,
			onCollideWithPlayerBullet: onCollideFunction,
			onScreenWipe: function () { },
			render
		};
	};

	Enemy_Background_ExplodeI.getEnemy = function (xMibi: number, yMibi: number, scalingFactorScaled: number, displayAngleScaled: number, enemyId: number): IEnemy {
		return getEnemy(xMibi, yMibi, 0, scalingFactorScaled, displayAngleScaled, enemyId);
	};
})());
