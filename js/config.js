 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
window.config = {
    // "applicationServerPath" : "http://localhost:8080",
    // "applicationServerPath" : "https://localhost:3000",
    "applicationServerPath" : "https://192.168.1.100",
    "requestsBaseUrl" : {
        "getClientObligations"  : "/rso/obligations",
        "sendNewObligation"     : "/rso/obligations",
        "repay"                 : "/rso/new-payment"
    },
    "bankName" : "Bank centralny Politechniki Warszawskiej",
    "uid" : "1",
    "key" : "secret",
    "aletDisplayTime" : 4000,
    "requestsTimeout" : 10000
};