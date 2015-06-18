 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
'use strict';
window.AppRouter = ( function() {
    var container = $('#main-container');
    var alertsContainer = $('#alerts-container');

    return Backbone.Router.extend({
        routes: {
            ''               : 'home',
            'obligations'    : 'obligations',
            'new-obligation' : 'newObligation',
            'repayment'      : 'repayment'
        },

        views : {
            mainView : null,
            newObligationView : null,
            obligationsView : null,
            repaymentView : null
        },

        initialize : function() {
            Backbone.history.start();
        },

        home : function() {
            if( this.views.mainView === null ) {
                this.views.mainView = new MainView();
            }

            this.switchView( this.views.mainView );
        },

        obligations : function() {
            if( this.views.obligationsView === null ) {
                this.views.obligationsView = new ObligationsView();
            }

            this.switchView( this.views.obligationsView );
        },

        newObligation : function() {
            if( this.views.newObligationView === null ) {
                this.views.newObligationView = new NewObligationView();
            }

            this.switchView( this.views.newObligationView );
        },

        repayment : function() {
            if( this.views.repaymentView === null ) {
                this.views.repaymentView = new RepaymentView();
            }

            this.switchView( this.views.repaymentView );
        },

        switchView : function( view ) {
            container.children().detach();
            $('#test-kit').off();
            $('#test-kit').empty();
            view.render();
            container.append( view.el );
        },

        parseAndDisplayError : function( type, statusCode, statusText, responseJson ) {
            var message = null, title = null;

            if( type == 'timeout' )
                message = 'Upłynął czas połączenia z serwerm.';
            if( responseJson && responseJson.errorMessage )
                message = responseJson.errorMessage;
            if( statusCode )
                title = '' + statusCode + ' ' + statusText;

            message = message || 'Błąd połączenia z serwerem.';

            app.displayAlert('danger', title, message);
        },

        displayAlert : function(type, title, message) {
            var values = {};

            if( /(success)|(info)|(warning)|(danger)/.test(type) )
                values.alertClass = 'alert-'+type;
            else
                values.alertClass = 'alert-warning';

            values.title = title || '';
            values.message = message || '';

            var newAlert = $( templates.alert( values ));

            alertsContainer.append( newAlert );

            setTimeout(function() {
                newAlert.fadeOut(null, function(){ $(this).remove(); });
            }, config.aletDisplayTime);
        }
    });
})();