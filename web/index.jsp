<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2018/4/11
  Time: 15:23
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>创新方法工作平台</title>
    <!--添加页面框架-->
    <link rel="stylesheet" href="./static/css/excelloadstyle.css" media="screen" type="text/css" />
    <link rel="stylesheet" href="./static/css/upload.css"/>
    <!--bootstrapTable-->
    <link rel="stylesheet" href="http://innovation.xjtu.edu.cn/webresources/ace-master/assets/css/bootstrap.min.css">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="http://innovation.xjtu.edu.cn/webresources/bootstrap/bootstrap-table/bootstrap-table.min.css">
    <link rel="import" id="frame" href="/webresources/common/html/appFrame.html">
    <style>
        .file {
            position: relative;
            display: inline-block;
            overflow: hidden;
            text-decoration: none;
            text-indent: 0;
            line-height: 20px;
        }

        .file input {
            position: absolute;
            font-size: 100px;
            right: 0;
            top: 0;
            opacity: 0;
        }

        .file:hover {
            text-decoration: none;
        }

        table input {
            width: 75%;
            height:30px;
            margin-bottom:5px;
        }

        .main-content {
            margin-left: 0px;
        }

        div {
            margin-left: auto;
            margin-right: auto;
        }
        .modal-dialog{
            width:40%;
        }
        tr td{
            vertical-align: middle!important;
        }
    </style>
    <script type="text/javascript" src="js/buttonAction.js"></script>
    <script src="assets/js/spin.min.js"></script>
    <script src="assets/js/highchart/highcharts.js"></script>
    <script src="assets/js/highchart/exporting.js"></script>
    <script src="assets/js/vis.js"></script>
    <script src="./static/dependencies/excel/cpexcel.js"></script>
    <script src="./static/dependencies/excel/shim.js"></script>
    <script src="./static/dependencies/excel/jszip.js"></script>
    <script src="./static/dependencies/excel/xlsx.js"></script>
    <script src="./static/dependencies/vue.js"></script>
    <!-- FileSaver.js is the library of choice for Chrome -->
    <script type="text/javascript" src="./static/dependencies/excel/Blob.js"></script>
    <script type="text/javascript" src="./static/dependencies/excel/FileSaver.js"></script>
    <script type="text/javascript" src="./static/dependencies/dom-to-image.js"></script>
    <script src="./static/js/index.js"></script>
    <!--静态资源中已经添加的css和js-->
    <!--bootstrapTable-->

    <!-- 最新版本的 Bootstrap 核心 CSS 文件 -->
    <!-- Latest compiled and minified JavaScript -->
    <script src="http://innovation.xjtu.edu.cn/webresources/bootstrap/bootstrap-table/bootstrap-table.min.js"></script>
    <!-- Latest compiled and minified Locales -->
    <script src="http://innovation.xjtu.edu.cn/webresources/bootstrap/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>

</head>
<body class="no-skin">
<div id="mainFunctionHtml">
    <div id="myCustomLi">
        <li class="active">
            <a data-toggle="tab" href="#abc" id="mainFunction">
                <i class="green ace-icon fa fa-desktop bigger-120"></i>主功能区</a>
        </li>
    </div>
    <div id="myCustomTab">
        <div class="tab-pane active" id="abc">
            <div id="mainBtnGroup" class="btn-group btn-group-sm">
                <a type="button" class="btn btn-info"  href="template/pareto_template.xls">
                    <span class="menu-icon fa fa-download"></span>下载模板
                </a>
                <a type="button" class="btn btn-info file">
                    <span class="glyphicon glyphicon-upload"></span>文件导入
                    <input class="" id="xlf" type="file" name="xlfile"/>
                </a>
                <a type="button" class="btn btn-info"  data-toggle="modal" data-target="#myModal">
                    <span class="glyphicon glyphicon-plus"></span>添加数据
                </a>
                <a type="button" class="btn btn-info" id="btnSaveAsPicture">
                    <span class="glyphicon glyphicon-ok"></span>保存图片
                </a>
                <a type="button" class="btn btn-info" id="btnSaveToFile">
                    <span class="glyphicon glyphicon-download"></span>导出文件
                </a>
                <a type="button" class="btn btn-info" id="saveProject">
                    <span class="menu-icon fa fa-folder"></span>保存至云
                </a>
            </div>
        <%--柏拉图主体部分--%>

            <div id="print" class="row" style="margin-top: 20px;">
                <div id="app" class="col-sm-6">
                    <%--展示表格--%>
                    <table id="showTable" class="table" style="text-align: center;font-size: 16px;display: none">
                        <tr>
                            <td>问题</td>
                            <td>数量</td>
                            <td>操作</td>
                        </tr>
                        <tr v-for="problem in problems">
                            <td style="display: none;" class="id">{{problem.id}}</td>
                            <td>{{problem.name}}</td>
                            <td>{{problem.num}}</td>
                            <td><button class="btn btn-sm btn-danger" onclick="javascript:delElement(this);">删除</button></td>
                        </tr>
                    </table>
                        <div id="toolbar" class="btn-group">
                            <button id="btn_add" class="btn btn-default" onclick="queryPath()">
                                <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>新增
                            </button>
                        </div>
                        <table id="table"
                               data-toggle="table"
                               data-height="460"
                               data-click-to-select="true"
                               >
                            <thead>
                            <tr>
                                <th data-field="state" data-checkbox="true"
                                    data-formatter="stateFormatter"></th>
                                <th>问题</th>
                                <th>数量</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="problem in problems">
                                    <td class="bs-checkbox "><input data-index="{{problem.id}}" name="btSelectItem" type="checkbox"></td>
                                    <td>{{problem.name}}</td>
                                    <td>{{problem.num}}</td>
                                </tr>
                            </tbody>
                        </table>

                    <%--展示表格End--%>
                        <%--导出Table--%>
                        <table id="exportTable" style="display:none">
                            <thead>
                                <tr>
                                    <th>问题</th>
                                    <th>数量</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>问题1</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <td>问题2</td>
                                <td>2</td>
                            </tr>
                            </tbody>
                        </table>
                        <%--导出Table End--%>
                </div>
                <div id="paretoDiv" class="col-sm-6"></div>
                <%--弹层--%>
                <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>
                                <h4 class="modal-title" id="myModalLabel">添加问题</h4>
                            </div>
                            <div class="modal-body">
                                <label>问题名称：</label>
                                <input id="input_problem_name" class="form-control" placeholder="请输入问题名称" >
                                <label>问题数量：</label>
                                <input id="input_problem_num" class="form-control" placeholder="请输入问题数量">
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="javascript:addElement()">添加</button>
                            </div>
                        </div>
                    </div>
                </div>
                <%--弹层End--%>
            </div>
        <%--柏拉图主体部分End--%>
        </div>
    </div>
