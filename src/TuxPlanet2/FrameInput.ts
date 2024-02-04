
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
			up: keyboardInput.isPressed(Key.UpArrow) && !keyboardInput.isPressed(Key.DownArrow),
			down: keyboardInput.isPressed(Key.DownArrow) && !keyboardInput.isPressed(Key.UpArrow),
			left: keyboardInput.isPressed(Key.LeftArrow) && !keyboardInput.isPressed(Key.RightArrow),
			right: keyboardInput.isPressed(Key.RightArrow) && !keyboardInput.isPressed(Key.LeftArrow),
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
