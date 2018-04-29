<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2018/4/11
  Time: 15:23
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="zh-CN">
<head>
    <title>柏拉图</title>
    <link rel="stylesheet" href="css/excelloadstyle.css" media="screen"
          type="text/css" />
    <link rel="stylesheet" href="css/upload.css" />
    <script src="js/jquery.min.js"></script>
    <script src="assets/js/spin.min.js"></script>
    <script src="assets/js/highchart/highcharts.js"></script>
    <script src="assets/js/highchart/exporting.js"></script>
    <script src="assets/js/pareto.js"></script>
    <script src="assets/js/vis.js"></script>
    <script src="js/index.js"></script>
</head>
<body>

<div class=test>
    <div style="float: left; margin-top: 10px; margin-left: 3%; width: 100%;">
        <div>
            <div style="margin-top: 5px; float: left">
                <button style="height: 35px; width: 180px; margin-left: 20px"
                        class="btn btn-sm btn-primary" onclick="downloadexcel()">
                    <span class="bigger-110"><i class="fa fa-cloud-download"></i>&nbsp;&nbsp;下载测量数据模板</span>
                </button>
            </div>
            <div style="margin: 5px 10px; float: left">
                <form action="jsp/dataUpload" method="post"
                      enctype="multipart/form-data" target="iframeInfo"
                      onsubmit="return checkfile();">
                    <div class="input-group">
                        <input id="dataList" type="file" name="file" class="form-control"
                               style="width: 200px" /> <input type="submit" style="height: 35px"
                                                              id="import_button" class="btn btn-primary" value="导入数据" />
                    </div>
                </form>
                <iframe name="iframeInfo" id="iframeInfo" style="display: none"></iframe>
            </div>

            <!-- 表格内容  -->
            <div style="clear: both"></div>
            <div id="EXCEL"
                 style="float: left; width:20%; margin-left: 20px; margin-top: 50px;">
                <table id="hand-table"
                       class="table table-striped table-bordered table-hover ssl_import">
                    <thead>
                    <tr>
                        <th class="col-sm-1 ">1#</th>
                        <th class="col-sm-1 ">2</th>
                        <th class="col-sm-1 ">操作</th>
                    </tr>
                    </thead>
                    <tbody id="excelinfo"></tbody>
                </table>
                <div style="margin-top: 20px; margin-bottom: 20px">
                    <input type="button" style="margin-left: 40%"
                           class="upload_btn btn btn-small" value="添加信息" data-toggle="modal"
                           data-target="#modal-1"/>
                    <!--待加入-->
                </div>
            </div>

            <!-- 模态弹出框 -->
            <div class="modal fade" id="modal-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span><span class="sr-only">关闭</span>
                            </button>
                            <h4 class="modal-title">请输入测量数据信息：</h4>
                        </div>
                        <div class="modal-body">
                            <table class="table table-striped table-bordered table-hover ssl_import"
                                   id="modal-table">
                                <tr>
                                    <td>1#：</td>
                                    <td width="5%"><input type="text" style="width: 100px"
                                                          id="1"/></td>
                                    <td>2#：</td>
                                    <td width="5%"><input type="text" style="width: 100px"
                                                          id="2"/></td>
                                </tr>
                            </table>
                        </div>
                        <div class="modal-footer" style="text-align: center;">
                            <button class="btn btn-sm btn-primary" onclick="addTable();">
                                <span class="bigger-110"><i class="fa fa-check"></i>确定</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <!-- 显示柏拉图动态过程 -->
            <div style="float: left; margin-left: 20px; display: none">
                <button style="height: 35px; margin-left: 20px"
                        class="btn btn-sm btn-primary" onclick="show()">
                    <span class="bigger-110"><i class="fa fa-retweet"></i>&nbsp;&nbsp;显示柏拉图</span>
                </button>
            </div>
        </div>
        <!-- 柏拉图的大小 -->
        <div id="div"
             style="float: left; margin: 0 auto; height: 350px; min-width: 40%; margin-top: 50px; margin-bottom: 50px;"></div>
    </div>
</div>

<!--modal对话框 :用于文件上传等候操作-->
<div class="modal fade" id="excelholdon" tabindex="-1" role="dialog"
     aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="loader">文件读取中...</div>
        </div>
    </div>
</div>

<!-- footer -->

</body>
</html>
