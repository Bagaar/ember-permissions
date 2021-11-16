# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/Bagaar/ember-permissions/compare/v0.2.0...v2.0.0) (2021-11-16)


### ⚠ BREAKING CHANGES

* `hasPermissions` now only accepts an array of permissions ([ad16cd7](https://github.com/Bagaar/ember-permissions/commit/ad16cd72fce81237a999ccc1ab82d82b8c91b874))
* Use tracked properties instead of internal events ([c18ea8f](https://github.com/Bagaar/ember-permissions/commit/c18ea8ff6e28408b996b690a59b6371e78610c82))

### Features

* Bring back the event methods ([8cbc8e5](https://github.com/Bagaar/ember-permissions/commit/8cbc8e58c4a14b1277ea251ce414d67a52309885))


## [1.0.0](https://github.com/Bagaar/ember-permissions/compare/v0.2.0...v1.0.0) (2021-09-22)


### ⚠ BREAKING CHANGES

* Dropped support for Ember versions below `v3.12` ([c9ed817](https://github.com/Bagaar/ember-permissions/commit/c9ed817637435df962f50e7e9cc3d1278ca66931))
* Removed use of the `Evented` mixin ([9de3632](https://github.com/Bagaar/ember-permissions/commit/9de3632f3af7ba009c58cd88c5d664f56f64a2ad))
* Switched to native classes ([89c8f6b](https://github.com/Bagaar/ember-permissions/commit/89c8f6b4c9aa7863c430444f0a25c82a21d1d5d7))

### Bug Fixes

* Remove `routeWillChange` listener on destroy ([e90a96f](https://github.com/Bagaar/ember-permissions/commit/e90a96f55e43b5eadbf9596e98d7743b14b8fee1))


## [1.0.0-beta.0](https://github.com/Bagaar/ember-permissions/compare/v0.2.0...v1.0.0-beta.0) (2020-04-26)


### ⚠ BREAKING CHANGES

* Dropped support for Ember versions below `v3.12` ([c9ed817](https://github.com/Bagaar/ember-permissions/commit/c9ed817637435df962f50e7e9cc3d1278ca66931))
* Removed use of the `Evented` mixin ([9de3632](https://github.com/Bagaar/ember-permissions/commit/9de3632f3af7ba009c58cd88c5d664f56f64a2ad))
* Switched to native classes ([89c8f6b](https://github.com/Bagaar/ember-permissions/commit/89c8f6b4c9aa7863c430444f0a25c82a21d1d5d7))

<a name="0.2.0"></a>
# [0.2.0](https://github.com/Bagaar/ember-permissions/compare/v0.1.0...v0.2.0) (2019-05-07)


### Bug Fixes

* Make sure the initial transition is cached ([0053177](https://github.com/Bagaar/ember-permissions/commit/0053177))


### Chores

* Update linting setup using `prettier-standard` ([ac6fbfb](https://github.com/Bagaar/ember-permissions/commit/ac6fbfb))


### ⚠ BREAKING CHANGES

* `prettier-standard` requires node 8
