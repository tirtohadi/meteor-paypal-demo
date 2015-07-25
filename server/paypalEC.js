

cred=  {
    username  : 'limjohn75-facilitator_api1.gmail.com',
    password  : 'YLUADKL5592MUGWD',
    signature : 'A61U8Amg8DVOOQbM3dhS46toycjRAOfHRiEjlU-lhQfbuCfLUWidLo1Q'
};

opts= {
    sandbox : true,
    version : '78.0'
};
//this function is an internal function
function EC_url_request_payment_authorization(transaction, callback){

    PayPalEC = Meteor.npmRequire('paypal-ec');
    var ec = new PayPalEC(cred, opts );

    var params = {
        returnUrl : process.env.ROOT_URL + "payment_return/" + transaction.invoice_no + "/" + transaction.total + "/",
        cancelUrl : process.env.ROOT_URL + "payment_cancel/",
        SOLUTIONTYPE : 'sole' ,
        PAYMENTREQUEST_0_PAYMENTACTION :'Sale',
        PAYMENTREQUEST_0_CURRENCYCODE :transaction.currency,
        PAYMENTREQUEST_0_AMT : transaction.total,
        PAYMENTREQUEST_0_DESC : transaction.description,
        PAYMENTREQUEST_0_ITEMAMT :transaction.total,
        L_PAYMENTREQUEST_0_QTY0 : transaction.quantity,
        L_PAYMENTREQUEST_0_AMT0 :transaction.total,
        L_PAYMENTREQUEST_0_NAME0 :transaction.description,
        PAYMENTREQUEST_0_INVNUM : transaction.invoice_no
    };

    ec.set( params, function ( err, data ){

        if(err) {
            console.log("Error inside EC_process_payment");
            console.log(err);
            callback(err, "");
        }
        else {
            var url = data['PAYMENTURL'];
            callback(null, url);
        }

    });


}


// this function is an internal function
function EC_do_actual_payment(params, callback){

    PayPalEC = Meteor.npmRequire('paypal-ec');
    var ec = new PayPalEC(cred, opts );

    ec.do_payment( params, function ( err, data ){

        // really charge the user for the payment
        if(err) {
            console.log("Error inside EC_do_payment" + err);
        }
        else {
            callback(err, data);
        }
    });
}


    generate_URL_for_payment_authorization = function (invoice_no, amount) {

        var transaction =
        {
            "invoice_no" : invoice_no,
            "currency": "SGD",
            "total": amount,
            "description": "Meteor demo for paypal payment",
            "quantity": 1,
            "itemprice": amount
        };

        var gists = Async.runSync(function (done) {
            EC_url_request_payment_authorization(transaction, function (error, url) {
                done(null, url);
            });
        });

        return gists.result;
    };


    paypal_return = function(invoice_no,amount, token, payerID){

        var params={
            "TOKEN" : token,
            "PAYERID" : payerID,
            SOLUTIONTYPE                   : 'sole' ,
            PAYMENTREQUEST_0_PAYMENTACTION :'Sale',
            PAYMENTREQUEST_0_CURRENCYCODE :'SGD',
            PAYMENTREQUEST_0_AMT :amount,
            PAYMENTREQUEST_0_DESC : "Meteor demo for paypal payment",
            PAYMENTREQUEST_0_INVNUM :invoice_no

        };


        var gists = Async.runSync(function (done) {
            EC_do_actual_payment( params, function ( err, data ) {
                if (err) {
                    done(err,null);
                }
                else {
                    done(null, data);
                }

            });
        });

        if (gists.error != null)
        {
            console.log(gists.error);
            return false;
        }

        return true;
    };





