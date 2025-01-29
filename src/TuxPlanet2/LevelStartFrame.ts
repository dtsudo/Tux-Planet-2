
let LevelStartFrame = ((function () {

	let getFrame = function (globalState: GlobalState, sessionState: SessionState, level: Level, overworldMapFrame: IFrame): IFrame {

		let selectedDifficulty: Difficulty = sessionState.lastSelectedDifficulty;

		let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

			if (keyboardInput.isPressed(Key.LeftArrow) && !previousKeyboardInput.isPressed(Key.LeftArrow)) {
				switch (selectedDifficulty) {
					case Difficulty.Easy: break;
					case Difficulty.Normal: selectedDifficulty = Difficulty.Easy; break;
					case Difficulty.Hard: selectedDifficulty = Difficulty.Normal; break;
				}
			}

			if (keyboardInput.isPressed(Key.RightArrow) && !previousKeyboardInput.isPressed(Key.RightArrow)) {
				switch (selectedDifficulty) {
					case Difficulty.Easy: selectedDifficulty = Difficulty.Normal; break;
					case Difficulty.Normal: selectedDifficulty = Difficulty.Hard; break;
					case Difficulty.Hard: break;
				}
			}

			if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
					|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
					|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {

				soundOutput.playSound(GameSound.Click, 100);

				sessionState.lastSelectedDifficulty = selectedDifficulty;
				globalState.saveAndLoadData.saveSessionState(sessionState);

				let gameState = GameStateUtil.getInitialGameState(level, selectedDifficulty, displayProcessing);
				return GameFrame.getFrame(globalState, sessionState, gameState);
			}

			if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)
					|| keyboardInput.isPressed(Key.X) && !previousKeyboardInput.isPressed(Key.X)
					|| keyboardInput.isPressed(Key.C) && !previousKeyboardInput.isPressed(Key.C)) {

				soundOutput.playSound(GameSound.Click, 100);

				sessionState.lastSelectedDifficulty = selectedDifficulty;
				globalState.saveAndLoadData.saveSessionState(sessionState);

				return overworldMapFrame;
			}

			return thisFrame;
		};

		let render = function (displayOutput: IDisplayOutput) {

			overworldMapFrame.render(displayOutput);

			let levelName: string;
			let levelNameX: number;
			let levelScreenshot: GameImage;

			switch (level) {
				case Level.Level1:
					levelName = "Learning the Slopes";
					levelNameX = 341;
					levelScreenshot = GameImage.Level1Screenshot;
					break;
				case Level.Level2:
					levelName = "Icyfall Forest";
					levelNameX = 383;
					levelScreenshot = GameImage.Level2Screenshot;
					break;
			}

			displayOutput.drawRectangle(
				50,
				50,
				900,
				600,
				GlobalConstants.STANDARD_BACKGROUND_COLOR,
				true);

			displayOutput.drawText(
				levelNameX,
				640,
				levelName,
				GameFont.SimpleFont,
				32,
				black);

			displayOutput.drawImage(levelScreenshot, 50, 175);

			displayOutput.drawRectangle(
				50,
				50,
				900,
				600,
				black,
				false);

			displayOutput.drawText(
				100,
				150,
				"Start level:",
				GameFont.SimpleFont,
				28,
				black);

			displayOutput.drawText(
				325,
				150,
				"Easy",
				GameFont.SimpleFont,
				28,
				black);

			displayOutput.drawText(
				457,
				150,
				"Normal",
				GameFont.SimpleFont,
				28,
				black);

			displayOutput.drawText(
				625,
				150,
				"Hard",
				GameFont.SimpleFont,
				28,
				black);

			let startLevelX: number;

			switch (selectedDifficulty) {
				case Difficulty.Easy: startLevelX = 300; break;
				case Difficulty.Normal: startLevelX = 450; break;
				case Difficulty.Hard: startLevelX = 600; break;
			}

			displayOutput.drawRectangle(
				startLevelX,
				122, 
				120,
				30,
				black,
				false);
		};

		return {
			getNextFrame,
			render,
			getClickUrl: function () { return null; },
			getCompletedAchievements: function () { return null; }
		};
	};

	return {
		getFrame
	};
})());
