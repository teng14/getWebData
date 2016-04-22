module.exports = function(app){
	app.get('/capture', function(req, res){
		res.render('capture');
	})
}