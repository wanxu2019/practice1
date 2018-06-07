/**
 * Created by Json Wan on 2017/8/29.
 */
/**
 * 点击编辑显示弹出框
 */
//draw.js内容
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};
function max(x1,x2){
    return x1>x2?x1:x2;
}
function min(x1,x2){
    return x1<x2?x1:x2;
}

//draw.js内容End
function saveDataToProjectManager(){
    console.log("saveDataToProjectManager:");

}
/*jshint browser:true */
/* eslint-env browser */
/* eslint no-use-before-define:0 */
/*global Uint8Array, Uint16Array, ArrayBuffer */
/*global XLSX */
var X = XLSX;
var XW = {
    /* worker message */
    msg: 'xlsx',
    /* worker scripts */
    worker: './xlsxworker.js'
};

var global_wb;

var process_wb = (function () {
    var OUT = document.getElementById('out');
    var HTMLOUT = document.getElementById('htmlout');

    var get_format = (function () {
        var radios = document.getElementsByName("format");
        return function () {
            for (var i = 0; i < radios.length; ++i)
                if (radios[i].checked || radios.length === 1)
                    return radios[i].value;
        };
    })();

    var to_json = function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
            var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if (roa.length) result[sheetName] = roa;
        });
        return JSON.stringify(result, 2, 2);
    };

    var to_csv = function to_csv(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function (sheetName) {
            var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            if (csv.length) {
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(csv);
            }
        });
        return result.join("\n");
    };

    var to_fmla = function to_fmla(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function (sheetName) {
            var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
            if (formulae.length) {
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(formulae.join("\n"));
            }
        });
        return result.join("\n");
    };

    var to_html = function to_html(workbook) {
        HTMLOUT.innerHTML = "";
        workbook.SheetNames.forEach(function (sheetName) {
            var htmlstr = X.write(workbook, {sheet: sheetName, type: 'binary', bookType: 'html'});
            HTMLOUT.innerHTML += htmlstr;
        });
        return "";
    };

    return function process_wb(wb) {
        global_wb = wb;
        var output = "";
        //switch(get_format()) {
        //    case "form": output = to_fmla(wb); break;
        //    case "html": output = to_html(wb); break;
        //    case "json": output = to_json(wb); break;
        //    default: output = to_csv(wb);
        //}
        output = to_json(wb);
        //show(output);
        //处理Excel中的数据
        handle_excel_data(output);
        //if(OUT.innerText === undefined)
        //    OUT.textContent = output;
        //else
        //    OUT.innerText = output;
        //if(typeof console !== 'undefined')
        //    console.log("output", new Date());
    };
})();

var problems=[];
var max_id=0;
//清空所有数据
function clearAllData(){
    problems=[];
    max_id=0;
}
var setfmt = window.setfmt = function setfmt() {
    if (global_wb)
        process_wb(global_wb);
};

var b64it = window.b64it = (function () {
    var tarea = document.getElementById('b64data');
    return function b64it() {
        if (typeof console !== 'undefined') console.log("onload", new Date());
        var wb = X.read(tarea.value, {type: 'base64', WTF: false});
        process_wb(wb);
    };
})();

var do_file = (function () {
    var rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString;
    var domrabs = document.getElementsByName("userabs")[0];
    if (!rABS) domrabs.disabled = !(domrabs.checked = false);

    var use_worker = typeof Worker !== 'undefined';
    var domwork = document.getElementsByName("useworker")[0];
    if (!use_worker) domwork.disabled = !(domwork.checked = false);

    var xw = function xw(data, cb) {
        var worker = new Worker(XW.worker);
        worker.onmessage = function (e) {
            switch (e.data.t) {
                case 'ready':
                    break;
                case 'e':
                    console.error(e.data.d);
                    break;
                case XW.msg:
                    cb(JSON.parse(e.data.d));
                    break;
            }
        };
        worker.postMessage({d: data, b: rABS ? 'binary' : 'array'});
    };

    return function do_file(files) {
        //rABS = domrabs.checked;
        rABS = true;
        //use_worker = domwork.checked;
        use_worker = false;
        var f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
            var data = e.target.result;
            if (!rABS) data = new Uint8Array(data);
            if (use_worker) xw(data, process_wb);
            else process_wb(X.read(data, {type: rABS ? 'binary' : 'array'}));
        };
        if (rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
    };
})();

