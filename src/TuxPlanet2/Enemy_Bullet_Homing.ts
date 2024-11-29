
let Enemy_Bullet_Homing: { getEnemy: ({ xMibi, yMibi, initialAngleScaled, enemyId }: { xMibi: number, yMibi: number, initialAngleScaled: number, enemyId: number }) => IEnemy } = {} as any;

((function () {
	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		displayAngleScaled: number,
		homingTargetXMibi: number,
		homingTargetYMibi: number,
		homingTargetAngleScaled: number,
		frameCounter: number,
		screenWipeCountdown: number | null,
		enemyId: number): IEnemy {

		let thisEnemyArray: IEnemy[] | null = null;

		let arcTangentScaled = function (x: number, y: number) {
			if (x === 0 && y === 0)
				return 0;
			return DTMath.arcTangentScaled(x, y);
		};

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput }) {

			let angleScaled = arcTangentScaled(homingTargetXMibi - xMibi, homingTargetYMibi - yMibi);

			let doubledSpeed: number;

			switch (difficulty) {
				case Difficulty.Easy: doubledSpeed = 12; break;
				case Difficulty.Normal: doubledSpeed = 25; break;
				case Difficulty.Hard: doubledSpeed = 35; break;
			}

			let xSpeed = Math.floor(DTMath.cosineScaled(angleScaled) * doubledSpeed / 2);
			let ySpeed = Math.floor(DTMath.sineScaled(angleScaled) * doubledSpeed / 2);

			xMibi += xSpeed;
			yMibi += ySpeed;

			displayAngleScaled = -angleScaled;

			frameCounter++;

			if (frameCounter === 12) {
				let targetX = playerState.xMibi;
				let targetY = playerState.yMibi;

				let deltaX = xMibi - targetX;
				let deltaY = yMibi - targetY;

				targetX -= deltaX >> 1;
				targetY -= deltaY >> 1;

				homingTargetAngleScaled = arcTangentScaled(targetX - homingTargetXMibi, targetY - homingTargetYMibi);
			}

			homingTargetXMibi += Math.floor(DTMath.cosineScaled(homingTargetAngleScaled) * 95 / 2);
			homingTargetYMibi += Math.floor(DTMath.sineScaled(homingTargetAngleScaled) * 95 / 2);

			let x = xMibi >> 10;
			let y = yMibi >> 10;

			if (x < -100 || x > GlobalConstants.WINDOW_WIDTH + 100 || y < -100 || y > GlobalConstants.WINDOW_HEIGHT + 100)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rngSeed
				};

			if (screenWipeCountdown !== null) {
				screenWipeCountdown--;

				if (screenWipeCountdown <= 0) {
					let poof = Enemy_Background_Poof.getEnemy({
						xMibi: xMibi,
						yMibi: yMibi,
						scalingFactorScaled: 3 * 128 * 2,
						enemyId: nextEnemyId++
					});
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
				xMibi: xMibi - 30 * 1024,
				yMibi: yMibi - 30 * 1024,
				widthMibi: 60 * 1024,
				heightMibi: 60 * 1024
			};

			return [hitbox];
		};

		let getDamageboxes = function () {
			return null;
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, displayAngleScaled, homingTargetXMibi, homingTargetYMibi, homingTargetAngleScaled, frameCounter, screenWipeCountdown, enemyId);
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 20) % 2;

			displayOutput.drawImageRotatedClockwise(
				GameImage.Freezewave,
				spriteNum * 28,
				0,
				28,
				24,
				(xMibi >> 10) - 14 * 3,
				(yMibi >> 10) - 12 * 3,
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

	Enemy_Bullet_Homing.getEnemy = function ({ xMibi, yMibi, initialAngleScaled, enemyId }: { xMibi: number, yMibi: number, initialAngleScaled: number, enemyId: number }): IEnemy {

		let displayAngleScaled = -initialAngleScaled;

		return getEnemy(xMibi, yMibi, displayAngleScaled, xMibi, yMibi, initialAngleScaled, 0, null, enemyId);
	};
})());
