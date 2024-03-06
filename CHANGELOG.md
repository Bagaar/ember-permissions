# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.


## v6.0.0 (2024-03-05)

#### :boom: Breaking Change
* [#411](https://github.com/Bagaar/ember-permissions/pull/411) Convert to v2 addon ([@bertdeblock](https://github.com/bertdeblock))

#### Committers: 1
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))

## [5.1.0](https://github.com/bagaar/ember-permissions/compare/v5.0.0...v5.1.0) (2024-03-04)


### Features

* provide an extendable template registry ([85ffa54](https://github.com/bagaar/ember-permissions/commit/85ffa54c8a558d398f2eec3c6e585f67ea7761d5))

## [5.0.0](https://github.com/bagaar/ember-permissions/compare/v4.0.0...v5.0.0) (2023-11-14)


### ⚠ BREAKING CHANGES

* drop support for Node v16
* drop support for Ember v4.4 and below
* drop support for Node v14

### Features

* add support for checking if some of the provided permissions are available for the current session ([a705865](https://github.com/bagaar/ember-permissions/commit/a705865b2c382d22be320f6b349157bb0be03a29))
* add support for Ember v5.0 ([30a7e74](https://github.com/bagaar/ember-permissions/commit/30a7e74b7d27ea904a9e4b52fa6393f173a13a9d))


* drop support for Ember v4.4 and below ([fd43e59](https://github.com/bagaar/ember-permissions/commit/fd43e5990fed195b57bffe7ca6d6a3bed16ce171))
* drop support for Node v14 ([148c5bf](https://github.com/bagaar/ember-permissions/commit/148c5bf94808f0185c4f40815776f0fb56e32a69))
* drop support for Node v16 ([1d26067](https://github.com/bagaar/ember-permissions/commit/1d2606761ad8df5fd665044558406878104606a4))

## [4.0.0](https://github.com/bagaar/ember-permissions/compare/v3.0.0...v4.0.0) (2023-01-03)


### ⚠ BREAKING CHANGES

* add new `addRouteAccessDeniedHandler` and `removeRouteAccessDeniedHandler` service methods
* require users to provide the initial transition

### Features

* add new `addRouteAccessDeniedHandler` and `removeRouteAccessDeniedHandler` service methods ([859ecd3](https://github.com/bagaar/ember-permissions/commit/859ecd30e62cae302fceed5f2d50d9fd8c228cea))
* require users to provide the initial transition ([ce60cff](https://github.com/bagaar/ember-permissions/commit/ce60cffa0b4a318d0d1d4afb7c788b250621156e))

## [3.0.0](https://github.com/bagaar/ember-permissions/compare/v2.0.1...v3.0.0) (2022-06-23)


### ⚠ BREAKING CHANGES

* drop support for Ember versions below v3.28
* drop support for Node v12

* drop support for Ember versions below v3.28 ([5cbb371](https://github.com/bagaar/ember-permissions/commit/5cbb3711abb05b947fccc759b4de99f285af6884))
* drop support for Node v12 ([3870698](https://github.com/bagaar/ember-permissions/commit/3870698e271622d94dbd3856c1c14e448436f67a))

### [2.0.1](https://github.com/bagaar/ember-permissions/compare/v2.0.0...v2.0.1) (2021-12-09)


### Bug Fixes

* Don't assume `transition.to` is always present when validating transitions ([b60ca08](https://github.com/bagaar/ember-permissions/commit/b60ca08a9e1b001e3a2b311236e4ad927133e51c))


## [2.0.0](https://github.com/bagaar/ember-permissions/compare/v1.0.0...v2.0.0) (2021-11-16)


### ⚠ BREAKING CHANGES

* `hasPermissions` now only accepts an array of permissions ([ad16cd7](https://github.com/bagaar/ember-permissions/commit/ad16cd72fce81237a999ccc1ab82d82b8c91b874))
* Use tracked properties instead of internal events ([c18ea8f](https://github.com/bagaar/ember-permissions/commit/c18ea8ff6e28408b996b690a59b6371e78610c82))

### Features

* Bring back the event methods ([8cbc8e5](https://github.com/bagaar/ember-permissions/commit/8cbc8e58c4a14b1277ea251ce414d67a52309885))


## [1.0.0](https://github.com/bagaar/ember-permissions/compare/v0.2.0...v1.0.0) (2021-09-22)


### ⚠ BREAKING CHANGES

* Dropped support for Ember versions below `v3.12` ([c9ed817](https://github.com/bagaar/ember-permissions/commit/c9ed817637435df962f50e7e9cc3d1278ca66931))
* Removed use of the `Evented` mixin ([9de3632](https://github.com/bagaar/ember-permissions/commit/9de3632f3af7ba009c58cd88c5d664f56f64a2ad))
* Switched to native classes ([89c8f6b](https://github.com/bagaar/ember-permissions/commit/89c8f6b4c9aa7863c430444f0a25c82a21d1d5d7))

### Bug Fixes

* Remove `routeWillChange` listener on destroy ([e90a96f](https://github.com/bagaar/ember-permissions/commit/e90a96f55e43b5eadbf9596e98d7743b14b8fee1))


## [1.0.0-beta.0](https://github.com/bagaar/ember-permissions/compare/v0.2.0...v1.0.0-beta.0) (2020-04-26)


### ⚠ BREAKING CHANGES

* Dropped support for Ember versions below `v3.12` ([c9ed817](https://github.com/bagaar/ember-permissions/commit/c9ed817637435df962f50e7e9cc3d1278ca66931))
* Removed use of the `Evented` mixin ([9de3632](https://github.com/bagaar/ember-permissions/commit/9de3632f3af7ba009c58cd88c5d664f56f64a2ad))
* Switched to native classes ([89c8f6b](https://github.com/bagaar/ember-permissions/commit/89c8f6b4c9aa7863c430444f0a25c82a21d1d5d7))

<a name="0.2.0"></a>
# [0.2.0](https://github.com/bagaar/ember-permissions/compare/v0.1.0...v0.2.0) (2019-05-07)


### Bug Fixes

* Make sure the initial transition is cached ([0053177](https://github.com/bagaar/ember-permissions/commit/0053177))


### Chores

* Update linting setup using `prettier-standard` ([ac6fbfb](https://github.com/bagaar/ember-permissions/commit/ac6fbfb))


### ⚠ BREAKING CHANGES

* `prettier-standard` requires node 8
