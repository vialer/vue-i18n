# vue-i18n-stash
This is a fork of the awesome [vuex-i18n](https://github.com/dkfbasel/vuex-i18n) i18n plugin
for Vue. It reuses the same i18n functionality but has vue-stash as a store backend.

## Requirements
- Vue ^2.0.0
- Vue-stash ^v2.0.1-beta


## Installation
```
$ npm install vue-i18n-stash
```

## Setup
The vue-i18n-stash plugin is intended to be used for applications that use Vue-stash as
store and require localized messages. Make sure that both Vue and Vue-stash have
been loaded beforehand.

The plugin does not make any assumption on how you want to load the localization
information. It can be loaded on start in your application bundle or dynamically
after when the user is switching to a different language.


## Usage
The plugin provides easy access to localized information through the use of
the `$t()` method or the `translate` filter.

It will try to find the given string as key in the translations of the
currently defined locale and return the respective translation. If the string
is not found, it will return as is. This wil allow you to setup an application
very quickly without having to first define all strings in a separate template.

It is also possible to specify a fallback-locale `$i18n.fallback(locale)`. If
the key is not found in current locale, vue-i18n-stash will look for the key in the
fallback-locale. If the key can not be found in the fallback-locale either,
the key itself will be returned as translation.

```javascript
<div>
	// will return: "Some localized information"
	{{ $t('Some localized information')}}
</div>

```

Dynamic parameters that can be passed to the translation method in the form of
key/value pairs.

```javascript
<div>
	// will return: "You have 5 new messages"
	{{ $t('You have {count} new messages', {count: 5}) }}
</div>
```

It is possible to specify custom identifiers for variable substitutions. The
respective identifiers - start and stop - must be passed when initializing the
module. Please note that a regular expression is used to match the tags.
Therefore it might be necessary to escape certain characters accordingly.

```javascript
// i.e. to use {{count}} as variable substitution.
// the third parameter defines the module name and is i18n per default
Vue.use(vueI18nStash.plugin, store, 'i18n', ['{{','}}']);
```

Basic pluralization is also supported. Please note, that the singular translation
must be specified first, denoted from the pluralized translation by `:::`.
The third parameter is used to define if the singular or plural version should be
used (see below for examples). Dynamic parameters can be passed as second argument.

```javascript
<div>
	// will return: "You have 5 new messages" if the third argument is 5"
	// or "You have 1 new message" if the third argument is 1
	// or "You have -1 new message" if the third argument is -1
	// or "You have 0 new messages" if the third argument is 0 (note pluralized version)
	{{ $t('You have {count} new message ::: You have {count} new messages', {count: 5}, 5) }}
</div>
```

The current locale can be set using the `$i18n.set()` method. By default, the
translation method will select the pre-specified current locale. However, it is
possible to request a specific locale using the `$tlang()` method.

```javascript
<div>
	// will return the english translation regardless of the current locale
	{{ $tlang('en', 'You have {count} new messages', {count: 5}) }}
</div>
```

There are also several methods available on the property `this.$i18n` or `Vue.i18n`

```javascript
$i18n.locale(), Vue.i18n.locale()
	// get the current locale

$i18n.set(locale), Vue.i18n.set(locale)
	// set the current locale (i.e. 'de', 'en')

$i18n.add(locale, translations), Vue.i18n.add(locale, translations)
	// add a new locale to the storage
	// (i.e. 'de', {'message': 'Eine Nachricht'})

$i18n.localeExists(locale), Vue.i18n.localeExists(locale)
	// check if the given locale translations are present in the store

$i18n.keyExists(key), Vue.i18n.keyExists(key)
	// check if the given key is available in the current or fallback locale

$i18n.remove(locale), Vue.i18n.remove(locale)
	// remove the given locale from the store

$i18n.fallback(locale), Vue.i18n.fallback(locale)
	// set a fallback locale if translation for current locale does not exist
```

## Contributions
Any comments or suggestions are very welcome.
