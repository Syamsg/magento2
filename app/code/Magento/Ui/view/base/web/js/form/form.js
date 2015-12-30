/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'underscore',
    'Magento_Ui/js/lib/spinner',
    'rjsResolver',
    './adapter',
    'uiCollection',
    'mage/validation'
], function ($, _, loader, resolver, adapter, Collection) {
    'use strict';

    function collectData(items) {
        var result = {};

        items = Array.prototype.slice.call(items);

        items.forEach(function (item) {
            result[item.name] = item.type === 'checkbox' ? +!!item.checked : item.value;
        });

        return result;
    }

    function validateFields(items){
        var result = true;

        items = document.querySelectorAll(selector);

        _.each(items, function (item){
           if (!$.validator.validateAndShowLabel(item)){
               result = false;
           }
        });

        return result;
    }

    return Collection.extend({
        items: [],

        initialize: function () {
            this._super()
                .initAdapter();

            resolver(this.hideLoader, this);

            return this;
        },

        initAdapter: function () {
            adapter.on({
                'reset': this.reset.bind(this),
                'save': this.save.bind(this, true),
                'saveAndContinue': this.save.bind(this, false)
            });

            return this;
        },

        initConfig: function () {
            this._super();

            this.selector = '[data-form-part=' + this.namespace + ']';

            return this;
        },

        hideLoader: function () {
            loader.get(this.name).hide();

            return this;
        },

        save: function (redirect) {
            this.validate();
            this.items = document.querySelectorAll(selector);

            if (validateFields(this.items) && !this.source.get('params.invalid')) {
                this.submit(redirect);
            }
        },

        /**
         * Submits form
         */
        submit: function (redirect) {
            var additional = collectData(this.items),
                source = this.source;

            _.each(additional, function (value, name) {
                source.set('data.' + name, value);
            });

            source.save({
                redirect: redirect,
                attributes: {
                    id: this.namespace
                }
            });
        },

        /**
         * Validates each element and returns true, if all elements are valid.
         */
        validate: function () {
            this.source.set('params.invalid', false);
            this.source.trigger('data.validate');
        },

        reset: function () {
            this.source.trigger('data.reset');
        }
    });
});
