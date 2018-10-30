// flattenTranslations will convert object trees for translations into a
// single-depth object tree
const flattenTranslations = function flattenTranslations(translations) {

	let toReturn = {};

	for (let i in translations) {

		// check if the property is present
		if (!translations.hasOwnProperty(i)) {
			continue;
		}

		// get the type of the property
		let objType = typeof translations[i]

		// allow unflattened array of strings
		if (Array.isArray(translations[i])) {
			let count = translations[i].length

			for (let index = 0; index < count; index++) {
				let itemType = typeof translations[i][index]
				if (itemType !== 'string') {
					console.warn('vue-i18n:', 'currently only arrays of strings are fully supported', translations[i])
					break
				}
			}

			toReturn[i] = translations[i]

		} else if (objType === 'object' && objType !== null) {
			let flatObject = flattenTranslations(translations[i])
			for (let x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue
				toReturn[i + '.' + x] = flatObject[x]
			}

		} else {
			toReturn[i] = translations[i]
		}
	}
	return toReturn
};


module.exports = {
    flattenTranslations: flattenTranslations,
}