//写入excel操作
function s2ab(s) {
    if(typeof ArrayBuffer !== 'undefined') {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    } else {
        var buf = new Array(s.length);
        for (var i=0; i!=s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}

function export_table_to_excel(id, type, fn) {
    var wb = XLSX.utils.table_to_book(document.getElementById(id), {sheet:"Sheet JS"});
    var wbout = XLSX.write(wb, {bookType:type, bookSST:true, type: 'binary'});
    var fname = fn || 'test.' + type;
    try {
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fname);
    } catch(e) { if(typeof console != 'undefined') console.log(e, wbout); }
    return wbout;
}

function doit(type, fn) {
    return export_table_to_excel('exportTable', type || 'xlsx', fn);
}

var handle_excel_data_flag = 0;
//处理导入的excel数据
function handle_excel_data(data) {
    //console.log("handle_excel_data begin:");
    //两次只处理一次
    switch (handle_excel_data_flag) {
        case 0:
            handle_excel_data_flag = 1;
            break;
        case 1:
            handle_excel_data_flag = 0;
            break;
        default :
            break;
    }
    console.log(data);
    data = JSON.parse(data);
    //加载
    loadDataFromExcel(data);
    //显示表格
    displayDataInTable();
    //显示柏拉图
    displayDataInPareto();
    //清除状态
    var xlf = document.getElementById('xlf');
    if (xlf) {
        xlf.value = "";
    }
    //console.log(data);
    //console.log("handle_excel_data end;");
}
//显示帕累托图
function drawPareto(problem,num1,num2){
    var chart = {
        title: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: problem
        },
        yAxis: [
            {
                labels:{
                    format: '{value}',
                    style:{
                        //color:'#4572A7',
                        color:'#000000',
                        fontSize:'16px'
                    }
                },
                title: {
                    text: '问题数量'
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    },
                ],
                tickPositioner: function() {
                    var positions = [0];
                    var increment = Math.ceil(this.dataMax/5);
                    for(var i=0;i<6;i++){
                        positions.push(positions[i]+increment);
                    }
                    return positions;
                }
            },
            {
                labels:{
                    format: '{value}%',
                    style:{
                        //color:'#89A54E',
                        color:'#000000',
                        fontSize:'16px'
                    }
                },
                title: {
                    text: '累计百分比'
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    },
                ],
                opposite: true,
                //tickPixelInterval:10,
                tickPositioner: function() {
                    var positions = [0,20,40,60,80,100,120];
                    return positions;
                }
            },
        ],
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [
            {
                name: '问题数量',
                color: '#4572A7',
                type: 'column',
                data: num1
            },
            {
                name: '累计百分比',
                color: '#89A54E',
                type: 'spline',
                yAxis: 1,
                data: num2,
                tooltip: {
                    valueSuffix: '%'
                }
            },
        ],
        credits: { enabled: false }
    };
    $('#paretoDiv').highcharts(chart,function(){
        //等500ms渲染完成后保存图片
        setTimeout(function(){
            console.log("begin to save image");
            //画完图后需要临时存储起来以供word使用
            if(customText!=undefined){
                domtoimage.toPng(document.getElementById('paretoDiv'))
                    .then(function (dataUrl) {
                        //console.log("dataUrl:"+dataUrl);
                        var img = new Image();
                        img.src = dataUrl;
                        customText.img = img;
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
            }
        },1000);
    });
}
function show(msg) {
    console.log("log:" + msg);
}
//模拟一份excel数据
function mockExcelData(){
    return {
        "Sheet1": [
            {
                "问题": "问题1",
                "数量": "1"
            },
            {
                "问题": "问题2",
                "数量": "3"
            },
            {
                "问题": "问题3",
                "数量": "2"
            },
            {
                "问题": "问题4",
                "数量": "4"
            },
            {
                "问题": "问题5",
                "数量": "70"
            },
            {
                "问题": "问题6",
                "数量": "5"
            },
            {
                "问题": "问题7",
                "数量": "10"
            },
            {
                "问题": "问题8",
                "数量": "8"
            }
        ]
    };
}
//从Excel中把数据加载到模型中
function loadDataFromExcel(data){
    clearAllData();
    data=data["Sheet1"];
    for(var i=0;i<data.length;i++){
        var name=data[i]["问题"];
        var num=parseInt(data[i]["数量"]);
        problems.push({
            id:i,
            name:name,
            num:num
        });
        max_id=max(max_id,i);
    }
}
var vueObject;
//在表格中展示数据
function displayDataInTable(){
    //Vue的方式
    //if(vueObject!=null){
    //    if($("#showTable").css("display")=="none"){
    //        $("#showTable").css("display","");
    //    }
    //    for(var i=0;i<vueObject.problems.length;){
    //        vueObject.problems.pop();
    //    }
    //    for(i=0;i<problems.length;i++){
    //        vueObject.problems.push(problems[i]);
    //    }
    //}
    //BootStrap Table的方式
    var showTableWrapper=$("#showTableWrapper");
    var showTable=$("#showTable");
    if(problems.length==0){
        showTableWrapper.css("display","none");
    }else{
        if(showTableWrapper.css("display")=="none"){
            showTableWrapper.css("display","");
        }
        showTable.bootstrapTable("load",problems);
    }
}
//使用帕累托图展示数据
function displayDataInPareto(){
    //构造插件所需数据格式
    var p=Array();
    var n=Array();
    for(var i=0;i<problems.length;i++){
        var name=problems[i].name;
        var num=problems[i].num;
        p.push(name);
        n.push(num);
    }
    //排序，冒泡
    for(var i=0;i< p.length;i++){
        for(var j=0;j< p.length-1-i;j++){
            if(n[j]<n[j+1]){
                //交换p
                var tmp=p[j];
                p[j]=p[j+1];
                p[j+1]=tmp;
                //交换n
                tmp=n[j];
                n[j]=n[j+1];
                n[j+1]=tmp;
            }
        }
    }
    //汇总
    var sum=0;
    var n2=[];
    for(i=0;i< n.length;i++){
        sum+=n[i];
    }
    for(i=0;i< n.length;i++){
        if(i>0) {
            n2.push(n[i] / parseFloat(sum) * 100 + n2[i - 1]);
        }else{
            n2.push(n[i] / parseFloat(sum) * 100);
        }
    }
    //画图
    if($("#paretoDiv").css("display")=="none"){
        $("#paretoDiv").css("display","");
    }
    drawPareto(p,n,n2);
}
//将数据序列化成为字符串以便保存
function getSerializableData(){
    //console.log(JSON.stringify(problems));
    //return "测试数据";
    return JSON.stringify(problems);
}
//隐藏显示元素
function hideDisplayElements(){
    $("#showTableWrapper").css("display","none");
    $("#paretoDiv").css("display","none");
}
//添加元素
function addElement(){
    var name=$("#input_problem_name").val().trim();
    var num=$("#input_problem_num").val().trim();
    if(name==""||num==""){
        alert("问题名称与数量不可为空，请检查后重新输入");
        return ;
    }
    try{
    num=parseInt(num);
    }catch(e){
        alert("问题数量不符合规范，请检查后重新输入");
        return ;
    }
    if(isNaN(num)||num<=0){
        alert("问题数量不符合规范，请检查后重新输入");
        return ;
    }
    max_id+=1;
    problems.push({
        "id":max_id,
        "name":name,
        "num":num,
        "state":false
    });
    displayDataInTable();
    displayDataInPareto();
    //添加完成之后清除掉已输入的数据
    $("#input_problem_name").val("");
    $("#input_problem_num").val("");
}
//重新绘制表格与图像
function reDisplay(){
    //删除之后重绘表格
    displayDataInTable();
    //删除之后柏拉图也需要重绘
    displayDataInPareto();
    //如果元素删完了，就连表格和柏拉图都不画了
    if(problems.length==0){
        hideDisplayElements();
    }
}
//根据Id找出index
function getIndexById(id){
    //遍历找出index
    var index=0;
    for(;index<problems.length;index++){
        if(problems[index].id==id){
            break;
        }
    }
    return index;
}
//根据id删除元素
function delDataById(id){
    var index=getIndexById(id);
    //删除index的元素
    problems.splice(index,1);
}
//删除元素
function delElement(node){
    //console.log("del"+$(node).parents("tr").children("td.id").html());
    var id=parseInt($(node).parents("tr").children("td.id").html());
    delDataById(id);
    reDisplay();
}
//批量删除元素
function delElements(){
    var elements=$("#showTable").bootstrapTable("getSelections");
    for(var i=0;i<elements.length;i++){
        delDataById(parseInt(elements[i].id));
    }
    reDisplay();
}
//显示增加元素模态框
function showAddElementPanel(){
    console.log("添加：");
    $("#myModalLabel").html("添加问题");
    $("#btnAdd").css("display","");
    $("#btnEdit").css("display","none");
    //添加之前清除掉已输入的数据
    $("#input_problem_name").val("");
    $("#input_problem_num").val("");
}
//显示编辑元素面板
function showEditElementPanel(id){
    $("#myModalLabel").html("编辑问题");
    $("#btnAdd").css("display","none");
    $("#btnEdit").css("display","");
    var index=getIndexById(parseInt(id));
    $("#input_problem_id").val(problems[index].id);
    $("#input_problem_name").val(problems[index].name);
    $("#input_problem_num").val(problems[index].num);
    $("#myModal").modal();
    //console.log("edit:"+id);
}
//编辑元素
function editElement(){
    var id=parseInt($("#input_problem_id").val());
    var index=getIndexById(parseInt(id));
    var name=$("#input_problem_name").val().trim();
    var num=$("#input_problem_num").val().trim();
    if(name==""||num==""){
        alert("问题名称与数量不可为空，请检查后重新输入");
        return ;
    }
    try{
        num=parseInt(num);
    }catch(e){
        alert("问题数量不符合规范，请检查后重新输入");
        return ;
    }
    if(isNaN(num)||num<=0){
        alert("问题数量不符合规范，请检查后重新输入");
        return ;
    }
    problems[index].name=name;
    problems[index].num=num;
    //编辑完成之后清除掉已输入的数据
    $("#input_problem_name").val("");
    $("#input_problem_num").val("");
    reDisplay();
}
//保存至文件
function saveToFile(){
    if(problems.length==0){
        alert("当前项目没有数据，请添加数据后保存");
        return ;
    }
    //把数据填充到导出表格当中
    //清理表格
    $("#exportTable tbody tr").remove();
    //提取数据放入格式化的表格
    for(var i=0;i<problems.length;i++) {
        $("#exportTable tbody").append("<tr></tr>");
        $("#exportTable tbody tr:nth-child(" + (i + 1) + ")").append("<td>" + problems[i].name + "</td>");
        $("#exportTable tbody tr:nth-child(" + (i + 1) + ")").append("<td>" + problems[i].num + "</td>");
    }
    //导出
    doit("xlsx","pareto_data.xlsx");
}
//保存为图片
function saveAsPicture(){
    if(problems.length==0){
        alert("当前项目没有数据，请添加数据后保存");
        return ;
    }
    domtoimage.toBlob(document.getElementById('paretoDiv'), { bgcolor: "#ffffff" })
        .then(function (blob) {
            window.saveAs(blob, 'pareto_picture.png');
        });
}
//保存至云端
function saveProject(){
    //console.log("save project begin:");
    if(projectId==0){
        alert("请先打开一个项目再保存数据");
        return ;
    }
    $.ajax({
        url:"/projectManager/api/v1/project",
        type:"put",
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
                console.log(result.content);
                alert("数据保存成功");
            }else{
                //请求错误
                console.log(result.error);
                alert("数据保存失败："+result.error);
            }
        }
    });
    //console.log("save project end:");
}
//另存项目
function saveAsProject() {
    var saveProjectNameArr = [];//获取所有项目
    // 获取输入框中的内容
    var projectName = $('#saveAsProjectNameModal')[0].value;//获取项目名
    var createDate = new Date().toLocaleDateString() + ',' + new Date().getHours() + ':' + new Date().getMinutes();//获取项目创建时间
    var memo = $('#saveAsProjectRemarkModal')[0].value;//获取备注
    var data = {
        "id": 0,
        "createDate": createDate,
        "projectName": projectName,
        "memo": memo,
        "appContent": getSerializableData(),
        "tempProjectID": tempProjectID
    };
//获取数据库所有项目名
    $.ajax({
        url: "/projectManager/api/v1/project",
        type: "get",
        async: false,
        dataType: "json",
        success: function (result) {
            saveProjectNameArr.length = 0;//数组清零
            result.content.forEach(function (element, index, array) {
                saveProjectNameArr.push(element.projectName);
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {//打印错误信息
            console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
            console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
            console.log("textStatus是：" + textStatus);
            console.log("errorThrown是：" + errorThrown);
        }
    });
    //表格添加数据
    if (projectName === '') {
        alert("请输入项目名！！！");
    } else if (saveProjectNameArr.indexOf(projectName) !== -1) {
        alert("项目已经存在，请重新输入项目名！！！");
    } else {
        // 添加数据库
        $.ajax({
            type: "post",
            url: "/projectManager/api/v1/project",
            data: data,
            success: function (result) {
                if (result.state) {
                    $('.selectList').prepend('<li class="">\n' +
                    '\t\t\t\t\t<a onclick="sideCheck(' + result.content.id + ',this)">\n' +
                    '\t\t\t\t\t\t<div>\n' +
                    '\t\t\t\t\t\t\t<div class="sideProjectLi" onmouseover="this.title = this.innerHTML;">\n' +
                    '\t\t\t\t\t\t\t\t' + result.content.projectName + '\n' +
                    '\t\t\t\t\t\t\t</div>\n' +
                    '\t\t\t\t\t\t\t<div style="position:absolute;bottom:6px;right:5px;">\n' +
                    '\t\t\t\t\t\t\t\t<i class="ace-icon fa fa-pencil align-top bigger-125 purple" id="checkSideLi" onclick="checkProject(' + result.content.id + ')" data-toggle="modal" data-target="#basicInfo"></i>\n' +
                    '\t\t\t\t\t\t\t\t<i class="ace-icon fa fa-trash-o bigger-120 red" id="deleteSideLi" onclick="removeProject(' + result.content.id + ')"></i>\n' +
                    '\t\t\t\t\t\t\t</div>\n' +
                    '\t\t\t\t\t\t</div>\n' +
                    '\t\t\t\t\t</a>\n' +
                    '\t\t\t\t</li>');
                    //侧边栏高度适应
                    var height = $(window).get(0).innerHeight;//获取屏幕高度
                    if ($('#cityList').children('li').length * 36 < height - 310) {
                        $('.selectList').css('height', $('#cityList').children('li').length * 36);
                    } else {
                        $('.selectList').css('height', height - 310);
                    }
                    $('#dynamic-table').DataTable().row.add(data).draw(false);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {//打印错误信息
                console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
                console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
                console.log("textStatus是：" + textStatus);
                console.log("errorThrown是：" + errorThrown);
            }
        });
        $('#saveAsModal').modal('hide');//隐藏模态框
        // 在前台添加表格
    }
}
//初始加载函数
$(function () {
    //alert("document ready!");
    $("#helpModal div.modal-dialog").css("width","60%");
    $("#btnSaveToFile").unbind('click').on("click", saveToFile);
    $("#btnSaveAsPicture").unbind('click').on("click", saveAsPicture);
    $("#btnDrawPareto").unbind('click').on("click", drawPareto);
    $("#saveProject").unbind('click').on("click", saveProject);
    var xlf = document.getElementById('xlf');
    if (!xlf.addEventListener)
        return;
    function handleFile(e) {
        //console.log("handleFile begin:");
        //延时调用的函数
        do_file(e.target.files);
        //console.log("handleFile end:");
    }
    xlf.addEventListener('change', handleFile, false);
    vueObject=new Vue({
        el: '#app',
        data: {
            problems: []
        }
    });
    //loadDataFromExcel(mockExcelData());
    //displayDataInPareto();
    //displayDataInTable();
});

