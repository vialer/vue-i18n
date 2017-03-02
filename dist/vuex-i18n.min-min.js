!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.vuexI18n=n()}(this,function(){"use strict";function t(t){return!!t&&Array===t.constructor}function n(t){return!!t&&Array===t.constructor}var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o={state:{locale:null,fallback:null,translations:{}},mutations:{SET_LOCALE:function t(n,e){n.locale=e.locale},ADD_LOCALE:function t(n,e){var o=r(e.translations);n.translations[e.locale]=o},REMOVE_LOCALE:function t(n,e){if(n.translations.hasOwnProperty(e.locale)){n.locale===e.locale&&(n.locale=null);var o=Object.assign({},n.translations);delete o[e.locale],n.translations=o}},SET_FALLBACK_LOCALE:function t(n,e){n.fallback=e.locale}},actions:{setLocale:function t(n,e){n.commit({type:"SET_LOCALE",locale:e.locale})},addLocale:function t(n,e){n.commit({type:"ADD_LOCALE",locale:e.locale,translations:e.translations})},removeLocale:function t(n,e){n.commit({type:"REMOVE_LOCALE",locale:e.locale,translations:e.translations})},setFallbackLocale:function t(n,e){n.commit({type:"SET_FALLBACK_LOCALE",locale:e.locale})}}},r=function n(o){var r={};for(var a in o)if(o.hasOwnProperty(a)){var l=e(o[a]);if(t(o[a])){for(var i=o[a].length,c=0;c<i;c++){var s=e(o[a][c]);if("string"!==s){console.warn("vuex-i18n:","currently only arrays of strings are fully supported",o[a]);break}}r[a]=o[a]}else if("object"==l&&null!==l){var u=n(o[a]);for(var f in u)u.hasOwnProperty(f)&&(r[a+"."+f]=u[f])}else r[a]=o[a]}return r},a={};a.install=function t(n,e){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"i18n";if(e.state.hasOwnProperty(o)===!1)return console.error("i18n vuex module is not correctly initialized. Please check the module name:",o),n.prototype.$i18n=function(t){return t},n.prototype.$getLanguage=function(){return null},void(n.prototype.$setLanguage=function(){console.error("i18n vuex module is not correctly initialized")});var r=function t(n,r,l){var i=e.state[o].locale;return a(i,n,r,l)},a=function t(n,r,a,l){var c=e.state[o].fallback,s=e.state[o].translations,u=!0;return s.hasOwnProperty(n)===!1?u=!1:s[n].hasOwnProperty(r)===!1&&(u=!1),u===!0?i(s[n][r],a,l):s.hasOwnProperty(c)===!1?i(r,a,l):s[c].hasOwnProperty(r)===!1?i(r,a,l):i(s[c][r],a,l)},l=function t(n){e.dispatch({type:"setFallbackLocale",locale:n})},c=function t(n){e.dispatch({type:"setLocale",locale:n})},s=function t(){return e.state[o].locale},u=function t(n,o){return e.dispatch({type:"addLocale",locale:n,translations:o})},f=function t(n){e.state[o].translations.hasOwnProperty(n)&&e.dispatch({type:"removeLocale",locale:n})},p=function t(n){return e.state[o].translations.hasOwnProperty(n)};n.prototype.$i18n={locale:s,set:c,add:u,remove:f,fallback:l,exists:p},n.i18n={locale:s,set:c,add:u,remove:f,fallback:l,exists:p,translate:r,translateIn:a},n.prototype.$t=r,n.prototype.$tlang=a,n.filter("translate",r)};var l=function t(n,e){var o=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return n.replace?n.replace(/\{\w+\}/g,function(t){var r=t.replace("{","").replace("}","");return void 0!==e[r]?e[r]:(o===!0&&(console.group("Not all placeholder founds"),console.warn("Text:",n),console.warn("Placeholder:",t),console.groupEnd()),t)}):n},i=function t(o){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,i="undefined"==typeof o?"undefined":e(o),c="undefined"==typeof a?"undefined":e(a),s=function t(){return n(o)?o.map(function(t){return l(t,r,!1)}):"string"===i?l(o,r):void 0};if(null===a)return s();if("number"!==c)return console.warn("pluralization is not a number"),s();var u=s().split(":::");return 1===a?u[0].trim():u.length>1?u[1].trim():(console.warn("no pluralized translation provided in ",o),u[0].trim())},c={store:o,plugin:a};return c});