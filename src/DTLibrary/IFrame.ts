
type getNextFrame = (
	keyboardInput: IKeyboard, 
	mouseInput: IMouse, 
	previousKeyboardInput: IKeyboard, 
	previousMouseInput: IMouse,
	displayProcessing: IDisplayProcessing,
	soundOutput: ISoundOutput,
	musicOutput: IMusicOutput,
	thisFrame: IFrame) => IFrame

type IFrame = {
	getNextFrame: getNextFrame,
	render: (display: IDisplayOutput) => void,
	getClickUrl: () => string | null,
	getCompletedAchievements: () => string[] | null
};
