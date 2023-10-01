
// REVIEW ME

let ReplayFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState, frameInputHistory: FrameInputHistory, difficulty: Difficulty) => IFrame } = {} as any;

ReplayFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState, frameInputHistory: FrameInputHistory, difficulty: Difficulty): IFrame {

	let gameState = GameStateUtil.getInitialGameState(1, difficulty);
	let savedGameState: GameState | null = null;
	let skipFrameCount = 0;

	let frameInputs: { [index: number]: FrameInput } = {};

	let endLevelCounter: number | null = null;

	let frameInputHistory2 = frameInputHistory;
	while (true) {
		frameInputs[frameInputHistory2.index] = frameInputHistory2.frameInput;
		if (frameInputHistory2.previousFrameInputs === null)
			break;
		frameInputHistory2 = frameInputHistory2.previousFrameInputs;
	}

	let getNextFrameWrapped: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) {
			return ReplayPauseMenuFrame.getFrame(globalState, sessionState, thisFrame, gameState.difficulty, frameInputHistory);
		}

		let frame = getNextFrame(keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame);

		if (keyboardInput.isPressed(Key.Z)) {
			let emptyKeyboard = EmptyKeyboard.getEmptyKeyboard();
			let emptyMouse = EmptyMouse.getEmptyMouse();
			for (let i = 0; i < 4; i++) {
				frame = getNextFrame(emptyKeyboard, emptyMouse, emptyKeyboard, emptyMouse, displayProcessing, soundOutput, musicOutput, thisFrame);
			}
		}

		if (endLevelCounter !== null)
			endLevelCounter++;

		if (endLevelCounter === 60)
			return LevelCompleteFrame.getFrame(globalState, sessionState, thisFrame, gameState.difficulty, frameInputHistory);

		return frame;
	};

	let getNextFrame: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {

		let shouldExecuteFrame = true;

		if (keyboardInput.isPressed(Key.Shift)) {
			skipFrameCount++;
			if (skipFrameCount === 5) {
				skipFrameCount = 0;
				shouldExecuteFrame = true;
			} else {
				shouldExecuteFrame = false;
			}
		}

		if (shouldExecuteFrame) {
			let frameInput = frameInputs[gameState.frameCount];

			if (!frameInput)
				frameInput = {
					up: false,
					down: false,
					right: false,
					left: false,
					shoot: false,
					continueDialogue: false
				};

			let result = GameStateProcessing.processFrame(gameState, frameInput, soundOutput, musicOutput);
			if (result.shouldEndLevel && endLevelCounter === null)
				endLevelCounter = 0;
		}

		if (keyboardInput.isPressed(Key.C) && !previousKeyboardInput.isPressed(Key.C) && gameState.playerState.isDeadFrameCount === null)
			savedGameState = GameStateUtil.getSnapshot(gameState);

		if (keyboardInput.isPressed(Key.X) && !previousKeyboardInput.isPressed(Key.X)) {
			if (savedGameState !== null)
				gameState = GameStateUtil.getSnapshot(savedGameState);
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		GameStateRendering.render(gameState, displayOutput, false);

		if (endLevelCounter !== null) {
			let alpha = endLevelCounter * 3;
			if (alpha > 200)
				alpha = 200;
			displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, { r: 0, g: 0, b: 0, alpha: alpha }, true);
		}
	};

	return {
		getNextFrame: getNextFrameWrapped,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
