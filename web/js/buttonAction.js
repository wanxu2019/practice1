var projectId = 0;//项目Id
var projectName;//项目名
var appResult = null;//word报告
var appName = "pareto";//将demo改为app名称，与数据库中表名字一致（必填）
var appNameChinese = '帕累托图';//app中文名（必填）
var USER_NAME = '';//当前登录用户名

// 添加项目后，自定义操作
function addSelfDefine(result) {
    //上一层函数查看basicAction.js中addProject()函数
    /*
    * your code.....
    **/
    //$('a[onclick="sideCheck('+result.content.id+',this)"]').trigger("click");
    $('div[onclick="sideCheck('+result.content.id+',this)"]').trigger("click");
    //console.log("add project successful");
}

// 查看项目后，自定义操作
function checkSelfDefine(node, result) {
    // 上一层函数查看basicAction.js中checkProject()函数
    /*
    * your code.....
    **/
    $('#mainFunction').trigger('click');
    initCustomText();
    //console.log("appContent:"+result.content.appContent);
    //console.log("appResult:"+result.content.appResult);
    projectName=result.content.projectName;
    try{
        problems=JSON.parse(result.content.appContent);
        //设置max_id
        for(var i=0;i<problems.length;i++){
            max_id=max(max_id,problems[i].id);
        }
    }catch(e){
        //console.log(e);
        problems=[];
    }
    if(problems.length>0){
        displayDataInTable();
        displayDataInPareto();
    }else{
        //没有数据就清空所有图表
        hideDisplayElements();
    }
    //console.log("check project successful");
}

//删除项目后，自定义操作
function removeSelfDefine(result) {
    // 上一层函数查看basicAction.js中removeProject()函数
    /*
    * your code.....
    **/
    //$($('a[onclick^="sideCheck("]')[0]).trigger("click");
    //$($('div[onclick^="sideCheck("]')[0]).trigger("click");
    //同步保存当前项目数据
    $.ajax({
        url:"/projectManager/api/v1/project",
        type:"put",
        async:false,
        //群组ID
        data:{
            id:projectId,
            appName:appName,
            //appResult:$("#WYeditor").html(),
            appContent:getSerializableData()
        },
        success:function(result){
            if(result.state){
                //请求正确
                //console.log(result.content);
                show("数据保存成功");
            }else{
                //请求错误
                //console.log(result.error);
                show("数据保存失败："+result.error);
            }
        }
    });
    //console.log("remove project successful");
}
var customText = {//word编辑区自定义文本内容
    'title': "<h2>1 帕累托图App分析结果 </h2>",
    'img':""
};
function initCustomText(){
    customText = {//word编辑区自定义文本内容
        'title': "<h2>1 帕累托图App分析结果 </h2>",
        'img': ""
    };
}
//定制初始化内容
function setCustomContext() {
    // canvas图片获取方式
    var img = $("#canvas")[0];  //选择页面中的img元素
    var image = new Image();
    if (img != null) {
        image.src = img.toDataURL("image/png");
    }
    var img1 = image;
    // 其他示例
    var img2 = $("#image2Id");  //选择页面中的img元素
    var wordImgArr = [img1, img2];//定义图片数组
    //var customText = {//word编辑区自定义文本内容
    //    'title': "<h2>1 **App分析结果 </h2>",
    //    'chap1': "<h3>1.1 *******</h3>",
    //    'img1': wordImgArr[0],
    //    'chap2': "<h3>1.2 *******</h3>",
    //    'img2': wordImgArr[1],
    //    'chap3': "<h3>1.3 结论****</h3>"
    //};
    //custom code begin
    try {
        for (var variable  in customText) {//遍历自定义文本对象
            $("#WYeditor").append(customText[variable]);//插入元素
        }
    }
    catch(e){
        //console.log("初始化报告失败");
    }
    //custom code end
}
