/**
 * Created by Administrator on 2016/3/20.
 */
$(function () {
    /*轮播图*/
    banner();
});
/*轮播图*/
function banner(){
    /*
    * 1.通过ajax获取数据 图片
    * 2.判断屏幕的尺寸$(window).width();
    * 3.根据屏幕的尺寸json转化渲染html字符串(1.js来拼接字符串 2.模板引擎)
    * 4.渲染在页面当前 html(我们解析的html)；
    * 5.响应屏幕的尺寸 来渲染当前屏幕尺寸下的图片 resize事件
    *
    * */

    /*
    *
    * 目的：优化目的
    * 1.图片加载过多
    * 2.在移动端需要做适配
    * 总之：图片响应
    *
    * */
    /*1.通过ajax获取数据 图片*/
    /*数据缓存*/

    var myData='';
    var getData=function(callback){
        /*如果数据已经存在 咱们就不是做请求*/
        if(myData){
            /*返回已经存在的数据*/
            callback&&callback(myData);
            /*不往下执行了*/
            return false;
        }

        $.ajax({
            //当前的目录是在index.html下 相对json的路径 js/index.json
            url:'js/index.json',
            type:'get',
            data:{},
            dataType:'json',
            success: function (data) {
                console.log(data);
                myData=data;
                callback&&callback(myData);
            }
        });
    }

   /* 2.判断屏幕的尺寸$(window).width();
    3.根据屏幕的尺寸json转化渲染html字符串(1.js来拼接字符串 2.模板引擎 artTemplate)
    */
    /*获取数据*/
    /*渲染*/
    var renderHtml=function(){
        //2.判断屏幕的尺寸
        /*当前的屏幕尺寸*/
        var width=$(window).width();
        var isMobile=false;
        /*在768px以下都认为是移动端*/
        if(width<768){
            isMobile=true;
        }
        getData(function(data){
            /*渲染html*/
            /*拿到模板*/
            console.log(1);
            var templatePoint= _.template($('#template_point').html());
            console.log(templatePoint);
            var templateImage= _.template($('#template_image').html());
            /*把数据穿进去解析成html*/
            var pointHtml=templatePoint({model:data});

            var imageHtml=templateImage({model:{list:data,isMobile:isMobile}});

            /*4.渲染在页面当中 html('我们解析的html');*/
            $('.carousel-indicators').html(pointHtml);
            $('.carousel-inner').html(imageHtml);

        });

    }
    /*5.响应屏幕的尺寸  来渲染当前屏幕尺寸下的图片  resize事件*/
    /*
    * renderHtml并没有调用
    * trigger 是jQuery的立即触发这个传入的事情
    * .trigger('resize')立即触发了resize事件
    * */
    $(window).on('resize', function () {
        renderHtml();
    }).trigger('resize');

    /*在移动端需要滑动*/
    var startX=0;
    var moveX=0;
    var distanceX=0;
    var isMove=false;
    $('.wjs_banner').on('touchstart', function (e) {
        /*在jQuery当中 绑定touch事件的时候返回的 originalEvent 包含的是原生的touchevent*/
        startX= e.originalEvent.touches[0].clientX;
    });
    $('.wjs_banner').on('touchmove', function (e) {
        moveX= e.originalEvent.touches[0].clientX;
        distanceX=moveX-startX;
        isMove=true;
    });
    $('.wjs_banner').on('touchend',function(e){
        /*滑动过50时候才算是一个手势*/
        if(isMove&&Math.abs(distanceX)>50){
            if(distanceX>0){
                /*向右滑动*/
                $('.carousel').carousel('prev');
            }else {
                /*向左滑动*/
                $('.carousel').carousel('next');
            }
        }

         startX=0;
         moveX=0;
         distanceX=0;
         isMove=false;
    });
}