module.exports = function(app){
	require('./home')(app);
	require('./handle')(app);
}