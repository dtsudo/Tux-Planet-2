
// REVIEW ME

let Enemy_Bullet_BouncySnow: { getEnemy: (xMibi: number, angleScaled: number, explodeYMibi: number, difficulty: Difficulty, enemyId: number) => IEnemy } = {} as any;

((function () {
	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		xSpeed: number,
		ySpeed: number,
		displayAngleScaled: number,
		explodeYMibi: number,
		frameCounter: number,
		screenWipeCountdown: number | null,
		enemyId: number): IEnemy {

		let thisEnemyArray: IEnemy[] | null = null;

		let processFrame: processFrameFunction = function (thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput) {

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			xMibi += xSpeed;
			yMibi += ySpeed;

			frameCounter++;

			let x = xMibi >> 10;
			let y = yMibi >> 10;

			if (yMibi < explodeYMibi && screenWipeCountdown === null) {
				let enemies: IEnemy[] = [];


				let increment: number;
				let speedOverride: number;

				switch (difficulty) {
					case Difficulty.Easy:
						increment = 45 * 128;
						speedOverride = 1024;
						break;
					case Difficulty.Normal:
						increment = 45 * 128;
						speedOverride = 1024;
						break;
					case Difficulty.Hard:
						increment = 45 * 128;
						speedOverride = 1024;
						break;
				}

				let startingAngle = rng.nextInt(increment);

				for (let i = startingAngle; i < 360 * 128; i += increment) {
					enemies.push(Enemy_Bullet_Iceball.getEnemy(
						xMibi,
						yMibi,
						i,
						difficulty,
						nextEnemyId++,
						speedOverride));
				}

				enemies.push(Enemy_Background_ExplodeI.getEnemy(
					xMibi,
					yMibi,
					128 * 3,
					-startingAngle,
					nextEnemyId++));

				return {
					enemies: enemies,
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed(),
				};
			}

			if (x < -50 || x > GlobalConstants.WINDOW_WIDTH + 50 || y < -50 || y > GlobalConstants.WINDOW_HEIGHT + 50)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rngSeed
				};

			if (screenWipeCountdown !== null) {
				screenWipeCountdown--;

				if (screenWipeCountdown <= 0) {
					let poof = Enemy_Background_Poof.getEnemy(xMibi, yMibi, 3 * 128, nextEnemyId++);
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
				newRngSeed: rng.getSeed(),
				shouldEndLevel: false
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
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, displayAngleScaled, explodeYMibi, frameCounter, screenWipeCountdown, enemyId);
		};

		let render = function (displayOutput: IDisplayOutput) {
			displayOutput.drawImageRotatedClockwise(
				GameImage.BouncySnow,
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

	Enemy_Bullet_BouncySnow.getEnemy = function (xMibi: number, angleScaled: number, explodeYMibi: number, difficulty: Difficulty, enemyId: number): IEnemy {

		let speed: number;

		switch (difficulty) {
			case Difficulty.Easy: speed = 5; break;
			case Difficulty.Normal: speed = 7; break;
			case Difficulty.Hard: speed = 9; break;
		}

		let xSpeed = speed * DTMath.cosineScaled(angleScaled);
		let ySpeed = speed * DTMath.sineScaled(angleScaled);

		// 0 => -90
		// 30 => -120
		let displayAngleScaled = -angleScaled - 90 * 128;

		let yMibi = (GlobalConstants.WINDOW_HEIGHT + 50) << 10;

		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, displayAngleScaled, explodeYMibi, 0, null, enemyId);
	};
})());
