export class Mk {

	constructor() { }

	// Informa o tipo do objeto
	static classof = (o: any): string => {
		let nomeClasse = Object.prototype.toString.call(o).slice(8, -1);
		if (nomeClasse == "Number") {
			if (o.toString() == "NaN") {
				nomeClasse = "NaN";
			}
		}
		return nomeClasse;
	};

	// String qualquer em string com números
	static convertToNumeric = (texto: string): Array<number> => {
		let arrayDeNumeros = [];
		for (const char of texto) {
			arrayDeNumeros.push(char.codePointAt(0) || 0);
		}
		return arrayDeNumeros;
	}

	static convertToTexto = (arrayNumeros: Array<number>): string => {
		return String.fromCodePoint(...arrayNumeros);
	}
	static convertToTexto2 = (stringNumeros: string): string => {
		return String.fromCodePoint(...stringNumeros.split(",").map(i => Number(i)));
	}

	static encod = (input: string) => {
		let nums = Mk.convertToNumeric(input.toString());
		//Key 1234-3142
		let t = 0;
		for (let i = 0; i < nums.length; i = i + 4) {
			if ((i + 4) <= nums.length) {
				t = nums[i];
				nums[i] = nums[i + 2];
				nums[i + 2] = nums[i + 3];
				nums[i + 3] = nums[i + 1];
				nums[i + 1] = t;
				nums[i] % 2 == 0 ? nums[i] = nums[i] + 2 : nums[i] = nums[i] - 2;
				nums[i + 1] % 2 == 0 ? nums[i + 1] = nums[i + 1] + 2 : nums[i + 1] = nums[i + 1] - 2;
				nums[i + 2] % 2 == 0 ? nums[i + 2] = nums[i + 2] + 2 : nums[i + 2] = nums[i + 2] - 2;
				nums[i + 3] % 2 == 0 ? nums[i + 3] = nums[i + 3] + 2 : nums[i + 3] = nums[i + 3] - 2;
			} else {
				if (nums[i]) nums[i] = nums[i] + 1;
				if (nums[i + 1]) nums[i + 1] = nums[i + 1] + 2;
				if (nums[i + 2]) nums[i + 2] = nums[i + 2] + 3;
			}
		}
		for (let i = 0; i < nums.length; i++) {
			nums[i] = nums[i] + i + 3;
		}
		for (let i = 0; i < Math.round(nums.length / 2); i = i + 2) {
			t = nums[i];
			nums[i] = nums[nums.length - i - 1];
			nums[nums.length - i - 1] = t;
		}
		let nums2 = Mk.convertToNumeric(nums.reverse().join());
		for (let i = 0; i < nums2.length; i = i + 4) {
			if ((i + 4) <= nums2.length) {
				t = nums2[i];
				nums2[i] = nums2[i + 2];
				nums2[i + 2] = nums2[i + 3];
				nums2[i + 3] = nums2[i + 1];
				nums2[i + 1] = t;
			}
		}
		return btoa(nums2.join(""));
	}

	static decod = (input: string) => {
		let nums2 = atob(input).toString().replace(/(\d{2})(?=\d)/g, '$1,').split(",").map(i => Number(i));
		let t = 0;
		for (let i = 0; i < nums2.length; i = i + 4) {
			if ((i + 4) <= nums2.length) {
				t = nums2[i];
				nums2[i] = nums2[i + 1];
				nums2[i + 1] = nums2[i + 3];
				nums2[i + 3] = nums2[i + 2];
				nums2[i + 2] = t;
			}
		}
		let nums = Mk.convertToTexto(nums2).split(",").reverse().map(i => Number(i));

		for (let i = 0; i < Math.round(nums.length / 2); i = i + 2) {
			t = nums[i];
			nums[i] = nums[nums.length - i - 1];
			nums[nums.length - i - 1] = t;
		}
		for (let i = 0; i < nums.length; i++) {
			nums[i] = nums[i] - i - 3;
		}
		t = 0;
		for (let i = 0; i < nums.length; i = i + 4) {
			if ((i + 4) <= nums.length) {
				nums[i] % 2 == 0 ? nums[i] = nums[i] - 2 : nums[i] = nums[i] + 2;
				nums[i + 1] % 2 == 0 ? nums[i + 1] = nums[i + 1] - 2 : nums[i + 1] = nums[i + 1] + 2;
				nums[i + 2] % 2 == 0 ? nums[i + 2] = nums[i + 2] - 2 : nums[i + 2] = nums[i + 2] + 2;
				nums[i + 3] % 2 == 0 ? nums[i + 3] = nums[i + 3] - 2 : nums[i + 3] = nums[i + 3] + 2;
				t = nums[i];
				nums[i] = nums[i + 1];
				nums[i + 1] = nums[i + 3];
				nums[i + 3] = nums[i + 2];
				nums[i + 2] = t;
			} else {
				if (nums[i]) nums[i] = nums[i] - 1;
				if (nums[i + 1]) nums[i + 1] = nums[i + 1] - 2;
				if (nums[i + 2]) nums[i + 2] = nums[i + 2] - 3;
			}
		}
		return Mk.convertToTexto(nums);
	}
}