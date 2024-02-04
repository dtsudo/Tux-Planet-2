
let Enemy_Bullet_Iceball: { getEnemy: ({ xMibi, yMibi, speed, angleScaled, enemyId }: { xMibi: number, yMibi: number, speed: number, angleScaled: number, enemyId: number }) => IEnemy } = {} as any;

((function () {
	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		xSpeed: number,
		ySpeed: number,
		displayAngleScaled: number,
		screenWipeCountdown: number | null,
		enemyId: number): IEnemy {

		let thisEnemyArray: IEnemy[] | null = null;

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, playerState, soundOutput }) {

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

			if (screenWipeCountdown !== null) {
				screenWipeCountdown--;

				if (screenWipeCountdown <= 0) {
					let poof = Enemy_Background_Poof.getEnemy({ xMibi: xMibi, yMibi: yMibi, scalingFactorScaled: 3 * 128, enemyId: nextEnemyId++ });
					return {
						enemies: [poof],
						nextEnemyId: nextEnemyId,
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
				xMibi: xMibi - 6 * 1024,
				yMibi: yMibi - 6 * 1024,
				widthMibi: 13 * 1024,
				heightMibi: 13 * 1024
			};

			return [hitbox];
		};

		let getDamageboxes = function () {
			return null;
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, displayAngleScaled, screenWipeCountdown, enemyId);
		};

		let render = function (displayOutput: IDisplayOutput) {
			displayOutput.drawImageRotatedClockwise(
				GameImage.Iceball,
				0,
				0,
				6,
				6,
				(xMibi >> 10) - 3 * 3,
				(yMibi >> 10) - 3 * 3,
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

	Enemy_Bullet_Iceball.getEnemy = function ({ xMibi, yMibi, speed, angleScaled, enemyId }: { xMibi: number, yMibi: number, speed: number, angleScaled: number, enemyId: number }): IEnemy {

		let xSpeed: number = (speed * DTMath.cosineScaled(angleScaled)) >> 10;
		let ySpeed: number = (speed * DTMath.sineScaled(angleScaled)) >> 10;

		let displayAngleScaled = -angleScaled - 90 * 128;

		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, displayAngleScaled, null, enemyId);
	};
})());
