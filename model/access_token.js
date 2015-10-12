var mongoose = require('mongoose');
var settings = require('../settings');

function DbFn(){};
// Schema 结构
var mongooseSchema = new mongoose.Schema({ 
    index : {type : Number},
    accessToken : {type : String},
    time     : {type : Date, default: Date.now}
});

DbFn.conect = function(){
	var db = mongoose.createConnection(settings.url);
	// 链接错误
	db.on('error', function(error) {
		console.log(error);
	});

	return db;
};

DbFn.save = function(oData, cb){
	
	var db = this.conect();

	// model
	var mongooseModel = db.model('access_token', mongooseSchema);
	
	// 增加记录 基于model操作
	var doc = {index:oData.index,accessToken : oData.accessToken};
	
	mongooseModel.create(doc, function(error,result){
		if(error) {
			//console.log(error);
			cb(error);
		} else {
			console.log('save ok');
			cb(null,result);
		}
		// 关闭数据库链接
		db.close();
	});
}

DbFn.get = function(index,cb){
	
	var db = this.conect();

	// model
	var mongooseModel = db.model('access_token', mongooseSchema);
	var criteria = {}; // 查询条件
	var fields   = {}; // 待返回的字段
	var options  = {};
	mongooseModel.find(criteria, fields, options, function(error, result){
		if(error) {
			//console.log(error);
			cb(error);
		} else {
			cb(null,result);
		}
		//关闭数据库链接
		db.close();
	})
};

DbFn.update = function(accessToken,oTime,cb){
	
	
	var db = this.conect();

	// model
	var mongooseModel = db.model('access_token', mongooseSchema);
	
	var conditions = {index : 1};
	var update     = {$set : {"accessToken" : accessToken,"time": oTime}};//,time: Date.now
	var options    = {upsert : true};
	mongooseModel.update(conditions, update, options, function(error,result){
		if(error) {
			console.log(error);
		} else {
			console.log('update ok!');
			//console.log(result);
			cb();
		}
		//关闭数据库链接
		db.close();
	});
}


module.exports = DbFn;