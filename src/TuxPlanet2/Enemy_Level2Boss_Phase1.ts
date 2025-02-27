
let Enemy_Level2Boss_Phase1: {
	BOSS_MUSIC: GameMusic,
	getEnemy: ({ xMibi, yMibi, frameCounter, enemyId }: { xMibi: number, yMibi: number, frameCounter: number, enemyId: number }) => IEnemy
} = {} as any;

Enemy_Level2Boss_Phase1.BOSS_MUSIC = GameMusic.ChiptuneLevel3;

((function () {

	let INITIAL_HP = 575;

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			ySpeed: number,
			frameCounter: number,
			attackCooldown1: number,
			attackCooldown2: number,
			attack2IsNextAttackClockwise: boolean,
			transitionToPhase2Counter: number | null,
			hp: number,
			enemyId: number): IEnemy {

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput, tilemap }) {

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			frameCounter++;

			xMibi += xSpeed;
			yMibi += ySpeed;

			if (playerState.yMibi - yMibi >= 1024 * 20) {
				if (ySpeed < 500)
					ySpeed += 8;
			}

			if (playerState.yMibi - yMibi <= -1024 * 20) {
				if (ySpeed > -500)
					ySpeed -= 8;
			}

			let enemies = [thisObj];

			let ATTACK_COOLDOWN_1: number;

			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_1 = 5; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_1 = 4; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_1 = 3; break;
			}

			attackCooldown1--;
			if (attackCooldown1 <= 0 && transitionToPhase2Counter === null) {
				attackCooldown1 = ATTACK_COOLDOWN_1;
				soundOutput.playSound(GameSound.EnemyShoot, 100);

				let numFireballs: number;
				let baseSpeed: number;
				let maxSpeedIncrement: number;

				switch (difficulty) {
					case Difficulty.Easy:
						numFireballs = 1;
						baseSpeed = 1150;
						maxSpeedIncrement = 2000;
						break;
					case Difficulty.Normal:
						numFireballs = 2;
						baseSpeed = 1700;
						maxSpeedIncrement = 2950;
						break;
					case Difficulty.Hard:
						numFireballs = 5;
						baseSpeed = 2300;
						maxSpeedIncrement = 4000;
						break;
				}

				for (let i = 0; i < numFireballs; i++) {
					enemies.push(Enemy_Bullet_Fireball_Normal.getEnemy({
						xInitialMibi: xMibi,
						yInitialMibi: yMibi,
						angleScaled: rng.nextInt(360 * 128),
						speedInMibipixelsPerFrame: baseSpeed + rng.nextInt(maxSpeedIncrement),
						enemyId: nextEnemyId++
					}));
				}
			}

			let ATTACK_COOLDOWN_2: number;

			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_2 = 360; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_2 = 160; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_2 = 40; break;
			}

			attackCooldown2--;
			if (attackCooldown2 <= 0 && transitionToPhase2Counter === null) {
				attackCooldown2 = ATTACK_COOLDOWN_2;
				soundOutput.playSound(GameSound.EnemyShoot, 100);

				let numBullets: number;
				let angularSpeed: number;
				let radiusSpeed: number;

				switch (difficulty) {
					case Difficulty.Easy:
						numBullets = 5;
						angularSpeed = 43;
						radiusSpeed = 853;
						break;
					case Difficulty.Normal:
						numBullets = 7;
						angularSpeed = 64;
						radiusSpeed = 1280;
						break;
					case Difficulty.Hard:
						numBullets = 12;
						angularSpeed = 128;
						radiusSpeed = 2560;
						break;
				}

				let delta = Math.floor(360 * 128 / numBullets);
				let offset = rng.nextInt(delta);

				for (let i = 0; i < numBullets; i++) {
					enemies.push(Enemy_Bullet_Fireball_Spiral.getEnemy({
						xInitialMibi: xMibi,
						yInitialMibi: yMibi,
						angleScaled: offset + delta * i,
						angularSpeedInAngleScaledPerFrame: angularSpeed,
						radiusSpeedInMibipixelsPerFrame: radiusSpeed,
						isRotatingClockwise: attack2IsNextAttackClockwise,
						enemyId: nextEnemyId++
					}));
				}

				attack2IsNextAttackClockwise = !attack2IsNextAttackClockwise;
			}

			if (hp <= 0 && transitionToPhase2Counter === null) 
				transitionToPhase2Counter = 0;
			
			if (transitionToPhase2Counter !== null)
				transitionToPhase2Counter++;

			if (transitionToPhase2Counter !== null && transitionToPhase2Counter >= 2 + GameStateProcessing.SCREEN_WIPE_MAX_COUNTDOWN + 180) {
				let phase2Boss = Enemy_Level2Boss_Phase2.getEnemy({
					xMibi: xMibi,
					yMibi: yMibi,
					xSpeed: xSpeed,
					ySpeed: ySpeed,
					frameCounter: frameCounter,
					enemyId: nextEnemyId++
				});
				return {
					enemies: [phase2Boss],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed()
				};
			}

			let returnVal: EnemyProcessFrameResult = {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed(),
				musicToPlay: Enemy_Level2Boss_Phase1.BOSS_MUSIC,
				bossHealthDisplayValue: Math.ceil(hp * 100 / INITIAL_HP)
			};

			if (transitionToPhase2Counter !== null && transitionToPhase2Counter === 2)
				returnVal.shouldScreenWipe = true;

			if (transitionToPhase2Counter !== null && transitionToPhase2Counter === 2 + GameStateProcessing.SCREEN_WIPE_MAX_COUNTDOWN + 60)
				returnVal.shouldCreateAutoSavestate = true;

			return returnVal;
		};

		let getHitboxes = function () {
			return null;
		};

		let getDamageboxes = function () {
			let damagebox: Hitbox = {
				xMibi: xMibi - 9 * 3 * 1024,
				yMibi: yMibi - 12 * 3 * 1024,
				widthMibi: 22 * 3 * 1024,
				heightMibi: 23 * 3 * 1024
			};
			return [damagebox];
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 24) % 6;

			displayOutput.drawImageRotatedClockwise(
				GameImage.DarkKonqi_Mirrored, 
				spriteNum * 32,
				128,
				32,
				32,
				(xMibi >> 10) - 16 * 3,
				(yMibi >> 10) - 16 * 3,
				0,
				128 * 3);
		};

		let getSnapshot = function (thisObj: IEnemy): IEnemy {
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, attackCooldown1, attackCooldown2, attack2IsNextAttackClockwise, transitionToPhase2Counter, hp, enemyId);
		};

		let onCollideWithPlayerBullet = function (): boolean {
			if (hp > 0)
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

	Enemy_Level2Boss_Phase1.getEnemy = function ({ xMibi, yMibi, frameCounter, enemyId }: { xMibi: number, yMibi: number, frameCounter: number, enemyId: number }): IEnemy {

		return getEnemy(xMibi, yMibi, 0, 0, frameCounter, 0, 0, true, null, INITIAL_HP, enemyId);
	};
})());
