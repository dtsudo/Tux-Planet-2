
let FileIO: { persistData: (fileId: number, version: Version, byteList: number[]) => void, fetchData: (fileId: number, version: Version) => number[] | null } = {} as any;

((function () {
	"use strict"; 

	let getNamespace = function (fileId: number, version: Version): string {
		return "guid" + version.alphanumericVersionGuid + "_file" + fileId;
	};

	let convertToBase64 = function (byteList: number[]): string {
		let stringArray: string[] = [];
		for (let i = 0; i < byteList.length; i++)
			stringArray.push(String.fromCharCode(byteList[i]));
		
		let str = stringArray.join("");
		return btoa(str);
	};

	let convertFromBase64 = function (str: string): number[] {
		let result = atob(str);

		let returnValue: number[] = [];

		for (let i = 0; i < result.length; i++) {
			returnValue.push(result.charCodeAt(i));
		}

		return returnValue;
	};

	FileIO.persistData = function (fileId: number, version: Version, byteList: number[]): void {
		let namespace: string = getNamespace(fileId, version);
		let base64Data: string = convertToBase64(byteList);

		try {
			localStorage.setItem(namespace, base64Data);
		} catch (error) {
			// do nothing
		}
	};

	FileIO.fetchData = function (fileId: number, version: Version): number[] | null {
		let namespace: string = getNamespace(fileId, version);

		try {
			let value = localStorage.getItem(namespace);

			if (value === null)
				return null;

			return convertFromBase64(value);
		} catch (error) {
			return null;
		}
	};
})());
