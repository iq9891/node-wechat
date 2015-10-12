var http = require('http');
var https = require('https');
var json = require('json-string');
var oParse = require('parse-json');
var gs = require('nodegrass');

var settings = require('./settings');
var Db = require('./model/access_token');

var sUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ settings.appid +'&secret='+ settings.secret;

http.createServer(function (request, response) {
	
	//请求腾讯接口
	function getQQ(cb){
		gs.get(sUrl, function(data){
			oParse(data, function(err, content) {//oParse
				console.log('getQQ');
				cb(content.access_token);

			});//oParse
		}, 'UTF-8').on('error',function(err){
			console.log(err);
		});
	};
	
	Db.get(1, function(err,result){
		if(err){
			console.log(err);
			return;
		}
		var oResult = result[0];
		console.log('获取数据库中的token');
		if(oResult){

			var sTime = (new Date()) - (new Date(oResult.time));//计算剩余的毫秒数  
			var days = parseInt(sTime / 1000 / 60 / 60 / 24, 10);//计算剩余的天数  
			var hours = parseInt(sTime / 1000 / 60 / 60 % 24, 10)+days*24;//计算剩余的小时数  
               
			if(hours>settings.outTime){//更新
				console.log(hours+"+"+settings.outTime);
				console.log('token超时，重新请求');
				getQQ(function(content){
					Db.update(content,new Date(),function(result){
						console.log('token修改成功');
						//console.log(result);
						Db.get(1, function(err,result){
							console.log('token修改后获取成功');
							response.writeHead(200, {'Content-Type': 'text/plain',"Access-Control-Allow-Origin":"http://localhost:3000"}); 
							response.end(json(oResult._doc));
						});
					});
				});
			}else{
				console.log('token获取成功');
				response.writeHead(200, {'Content-Type': 'text/plain',"Access-Control-Allow-Origin":"http://localhost:3000"}); 
				response.end(json(oResult._doc));
			}
		}else{//如果没有就获取新的
			console.log('数据库没有token');
			getQQ(function(access_token){
				Db.save({index:1,accessToken:access_token}, function(err,result){
					
					if(err){
						console.log(err);
						return;
					}
					console.log(12);
					response.writeHead(200, {'Content-Type': 'text/plain',"Access-Control-Allow-Origin":"http://localhost:3000"}); 
					response.end(json(data));
					console.log('存token');
				});
			});
		}

	});
	
}).listen(7777);

console.log('Server running at http://127.0.0.1:7777/');
//获取 access_token