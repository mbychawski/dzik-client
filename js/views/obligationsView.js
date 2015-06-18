 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
window.ObligationsView = (function() {
    return Backbone.View.extend({
        tagName    : 'div',

        events : {
            'click .getObligationsBtn'  : 'getObligations',
        },

        initialize : function(options) {
        },

        getObligations : function() {
            var self = this,
                pesel = this.validateForm();

            if( pesel ) {
                this.$el.find('.waitingIndicator').fadeIn();
                self.$el.find('.getObligationsBtn').attr('disabled', true);

                dataProvider.getClientObligations( pesel )
                .done(function( response ) {
                    self.renderResponse( response );
                })
                .fail( app.parseAndDisplayError )
                .always( function() {
                    self.$el.find('.waitingIndicator').hide();
                    self.$el.find('.getObligationsBtn').attr('disabled', false);
                });
            }
        },

        validateForm : function() {
            var $peselInput = this.$el.find('#peselInput'),
                pesel = $peselInput.val();

            this.$el.find('.obligationsResponse').remove();
            if( dataValidator.pesel( pesel ) ) {
                $peselInput.parent().removeClass('has-error');
                return pesel;
            }
            else {
                $peselInput.parent().addClass('has-error');
                app.displayAlert('warning', '', 'Wprowadź poprawny numer PESEL');
            }
        },

        render : function() {
            var self = this;

            this.$el.html( templates.obligationsViewTop() );

            $('#test-kit').html( templates.testKit02( {peselList : utils.localStorageProvider.getLastPESEL(3)} ) );
            $('.btnPesel').click( function() {
                self.$el.find('#peselInput').val( $(this).attr('pesel') );
            });
            $('#generateData').click( function() {
                randomDataGenerator.setInputValues( self.$el );
            });

            return this;
        },

        renderResponse : function( values ) {
            var newNode = $(templates.obligationsViewResponse( values ));
            this.$el.append( newNode );
            newNode.fadeIn();
        }
    });
})();
