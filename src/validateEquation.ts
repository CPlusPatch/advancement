import "../types/types.d.ts";

function findAtoms(molecule: string): AtomList {
	var atoms: AtomList = []
/* 	for part in molecule.split(","):
		if part.find("_") == -1:
			part = part + "_1"
		atoms[part.split("_")[0]] = int(part.split("_")[1]) */
	for (var part of molecule.split(",")) {
		if (part.indexOf("_") == -1)
			part = part + "_1";
		atoms.push({
			name: part.split("_")[0],
			value: Number.parseInt(part.split("_")[1])
		});
	}
	return atoms
}

function applyCoeff(atoms: AtomList, coeff: number): AtomList {
	var atoms_copy: AtomList = JSON.parse(JSON.stringify(atoms)) // Avoid making a pointer of the variable
	
	for (var atom of atoms_copy) {
		atom.value *= coeff
	}
	return atoms_copy
}

function getAllAtomsInSide(atoms_1: AtomList, atoms_2: AtomList): AtomList {
	var atoms: AtomList = []
/* 	for atom in atoms_1:
		try:
			atoms[atom] += atoms_1[atom]
		except:
			atoms[atom]	= atoms_1[atom]
	for atom in atoms_2:
		try:
			atoms[atom] += atoms_2[atom]
		except:
			atoms[atom]	= atoms_2[atom] */
	for (const atom of atoms_1) {
		var isFound = -1
		for(var i = 0; i < atoms.length; i++) {
			if (atom.name == atoms[i].name) isFound = i;
		}
		if (isFound > -1) atoms[isFound].value += atom.value;
		else atoms.push(atom)
	}

	for (const atom of atoms_2) {
		var isFound = -1;
		for (var i = 0; i < atoms.length; i++) {
			if (atom.name == atoms[i].name) isFound = i;
		}
		if (isFound > -1) atoms[isFound].value += atom.value;
		else atoms.push(atom);
	}
	
	return atoms
}

function areAtomsEqual(atoms_1: AtomList, atoms_2: AtomList): boolean {
	var atoms1: AtomList = JSON.parse(JSON.stringify(atoms_1));
	var atoms2: AtomList = JSON.parse(JSON.stringify(atoms_2));
	atoms1.sort((a: Atom, b: Atom) => {
		let fa: string = a.name.toLowerCase(),
			fb: string = b.name.toLowerCase();
		
		if (fa < fb) {
			return -1;
		}
		if (fa > fb) {
			return 1;
		}
		return 0;
	})
	atoms2.sort((a: Atom, b: Atom) => {
		let fa: string = a.name.toLowerCase(),
			fb: string = b.name.toLowerCase();

		if (fa < fb) {
			return -1;
		}
		if (fa > fb) {
			return 1;
		}
		return 0;
	});

	return JSON.stringify(atoms1) == JSON.stringify(atoms2); // Check if they are equal (cannot d it with a normal equals)
}

function bruteForceFindCoeffs(
	atoms_a: AtomList,
	atoms_b: AtomList,
	atoms_c: AtomList,
	atoms_d: AtomList,
	MAX_COEFF: number
): number[] {
	for (var n = 1; n < MAX_COEFF; n++) {
		for (var m = 1; m < MAX_COEFF; m++) {
			for (var j = 1; j < MAX_COEFF; j++) {
				for (var k = 1; k < MAX_COEFF; k++) {
					if (
						areAtomsEqual(
							getAllAtomsInSide(
								applyCoeff(atoms_a, n),
								applyCoeff(atoms_b, m)
							),
							getAllAtomsInSide(
								applyCoeff(atoms_c, j),
								applyCoeff(atoms_d, k)
							)
						)
					)
						return [n, m, j, k];
				}
			}
		}
	}
	return [];
}



export default function validateEquation(event: any, setResult: Function) {
	var equation: string = event.target.value.trim();

	if (equation == "")
		equation = "C_7,H_16 + O_2 = C,O_2 + H_2,O"; // Default value

	const reactifs: string = equation.split("=")[0].trim() // Find reactifs
	const produits: string = equation.split("=")[1].trim() // Find products

	const a: string = reactifs.split("+")[0].trim()
	const b: string = reactifs.split("+")[1].trim()
	const c: string = produits.split("+")[0].trim()
	const d: string = produits.split("+")[1].trim()

	const atoms_a: AtomList = findAtoms(a);
	const atoms_b: AtomList = findAtoms(b);
	const atoms_c: AtomList = findAtoms(c);
	const atoms_d: AtomList = findAtoms(d);

	const MAX_COEFF: number = 15;

	console.log(
		areAtomsEqual(getAllAtomsInSide(applyCoeff(atoms_a, 1), applyCoeff(atoms_b, 11)),
			getAllAtomsInSide(applyCoeff(atoms_c, 7), applyCoeff(atoms_d, 8)))
	);

	const answers = bruteForceFindCoeffs(atoms_a, atoms_b, atoms_c, atoms_d, MAX_COEFF);
	setResult({
		coeffs: answers,
		a: a,
		b: b,
		c: c,
		d: d
	});
}