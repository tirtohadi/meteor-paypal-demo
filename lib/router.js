Router.map(function() {
	this.route('/google/', {
		where: 'server',
		action: function() {

			this.response.writeHead(301, { 'Location': "http://www.google.com"});
			this.response.end();
		}
	});
});

Router.map(function() {
	this.route('/payment/:invoice_no/:amount/', {
		where: 'server',
		action: function() {
			var amount = parseInt(this.params.amount);
			var url = generate_URL_for_payment_authorization(this.params.invoice_no,this.params.amount);

			if (url == null)
			{
				this.response.end("error");
			}
			this.response.writeHead(301, { 'Location': url});
			this.response.end();
		}
	});
});
Router.map(function() {
	this.route('/payment_return/:invoice_no/:amount/', {
		where: 'server',
		onBeforeAction: function() {
			console.log("result");
			result = paypal_return(this.params.invoice_no,this.params.amount,this.params.query.token,this.params.query.PayerID);
			console.log(result);
			if (result)
			{
				this.response.end("Payment captured successfully");
			}
			else
			{
				this.response.end("Error in processing payment");
			}


		}
	});
});
Router.map(function() {
	this.route('/payment_cancel/', {
		where: 'server',
		onBeforeAction: function() {
			this.response.end("Payment Cancelled");
		}
	});
});

Router.route('/', function () {
	this.render('paypal_demo');
});
