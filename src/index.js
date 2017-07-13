// renderFn will initialize a function to render the variable substitutions in
// the translation string. identifiers specify the tags will be used to find
// variable substitutions, i.e. {test} or {{test}}, note that we are using a
// closure to avoid recompilation of the regular expression to match tags on
// every render cycle.
let renderFn = function(identifiers) {
	if (identifiers == null || identifiers.length != 2) {
		console.warn('You must specify the start and end character identifying variable substitutions');
	}

	// Construct a regular expression ot find variable substitutions, i.e. {test}.
	let matcher = new RegExp('' + identifiers[0] + '\\w+' + identifiers[1], 'g');

	// Define the replacement function.
	let replace = function replace(translation, replacements, warn = true) {

		// Check if the object has a replace property.
		if (!translation.replace) {
			return translation
		}

		return translation.replace(matcher, function(placeholder) {
			// Remove the identifiers (can be set on the module level).
			let key = placeholder.replace(identifiers[0], '').replace(identifiers[1], '')
			if (replacements[key] !== undefined) {
				return replacements[key]
			}

			// Warn user that the placeholder has not been found.
			if (warn === true) {
				console.group('Not all placeholders found')
				console.warn('Text:', translation)
				console.warn('Placeholder:', placeholder)
				console.groupEnd()
			}

			// Return the original placeholder.
			return placeholder
		});
	};

	// the render function will replace variable substitutions and prepare the
	// translations for rendering
	let render = function render(translation, replacements = {}, pluralization = null) {

		// get the type of the property
		let objType = typeof translation;
		let pluralizationType = typeof pluralization;

		let replacedText = function() {
			if (Array.isArray(translation)) {

				// replace the placeholder elements in all sub-items
				return translation.map((item) => {
					return replace(item, replacements, false);
				});

			} else if (objType === 'string') {
				return replace(translation, replacements, true);
			}

		};

			// return translation item directly
		if (pluralization === null) {
			return replacedText()
		}

		// check if pluralization value is countable
		if (pluralizationType !== 'number') {
			console.warn('pluralization is not a number')
			return replacedText()
		}

		// check for pluralization and return the correct part of the string
		let translatedText = replacedText().split(':::')

		// return the left side on singular, the right side for plural
		// 0 has plural notation
		if (pluralization === 1) {
			return translatedText[0].trim()
		}

		// use singular version for -1 as well
		if (pluralization === -1) {
			return translatedText[0].trim()
		}

		if (translatedText.length > 1) {
			return translatedText[1].trim()
		}

		console.warn('no pluralized translation provided in ', translation)
		return translatedText[0].trim()

	};

	// Return the render function to the caller.
	return render
}


// initialize the plugin object
let VuexI18nPlugin = {};

// Internationalization plugin for vue js using an adapter interface to
// several stores; e.g. vuex & vue-stash.
VuexI18nPlugin.install = function install(Vue, store, identifiers = ['{', '}']) {
    store.init(Vue)

    // Initialize the replacement function.
    let render = renderFn(identifiers)

	// Get localized string from store in a given language if available.
	let translateInLanguage = function translateInLanguage(locale, key, options, pluralization) {
		// Get the current language from the store.
		let fallback = store.fallback
		let translations = store.translations

		// Flag for translation to exist or not.
		let translationExist = true

		// Check if the language exists in the store.
        // Return the key if not.
		if (translations.hasOwnProperty(locale) === false ) {
			translationExist = false
		} else if (translations[locale].hasOwnProperty(key) === false) {
            // Check if the key exists in the store. return the key if not.
			translationExist = false
		}

		// Return the value from the store.
		if (translationExist === true) {
			return render(translations[locale][key], options, pluralization)
		}

		// Check if a vaild fallback exists in the store.
        // Return the key if not.
		if (translations.hasOwnProperty(fallback) === false ) {
			return render(key, options, pluralization)
		}

		// Check if the key exists in the fallback in the store.
        // Return the key if not.
		if (translations[fallback].hasOwnProperty(key) === false) {
			return render(key, options, pluralization)
		}

		return render(translations[fallback][key], options, pluralization)
	}

    // Get localized string from store.
    let translate = function $t(key, options, pluralization) {
        // Get the current language from the store.
        let locale = store.getLocale()
        return translateInLanguage(locale, key, options, pluralization);
    }

	// Check if the given key exists in the current locale.
	let checkKeyExists = function checkKeyExists(key) {

		// Get the current language from the store.
		let locale = store.locale
		let fallback = store.fallback
		let translations = store.translations

		// Check if the language exists in the store.
		if (translations.hasOwnProperty(locale) === false ) {
			// Check if a fallback locale exists.
			if (translations.hasOwnProperty(fallback) === false ) {
				return false
			}

			// Check the fallback locale for the key.
			return translations[fallback].hasOwnProperty(key)
		}

		// Check if the key exists in the store.
		return translations[locale].hasOwnProperty(key)
	};

	// Set fallback locale.
	let setFallbackLocale = function setFallbackLocale(locale) {
        store.setFallbackLocale(locale)
	}

	// Set the current locale.
	let setLocale = function setLocale(locale) {
        store.setLocale(locale)
	}

	// Get the current locale.
	let getLocale = function getLocale() {
		return store.getLocale()
	};

	// Add predefined translations to the store.
	let addLocale = function addLocale(locale, translations) {
        store.addLocale(locale, translations)
	}

	// remove the givne locale from the store
	let removeLocale = function removeLocale(locale) {
        store.removeLocale(locale)
	}

	// Check if the given locale is already loaded.
	let checkLocaleExists = function checkLocaleExists(locale) {
		return store.checkLocaleExists(locale)
	};

	// Register vue prototype methods.
	Vue.prototype.$i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale,
		remove: removeLocale,
		fallback: setFallbackLocale,
		localeExists: checkLocaleExists,
		keyExists: checkKeyExists,
	};

	// Register global methods.
	Vue.i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale,
		remove: removeLocale,
		fallback: setFallbackLocale,
		translate: translate,
		translateIn: translateInLanguage,
		localeExists: checkLocaleExists,
		keyExists: checkKeyExists,
	};

	// Register the translation function on the vue instance.
	Vue.prototype.$t = translate
	// Register the specific language translation function on the vue instance.
	Vue.prototype.$tlang = translateInLanguage

	// Register a filter function for translations.
	Vue.filter('translate', translate)
}

module.exports = VuexI18nPlugin
