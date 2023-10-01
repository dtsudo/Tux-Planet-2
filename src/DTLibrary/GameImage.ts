
const enum GameImage {
	SoundOn,
	SoundOff,
	MusicOn,
	MusicOff,
	KonqiAir,
	TinyFlame,
	FlyAmanita,
	Ocean,
	Noone,
	ExplodeF2,
	Strawberry,
	Freezewave,
	Poof,
	OwlBrown,
	CyraDoll,
	DashieDoll,
	Iceball,
	Skull,
	BossHealth,
	ExplodeI,
	BouncySnow
}

let GameImageUtil = {
	getImageNames: function (): GameImage[] {
		return [
			GameImage.SoundOn,
			GameImage.SoundOff,
			GameImage.MusicOn,
			GameImage.MusicOff,
			GameImage.KonqiAir,
			GameImage.TinyFlame,
			GameImage.FlyAmanita,
			GameImage.Ocean,
			GameImage.Noone,
			GameImage.ExplodeF2,
			GameImage.Strawberry,
			GameImage.Freezewave,
			GameImage.Poof,
			GameImage.OwlBrown,
			GameImage.CyraDoll,
			GameImage.DashieDoll,
			GameImage.Iceball,
			GameImage.Skull,
			GameImage.BossHealth,
			GameImage.ExplodeI,
			GameImage.BouncySnow
		];
	},
	
	getFilename: function (image: GameImage): string {
		switch (image) {
			case GameImage.SoundOn: return "Kenney/SoundOn.png";
			case GameImage.SoundOff: return "Kenney/SoundOff.png";
			case GameImage.MusicOn: return "Kenney/MusicOn.png";
			case GameImage.MusicOff: return "Kenney/MusicOff.png";
			case GameImage.KonqiAir: return "KelvinShadewing/konqiair.png";
			case GameImage.TinyFlame: return "KelvinShadewing/tinyflame.png";
			case GameImage.FlyAmanita: return "KelvinShadewing/flyamanita.png";
			case GameImage.Ocean: return "KnoblePersona/ocean.png";
			case GameImage.Noone: return "KelvinShadewing/noone.png";
			case GameImage.ExplodeF2: return "KelvinShadewing/explodeF.png";
			case GameImage.Strawberry: return "KelvinShadewing/strawberry.png";
			case GameImage.Freezewave: return "KelvinShadewing/freezewave.png";
			case GameImage.Poof: return "KelvinShadewing/poof.png";
			case GameImage.OwlBrown: return "KelvinShadewing/owl-brown.png";
			case GameImage.CyraDoll: return "KelvinShadewing/cyradoll.png";
			case GameImage.DashieDoll: return "KelvinShadewing/dashie-doll.png";
			case GameImage.Iceball: return "KelvinShadewing/iceball.png";
			case GameImage.Skull: return "KelvinShadewing/skull.png";
			case GameImage.BossHealth: return "KelvinShadewing/boss-health.png";
			case GameImage.ExplodeI: return "KelvinShadewing/explodeI.png";
			case GameImage.BouncySnow: return "KelvinShadewing/bouncysnow.png";
		}
	}
};
