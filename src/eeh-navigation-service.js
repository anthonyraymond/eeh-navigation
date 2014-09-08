'use strict';
/* global MenuItem */

var NavigationService = function ($translateProvider) {
    this.$translateProvider = $translateProvider;
    this.sidebarSearch = {
        isVisible: true,
        model: '',
        click: function () {}
    };
    this.navbarBrand = {};
    this._navbarMenuItems = {};
    this._sidebarMenuItems = {};
    this._toArray = function (items) {
        var arr = [];
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                arr.push(items[key]);
            }
        }
        return arr;
    };
};

NavigationService.prototype.$get = function () {
    return this;
};

/**
 * Recursively map a flat array of menu items to a nested object suitable to generate HTML lists from.
 */
NavigationService.prototype.buildAncestorChain = function (name, items, config) {
    var keys = name.split('.');
    if (name.length === 0 || keys.length === 0) {
        return;
    }
    var key = keys.shift();
    if (angular.isUndefined(items[key])) {
        items[key] = keys.length === 0 ? config : {};
        if (keys.length === 0) {
            items[key] = config;
        }
    }
    this.buildAncestorChain(keys.join('.'), items[key], config);
};

NavigationService.prototype.sidebarMenuItem = function (name, config) {
    if (angular.isUndefined(config)) {
        return this._sidebarMenuItems[name];
    }
    this._sidebarMenuItems[name] = new MenuItem(config);
    return this;
};

NavigationService.prototype.sidebarMenuItems = function () {
    var items = {};
    var self = this;
    angular.forEach(this._sidebarMenuItems, function (config, name) {
        self.buildAncestorChain(name, items, config);
    });
    return this._toArray(items);
};

NavigationService.prototype.navbarMenuItem = function (name, config) {
    if (angular.isUndefined(config)) {
        return this._navbarMenuItems[name];
    }
    this._navbarMenuItems[name] = new MenuItem(config);
    return this;
};

NavigationService.prototype.navbarMenuItems = function () {
    var items = {};
    var self = this;
    angular.forEach(this._navbarMenuItems, function (config, name) {
        self.buildAncestorChain(name, items, config);
    });
    return this._toArray(items);
};

NavigationService.prototype.translations = function (languageKey, translationMap) {
    this.$translateProvider.translations(languageKey, translationMap);
    return this;
};

NavigationService.prototype.preferredLanguage = function (languageKey) {
    this.$translateProvider.preferredLanguage(languageKey);
    return this;
};

angular.module('eehNavigation').provider('eehNavigation', ['$translateProvider', NavigationService]);
