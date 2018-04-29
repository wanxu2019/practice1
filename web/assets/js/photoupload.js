var flag = 0;// 用于判断是否获得文件名称
var initial = true;
var recimagesource = "";// 存放上一次图像的地址(配置时)

$(function() {
	setInterval("imagefource()", 3000);// 监测文件名称是否获得
});

// 获取图片上传之后的路径以及文件名
function imagefource() {
	var imagesource = "";
	imagesource = $("#iframeInfo").contents().find("pre").html();
	console.log("地址="+imagesource);
	if (imagesource != "" && imagesource != null && imagesource != "undefined") {
		if (initial
				|| recimagesource.substring(1, recimagesource.length - 1) != imagesource
						.substring(1, imagesource.length - 1)) {
			recimagesource = imagesource;
			imagesource = imagesource.substring(1, imagesource.length - 1);
			console.log("地址1="+imagesource);
			$("#photo").attr("src", imagesource);
//			$(".nav-user-photo").attr("src", imagesource);
//			$("#employeephoto").val(imagesource);
			initial = false;
			spinner.spin();
//			var id = $("#accountID").val();
//			$.post('jsp/common/personal_modifyimgurl',{id:id,imgurl:imagesource},function(data){
//			});
			
		}

	}
}