
type PlayerBullet = {
	xMibi: number,
	yMibi: number,
	xSpeedInMibipixelsPerFrame: number,
	ySpeedInMibipixelsPerFrame: number,
	displayRotationScaled: number,
	animationOffset: number
}

type PlayerBulletState = {
	playerBullets: PlayerBullet[]
}
