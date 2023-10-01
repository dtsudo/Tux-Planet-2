
// REVIEW ME

type FrameInput = {
	up: boolean,
	down: boolean,
	left: boolean,
	right: boolean,
	shoot: boolean,
	continueDialogue: boolean
}

let FrameInputUtil = {
	getFrameInput: function (keyboardInput: IKeyboard, previousKeyboardInput: IKeyboard): FrameInput {
		return {
			up: keyboardInput.isPressed(Key.UpArrow),
			down: keyboardInput.isPressed(Key.DownArrow),
			left: keyboardInput.isPressed(Key.LeftArrow),
			right: keyboardInput.isPressed(Key.RightArrow),
			shoot: keyboardInput.isPressed(Key.Z),
			continueDialogue: keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)
		};
	},

	getEmptyFrameInput: function () {
		return {
			up: false,
			down: false,
			left: false,
			right: false,
			shoot: false,
			continueDialogue: false
		};
	}
};
