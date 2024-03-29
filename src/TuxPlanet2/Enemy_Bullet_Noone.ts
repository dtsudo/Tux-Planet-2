
let Enemy_Bullet_Noone: { getEnemy: ({ xMibi, yMibi, directionScaled, rotatesClockwise, displayAngleScaled, gameImage, difficulty, enemyId }: { xMibi: number, yMibi: number, directionScaled: number, rotatesClockwise: boolean, displayAngleScaled: number, gameImage: GameImage, difficulty: Difficulty, enemyId: number }) => IEnemy } = {} as any;

((function () {
	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		xSpeed: number,
		ySpeed: number,
		rotatesClockwise: boolean,
		displayAngleScaled: number,
		screenWipeCountdown: number | null,
		gameImage: GameImage,
		enemyId: number): IEnemy {

		let thisEnemyArray: IEnemy[] | null = null;

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId }) {

			xMibi += xSpeed;
			yMibi += ySpeed;

			let x = xMibi >> 10;
			let y = yMibi >> 10;

			if (x < -50 || x > GlobalConstants.WINDOW_WIDTH + 50 || y < -50 || y > GlobalConstants.WINDOW_HEIGHT + 50)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rngSeed
				};

			if (rotatesClockwise) {
				displayAngleScaled += 3 * 128;
				if (displayAngleScaled >= 360 * 128)
					displayAngleScaled -= 360 * 128;
			} else {
				displayAngleScaled -= 3 * 128;
				if (displayAngleScaled < 0)
					displayAngleScaled += 360 * 128;
			}

			if (screenWipeCountdown !== null) {
				screenWipeCountdown--;
				if (screenWipeCountdown <= 0) {
					let poof = Enemy_Background_Poof.getEnemy({ xMibi: xMibi, yMibi: yMibi, scalingFactorScaled: 3 * 128 * 2, enemyId: nextEnemyId++ });
					return {
						enemies: [poof],
						nextEnemyId,
						newRngSeed: rngSeed
					};
				}
			}

			if (thisEnemyArray === null)
				thisEnemyArray = [thisObj];

			return {
				enemies: thisEnemyArray,
				nextEnemyId: nextEnemyId,
				newRngSeed: rngSeed
			};
		};

		let getHitboxes = function () {
			let hitbox: Hitbox = {
				xMibi: xMibi - 16 * 1024,
				yMibi: yMibi - 16 * 1024,
				widthMibi: 32 * 1024,
				heightMibi: 32 * 1024
			};

			return [hitbox];
		};

		let getDamageboxes = function () {
			return null;
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, rotatesClockwise, displayAngleScaled, screenWipeCountdown, gameImage, enemyId);
		};

		let render = function (displayOutput: IDisplayOutput) {
			displayOutput.drawImageRotatedClockwise(
				gameImage,
				0,
				0,
				16,
				16,
				(xMibi >> 10) - 8 * 3,
				(yMibi >> 10) - 8 * 3,
				displayAngleScaled,
				3 * 128);
		};

		let onScreenWipe = function (countdown: number) {
			screenWipeCountdown = countdown;
		};

		return {
			getSnapshot,
			enemyId,
			isBullet: true,
			isBackground: false,
			processFrame,
			getHitboxes,
			getDamageboxes,
			onCollideWithPlayer: function () { return true; },
			onCollideWithPlayerBullet: function () { return false; },
			onScreenWipe,
			render
		};
	};

	Enemy_Bullet_Noone.getEnemy = function ({ xMibi, yMibi, directionScaled, rotatesClockwise, displayAngleScaled, gameImage, difficulty, enemyId }: { xMibi: number, yMibi: number, directionScaled: number, rotatesClockwise: boolean, displayAngleScaled: number, gameImage: GameImage, difficulty: Difficulty, enemyId: number }): IEnemy {

		displayAngleScaled = DTMath.normalizeDegreesScaled(displayAngleScaled);

		let speed: number;

		switch (difficulty) {
			case Difficulty.Easy: speed = 3; break;
			case Difficulty.Normal: speed = 4; break;
			case Difficulty.Hard: speed = 5; break;
		}

		let xSpeed = DTMath.cosineScaled(directionScaled) * speed;
		let ySpeed = DTMath.sineScaled(directionScaled) * speed;

		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, rotatesClockwise, displayAngleScaled, null, gameImage, enemyId);
	};
})());
