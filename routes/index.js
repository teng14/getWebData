module.exports = function(app){
	require('./home')(app);
	require('./handle')(app);
	require('./capture')(app);
	require('./getweb')(app);
}