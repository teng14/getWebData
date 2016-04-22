var http = require('http'),
	https = require('https'),
	path = require('path'),
	cheerio = require('cheerio'),
	fs = require('fs'),
	mkdirp = require('mkdirp');

var mongoose = require('mongoose')  
    , Schema = mongoose.Schema ;

mongoose.connect('mongodb://www.fireyun.cn/smzdm');

var dateTime = new Date();

var imgSavePath = './public/upload/'+dateTime.getFullYear()+(dateTime.getMonth()+1)+dateTime.getDate()+'/';
var imgSrcPath =  '/images/upload/'+dateTime.getFullYear()+(dateTime.getMonth()+1)+dateTime.getDate()+'/';

//创建文件夹
mkdirp(imgSavePath, function(err){
	if(err){
		console.log('创建文件夹出错了！')
	}
})

//骨架
var articleSchema = new Schema({  
	title: String,
	imgUrl: String,
	mall: String,
	info: String,
	time: String,
	update: Date
}); 

//模型
var Article = mongoose.model('Article', articleSchema);

//存储数据
function saveData(prams){
	if(typeof prams =='object'){
		var article = new Article({
			title: prams.title,
			imgUrl: prams.imgUrl,
			mall: prams.mall,
			info: prams.info,
			time: prams.time,
			update: new Date()
		});
		article.save(function(err){
			if(err){
				console.log('数据保存失败');
				return;
			}else{
				console.log('数据保存成功！')
			}
		})
	}else{
		console.log('请传参数对象')
	}
}

//获取远程页面内容
function getWebData(url){
	http.get(url, function(res){
		var data = "";
		res.on('data', function (chunk) {
	      data += chunk;
	    });
		res.on("end", function() {
			analyze(data)
	    })
	}).on("error", function() {
		console.log('error')
	});
}

//下载远程图片
function downloadImg(url){
	if(url!==''){
		http.get(url, function(res) {
			var data = "";
		    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
			res.on('data', function (chunk) {
		      data += chunk;
		    });
			res.on("end", function() {
				fs.writeFile(imgSavePath+path.basename(url), data, "binary", function(err){
		            if(err){
		                console.log(url+"  图片下载失败!");
		            }else{
		            	console.log(url+"  图片下载成功！");
		            }
		            
		        });

		    })
		}).on("error", function() {
			console.log(url+ '请求图片出错！')
		});
	}
};

//分析页面代码
function analyze(data){
	var $ = cheerio.load(data);
	var list = $('.list');
	var imgUrl = [];
	for(var i = 0; i < list.length; i++){
		var title = list.eq(i).find('.itemName .black').text(),
			imgUrl = list.eq(i).find('.picBox img').attr('src'),
			mall = list.eq(i).find('.mall_word').text(),
			info = list.eq(i).find('p').text(),
			time = list.eq(i).find('.time').text();
		downloadImg(imgUrl);
		saveData({
			title: title,
			imgUrl: imgUrl,
			mall: mall,
			info: info,
			time: time	
		})
	}
}

module.exports = function(app){
	
	app.get('/getweb', function(req, res){
		var url = [];
		url = req.query.url.split(',');
		for(var i = 0; i < url.length; i++){
			getWebData(url[i]);
		};
	})
}





