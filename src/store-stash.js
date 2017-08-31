const I18nStore = require('./store')
const {flattenTranslations} = require('./utils')

class StashI18nStore extends I18nStore {
    constructor(stash, moduleName) {
        super(stash, moduleName)
        this.store[this.moduleName] = {
            translations: {},
            locale: '',
        }
    }

    init(Vue) {
        if (!this.store[this.moduleName]) {
            this.setupNamespace()
        }
    }

    get fallback() {
        return this.store[this.moduleName].fallback
    }

    get locale() {
        return this.store[this.moduleName].locale
    }

    get translations() {
        return this.store[this.moduleName].translations
    }

    addLocale(locale, translations) {
        // Reduce the given translations to a single-depth tree.
        this.store[this.moduleName].translations[locale] = flattenTranslations(translations)
        // Make sure to notify vue of changes.
        // This might break with new vue versions.
        if (this.store[this.moduleName].translations.hasOwnProperty('__ob__')) {
            this.store[this.moduleName].translations.__ob__.dep.notify()
        }
    }

    checkLocaleExists(locale) {
        return this.store[this.moduleName].translations.hasOwnProperty(locale)
    }

    getLocale() {
        return this.store[this.moduleName].locale
    }

    removeLocale(locale) {
        // Check if the given locale is present in the state.
        if (this.store[this.moduleName].translations.hasOwnProperty(locale)) {
            // Check if the current locale is the given locale to remove.
            if (this.store[this.moduleName].locale === locale) {
                // Reset the current locale.
                this.store[this.moduleName].locale = null
            }
            // Create a copy of the translations object.
            let translationCopy = Object.assign({}, this.store[this.moduleName].translations)
            // Remove the given locale.
            delete translationCopy[locale]
            // Set the state to the new object.
            this.store[this.moduleName].translations = translationCopy
        }
    }

    setLocale(locale) {
        this.store[this.moduleName].locale = locale
    }

    setFallbackLocale(locale) {
        this.store[this.moduleName].fallback = locale
    }

}

module.exports = StashI18nStore;
