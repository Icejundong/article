
//创建登陆模块。
var loginApp = angular.module('loginApp',[]);
// 创建登陆模块的控制器
loginApp.controller('loginController',function($scope,$http){
    $scope.formData = {};
    $scope.postForm = function(){
        //这句话必须加
        $scope.formData.action='login';
        $http({
            method:'POST',
            url:'./get.php',
            data: $.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(function(data){
            console.log(data);
            if(!data.success){
                if(!data.errors){
                    $scope.message = data.message;
                }else{
                    $scope.errorUsername = data.errors.username;
                    $scope.errorPassword = data.errors.password;
                }
            }else{
                window.location.href = '#/0';
            }
        })
    }
})

// 列表页面的模块
var pageList = angular.module('pageList',[]);
// 分类列表的控制器
pageList.controller('ListTypeCtrl',function($scope,$http){
    $http({
        method:'GET',
        url:'get.php?action=get_arctype&where=reid=0'
    }).success(function(data,status,headers,config){
        $scope.lists = data;
    }).error(function(data,status,headers,config){
        console.log('error...');
    })
})


// 文章列表控制器
totals = 0;
pageList.controller('arcListCtrl',function($scope,$http,$location) {
    //首先先获取到当前的路径
    $scope.typeid = $location.path().replace('/', '');
    //获取文章的总数
    if ($scope.typeid == 0) {
        $get_total_url = 'get.php?action=get_total';
    } else {
        $get_total_url = 'get.php?action=get_total&where=typeid=' + $scope.typeid;
    }
    //发送请求
    $http({
        method: 'GET',
        url: $get_total_url
    }).success(function (data, status, headers, config) {
        $scope.paginationConf.totalItems = data.total;
    }).error(function (data, status, headers, config) {
        console.log('error....');
    })

    //获取到总的文章数量之后，我们其实就可以开始设置分页显示内容了.
    //  文章总数
    //  每页几条数据 pageSize
    //  当前页数  currentPage
    //  (current - 1) * pageSize = startPage
    //  limit(pageStart, pageSize)
    //  limit(10,20), 从10开始，查询20个数据
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5,
        pagesLength: 5,
        //这里一定要注意有一个空格
        perPageOptions: [5, 10, 15, 20, 25],
        rememberPerPage: 'perPageItems',
        onChange: function () {
            //获取分页的开始数
            if ($scope.paginationConf.currentPage == 1) {
                $scope.limit = 0;
            } else {
                //比如这里从第二页开始，那么每页显示五条数据，那么第二页就应该从第五条数据后显示五条才行.
                $scope.limit = $scope.paginationConf.currentPage * $scope.paginationConf.itemsPerPage
                    - $scope.paginationConf.itemsPerPage;
            }

            //根据当前的type类型，显示不同的栏目里面的内容,先显示的就是第一页的五条数据
            if ($scope.typeid == 0) {
                $geturl = 'get.php?action=get_list&offset=' + $scope.limit + '&rows=' + $scope.paginationConf.itemsPerPage +
                    '&orderField=id&orderBy=DESC';
            } else {
                $geturl = 'get.php?action=get_list&offset=' + $scope.limit +
                    '&rows=' + $scope.paginationConf.itemsPerPage + '&where=typeid=' + $scope.typeid + '&orderField=id&orderBy=DESC';
            }
            $http({
                method: 'GET',
                url: $geturl,
            }).success(function (data, status, headers, config) {
                $scope.lists = data;
                console.log(data);
            }).error(function (data, status, headers, config) {
                console.log('error....')
            })
        }
    }

    // 删除文章
    $scope.del = function (index,id) {
        $http({
            metdod:'GET',
            url:'get.php?action=delete_article&index='+ index + '&id=' + id,
        }).success(function (data) {
            if (data.code==101) {
                //删除成功
                //console.log('删除成功');
                $scope.meg_success="删除成功!";
                $scope.meg_error="";
//                setTimeout(function(){location.href='#/list/0'}, 1000);
                //重新发送ajax请求 页面
                $http({
                    method: 'GET',
                    url: $geturl,
                }).success(function (data) {
                    $scope.lists = data;
                }).error(function (err) {
                })
                $http({
                    method: 'GET',
                    url: $get_total_url
                }).success(function (data) {
                    $scope.paginationConf.totalItems = data.total;
                }).error(function (err) {
                    console.log(err);
                })

            } else {
                //添加失败
                //console.log('删除失败');
                $scope.meg_error="删除失败";
            }
        })
    }
})


// 新增内容模块
var addCont = angular.module('addCont',[]);
addCont.controller('AddContCtrl',function($scope,$http){
    //获取分类的列表
    $http({
        method:'GET',
        url:'get.php?action=get_arctype&where=reid=0'
    }).success(function(data,status,headers,config){
        $scope.lists = data;
    }).error(function(data,status,headers,config){
        console.log('get type is error');
    })
    //执行写入数据的操作
    $scope.formData = {};
    $scope.formData.action = 'add_article';
    $scope.postForm = function(){
        $http({
            method:'POST',
            url:'get.php',
            data: $.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(function(data){
            $scope.errorBye = function(){
                $('#errorbox').fadeOut();
            }
            $scope.errorShow = function(){
                $('#errorbox').fadeIn();
            }
            if(!data.errors){
                $scope.meg_success = '插入成功！正在返回列表页面..';
                $scope.meg_error = '';
                setTimeout(function(){location.href='#/0'},1000);
            }else{
                //添加失败
                $scope.meg_success = '';
                var get_error = '';
                if(data.errors.hasOwnProperty('title')){
                    get_error=data.errors.title;
                }
                if(data.errors.hasOwnProperty('content')){
                    get_error=get_error+(get_error?"&":"")+data.errors.content;
                }
                if(data.errors.hasOwnProperty('typeid')){
                    get_error=get_error+(get_error?"&":"")+data.errors.typeid;
                }
                $scope.meg_error=get_error;

            }
        })
    }
})


// 修改 更新模块
var modifyCont = angular.module('modifyCont',[]);
modifyCont.controller('ModifyContCtrl',function($scope,$http,$stateParams){
    //获取分类列表
    $http({
        method: 'GET',
        url: 'get.php?action=get_arctype&where=reid=0'
    }).success(function(data, status, headers, config) {
        $scope.types=data;
    }).error(function(data, status, headers, config) {
        console.log("get type list error...");
    });
    //读取这一条数据
    console.log($stateParams);
    $http({
        method: 'GET',
        url: 'get.php?action=get_article&id='+$stateParams.Id
    }).success(function(data, status, headers, config) {
        $scope.lists=data;
    }).error(function(data, status, headers, config) {
        console.log("error...");
    });
    //更新数据
    $scope.formData = {};
    $scope.postForm = function() {
        $scope.formData.action = 'update_article';
        $scope.formData.id = $stateParams.Id;
        $scope.formData.title = form.title.value;
        $scope.formData.content = form.content.value;
        $scope.formData.typeid = $("#typeid option:selected").val();//待优化取值方式
        $http({
            method  : 'POST',
            url     : 'get.php',
            data    : $.param($scope.formData),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .success(function(data) {
                console.log(data);
                if (data.code==101) {
                    //添加成功
                    console.log('修改成功');
                    $scope.meg_success="修改成功! 正在返回列表页...";
                    $scope.meg_error="";
                    setTimeout(function(){location.href='#/0'}, 1000);
                } else {
                    //添加失败
                    console.log('修改失败');
                    var get_errors="";
                    $scope.meg_success="";
                    //信息提示框状态
                    $scope.errorBye=function(){
                        $('#errorbox').fadeOut();
                    }
                    $scope.errorShow=function(){
                        $('#errorbox').fadeIn();
                        $scope.meg_error='';
                    }
                    if(data.errors){
                        console.log("有错误信息");
                        if(data.errors.hasOwnProperty('title')){
                            get_errors=data.errors.title;
                        }
                        if(data.errors.hasOwnProperty('content')){
                            get_errors=get_errors+(get_errors?"&":"")+data.errors.content;
                        }
                        $scope.meg_error=get_errors;
                    }else{
                        console.log("无错误信息");
                        $scope.meg_error="修改失败，无改动！";
                    }
                }
            });
    };
})



// 显示文章详情的模块
var showCont = angular.module("showCont", []);
showCont.controller('ShowContCtrl', function($scope, $http, $stateParams) {
    console.log($stateParams.Id);
    $http({
        method: 'GET',
        url: 'get.php?action=get_article&id='+$stateParams.Id
    }).success(function(data, status, headers, config) {
        console.log("success...");
        console.log(data);
        $scope.lists=data;
    }).error(function(data, status, headers, config) {
        console.log("error...");
    });
});



