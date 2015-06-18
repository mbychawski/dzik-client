 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
window.utils = (function() {
    'use strict';
    var appEventEmitter = _.extend({}, Backbone.Events);

    function loadTemplates( paths ) {
        var deferred = new $.Deferred(),
            deferreds = [],
            templates = {};

        if(typeof paths === "string")
            paths = [paths];

        _.each(paths, function(path) {
            var def = new $.Deferred();

            $.get(path, null, function( data ) {
                var $templates = $(data).filter('[type="text/x-template"]');
                $templates.each( function() {
                    var $this = $(this);
                    templates[ $this.attr('id') ] = _.template( $this.html() );
                });
                def.resolve();
            });

            deferreds.push( def );
        });

        $.when.apply(null, deferreds).done(function() {
            deferred.resolve( templates );
        });

        return deferred.promise();
    }

    var localStorageProvider = {
        sendedObligations : null,

        init : function() {
            this.sendedObligations = JSON.parse( localStorage.getItem('RSO-obligations') );
            if( this.sendedObligations == null ) this.sendedObligations = [];
        },

        addObligation : function( obligation ) {
            if( this.getById( obligation.id ) )
                return false;

            this.sendedObligations.push( obligation );
            localStorage.setItem('RSO-obligations', JSON.stringify(this.sendedObligations) );

            return true;
        },

        getByPesel : function( pesel ) {
            return _.where(this.sendedObligations, {pesel: pesel});
        },

        getById : function( id ) {
            return _.findWhere(this.sendedObligations, {id: id});
        },

        updateObligation : function( newObligation ) {
            _.findWhere(this.sendedObligations, {id: newObligation.id}).value = newObligation.value;
            localStorage.setItem('RSO-obligations', JSON.stringify(this.sendedObligations) );
        },

        getLastPESEL : function( count ) {
            return _.last( _.uniq( _.pluck( this.sendedObligations, 'pesel' ) ), count );
        }
    };

    localStorageProvider.init();

    if( typeof require !== 'undefined' ){
        document.addEventListener("keydown", function(e) {
            if(e.keyCode === 68 && e.shiftKey && e.ctrlKey) {
                require("nw.gui").Window.get().showDevTools();
            }
        });
    }

    return {
        loadTemplates: loadTemplates,
        appEventEmitter : appEventEmitter,
        config : config,
        localStorageProvider : localStorageProvider
    }
})();