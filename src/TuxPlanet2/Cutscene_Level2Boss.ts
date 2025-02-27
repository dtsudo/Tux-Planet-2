
let Cutscene_Level2Boss: { getCutscene: (darkKonqiEnemyId: number) => ICutscene } = {} as any;

((function () {
	let dialogue = [
		{
			isKonqi: false,
			text: "Hello. I'm the level 2 boss.",
			width: 313
		},
		{
			isKonqi: true,
			text: "Who are you?",
			width: 165
		},
		{
			isKonqi: false,
			text: "I'm Dark Konqi!",
			width: 168 
		},
		{
			isKonqi: true,
			text: "Are you evil?",
			width: 159
		},
		{
			isKonqi: false,
			text: "No, I'm not evil.",
			width: 177
		},
		{
			isKonqi: false,
			text: "Why would you think that?",
			width: 324
		}
	];

	let getCutscene = function (
		dialogueIndex: number,
		beginBossFightCounter: number | null,
		darkKonqiEnemyId: number,
		darkKonqiXMibi: number | null,
		darkKonqiYMibi: number | null,
		playerXMibi: number | null,
		playerYMibi: number | null): ICutscene {

		let getSnapshot = function (thisObj: ICutscene): ICutscene {
			return getCutscene(dialogueIndex, beginBossFightCounter, darkKonqiEnemyId, darkKonqiXMibi, darkKonqiYMibi, playerXMibi, playerYMibi);
		};

		let processFrame = function ({ gameState, enemyMapping, frameInput, musicOutput }: CutsceneProcessFrameInput): { updatedFrameInput: FrameInput, shouldCreateAutoSavestate: boolean } {

			playerXMibi = gameState.playerState.xMibi;
			playerYMibi = gameState.playerState.yMibi;

			let darkKonqiEnemy: IEnemy = enemyMapping[darkKonqiEnemyId];
			let darkKonqiEnemyAsDarkKonqi: Level2BossCutsceneEnemy = darkKonqiEnemy as IEnemy & Level2BossCutsceneEnemy;

			darkKonqiXMibi = darkKonqiEnemyAsDarkKonqi.getXMibi();
			darkKonqiYMibi = darkKonqiEnemyAsDarkKonqi.getYMibi();

			if (frameInput.continueDialogue && beginBossFightCounter === null) {
				dialogueIndex++;

				if (dialogueIndex === dialogue.length) {
					if (beginBossFightCounter === null)
						beginBossFightCounter = 0;
				}
			}

			if (beginBossFightCounter !== null) {
				beginBossFightCounter++;
				if (beginBossFightCounter === 1) {
					gameState.background.startBoss();
					gameState.tilemap.startBoss();
				}
				musicOutput.playMusic(Enemy_Level2Boss_Phase1.BOSS_MUSIC, 100);
			}

			if (beginBossFightCounter !== null && beginBossFightCounter === 100) {
				gameState.cutscene = null;
				darkKonqiEnemyAsDarkKonqi.transformToLevel2Boss();
			}

			return {
				updatedFrameInput: {
					up: frameInput.up,
					down: frameInput.down,
					left: frameInput.left,
					right: frameInput.right,
					shoot: false,
					continueDialogue: frameInput.continueDialogue,
					debug_toggleInvulnerability: frameInput.debug_toggleInvulnerability
				},
				shouldCreateAutoSavestate: beginBossFightCounter !== null && beginBossFightCounter === 1
			};
		};

		let drawDialogue = function (x: number, y: number, width: number, text: string, displayOutput: IDisplayOutput) {

			let height = 24;

			displayOutput.drawRectangle(
				x,
				y,
				width,
				height,
				{ r: 0, g: 0, b: 0, alpha: 150 },
				true);

			displayOutput.drawText(
				x,
				y + height,
				text,
				GameFont.SimpleFont,
				24,
				white);
		};

		let render = function (displayOutput: IDisplayOutput): void {

			if (beginBossFightCounter === null && darkKonqiXMibi !== null && darkKonqiYMibi !== null && playerXMibi !== null && playerYMibi !== null) {
				let currentText = dialogue[dialogueIndex];
				let isKonqi = currentText.isKonqi;
				let text = currentText.text;

				let x: number;
				let y: number;
				let width = currentText.width;

				if (isKonqi) {
					x = (playerXMibi >> 10) - Math.floor(width / 2);
					y = (playerYMibi >> 10) + 35;
				} else {
					x = (darkKonqiXMibi >> 10) - Math.floor(width / 2);
					y = (darkKonqiYMibi >> 10) + 35;
				}

				drawDialogue(
					x,
					y,
					width,
					text,
					displayOutput);
			}
		};

		return {
			getSnapshot,
			processFrame,
			render
		};
	};

	Cutscene_Level2Boss.getCutscene = function (darkKonqiEnemyId: number): ICutscene {
		return getCutscene(0, null, darkKonqiEnemyId, null, null, null, null);
	};
})());
