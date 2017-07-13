const {flattenTranslations} = require('./utils')


// Define a simple vuex module to handle locale translations.
const i18nVuexModule = {
	state: {
		locale: null,
		fallback: null,
		translations: {},
	},
	mutations: {
		// set the current locale
		SET_LOCALE(state, payload) {
			state.locale = payload.locale
		},

		// add a new locale
		ADD_LOCALE(state, payload) {
			// reduce the given translations to a single-depth tree
			var translations = flattenTranslations(payload.translations)
			state.translations[payload.locale] = translations
			// Make sure to notify vue of changes.
            // This might break with new vue versions.
			state.translations.__ob__.dep.notify()
		},

		// Remove a new locale.
		REMOVE_LOCALE(state, payload) {
			// Check if the given locale is present in the state.
			if (state.translations.hasOwnProperty(payload.locale)) {
				// Check if the current locale is the given locale to remove.
				if (state.locale === payload.locale) {
					// reset the current locale
					state.locale = null
				}
				// Create a copy of the translations object.
				let translationCopy = Object.assign({}, state.translations)
				// Remove the given locale.
				delete translationCopy[payload.locale]
				// Set the state to the new object.
				state.translations = translationCopy

			}
		},
		SET_FALLBACK_LOCALE(state, payload) {
			state.fallback = payload.locale
		},
	},
	actions: {
		// set the current locale
		setLocale(context, payload) {
			context.commit({
				type: 'SET_LOCALE',
				locale: payload.locale,
			})
		},

		// Add a new locale with translations.
		addLocale(context, payload) {
			context.commit({
				type: 'ADD_LOCALE',
				locale: payload.locale,
				translations: payload.translations,
			})
		},

		// Remove the given locale translations.
		removeLocale(context, payload) {
			context.commit({
				type: 'REMOVE_LOCALE',
				locale: payload.locale,
				translations: payload.translations,
			})
		},

		setFallbackLocale(context, payload) {
			context.commit({
				type: 'SET_FALLBACK_LOCALE',
				locale: payload.locale,
			})
		},
	},
}


/* vuex-i18n-store defines a vuex module to store locale translations. Make sure
** to also include the file vuex-i18n.js to enable easy access to localized
** strings in your vue components.
*/
const I18nStore = require('./store')


class VuexI18nStore extends I18nStore {
    constructor(vuexInstance, moduleName = 'i18n') {
        super(vuexInstance, moduleName)
        this.store.registerModule(moduleName, vuexInstance)
    }

    init() {
        // check if the plugin was correctly initialized
        if (this.store.state.hasOwnProperty(this.moduleName) === false) {
            console.error('i18n vuex module not correctly initialized. Check the module name:', this.moduleName)
            this.setupNamespace()
            return
        }
    }

    get fallback() {
        return this.store.state[this.moduleName].fallback
    }

    get locale() {
        return this.store.state[this.moduleName].locale
    }


    get translations() {
        return this.store.state[this.moduleName].translations
    }

    getLocale() {
        return this.store.state[this.moduleName].locale
    }

    addLocale(locale, translations) {
        return this.store.dispatch({
			type: 'addLocale',
			locale: locale,
			translations: translations,
		})
    }

    checkLocaleExists(locale) {
        return this.store.state[this.moduleName].translations.hasOwnProperty(locale)
    }

    removeLocale(locale) {
        if (this.store.state[this.moduleName].translations.hasOwnProperty(locale)) {
			this.store.dispatch({
				type: 'removeLocale',
				locale: locale,
			})
		}
    }

    setLocale(locale) {
        this.store.dispatch({
			type: 'setLocale',
			locale: locale,
		})
    }

    setFallbackLocale(locale) {
        this.store.dispatch({
			type: 'setFallbackLocale',
			locale: locale,
		})
    }
}

module.exports = VuexI18nStore
