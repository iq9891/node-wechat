$(function(){
	//https://api.weixin.qq.com/cgi-bin/user/info?access_token=infinititest_token&openid=OPENID&lang=zh_CN
	
	$.ajax({
		method: "GET",
		url: "//localhost:8888/"
	}).done(function(msg) {
		var oData = JSON.parse(msg);
		console.log(oData);
		$('#headerImg').attr('src',oData.headimgurl);
		$('#nickname').html(oData.nickname);
		$('#country').html(oData.country);
		$('#province').html(oData.province);
		$('#openid').html(oData.openid);
		localStorage.setItem("openid",oData.openid);
	});
});