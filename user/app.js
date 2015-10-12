var oParse = require('parse-json');
var http = require('http');
var gs = require('nodegrass');
var json = require('json-string');

var settings = require('../settings');
var Db = require('../model/access_token');

http.createServer(function (request, response) {

Db.get(1, function(err,result){
	var oResult = result[0],
		sUrl = settings.wechatURL + 'user/info?access_token='+oResult.accessToken+'&openid='+ settings.openid +'&lang=zh_CN'

	gs.get(sUrl, function(data){//get1
		console.log('获取id成功');
		oParse(data, function(err, content) {//oParse1
			//console.log(content);
			response.writeHead(200, {'Content-Type': 'text/plain',"Access-Control-Allow-Origin":"http://localhost:3000"}); 
			response.end(json(content));
		});//oParse1
	}, 'UTF-8').on('error',function(err){console.log(err);});//get1

});

}).listen(8888);

console.log('Server running at http://127.0.0.1:8888/');
