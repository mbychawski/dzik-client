 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
window.randomDataGenerator = (function() {

    function generatePESEL() {
        var date = chance.date({year: chance.integer({min: 1939, max: 1999})}),
            year = (''+date.getYear()).slice(-2);
            day   = date.getDay() + 1,
            month = date.getMonth() + 1,
            rnd = chance.integer({min: 0, max: 9999}),
            peselStr = '' + year + chance.pad(month, 2) + chance.pad(day, 2) + chance.pad(rnd, 4);

        var dig = peselStr.split(""),
            controll = (1*parseInt(dig[0]) + 3*parseInt(dig[1]) + 7*parseInt(dig[2]) + 9*parseInt(dig[3]) + 1*parseInt(dig[4]) + 3*parseInt(dig[5]) + 7*parseInt(dig[6]) + 9*parseInt(dig[7]) + 1*parseInt(dig[8]) + 3*parseInt(dig[9]))%10;

        controll = (controll == 0) ? 0 : 10 - controll;
        peselStr = peselStr + controll;

        return peselStr;
    }

    function generateDocId() {
        var prefix = chance.string({length: 3, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'}),
            suffix = chance.string({length: 6, pool: '1234567890'});

        return prefix + suffix;
    }

    function generatePhoneNumber() {
        var prefix = chance.integer({min: 500, max: 999});
        return '' + prefix + chance.string({length: 5, pool: '1234567890'});
    }

    function generateStreet() {
        return chance.street() + ' ' + chance.integer({min: 1, max: 999}) + '/' + chance.integer({min: 1, max: 300});
    }

    function generatePostCode() {
        return chance.string({length: 2, pool: "1234567890"}) + '-' + chance.string({length: 3, pool: "1234567890"});
    }

    function generateDate() {
        var date = chance.date({year: chance.integer({min: 2016, max: 2050})}),
            day = ("0" + date.getDate()).slice(-2),
            month = ("0" + (date.getMonth() + 1)).slice(-2);

        return date.getFullYear()+"-"+(month)+"-"+(day);
    }

    function setInputValues( parentNode ) {
        $( parentNode ).find('input').each( function() {
            var id = this.id,
                val = generate( id );
            if( val )
                $(this).val( val );
        });
    }

    function generate( what ) {
        switch ( what ) {
            case 'peselInput'     : return generatePESEL();
            case 'fname'          : return chance.first();
            case 'lname'          : return chance.last();
            case 'pesel'          : return generatePESEL();
            case 'documentNumber' : return generateDocId();
            case 'phonenumber'    : return generatePhoneNumber();
            case 'email'          : return chance.email();
            case 'street'         : return generateStreet();
            case 'zipCode'        : return generatePostCode();
            case 'city'           : return chance.city();
            case 'name'           : return chance.sentence({words: 5});
            case 'value'          : return chance.integer({min: 1, max: 100}) * 500;
            case 'date'           : return generateDate();
        }
        return null;
    }

    return {
        setInputValues : setInputValues,
        generate : generate,
        generatePESEL : generatePESEL
    }
})();