</div>
<!--帮助页面-->
<div id="helpHtml">
    <div class="page-header">
        <h1>
            柏拉图App使用说明
        </h1>
    </div>
    <div class="alert alert-block alert-success" id="appHelp">
        <div class="helpClass">
            <p class="helpP">
                <i class="ace-icon fa fa-check green"></i>
                欢迎使用<strong class="green">App</strong>, 使用流程如下：<br>
                &nbsp;&nbsp;&nbsp;&nbsp;1、首先*****<br>
                截图<br>
                &nbsp;&nbsp;&nbsp;&nbsp;2、其次*****<br>
                截图<br>
                &nbsp;&nbsp;&nbsp;&nbsp;3、最后*****<br>
                截图<br>
            <p>
        </div>
    </div>
</div>
</body>
<script type="text/javascript">
    function stateFormatter(value, row, index) {
        if (index === 2) {
            return {
                disabled: true
            };
        }
        if (index === 5) {
            return {
                disabled: true,
                checked: true
            }
        }
        return value;
    }
//    $('#table').bootstrapTable({
//        url: 'Servlet',         //请求后台的URL（*）
//        method: 'get',                      //请求方式（*）
//        toolbar: '#toolbar',                //工具按钮用哪个容器
//        striped: true,                      //是否显示行间隔色
//        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
//        pagination: true,                   //是否显示分页（*）
//        sortable: true,                     //是否启用排序
//        sortOrder: "asc",                   //排序方式
////                queryParams: oTableInit.queryParams,//传递参数（*）
//        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
//        pageNumber: 1,                       //初始化加载第一页，默认第一页
//        pageSize: 20,                       //每页的记录行数（*）
////                pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
//        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
//        strictSearch: true,
//        showColumns: true,                  //是否显示所有的列
//        showRefresh: true,                  //是否显示刷新按钮
//        minimumCountColumns: 2,             //最少允许的列数
//        clickToSelect: true,                //是否启用点击选中行
//        height: 1000,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
//        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
////                showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
//        cardView: false,                    //是否显示详细视图
//        detailView: false,                   //是否显示父子表
////        onLoadSuccess: bdCopy,
//
//        responseHandler: function (res) {
//            //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
//            //在ajax后我们可以在这里进行一些事件的处理
//            var datat = JSON.stringify(res);
//            data = JSON.parse(datat);
//            return data;
//        },
//        columns: [ {
//            field: 'name',
//            title: '静态资源名称'
//        }, {
//            field: 'attribute',
//            title: '静态资源属性'
//        }, {
//            field: 'link',
//            title: '链接',
//            formatter: linkFormatter
//        }, {
//            field: 'version',
//            title: '版本'
//        },  {
//            field: 'searchTimes',
//            title: '引用次数'
//        }, {
//            field: 'op',
//            title: '操作',
////                    events: operateEvents,
//            formatter: operateFormatter
//        },{
//            field: 'reLink',
//            title: '相对链接',
//            visible:false
//        }]
//    });
</script>
</html>