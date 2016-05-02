var n26 = require('./number26-api.js').User;

n26(process.env.email, process.env.passwd, function(u) {
	u.balance(function(bal) {
		if(isNaN(bal)) throw new Error('Balance not a number');
	});
	u.transactions(function(trans) {
		if(typeof trans != 'object') throw new Error('Transactions not valid');
		else if(typeof trans.paging != 'object') throw new Error('Transactions not valid');
	});
});