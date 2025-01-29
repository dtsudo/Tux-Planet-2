
let ReplayFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState, frameInputHistory: FrameInputHistory, level: Level, difficulty: Difficulty, displayProcessing: IDisplayProcessing) => IFrame } = {} as any;

ReplayFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState, frameInputHistory: FrameInputHistory, level: Level, difficulty: Difficulty, displayProcessing: IDisplayProcessing): IFrame {

	let gameState = GameStateUtil.getInitialGameState(level, difficulty, displayProcessing);
	let savedGameState: GameState | null = null;
	let skipFrameCount = 0;

	let frameInputs: { [index: number]: FrameInput } = {};

	let endLevelCounter: number | null = null;

	((function () {
		let currentFrameInput = frameInputHistory;
		while (true) {
			frameInputs[currentFrameInput.index] = currentFrameInput.frameInput;
			if (currentFrameInput.previousFrameInputs === null)
				return;
			currentFrameInput = currentFrameInput.previousFrameInputs;
		}
	})());

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) 
			return ReplayPauseMenuFrame.getFrame(globalState, sessionState, thisFrame, gameState.level, gameState.difficulty, frameInputHistory);

		let frame = getNextFrameHelper({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame });

		if (!keyboardInput.isPressed(Key.Shift))
			frame = getNextFrameHelper({ keyboardInput, mouseInput, previousKeyboardInput: keyboardInput, previousMouseInput: mouseInput, displayProcessing, soundOutput, musicOutput, thisFrame });

		if (keyboardInput.isPressed(Key.Z) && !keyboardInput.isPressed(Key.Shift)) {
			let emptyKeyboard = EmptyKeyboard.getEmptyKeyboard();
			let emptyMouse = EmptyMouse.getEmptyMouse();
			for (let i = 0; i < 8; i++) {
				frame = getNextFrameHelper({ keyboardInput: emptyKeyboard, mouseInput: emptyMouse, previousKeyboardInput: emptyKeyboard, previousMouseInput: emptyMouse, displayProcessing, soundOutput, musicOutput, thisFrame });
			}
		}

		if (globalState.debugMode && keyboardInput.isPressed(Key.One)) {
			let emptyKeyboard = EmptyKeyboard.getEmptyKeyboard();
			let emptyMouse = EmptyMouse.getEmptyMouse();
			for (let i = 0; i < 80; i++) {
				frame = getNextFrameHelper({ keyboardInput: emptyKeyboard, mouseInput: emptyMouse, previousKeyboardInput: emptyKeyboard, previousMouseInput: emptyMouse, displayProcessing, soundOutput, musicOutput, thisFrame });
			}
		}

		if (endLevelCounter !== null)
			endLevelCounter++;

		if (endLevelCounter === GameFrame.END_LEVEL_NUM_FRAMES_TO_WAIT)
			return LevelCompleteFrame.getFrame(globalState, sessionState, thisFrame, gameState.level, gameState.difficulty, frameInputHistory);

		return frame;
	};

	let getNextFrameHelper: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

		if (keyboardInput.isPressed(Key.X) && endLevelCounter === null) {
			if (savedGameState !== null) {
				gameState = GameStateUtil.getSnapshot(savedGameState);
				return thisFrame;
			}
		}

		let shouldExecuteFrame = true;

		if (keyboardInput.isPressed(Key.Shift)) {
			skipFrameCount++;
			if (skipFrameCount === 2) {
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
					left: false,
					right: false,
					shoot: false,
					continueDialogue: false,
					debug_toggleInvulnerability: false
				};

			let result = GameStateProcessing.processFrame(gameState, frameInput, soundOutput, musicOutput);
			if (result.shouldEndLevel && endLevelCounter === null)
				endLevelCounter = 0;
		}

		if (keyboardInput.isPressed(Key.C) && gameState.playerState.isDeadFrameCount === null)
			savedGameState = GameStateUtil.getSnapshot(gameState);

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		let debug_renderDamageboxes = false;
		let debug_renderHitboxes = false;
		GameStateRendering.render(gameState, displayOutput, false, debug_renderDamageboxes, debug_renderHitboxes);

		if (endLevelCounter !== null) {
			let alpha = GameFrame.getAlphaForEndLevelFadeOut(endLevelCounter);
			displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, { r: 0, g: 0, b: 0, alpha: alpha }, true);
		}
	};

	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
