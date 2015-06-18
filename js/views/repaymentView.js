 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
window.RepaymentView = (function() {
    var ObligationView = Backbone.View.extend({
        tagName : 'tr',

        events : {
            'click .sendBtn' : 'repay'
        },

        initialize : function() {
            var self = this;
            this.model.on('change', function() {
                self.render();
            });

            this.render();
        },

        render : function() {
            this.$el.html( templates.obligationView( this.model.toJSON() ) );
        },

        repay : function() {
            if( dataValidator.validateForm( this.$el ) ){
                var value = +this.$el.find('.repayment-input').val(),
                    self = this;

                self.$el.find('.sendBtn').attr('disabled', true);
                dataProvider.repay( this.model, value )
                .done(function( response ) {
                    app.displayAlert('success', '', 'Poprawnie wprowadzono spłatę zobowiązania: ' + self.model.get('id'));
                })
                .fail( app.parseAndDisplayError )
                .always( function() {
                    self.$el.find('.sendBtn').attr('disabled', false);
                });
            }
            else {
                app.displayAlert('warning', '', 'Wprowadź poprawną kwotę spłaty.');
            }
        }
    })

    return Backbone.View.extend({
        tagName    : 'div',

        events : {
            'click .get-obligations-btn' : 'getObligations',
        },

        initialize : function(options) {
        },

        render : function() {
            var self = this;

            this.$el.html( templates.repaymentView() );

            $('#test-kit').html( templates.testKit02( {peselList : utils.localStorageProvider.getLastPESEL(3)} ) );
            $('.btnPesel').click( function() {
                self.$el.find('#peselInput').val( $(this).attr('pesel') );
            });
            $('#generateData').click( function() {
                randomDataGenerator.setInputValues( self.$el );
            });

            return this;
        },

        getObligations : function() {
            if( dataValidator.validateForm( this.$el.find('.topDiv') ) ){
                var pesel = this.$el.find('#peselInput').val();

                var obligations = utils.localStorageProvider.getByPesel( pesel );

                if ( obligations.length > 0 ){
                    this.renderObligations( obligations );
                }
                else {
                    this.$el.find('.obligations-list').empty();
                    app.displayAlert('info', '', 'Klient o podanym numerze PESEL nie posiada żadnych zobowiązań w naszym banku.');
                }
            }
            else {
                app.displayAlert('warning', '', 'Wprowadź poprawny numer PESEL');
            }
        },

        renderObligations: function( obligations ) {
            var self = this;
            var list = self.$el.find('.obligations-list');
            list.empty();
            obligations.forEach(function(obligation) {
                list.append( new ObligationView({ model: new Backbone.Model(obligation) }).el );
            });
        }
    });
})();