
type IDisplay = IDisplayProcessing & IDisplayOutput;

type IDisplayProcessing = {
	load: () => boolean,
	getWidth: (image: GameImage) => number,
	getHeight: (image: GameImage) => number
}

type IDisplayOutput = {
	drawRectangle: (x: number, y: number, width: number, height: number, color: DTColor, fill: boolean) => void,
	drawText: (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor) => void,
	tryDrawText: (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor) => void,
	drawImage: (image: GameImage, x: number, y: number) => void,
	drawImageRotatedClockwise: (
		image: GameImage,
		imageX: number,
		imageY: number,
		imageWidth: number,
		imageHeight: number,
		x: number,
		y: number,
		degreesScaled: number,
		scalingFactorScaled: number)
			=> void,
	getWidth: (image: GameImage) => number,
	getHeight: (image: GameImage) => number
}
