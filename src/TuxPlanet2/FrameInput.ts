
type FrameInput = {
	up: boolean,
	down: boolean,
	left: boolean,
	right: boolean,
	shoot: boolean,
	continueDialogue: boolean,
	debug_toggleInvulnerability: boolean
}

let FrameInputUtil = {
	getFrameInput: function (keyboardInput: IKeyboard, previousKeyboardInput: IKeyboard, debugMode: boolean): FrameInput {

		let debug_toggleInvulnerability = false;

		if (debugMode) {
			if (keyboardInput.isPressed(Key.I) && !previousKeyboardInput.isPressed(Key.I))
				debug_toggleInvulnerability = true;
		}

		return {
			up: keyboardInput.isPressed(Key.UpArrow) && !keyboardInput.isPressed(Key.DownArrow),
			down: keyboardInput.isPressed(Key.DownArrow) && !keyboardInput.isPressed(Key.UpArrow),
			left: keyboardInput.isPressed(Key.LeftArrow) && !keyboardInput.isPressed(Key.RightArrow),
			right: keyboardInput.isPressed(Key.RightArrow) && !keyboardInput.isPressed(Key.LeftArrow),
			shoot: keyboardInput.isPressed(Key.Z),
			continueDialogue: keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z),
			debug_toggleInvulnerability: debug_toggleInvulnerability
		};
	},

	getEmptyFrameInput: function (): FrameInput {
		return {
			up: false,
			down: false,
			left: false,
			right: false,
			shoot: false,
			continueDialogue: false,
			debug_toggleInvulnerability: false
		};
	}
};
