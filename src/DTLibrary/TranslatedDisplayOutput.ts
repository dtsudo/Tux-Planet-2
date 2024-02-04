
let TranslatedDisplayOutput = {
	getTranslatedDisplayOutput: function (displayOutput: IDisplayOutput, xOffsetInPixels: number, yOffsetInPixels: number): IDisplayOutput {

		let drawRectangle = function (x: number, y: number, width: number, height: number, color: DTColor, fill: boolean): void {
			displayOutput.drawRectangle(x + xOffsetInPixels, y + yOffsetInPixels, width, height, color, fill);
		};

		let drawText = function (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor): void {
			displayOutput.drawText(x + xOffsetInPixels, y + yOffsetInPixels, text, font, fontSize, color);
		};

		let tryDrawText = function (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor): void {
			displayOutput.tryDrawText(x + xOffsetInPixels, y + yOffsetInPixels, text, font, fontSize, color);
		};

		let drawImage = function (image: GameImage, x: number, y: number): void {
			displayOutput.drawImage(image, x + xOffsetInPixels, y + yOffsetInPixels);
		};

		let drawImageRotatedClockwise = function (
				image: GameImage,
				imageX: number,
				imageY: number,
				imageWidth: number,
				imageHeight: number,
				x: number,
				y: number,
				degreesScaled: number,
				scalingFactorScaled: number): void {
			displayOutput.drawImageRotatedClockwise(image, imageX, imageY, imageWidth, imageHeight, x + xOffsetInPixels, y + yOffsetInPixels, degreesScaled, scalingFactorScaled);
		};

		let getWidth = function (image: GameImage): number {
			return displayOutput.getWidth(image);
		};

		let getHeight = function (image: GameImage): number {
			return displayOutput.getHeight(image);
		};

		return {
			drawRectangle,
			drawText,
			tryDrawText,
			drawImage,
			drawImageRotatedClockwise,
			getWidth,
			getHeight
		};
	}
};
