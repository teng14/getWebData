/*
 * 
 */

var express    = require('express');
var app        = express();
var path       = require('path');
var bodyParser = require('body-parser');
var multer     = require('multer'); 
var cors = require('cors');

app.use(cors());//解决跨域问题

//静态资源托管
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

//设定views变量，视图存放目录
app.set('views', path.join(__dirname, 'views'));
//设定view engine变量，模板引擎
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

require('./routes')(app);


app.listen(3100);
//启动服务提示语：
console.log('getWebData服务启动：请访问http://localhost:3100')