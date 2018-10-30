class I18nStore {
    constructor(store, moduleName = 'i18n') {
        this.moduleName = moduleName
        this.store = store
    }


    init(Vue) {}


    getLocale() {}


    setupNamespace() {
        // always return the key if module is not initialized correctly
        Vue.prototype.$i18n = function(key) {
            return key
        }

        Vue.prototype.$getLanguage = function() {
            return null
        }

        Vue.prototype.$setLanguage = function() {
            console.error('vue-i18n module is not correctly initialized')
        }
    }
}

module.exports = I18nStore
