var http = require('http');
var fs = require('fs');
var cheerio	= require('cheerio');

module.exports = function(app){
	app.get('/handle', function(req, res){
		var url = req.query.url;
		var test = /\/([^\/]*?\.jpg)/i;
		http.get(url, function(res) {
	        var data = "";
		    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

			res.on('data', function (chunk) {
		      data += chunk;
		    });
			res.on("end", function() {
				writeData(data)

		    })
		}).on("error", function() {
			console.log('error')
		});

		function writeData(data){
			var $ = cheerio.load(data);
			var returnObj ={};
			returnObj.data = [];
			var list = $('.list');
			var imgUrl = [];
			for(var i = 0; i < list.length; i++){
				var imgUrl = list.eq(i).find('.picBox img').attr('src')
				downLoadImg(imgUrl, i)
				returnObj.data.push({
					title: list.eq(i).find('.itemName .black').text(),
					imgUrl: 'http://localhost:3100/upload/downImg/'+test.exec(imgUrl)[1],
					mall: list.eq(i).find('.mall_word').text(),
					info: list.eq(i).find('p').text(),
					time: list.eq(i).find('.time').text()
				})
			}

			console.log('请求成功')
			res.jsonp(JSON.stringify(returnObj))
		}


		function downLoadImg(url,j){
			http.get(url, function(res) {
				var data = "";
			    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
				res.on('data', function (chunk) {
			      data += chunk;
			    });
				res.on("end", function() {
					console.log(test.exec(url)[1])
					fs.writeFile("./public/upload/downImg/"+test.exec(url)[1], data, "binary", function(err){
			            if(err){
			                console.log("down fail");
			            }else{
			            	console.log("down success");
			            }
			            
			        });

			    })
			}).on("error", function() {
				console.log('error')
			});

		}

	});
}