var req = require('request');
var api = 'https://api.tech26.de';

exports.User = function(username, password, callback) {
	req.post({
		url: api + '/oauth/token',
		headers: {
			'Authorization': 'Basic YW5kcm9pZDpzZWNyZXQ=',
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'			
		},
		form: {
			'username': username,
			'password': password,
			'grant_type': 'password'
		}
	}, function(err,httpResponse,body) {
		if(body) {
			auth = JSON.parse(body);
			if(!(auth.title && auth.title == 'Oops!') && auth.access_token) {
				var u = {};
				var headerObj = {
					'Authorization': 'bearer ' + auth.access_token,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'	
				}

				u.balance = function(callback) {
					req.get({
						url: api + '/api/accounts',
						headers: headerObj
					}, function(err,httpResponse,body) {
						var account = JSON.parse(body);
						var bal = account.usableBalance
						if(isNaN(bal)) balance(token, callback);
						else callback(bal);
					});
				}
				u.transactions = function(callback) {
					req.get({
						url: api + '/api/transactions?sort=visibleTS&dir=DESC&limit=20',
						headers: headerObj
					}, function(err,httpResponse,body) {
						callback(body);
					});
				}
				u.transfer = function(token, pin, bic, amount, iban, partner, reason, callback) {
					req.post({
						url: api + '/api/transactions',
						headers: headerObj,
						json: {
							'pin': pin,
							'transaction': {
								'partnerBic': bic,
								'amount': amount,
								'type': 'DT',
								'partnerIban': iban,
								'partnerName': partner,
								'referenceText': reason
							}
						}
					}, function(err,httpResponse,body) {
						callback(body);
					});		
				}

				var token = auth.access_token;
				callback(u);
			}
		}
		if(!token) {
			User(username,password,callback);	
		}
	});
}/*


exports.transfer = function(token, pin, bic, amount, iban, partner, reason, callback) {
	req.post({
		url: api + '/api/transactions',
		headers: {
			'Authorization': 'bearer ' + token,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'	
		},
		json: {
			'pin': pin,
			'transaction': {
				'partnerBic': bic,
				'amount': amount,
				'type': 'DT',
				'partnerIban': iban,
				'partnerName': partner,
				'referenceText': reason
			}
		}
	}, function(err,httpResponse,body) {
		callback(body);
	});		
}*/