/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*global window */
'use strict';
var React = require('react');
var connectToStores = require('fluxible/addons/connectToStores');
var objectAssign = require('object-assign');
var hoistNonReactStatics = require('hoist-non-react-statics');

module.exports = function handleRoute(Component) {
    var RouteHandler = React.createClass({
        displayName: 'RouteHandler',
        contextTypes: {
            getStore: React.PropTypes.func.isRequired
        },
        propTypes: {
            currentRoute: React.PropTypes.object,
            currentNavigate: React.PropTypes.object,
            currentNavigateError: React.PropTypes.object,
            isNavigateComplete: React.PropTypes.bool
        },

        render: function () {
            var routeStore = this.context.getStore('RouteStore');

            return React.createElement(Component, objectAssign({
                isActive: routeStore.isActive.bind(routeStore),
                makePath: routeStore.makePath.bind(routeStore)
            }, this.props));
        }
    });

    RouteHandler = connectToStores(RouteHandler, ['RouteStore'], function (stores, props) {
        return {
            currentNavigate: stores.RouteStore.getCurrentNavigate(),
            currentNavigateError: stores.RouteStore.getCurrentNavigateError(),
            isNavigateComplete: stores.RouteStore.isNavigateComplete(),
            currentRoute: stores.RouteStore.getCurrentRoute()
        };
    });

    // Copy statics to RouteHandler
    hoistNonReactStatics(RouteHandler, Component);

    return RouteHandler;
};
