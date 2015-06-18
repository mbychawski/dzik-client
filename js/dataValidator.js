 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
window.dataValidator = (function() {
    return {
        pesel : function(pesel) {
            var reg = /^[0-9]{11}$/;
            if(reg.test(pesel) == false) {
                return false;
            }
            else {
                var dig = (""+pesel).split("");
                var controll = (1*parseInt(dig[0]) + 3*parseInt(dig[1]) + 7*parseInt(dig[2]) + 9*parseInt(dig[3]) + 1*parseInt(dig[4]) + 3*parseInt(dig[5]) + 7*parseInt(dig[6]) + 9*parseInt(dig[7]) + 1*parseInt(dig[8]) + 3*parseInt(dig[9]))%10;
                if(controll==0) controll = 10;
                controll = 10 - controll;
                if(parseInt(dig[10])==controll)
                    return true;
                else
                    return false;
            }
        },

        basic : function( str ) {
            return (str != '' && str);
        },

        email : function( email ) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        },

        zipCode : function( str ) {
            var re = /[0-9]{2}-[0-9]{3}/i;
            return re.test(str);
        },

        numberPositive : function( value ) {
            return _.isNumber( +value ) && +value > 0;
        },

        validateForm : function( parentNode ) {
            var self = this;
            var $inputs = $( parentNode ).find('input[data-validator]');

            var valid = true;

            $inputs.each(function() {
                var $this = $(this),
                    value = $this.val(),
                    type = $this.attr('data-validator'),
                    validator = self[type] || self.basic;

                if( validator( value ) ){
                    $this.parent().removeClass('has-error');
                }
                else {
                    valid = false;
                    $this.parent().addClass('has-error');
                }
            });

            return valid;
        }
    }
})();