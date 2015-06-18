 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
window.dataProvider = (function() {

    function getClientObligations( pesel ) {
        var deferred = new $.Deferred();

        $.ajax({
            method      : 'GET',
            url         : getUrl('getClientObligations', pesel),
            dataType    : 'json',
            crossDomain : true,
            timeout     : window.config.requestsTimeout,
            error : function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus, jqXHR.status, jqXHR.statusText, jqXHR.responseJSON);
            },

            success : function(data, textStatus, jqXHR) {
                if( data.errorCode ){
                    deferred.reject( 'error', null, null, data );
                }
                else {
                    deferred.resolve( data );
                }
            }
        });

        return deferred.promise();
    }

    function sendNewObligation( data ) {
        var deferred = new $.Deferred();

        $.ajax({
            method      : 'POST',
            url         : getUrl('sendNewObligation'),
            dataType    : 'json',
            contentType : 'application/json; charset=utf-8',
            data        : JSON.stringify( data ),
            crossDomain : true,
            timeout     : window.config.requestsTimeout,
            error : function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus, jqXHR.status, jqXHR.statusText, jqXHR.responseJSON);
            },

            success : function(response, textStatus, jqXHR) {
                if( response.errorCode || !response.creditId){
                    deferred.reject( 'error', null, null, response );
                }
                else {
                    var creditInfo = {
                        pesel   : data.client.pesel,
                        name    : data.credit.name,
                        value   : data.credit.value,
                        id      : response.creditId
                    }

                    utils.localStorageProvider.addObligation( creditInfo );

                    deferred.resolve( response );
                }
            }
        });

        return deferred.promise();
    }

    function repay( creditInfo, value ) {
        var deferred = new $.Deferred();

        var data = {
            paymentName : chance.word(),
            payment : {
                value: value,
                creditId: creditInfo.get('id')
            }
        }

        $.ajax({
            method      : 'POST',
            url         : getUrl('repay', creditInfo.get('pesel')),
            dataType    : 'json',
            contentType : 'application/json; charset=utf-8',
            data        : JSON.stringify( data ),
            crossDomain : true,
            timeout     : window.config.requestsTimeout,
            error : function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus, jqXHR.status, jqXHR.statusText, jqXHR.responseJSON);
            },

            success : function(response, textStatus, jqXHR) {
                if( response.errorCode || response.remaining === undefined || response.remaining === null ){
                    deferred.reject( 'error', null, null, response );
                }
                else {
                    creditInfo.set('value', response.remaining);
                    utils.localStorageProvider.updateObligation( creditInfo.toJSON() );

                    deferred.resolve( response );
                }
            }
        });

        return deferred.promise();
    }

    function getUrl( requestName, pesel ) {
        var url = config.applicationServerPath + config.requestsBaseUrl[ requestName ];
        if( pesel )
            url += '/' + pesel;
        url += '?' + generateCredentials();

        return url;
    }

    function generateCredentials() {
        var timestamp = new Date().getTime(),
            token = CryptoJS.MD5( '' + config.key + timestamp ).toString(),
            credentials = {
                "uid" : config.uid,
                "ts" : timestamp,
                "token" : token
            };

        return $.param( credentials );
    }

    return {
        getClientObligations: getClientObligations,
        sendNewObligation: sendNewObligation,
        repay: repay
    }
})();