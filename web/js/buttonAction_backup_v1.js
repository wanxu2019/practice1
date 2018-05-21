var projectId = 0;//项目Id
var projectName;//项目名
var appResult = null;//word报告
var appName = "pareto";//将demo改为app名称，与数据库中表名字一致（必填）
var appNameChinese = '柏拉图';//app中文名（必填）
var USER_NAME = '';//当前登录用户名

console.log("模板层Id为：" + tempProjectID);//当前模板项目ID

//删除项目
function removeProject(index) {
    if (confirm("项目删除后将无法恢复，确认要删除吗？")) {
        $.ajax({
            url: "/projectManager/api/v1/project",
            type: "delete",
            data: {
                "id": index,
                "appName": appName
            },
            success: function (result) {
                if (result.state) {
                    location.reload();//刷新页面
                } else {
                    console.log(result.error);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {//输出错误信息
                console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
                console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
                console.log("textStatus是：" + textStatus);
                console.log("errorThrown是：" + errorThrown);
            }
        });
    }
}

// 添加项目函数
function addProject() {
    // 获取输入框中的内容
    var projectName = $('#projectNameModal')[0].value;//获取项目名
    var createDate = new Date().toLocaleDateString() + ',' + new Date().getHours() + ':' + new Date().getMinutes();//获取项目创建时间
    var memo = $('#projectRemarkModal')[0].value;//获取备注
    var data = {
        "appName": appName,
        "id": 0,
        "createDate": createDate,
        "projectName": projectName,
        "memo": memo,
        "appResult": appResult,
        "tempProjectID": tempProjectID
    };

    //表格添加数据
    if (projectName === '') {
        alert("请输入项目名！！！");
    } else {
        // 添加数据库
        $.ajax({
            type: "post",
            url: "/projectManager/api/v1/project",
            data: data,
            success: function (result) {
                if (result.state) {
                    location.reload();
                } else {
                    console.log(result.error);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {//打印错误信息
                console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
                console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
                console.log("textStatus是：" + textStatus);
                console.log("errorThrown是：" + errorThrown);
            }
        });
        $('#newProjectModal').modal('hide');//隐藏模态框
        // 在前台添加表格
    }
}

// 查看项目
function checkProject(index) {
    projectId = index;//项目全局ID
    checkBasic();//前台样式调整函数，具体内容在静态资源中
    //数据库查看项目
    $.ajax({
        url: "/projectManager/api/v1/project",
        type: "get",
        data: {
            "appName": appName,
            "id": projectId
        },
        success: function (result) {
            if (result.state) {
                //将项目数据加载到主功能区
                /*
                * your code.......
                **/
                $('#mainFunction').trigger('click');
                console.log("appContent:"+result.content.appContent);
                console.log("appResult:"+result.content.appResult);
                try{
                    problems=JSON.parse(result.content.appContent);
                    //设置max_id
                    for(var i=0;i<problems.length;i++){
                        max_id=max(max_id,problems[i].id);
                    }
                }catch(e){
                    console.log(e);
                    problems=[];
                }
                if(problems.length>0){
                    displayDataInTable();
                    displayDataInPareto();
                }else{
                    //没有数据就清空所有图表
                    hideDisplayElements();
                }
                var oDate = new Date(result.content.createDate);
                var createTime = oDate.toLocaleDateString() + ',' + oDate.getHours() + ':' + oDate.getMinutes();//获取创建时间
                $('#timeModal').html(createTime);//创建时间添加到模态框
                $('#remarkModal').html(result.content.memo);//项目备注添加到模态框
                $('#ProjectNameModal').html(result.content.projectName);//项目名添加到模态框
            } else {
                console.log(result.error);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {//打印错误信息
            console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
            console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
            console.log("textStatus是：" + textStatus);
            console.log("errorThrown是：" + errorThrown);
        }
    })
}

//获得内容
function getWordContext() {
    $.ajax({
        url: "/projectManager/api/v1/project",
        type: "put",
        //群组ID
        data: {
            id: projectId,
            appName: appName,
            appResult: $.trim($('#WYeditor').html())
        },
        success: function (result) {
            if (result.state) {
                //请求正确
                alert('恭喜你，word内容保存成功');
                console.log(result.content)
            } else {
                //请求错误
                console.log(result.error)
            }
        }
    });
}
var customText1 = {//word编辑区自定义文本内容
    'title': "<h2>1 柏拉图App分析结果 </h2>",
    'chap1': "<h3>1.1 *******</h3>",
    'chap2': "<h3>1.2 *******</h3>",
    'chap3': "<h3>1.3 结论****</h3>"
};
var customText = {//word编辑区自定义文本内容
    'title': "<h2>1 柏拉图App分析结果 </h2>",
    'img':""
};
//定制初始化内容
function setCustomContext() {
    try {
        for (var variable  in customText) {//遍历自定义文本对象
            $("#WYeditor").append(customText[variable]);//插入元素
        }
    }
    catch(e){
        console.log("初始化报告失败");
    }
}