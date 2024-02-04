
let Enemy_Level1Boss_Phase2: { getEnemy: ({ xMibi, yMibi, xSpeed, ySpeed, frameCounter, enemyId }: { xMibi: number, yMibi: number, xSpeed: number, ySpeed: number, frameCounter: number, enemyId: number }) => IEnemy } = {} as any;

((function () {

	const INITIAL_HP = 500;

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			ySpeed: number,
			frameCounter: number,
			attackCooldown1: number,
			attackCooldown2: number,
			hp: number,
			transitionToPhase3Counter: number | null,
			enemyId: number): IEnemy {

		let arcTangentScaled = function (x: number, y: number) {
			if (x === 0 && y === 0)
				return 0;
			return DTMath.arcTangentScaled(x, y);
		};

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput }) {

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			xMibi += xSpeed;
			yMibi += ySpeed;

			if (playerState.yMibi - yMibi >= 1024 * 20) {
				if (ySpeed < 1000)
					ySpeed += 30;
			}

			if (playerState.yMibi - yMibi <= -1024 * 20) {
				if (ySpeed > -1000)
					ySpeed -= 30;
			}

			frameCounter++;

			let enemies = [thisObj];

			let ATTACK_COOLDOWN_1: number;

			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_1 = 50; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_1 = 30; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_1 = 12; break;
			}

			attackCooldown1--;
			if (attackCooldown1 <= 0 && transitionToPhase3Counter === null) {
				attackCooldown1 = ATTACK_COOLDOWN_1;
				soundOutput.playSound(GameSound.EnemyShoot, 100);

				let increment: number;
				let speed: number;

				switch (difficulty) {
					case Difficulty.Easy:
						increment = 30 * 128;
						speed = 3 * 1024;
						break;
					case Difficulty.Normal:
						increment = 15 * 128;
						speed = 4 * 1024;
						break;
					case Difficulty.Hard:
						increment = 10 * 128;
						speed = 6 * 1024;
						break;
				}

				for (let i = rng.nextInt(increment); i < 360 * 128; i += increment) {
					enemies.push(Enemy_Bullet_Iceball.getEnemy({
						xMibi: xMibi,
						yMibi: yMibi,
						speed: speed,
						angleScaled: i,
						enemyId: nextEnemyId++
					}));
				}
			}

			let ATTACK_COOLDOWN_2: number;

			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_2 = 118; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_2 = 80; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_2 = 35; break;
			}

			attackCooldown2--;
			if (attackCooldown2 <= 0 && transitionToPhase3Counter === null) {
				attackCooldown2 = ATTACK_COOLDOWN_2;
				soundOutput.playSound(GameSound.EnemyShoot, 100);

				enemies.push(Enemy_Bullet_Freezewave.getEnemy({ xMibi: xMibi, yMibi: yMibi, playerState: playerState, difficulty: difficulty, enemyId: nextEnemyId++ }));

				let initialAngleScaled = arcTangentScaled(playerState.xMibi - xMibi, playerState.yMibi - yMibi);
				enemies.push(Enemy_Bullet_Homing.getEnemy({
					xMibi: xMibi,
					yMibi: yMibi,
					initialAngleScaled: initialAngleScaled + 50 * 128,
					enemyId: nextEnemyId++
				}));
				enemies.push(Enemy_Bullet_Homing.getEnemy({
					xMibi: xMibi,
					yMibi: yMibi,
					initialAngleScaled: initialAngleScaled - 50 * 128,
					enemyId: nextEnemyId++
				}));
			}

			if (hp <= 0 && transitionToPhase3Counter === null) 
				transitionToPhase3Counter = 0;

			if (transitionToPhase3Counter !== null)
				transitionToPhase3Counter++;

			if (transitionToPhase3Counter !== null && transitionToPhase3Counter >= 2 + GameStateProcessing.SCREEN_WIPE_MAX_COUNTDOWN + 90) {
				let phase3Boss = Enemy_Level1Boss_Phase3.getEnemy({
					xMibi: xMibi,
					yMibi: yMibi,
					xSpeed: xSpeed,
					ySpeed: ySpeed,
					frameCounter: frameCounter,
					enemyId: nextEnemyId++
				});

				return {
					enemies: [phase3Boss],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed()
				};
			}

			let returnVal: EnemyProcessFrameResult = {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed(),
				musicToPlay: Enemy_Level1Boss_Phase1.BOSS_MUSIC,
				bossHealthDisplayValue: Math.ceil(hp * 100 / INITIAL_HP)
			};

			if (transitionToPhase3Counter !== null && transitionToPhase3Counter === 2)
				returnVal.shouldScreenWipe = true;

			if (transitionToPhase3Counter !== null && transitionToPhase3Counter === 2 + GameStateProcessing.SCREEN_WIPE_MAX_COUNTDOWN + 30)
				returnVal.shouldCreateAutoSavestate = true;

			return returnVal;
		};

		let getHitboxes = function () {
			return null;
		};

		let getDamageboxes = function () {
			let damagebox: Hitbox = {
				xMibi: xMibi - 16 * 3 * 1024,
				yMibi: yMibi - 16 * 3 * 1024,
				widthMibi: 32 * 3 * 1024,
				heightMibi: 32 * 3 * 1024
			};
			return [damagebox];
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 10) % 4;

			displayOutput.drawImageRotatedClockwise(
				GameImage.OwlBrown,
				32 + spriteNum * 32,
				0,
				32,
				32,
				(xMibi >> 10) - 16 * 3,
				(yMibi >> 10) - 16 * 3,
				0,
				128 * 3);
		};

		let getSnapshot = function (thisObj: IEnemy): IEnemy {
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, attackCooldown1, attackCooldown2, hp, transitionToPhase3Counter, enemyId);
		};

		let onCollideWithPlayerBullet = function (): boolean {
			hp--;
			return true;
		};

		return {
			getSnapshot: getSnapshot,
			enemyId: enemyId,
			isBullet: false,
			isBackground: false,
			processFrame: processFrame,
			getHitboxes: getHitboxes,
			getDamageboxes: getDamageboxes,
			onCollideWithPlayer: function () { return false; },
			onCollideWithPlayerBullet: onCollideWithPlayerBullet,
			onScreenWipe: function (countdown: number) { },
			render: render
		};
	};

	Enemy_Level1Boss_Phase2.getEnemy = function ({ xMibi, yMibi, xSpeed, ySpeed, frameCounter, enemyId }: { xMibi: number, yMibi: number, xSpeed: number, ySpeed: number, frameCounter: number, enemyId: number }): IEnemy {
		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, 0, 120, INITIAL_HP, null, enemyId);
	};
})());
