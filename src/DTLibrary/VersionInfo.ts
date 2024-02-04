
type Version = {
	version: string,
	alphanumericVersionGuid: string
};

let VersionInfo: { getVersionHistory: () => Version[], getCurrentVersion: () => Version } = {} as any;

VersionInfo.getVersionHistory = function (): Version[] {
	"use strict";

	return [
		{ version: "1.00", alphanumericVersionGuid: "ad3452c3176b8ec393baa35ec5ec3fd1" }
	];
};

VersionInfo.getCurrentVersion = function (): Version {
	"use strict";

	let versionHistory = VersionInfo.getVersionHistory();
	return versionHistory[versionHistory.length - 1];
};

