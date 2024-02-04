
type Button = {
	processFrame: (mouseInput: IMouse) => { wasClicked: boolean },
	render: (displayOutput: IDisplayOutput) => void
}

type getButtonInput = {
	x: number,
	y: number,
	width: number,
	height: number,
	backgroundColor: DTColor,
	hoverColor: DTColor,
	clickColor: DTColor,
	text: string,
	textXOffset: number,
	textYOffset: number,
	font: GameFont,
	fontSize: number
}

let ButtonUtil = {
	STANDARD_PRIMARY_BACKGROUND_COLOR: { r: 235, g: 235, b: 235, alpha: 255 },
	STANDARD_SECONDARY_BACKGROUND_COLOR: { r: 200, g: 200, b: 200, alpha: 255 },
	STANDARD_HOVER_COLOR: { r: 250, g: 249, b: 200, alpha: 255 },
	STANDARD_CLICK_COLOR: { r: 252, g: 251, b: 154, alpha: 255 },

	getButton: function ({ x, y, width, height, backgroundColor, hoverColor, clickColor, text, textXOffset, textYOffset, font, fontSize }: getButtonInput): Button {

		let previousMouseInput: IMouse | null = null;
		let isHover = false;
		let isClicked = false;

		let isMouseInRange = function (mouseInput: IMouse): boolean {
			let mouseX = mouseInput.getX();
			let mouseY = mouseInput.getY();

			return x <= mouseX
				&& mouseX <= x + width
				&& y <= mouseY
				&& mouseY <= y + height;
		};

		let processFrame = function (mouseInput: IMouse) {

			let didUserClickOnButton = false;

			if (isMouseInRange(mouseInput)) {
				isHover = true;

				if (mouseInput.isLeftMouseButtonPressed() && previousMouseInput !== null && !previousMouseInput.isLeftMouseButtonPressed())
					isClicked = true;

				if (isClicked && !mouseInput.isLeftMouseButtonPressed() && previousMouseInput !== null && previousMouseInput.isLeftMouseButtonPressed())
					didUserClickOnButton = true;

			} else {
				isHover = false;
			}

			if (!mouseInput.isLeftMouseButtonPressed())
				isClicked = false;

			previousMouseInput = CopiedMouse.getSnapshot(mouseInput);

			return {
				wasClicked: didUserClickOnButton
			};
		};

		let render = function (displayOutput: IDisplayOutput): void {

			let color: DTColor = backgroundColor;
			if (isHover)
				color = hoverColor;
			if (isClicked)
				color = clickColor;

			displayOutput.drawRectangle(
				x,
				y,
				width,
				height,
				color,
				true);

			displayOutput.drawRectangle(
				x,
				y,
				width,
				height,
				black,
				false);

			displayOutput.drawText(
				x + textXOffset,
				y + height - textYOffset,
				text,
				font,
				fontSize,
				black);
		};

		return {
			processFrame,
			render
		};
	}
};
