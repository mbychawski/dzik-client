 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
window.NewObligationView = (function() {
    function daysToDate( date ) {
        var oneDay = 24*60*60*1000;
        var today = new Date();
        var parts = date.split('-');
        date = new Date(parts[0], parts[1] - 1, parts[2]);

        return Math.ceil( (date.getTime() - today.getTime()) / oneDay );
    }

    return Backbone.View.extend({
        tagName : 'div',

        events : {
            'click .sendBtn'  : 'sendObligation',
        },

        initialize : function(options) {
        },

        render : function() {
            var self = this;

            this.$el.html( templates.newObligation() );

            $('#test-kit').html( templates.testKit03() );
            $('#generateData').click( function() {
                randomDataGenerator.setInputValues( self.$el.find('.personalData') );
            });
            $('#generateCreditData').click( function() {
                randomDataGenerator.setInputValues( self.$el.find('.creditData') );
            });

            return this;
        },

        sendObligation : function() {
            var self = this;

            if( dataValidator.validateForm( this.$el ) ){
                var values = this.prepareValues();

                self.$el.find('.sendBtn').attr('disabled', true);
                dataProvider.sendNewObligation( values ).done(function( response ) {
                    app.displayAlert('success', '', 'Wysłano pomyślnie. Id zobowiązania: ' + response.creditId)
                })
                .fail( app.parseAndDisplayError )
                .always(function() {
                    self.$el.find('.sendBtn').attr('disabled', false);
                });
            }
            else {
                app.displayAlert('warning', '', 'Wprowadź poprawne dane.');
            }
        },

        prepareValues : function() {
            var tmp = {};

            this.$el.find('input').each(function() {
                var $this = $(this);
                tmp[ $this.attr('id') ] = $this.val();
            });

            ret = {
                "client": {
                    "firstName"       : tmp.fname,
                    "lastName"        : tmp.lname,
                    "pesel"           : tmp.pesel,
                    "documentNumber"  : tmp.documentNumber,
                    "phoneNumber"     : tmp.phonenumber,
                    "email"           : tmp.email,
                    "address": {
                        "street"      : tmp.street,
                        "zipCode"     : tmp.zipCode,
                        "city"        : tmp.city
                    }
                },
                "credit": {
                    "name"  : tmp.name,
                    "value" : tmp.value,
                    "time"  : daysToDate(tmp.date),
                }
            };

            return ret;
        }
    });
})();