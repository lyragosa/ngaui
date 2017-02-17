// ==UserScript==
// @name NGACN 艾泽拉斯国家地理论坛 论坛增强插件
// @namespace ngacn
// @author Linoa Feathermoon @ NGACN (莉诺雅羽月)
// @description 一个扩展NGACN论坛功能和优化显示的用户脚本，包含一些实用小功能
// @version 2.31
// @match http://bbs.ngacn.cc/*
// @include http://bbs.ngacn.cc/*
// ==/UserScript==

// 修改：lintx
// 测试：Chrome,Firefox,IE8,Opera,搜狗,傲游+178用户脚本功能测试成功

//-----------  !!! 设置项目全部从个人菜单中设置并保存于cookie中，脚本请勿修改-------
//-----------  !!! 从这里开始往下的部分请勿修改 !!!  ------
var version = "2.31 Beta";
var updatetitle = "本次更新：\n1.再次修复发帖界面表情消失的BUG";


var checkMojoEmo = ngaui_getCookie("mojoemocheck")=="false"?false:true; //表情开关
var checkQuickMojoEmo = ngaui_getCookie("mojoemoquickcheck")=="false"?false:true; //快速发帖表情开关
var checkCustomTitle = ngaui_getCookie("customcheck")=="false"?false:true; //如果需要使用自定义功能，请修改为 true
var customTitle = ngaui_getCookie("customtitle") || "艾泽拉斯国家地理论坛"; //全局标题栏样式变更
var rmbltopic = ngaui_getCookie("rmbltopic")=="false"?false:true; //是否移除黑名单用户发表的主题
var updateinfo = ngaui_getCookie("updateinfo")=="false"?false:true; //是否启用升级提示
var localversion = ngaui_getCookie("localversion"); //本地版本信息
var blist = ngaui_getCookie("blist"); //黑名单列表
var quickpage = ngaui_getCookie("quickpage")=="false"?false:true; //是否启用快速翻页
var customEmo = localStorage.ngaui_customEmo||""; //自定义表情
var customEmoCheck = ngaui_getCookie("mojoemocustom")=="false"?false:true; //是否启用自定义表情
var customTerm = JSON.parse(localStorage.ngaui_customTerm||"[]"); //自定义短语
var customTermCheck = ngaui_getCookie("termcheck")=="false"?false:true; //是否启用自定义短语
var isinstall = document.getElementById("isinstalldiv"); //在脚本末尾创建一个div以判断脚本是否已经加载过  以防止在点击个人菜单时会导致的重复加载插件
var hostname=location.hostname;
var ngaui_isaddemo = false;
var ngaui_isdelemo = false;
var ngaui_isdelterm = false;
var ngaui_iseditterm = false;

localStorage.ngaui_customEmo = customEmo;
//导入旧的屏蔽列表
var t = ngaui_getCookie("blnum")==""?0:parseInt(ngaui_getCookie("blnum"));
if (blist == "" && t > 0){
	for (i=0;i<t;i++){
		blist += ngaui_getCookie("bl" + i) + ",";
	}
	ngaui_setCookie("blist",blist);
}

//清除屏蔽列表中的=号;号空格重复的,号和第一位的,号
clearsym();
function clearsym(){
	blist = blist.replace(" ","");
	blist = blist.replace(";","");
	blist = blist.replace("=","");
	if (blist.indexOf(",,") > -1){
		blist = blist.replace(",,",",");
		if (blist.indexOf(",,") > -1){
			clearsym();
		}
	}
	if(blist.charAt(0) == ","){
		blist = blist.substring(1, blist.length);
		if(blist.charAt(0) == ","){
			clearsym();
		}
	}
}
ngaui_setCookie("blist",blist);

//表情系统
//logo表示展开表情按钮上的图片，title表示展开表情按钮上的文字
//img是一个数组，加表情直接往里面丢URL即可
//因为Firefox等浏览器cookie不支持中文，所以为了使Firefox等浏览器获取cookie，给予每个表情组分配一个ID，在存储cookie时以ID存储而非title存储。
var MojoEmoArr=[{
	title:'麻将脸',
	id:'majiang',
	check:true,
	img:['http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd1be4d27.jpg','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd1fc1ab8.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd2461f68.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd27c41b7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd2b16477.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd2fc0eef.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd354e6e6.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd3a6ded0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd4a701f9.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fd4e5e4d0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fdba3f8a3.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fdbfd6a98.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fdc558b06.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fdcae7c08.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fdd1490f7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fde4af997.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe031e177.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe0a16090.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe0f3cdb7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe132049f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe1b2896d.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe204db2f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe2583a77.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe2c21827.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe32e31d0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe4fda531.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe55ec644.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe5bf1c30.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe6273c90.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fe691f115.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79008b04368.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900921685e.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790097e2230.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900a484a17.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900a9c16c1.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900b9a9023.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900becfd38.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900c5e6498.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900cb0a511.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900d041bc5.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900d79e056.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900de2b07f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900e7187a0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900ef0b0c7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7900f792cab.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79010218b8b.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790109cf17f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79011007dff.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790115807af.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79011bc60f6.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79012307dff.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790129f3b6f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7901304b420.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79013744e8f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79013e081e7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7901441ca07.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79014b2b467.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790151880c8.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79015705ebd.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790328d0cd8.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79032bd7e20.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79032eda146.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903341aac6.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790337ba578.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79033c2431d.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79033f5ae1d.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790342a8c37.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79034631227.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790349bd840.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903517a9ef.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790378471b7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79037d7c548.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903826a437.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790386e5110.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79038c34cbf.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790391a6140.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903962a8b0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79039b62350.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903a0b20a6.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903a56a051.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903adc3601.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903b2519b0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903b667170.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903bbcd23e.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903c10f717.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903c602427.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7904a1b20a5.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903d24d748.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7903d99ff97.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79056881f1f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79056bcab31.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79056f54c78.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790572928bf.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79057618f6f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79057974848.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79057d540bf.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905807bd77.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790583c459f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905868a3f0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790589ba191.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79058d33935.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905928bb77.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790597102d0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79059ce8ba7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905a402bf7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905a8ac6d0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905ad3d962.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905b14eadc.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905b59a9a7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905b9a22bf.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905bfa78ae.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905c4c41b7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905cb0eb5f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905d05ae21.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905d6df738.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905dba0b50.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905e0f2fb8.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905e4f3f57.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7905eaa5586.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907a666d87.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907a977728.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907ac901b0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907af832a7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907b5ced97.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907b8e9377.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907bc9bd30.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907bfd5ede.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907c3089b6.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907c9878f8.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907cda41ff.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907d2129e4.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907d67c15e.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907da84a17.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907de5e4cf.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907e443ef0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907e87fbf8.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907ed2f6d1.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907f1de3b0.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907f6a9031.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7907fbea317.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79080026648.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7908053e8ff.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790809d66ae.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79080f07246.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79081372906.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790818e4558.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79082162741.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7908259eff7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909365a650.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79093976b6e.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79093e7a609.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790941e4559.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790945c5d0e.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909495582f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79094c8ee27.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79094f6a04e.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790952738a8.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79095640c2b.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790959abefe.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79095d99620.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790961c2a48.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79096583e5f.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79096962737.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79096ea8c38.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909739a9a8.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909786cf2e.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79097db2877.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909836a438.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b790989cca70.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79098eabb18.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909947c15e.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79099a38b40.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b79099f6cf30.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909a39a9b5.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909a798298.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909ac321c7.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b7909b229cf6.gif','http://img.ngacn.cc/attachments/mon_201002/15/-447601_4b78fcddc0b06.gif','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6d0eb054e.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6d2583a76.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6dc0125f8.png','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6dc8a5588.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6e20d7267.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6e26b0550.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6e26b0550.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6e30a6cf9.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6e353f89d.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6e801126f.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6e83a26a7.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6e95dc089.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b6e9875016.jpg','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b7b5a91d08.gif','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b7b5fc8420.gif','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b733be06d5.gif','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b7341d958f.gif','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b734e2d3a7.gif','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b74e96ee6e.gif','http://img.ngacn.cc/attachments/mon_201002/17/-447601_4b7b74efd2c17.gif','http://i.imgur.com/IEMCO.gif','http://pic2.178.com/152/1522091/month_1103/f1df3d0dc150a0470d5a8ffab7727538.gif','http://pic2.178.com/152/1522091/month_1110/7616a1292a1bf3ae5e4a1c8bddd6241b.gif','http://pic2.178.com/152/1522091/month_1111/b0e081f57bd4e81c3c73ef3d2587fb25.gif','http://pic2.178.com/152/1522091/month_1103/5f5f459692ec6af06f042569fe20d2e3.gif','http://pic2.178.com/152/1522091/month_1103/6f7da890cfed3ffbc7e4772c98c1931b.gif','http://pic2.178.com/152/1522091/month_1103/3472cc963415a398483c283f02669528.gif','http://pic2.178.com/152/1522091/month_1110/f1c0cf48c7e2aafe2fbb17abc81301e4.gif','http://pic2.178.com/152/1522091/month_1110/8ee775b6c1aec0bbd8c93520d5714a71.gif','http://pic2.178.com/152/1522091/month_1110/ee4c5eeb170a9baa51f3a7a180924b87.gif','http://pic2.178.com/152/1522091/month_1110/5950090c78c9efcb770df8ae35bb117a.gif','http://pic2.178.com/152/1522091/month_1110/daab7f0b60404d4577ba330711dc3132.gif','http://pic2.178.com/152/1522091/month_1110/5fbbb3fec42c8abecec045c96e7ea349.gif','http://pic2.178.com/152/1522091/month_1103/78d27c2dd4f8cbd68e8376396af120c3.jpg','http://pic2.178.com/152/1522091/month_1103/42e4e223bb3174191903fe30fab3c306.gif','http://pic2.178.com/152/1522091/month_1110/ac3c9a53e9d8a49ba9fef6533cfe4f5f.gif','http://pic2.178.com/152/1522091/month_1110/f98d5e139e9f557e3539a50180343b4c.gif','http://pic2.178.com/152/1522091/month_1110/f324680af1a8dc389b8ecff9fb34c67f.gif','http://pic2.178.com/152/1522091/month_1103/50a612150fcb53ceb94bd6533cea3828.gif','http://pic2.178.com/152/1522091/month_1103/2f9829dfbe50939d3d3cedf9592b300a.gif','http://pic2.178.com/152/1522091/month_1103/b48300a96b7594e03baf04653783c266.gif','http://pic2.178.com/152/1522091/month_1103/ee9c6aa634dc6fd7df7df5b797bcf011.jpg','http://pic2.178.com/152/1522091/month_1103/30508d0ef17818191bea676ec6562ebb.gif','http://pic2.178.com/152/1522091/month_1110/56a81d3dc032f3a730c288c7063f3fbe.gif','http://pic2.178.com/152/1522091/month_1110/a57c021beb90c65bbcce39eda52694ca.gif','http://pic2.178.com/152/1522091/month_1110/7feba7a029c7892f8837490344de5e16.gif','http://pic2.178.com/152/1522091/month_1103/754a76e5f8ec5bc9adf8b88b0d5fc6eb.gif','http://pic2.178.com/152/1522091/month_1103/63d016431dd054d6af6dd3bc1db482ec.gif','http://pic2.178.com/1283/12837687/month_1202/7b0cc66ba48ed1edf3d5acaa3b5332ec.gif','http://pic2.178.com/1283/12837687/month_1202/8dd39a3a5fe6f52675ee9bb3e1db4583.gif','http://pic2.178.com/1283/12837687/month_1202/798babb0df1456c100dad7aa7997163c.gif','http://pic2.178.com/152/1522091/month_1110/6a35593a8863ec52424f143959d1ee91.gif','http://pic2.178.com/1283/12837687/month_1202/4efd2ae5ef5c057560c690b5555a214b.gif','http://pic2.178.com/1283/12837687/month_1202/75c3c460d3af696c1bf70ac4b5439a6b.gif','http://pic2.178.com/1283/12837687/month_1202/943e5aa0eb704065900ffca4eab72140.gif','http://pic2.178.com/152/1522091/month_1103/af32cd74ea24cde10a64a8dc5cdf71f8.gif','http://pic2.178.com/152/1522091/month_1103/cd1cc98d9d0740e4b4fed6070283c028.gif','http://pic2.178.com/152/1522091/month_1103/f57cb7e8385837cc6aefaa2a590b68bd.gif','http://pic2.178.com/152/1522091/month_1103/faa233339c0dbb68dc3f7b71756aadc0.gif','http://pic2.178.com/152/1522091/month_1103/f24b940c2dbda7a941a6f14059df8802.gif','http://pic2.178.com/152/1522091/month_1103/2b67a415de19e5814f246f1bba16765e.gif','http://pic2.178.com/152/1522091/month_1103/bc089e09e117e7e5cf9df0f0165a1b49.gif','http://pic2.178.com/152/1522091/month_1103/239e8cb4e39377e1d8d4a07a404aa100.gif','http://pic2.178.com/152/1522091/month_1103/00aea8560f52f38f1f8af7a7f3975c6a.gif','http://pic2.178.com/152/1522091/month_1103/60ae9393318297f9cc30ccba6ba05f8a.gif','http://pic2.178.com/152/1522091/month_1103/fb56c64e4662604a2444a8f235d9929e.jpg','http://pic2.178.com/1283/12837687/month_1202/2d9d7df4d3d8d1a0157b37a93ed56982.gif','http://pic2.178.com/152/1522091/month_1103/30bf7efcbb4344cf787725f23542e44f.gif','http://pic2.178.com/152/1522091/month_1103/4e389a754de8050e95962ce3215589c7.gif','http://pic2.178.com/152/1522091/month_1103/c8977266b532e7aab2bc098663c9b83c.gif','http://pic2.178.com/152/1522091/month_1103/5e1fb379a688792a5aa568c445085620.gif','http://pic2.178.com/152/1522091/month_1103/b0c85d02e48313871dbe29528b38f67a.gif','http://pic2.178.com/152/1522091/month_1103/72bcf7bd1a027bf3cc0383f2381d8b88.gif','http://pic2.178.com/152/1522091/month_1103/df3d4a843580a43bdd5f26d1b48736d7.gif','http://pic2.178.com/152/1522091/month_1103/ca3a8d4398a3851b6a325edc24f0568b.gif','http://pic2.178.com/152/1522091/month_1103/dd3f5cb0a5ad64658e4c6b7c0fe1004a.gif','http://pic2.178.com/152/1522091/month_1103/5455a86a9df9825b7819887c4ca7e793.gif','http://pic2.178.com/152/1522091/month_1103/0f1cc8de7b66bff2b56c9d62b592ebd5.gif','http://pic2.178.com/152/1522091/month_1103/2d24e433621f5552c2a50d74ee3e9ed7.gif','http://pic2.178.com/152/1522091/month_1103/d5d528d116634a8ebac1a183c060ebfe.gif','http://pic2.178.com/152/1522091/month_1103/3dbc54486b18be8dc6cf629ee0297592.gif','http://pic2.178.com/152/1522091/month_1103/8ff1b8a050b09096b6cba220a911f894.gif','http://pic2.178.com/152/1522091/month_1110/2a468c4fac87bb01e7026b77e65e4778.gif','http://pic2.178.com/152/1522091/month_1110/da59c8d18250fbed39a917150530d7f4.gif','http://pic2.178.com/152/1522091/month_1110/b98187d3c99ecac9db3a0489b62a8bb9.gif','http://pic2.178.com/152/1522091/month_1110/36175764ac1ea70af438b3162c922aeb.gif','http://pic2.178.com/120/1207216/month_1110/96c180ea408177d6299992cd11bc16f3.gif','http://pic2.178.com/152/1522091/month_1110/6ab842570b7aeea1d3002fdcf5f86ebe.gif','http://pic2.178.com/152/1522091/month_1111/b7d3519c436b12e583419f62e13f5884.gif','http://pic2.178.com/152/1522091/month_1103/57d569615f91a42296f843717bbbb3fd.gif','http://pic2.178.com/152/1522091/month_1103/97d8e9b98ed2190e452550dfa054a212.gif','http://pic2.178.com/152/1522091/month_1103/6c840f9bec2da5dbfb95393eb9c91bea.gif','http://pic2.178.com/152/1522091/month_1103/c46f0d703a29a5d141939e20fdecb5a0.gif','http://pic2.178.com/152/1522091/month_1103/4c345bbb0b2596d4e79ab35f2abe9a53.gif','http://pic2.178.com/152/1522091/month_1103/38a7a48b8782bfcb2f175e6ceeeca6d0.gif','http://pic2.178.com/152/1522091/month_1103/9df28b591e20150a628d66fe63b5f2a0.gif','http://pic2.178.com/152/1522091/month_1103/965e616ce9d009fb2b977615ec68e6fa.jpg','http://pic2.178.com/152/1522091/month_1103/5244dcbe187cd6f9385d026116d4ffc7.gif','http://pic2.178.com/152/1522091/month_1103/84cd97305401e5b8a0a52935c259764a.jpg','http://pic2.178.com/152/1522091/month_1103/71b9023c1922a017e77ffef030b24990.gif','http://pic2.178.com/1283/12837687/month_1202/d665244ab9411de65177b301bf8e4159.gif']
},
{
	title:'阿狸',
	id:'ali',
	check:true,
	img:['http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082810882c15.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082810d43bac.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828110e8139.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281155cc7a.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082811ad196c.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828120c1b43.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281248e6fb.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828128202a1.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082812b869df.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082812ee6277.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082814b188f0.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828156044a9.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828159504bc.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082815d2e110.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281606385b.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281640d535.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082816699b50.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082816b9263a.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082816f07afa.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281724dbf0.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082819c27c6a.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082819f84e6a.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281a2b4e00.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281a6187f5.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281a9d3dc6.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281ad097e0.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281b077c7b.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281b351426.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281b6856a0.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281ba0ef70.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281e3c61c9.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281e6d31ad.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281e9e234f.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281ec82ed2.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281ef70875.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281f265d94.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281f515918.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281f8649ad.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281faf3aae.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508281fe06724.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508282f47ec7f.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508282f767d2d.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508282fa22bf0.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508282fdaa34c.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828300d278f.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828306981aa.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082830a4b627.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082830d15f9d.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283139d9cd.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082831790c11.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283532eac8.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082835766d19.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082835af2b67.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082835e79d8d.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283622906c.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283672714d.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082836bd2372.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082836f52130.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828373b260c.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283767180e.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828390a1f80.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283941d626.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828397760d2.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082839c7b521.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283a00c452.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283a44a3b7.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283a796e41.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283abe0dad.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283af77d79.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283b30bb41.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283f043748.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283f57ebc3.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283f8a086f.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283fc9988e.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508283ff1ebb3.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508284021c88d.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082840555c68.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082840811678.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082840ac0f96.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082840d6f618.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082859e252f9.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508285a338c42.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508285a63c01e.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508285a8c03af.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508285abb5b70.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508285b2e9acb.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508285b76bcbc.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508285ba3dc85.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508285beb7941.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508285c237630.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082860e4b7d3.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286113d515.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286142d529.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828616bc53d.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082861b2bcfb.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286219a587.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082862651d34.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082862bc6b04.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082862e3d030.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286339e6db.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082866c3596f.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286792f655.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082867e9a86b.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286824723d.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828685b6582.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286897bbf6.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082868c8aa1e.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_5082868fee3dc.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_50828695cbd17.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286a20707b.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286a80ab92.gif','http://img.ngacn.cc/attachments/mon_201210/20/-1324875_508286b0df0d3.gif','http://img.ngacn.cc/attachments/mon_201212/07/-1324875_50c155ad639ac.gif','http://img.ngacn.cc/attachments/mon_201212/07/-1324875_50c155b5e8605.gif','http://img.ngacn.cc/attachments/mon_201212/07/-1324875_50c155bc49e23.gif','http://img.ngacn.cc/attachments/mon_201212/07/-1324875_50c155c106357.gif']
},
{
	title:'大眼睛猫猫',
	id:'dayanmao',
	check:true,
	img:['http://pic1.178.com/36/364011/month_1001/78aa7a031f2f880692ba41047cf0efd4.gif','http://pic1.178.com/36/364011/month_1001/e979814adb039319e185c0693f70ac19.gif','http://pic1.178.com/36/364011/month_1001/c71b0666ae7360fb57ca7e4746d77180.gif','http://pic1.178.com/36/364011/month_1001/65a10d35bae4a645c4e1fdd0c4a72b7c.jpg','http://pic1.178.com/36/364011/month_1001/fd4d129f46c9d45265fa548aae1e1a46.gif','http://pic1.178.com/36/364011/month_1001/88f65c29aab14a27613e64b77a1ce787.gif','http://pic1.178.com/36/364011/month_1001/7dc7db2cbc60e4b69e5616f344f81de4.gif','http://pic1.178.com/36/364011/month_1001/9a530ab7c625abf240a4683622c8835c.gif','http://pic1.178.com/36/364011/month_1001/f88ac0bc61e839d578269e193710a926.gif','http://pic1.178.com/36/364011/month_1001/86fbc79540b5b76225d910d7324e6dcc.gif','http://pic1.178.com/36/364011/month_1001/6b6fb853e8ec2c96ad5fab40610f27a7.gif','http://pic1.178.com/36/364011/month_1001/bbf7db0849de605351c2493db50e0043.gif','http://pic2.178.com/132/1324875/month_1206/8379f982088ed8ddd2c9d19a67cb5c73.gif','http://pic2.178.com/132/1324875/month_1206/54bb6b6331125af57b67884117d202c7.gif','http://pic2.178.com/132/1324875/month_1206/83eddfc33830e9325fc69fc60e782861.gif','http://pic2.178.com/132/1324875/month_1207/ab7d2da8db56b8477031b089c94c2042.gif','http://pic2.178.com/132/1324875/month_1207/0aca3c8ecb51090c14ee9a3e3330e293.gif','http://pic2.178.com/132/1324875/month_1207/3d125f40932a525e0a0049a675c70776.gif','http://pic2.178.com/132/1324875/month_1207/96dad75c7889dddb47f03058437412f0.gif','http://pic2.178.com/132/1324875/month_1207/08cb2c1a86e85f77824510e31266dca6.gif','http://pic2.178.com/132/1324875/month_1207/806b7c7e3e036d6373605e88ed2e3370.gif','http://pic2.178.com/132/1324875/month_1207/b8e7f7ed55260626d179c375c709abc5.gif','http://pic2.178.com/132/1324875/month_1207/e84f7a8605042643c0a67462187b0e92.gif','http://pic2.178.com/132/1324875/month_1207/103cbe0ee09a2dcbe476c5b48056c3b4.gif','http://pic2.178.com/132/1324875/month_1207/7b2bcfa3c2a30c32915fbd5d9f746156.gif','http://pic2.178.com/132/1324875/month_1207/2afc2006a6a817ec1dd577956450c72c.gif','http://pic2.178.com/132/1324875/month_1207/60f602c812c5d9b0f88f5b78a89e914e.gif']
},
{
	title:'罗小黑',
	id:'luoxiaohei',
	check:true,
	img:['http://pic2.178.com/825/8256664/month_1206/5c0de79888729eff15d9e987fbba4c25.gif','http://pic2.178.com/825/8256664/month_1206/d29ac462d5ccbfdd286f6eb90bea71cf.gif','http://pic2.178.com/825/8256664/month_1206/9e21cdefd6b3f92d0b1f4bba3e4cda38.gif','http://pic2.178.com/825/8256664/month_1206/54b82214e99cfa3a3da7a66afe864fdf.gif','http://pic2.178.com/825/8256664/month_1206/db828196a219ca5c516bbeafd47117f4.gif','http://pic2.178.com/825/8256664/month_1206/cc308c269384b073a91e8e851e9471f9.gif','http://pic2.178.com/825/8256664/month_1206/62508130547e05e4c322839968dd216e.gif','http://pic2.178.com/825/8256664/month_1206/65164a8305f446ed5b82e7c43ff43901.gif','http://pic2.178.com/825/8256664/month_1206/5d8f39679c3e6d295a0305fc23d9af2a.gif','http://pic2.178.com/825/8256664/month_1206/33a65a5d1ea1aa9cc77db3d9f94bc9d6.gif','http://pic2.178.com/825/8256664/month_1206/d54f27747487bf59649b5da25ce52963.gif','http://pic2.178.com/825/8256664/month_1206/70e129baaf95e2f56f3976104f893473.gif','http://pic2.178.com/825/8256664/month_1206/c34f57dc27a585b0c842f788140b85ca.gif','http://pic2.178.com/825/8256664/month_1206/fa8bc2db7c485e1ecaecfa639363e9af.gif','http://pic2.178.com/825/8256664/month_1206/289fe14a25dff087f17ddddedcbad510.gif','http://pic2.178.com/825/8256664/month_1206/89450c4f7eb2dfe3ea3832be12d9a1fd.gif','http://pic2.178.com/825/8256664/month_1206/93799e7cf5b4c32a6186718c17cc6488.gif','http://pic2.178.com/825/8256664/month_1206/46c6f342a8b051a38ea3bc8ff959e02d.gif','http://pic2.178.com/825/8256664/month_1206/52e06e3401a72311cb40941beeed3590.gif','http://pic2.178.com/825/8256664/month_1206/6f7972b1a2452f968f1a6e14aef81248.gif','http://pic2.178.com/825/8256664/month_1206/9ea2d7fb2fb9f9f8cb8e110b5b5a0bd8.gif','http://pic2.178.com/825/8256664/month_1206/343f7b3c71da2975c4582b1e713f75fc.gif','http://pic2.178.com/825/8256664/month_1206/da77ab1bc23dc5718f286006b2c4d873.gif','http://pic2.178.com/825/8256664/month_1206/fa3ecaa87375e10a09996e663eb9c7c9.gif','http://pic2.178.com/825/8256664/month_1206/560cc871dacea718be53a968fe99e25b.gif','http://pic2.178.com/825/8256664/month_1206/3acf42b1de0c59cad6f2bc57c5013d2e.gif','http://pic2.178.com/825/8256664/month_1206/1ac323e705d6e359066ab2ea8c9dded1.gif','http://pic2.178.com/825/8256664/month_1206/4f13fb2e09b9024ee320a3d0fedfad3e.gif','http://pic2.178.com/825/8256664/month_1206/433df28f586354c47395623f5a5a8f5c.gif','http://pic2.178.com/825/8256664/month_1206/ac1fa35081de0adfabc70789f5fa5103.gif','http://pic2.178.com/825/8256664/month_1206/4fce62ce80196ecd0a2d72ebffba7152.gif','http://pic2.178.com/825/8256664/month_1206/e6be0e1f5d16216ecbaf4af96d61e951.gif','http://pic2.178.com/825/8256664/month_1206/68d091a8525af89af3792ceffc0c88d7.gif','http://pic2.178.com/825/8256664/month_1206/2f298fd226b5c1b9c8cd1d7976b725bc.gif','http://pic2.178.com/825/8256664/month_1206/0ed9b744030c1f2a66b0ba11a1098271.gif','http://pic2.178.com/825/8256664/month_1206/768dc8efd0b5e2539f8591ecff8357a9.gif','http://pic2.178.com/825/8256664/month_1206/56b3ffe62f4beaa13d41a239d1c8a51f.gif','http://pic2.178.com/825/8256664/month_1206/64824c081c08d2cdf410a2c91b0ac548.gif']
},
{
	title:'彼尔德',
	id:'bierde',
	check:true,
	img:['http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bd823ee71.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bd8e94feb.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bd94b6eba.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bd9d49867.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bda5828bf.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bdb19a376.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045be7051800.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045be9e16a62.gif','http://pic2.178.com/101/1011736/month_1206/89d494e527d5b11a712d40fccbab5fee.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045beea312de.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bef2b42a2.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bef857bc0.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bf6234da1.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bf6a0a114.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bf6e41fe2.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bf748eded.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bf7963e3d.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bfe1e7644.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bfe95474a.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045bff13a601.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045c0026d5d6.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045c007e9a2a.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045c00be7aee.gif','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045c01072fb7.gif','http://pic3.178.com/138/1380449/month_1209/89a720830dc76564aad7c36ddbc24666.gif','http://pic3.178.com/138/1380449/month_1209/4dcbe2272104ca48a3c820fe5e1dff0c.gif','http://pic3.178.com/138/1380449/month_1209/e8c558613cd2c1a0fb5001ca98945412.gif','http://pic3.178.com/138/1380449/month_1209/32141737f81d1f6929c2d0aa3233d871.gif','http://pic3.178.com/138/1380449/month_1209/9731b85342a608df805e3fd19165c0f2.gif','http://pic3.178.com/138/1380449/month_1209/761e883f305fbe622e06d9c4840047a7.gif','http://pic3.178.com/138/1380449/month_1209/0ed4291e2cf40b03cdab06f0c30f73c7.gif','http://img.ngacn.cc/attachments/mon_201209/12/-7_50509f1fe9244.gif','http://img.ngacn.cc/attachments/mon_201209/12/-7_5050a159a098e.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dgals34t3lg.gif','http://ww1.sinaimg.cn/small/7ba67b70jw1dgbi8ex6sdg.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1dgbv0bto90g.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1dggdp7q2zfg.gif','http://ww1.sinaimg.cn/small/7ba67b70jw1dggewp6dt8g.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1dgktvy7zckg.gif','http://ww1.sinaimg.cn/small/7ba67b70jw1dgkwm3sxvug.gif','http://ww1.sinaimg.cn/small/7ba67b70jw1dgncnx2d3pg.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dgpix44izag.gif','http://ww1.sinaimg.cn/small/7ba67b70jw1dhdxd6oc6mg.gif','http://ww2.sinaimg.cn/small/7ba67b70jw1dhblj3pzrvg.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dh9bh1du9sg.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dh73pi0kcng.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dh0p4llj6dg.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1dgz4keue8og.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dgxrw8qvagg.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dgwljfwu9yg.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1dgvjbzojhcg.gif','http://ww2.sinaimg.cn/small/7ba67b70jw1dguxx9ekcag.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1diwbxfevfjg.gif','http://ww2.sinaimg.cn/small/7ba67b70jw1diu2ss61v5g.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dipbmtc83sg.gif','http://ww1.sinaimg.cn/small/7ba67b70jw1dikrpy7efyg.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1di6yuqaj4ig.gif','http://ww2.sinaimg.cn/small/7ba67b70jw1dhsygfvinzg.gif','http://ww1.sinaimg.cn/small/7ba67b70jw1dhrwvttdutg.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dho89ljb6lg.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dk4fr513nog.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1dk382te8a7g.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1djuu93ugt9g.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1djsouvhul2g.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1djko5hw24sg.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1djeelhi9z0g.gif','http://ww2.sinaimg.cn/small/7ba67b70jw1djealda94hg.gif','http://ww2.sinaimg.cn/small/7ba67b70jw1djc3qaqx95g.gif','http://ww1.sinaimg.cn/small/7ba67b70jw1dj4fppv7jpg.gif','http://ww1.sinaimg.cn/small/7ba67b70jw1dj24zgguf5g.gif','http://ww2.sinaimg.cn/small/7ba67b70jw1dix29c1wpxg.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dlwtw8wn5rg.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dlz09xhbd9g.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dltnlovqb2g.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dlc5th0hfgg.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dl53gerjn5g.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dl40he8hfrg.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dky60i92zag.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dktqlyll7sg.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1dkri9bldgfg.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dkj8dxca7xg.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dkgjvjmfpxg.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dkcfm83e8dg.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1dngbfj22i7g.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dn4inpe1xag.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dmukc6xfzxg.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dmn5jhepkwg.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1dmcwpsor75g.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1ds7gtn7lehg.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1ds7gsdp8wsg.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1ds7ehx9spvg.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1ds4q7vhmykg.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1drnm4ukcrmg.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1driyyoeynbg.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dri48et1w9g.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1drak2ht7o5g.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dr1pgt7ohig.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1dqqea7f8x6g.gif','http://ww3.sinaimg.cn/small/7ba67b70jw1dqz2toj99ig.gif','http://ww4.sinaimg.cn/small/7ba67b70jw1dqoordygmog.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dprp5jf4i6g.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dporuqzwtrg.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1dpelj78i4yg.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1doynwx9n2eg.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1dotkpzbr0qg.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1duyoxoiol1g.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dul1zx8ib7g.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dufg5w4tf9g.gif','http://ww3.sinaimg.cn/small/7ba67b70gw1dtz5lh9gyyg.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1dtv2hv96u1g.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dts8bvkt07g.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dsl3cofef1g.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1dshtdcgz7lg.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dsam1gu07ug.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1ds7h15ujxdg.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dwc5pmqspbg.gif','http://ww2.sinaimg.cn/small/7ba67b70gw1dvhhoz3uqsg.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dv32mssiueg.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dx80nme48xg.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dx5nbg8b0vg.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dx3d2pc2msg.gif','http://ww4.sinaimg.cn/small/7ba67b70gw1dwsurh35qkg.gif','http://ww1.sinaimg.cn/small/7ba67b70gw1dwdk3hlaj2g.gif','http://ww1.sinaimg.cn/small/4c0c7ffajw1dl3l4j89m1g.gif','http://img.ngacn.cc/attachments/mon_201211/14/-7_50a3a5077863f.gif','http://ww3.sinaimg.cn/bmiddle/7ba67b70gw1e12pm787ing.gif']
},
{
	title:'暴走漫画',
	id:'baozoumanhua',
	check:true,
	img:['http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52ecc3d7ac.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52ed6d3dc1.gif','http://pic2.178.com/132/1324875/month_1206/9f20039eba5242f1f5df34779199e143.png','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52eda5044a.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52eddcb513.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52ee2f2dbe.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52eeba4771.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52ef0e1409.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52ef46b530.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52ef8788ab.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52efb178ce.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52efee430b.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52f018139f.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52f044c7b1.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52f0788e44.gif','http://img.ngacn.cc/attachments/mon_201205/05/-7_4fa52f0a45e4b.gif','http://pic2.178.com/132/1324875/month_1206/b66735510ea8c96938ac5d31d4c589fd.png','http://pic2.178.com/132/1324875/month_1206/ccd7cbbb06e8cfa797a1070a82953b4b.png','http://pic2.178.com/132/1324875/month_1207/da6eeba218ce65317a625c60a6314bd2.png','http://pic2.178.com/132/1324875/month_1207/15ffc0dc16d79e8229c0a7e20f7dc86b.png','http://pic2.178.com/132/1324875/month_1207/6175b8ea9cd71127142824e8f799714b.png','http://pic2.178.com/132/1324875/month_1207/9696572c3280071e7d27fb15f072ed94.png','http://pic2.178.com/132/1324875/month_1207/890b262fcc2834e79037cfbdde177bac.png','http://pic2.178.com/132/1324875/month_1207/7f16fd71d6b86d9a90c0eea23a207420.png','http://pic2.178.com/132/1324875/month_1207/f50a6b4a25bcd0550395f4b9fbec7e12.png','http://pic2.178.com/132/1324875/month_1207/74bdbd3f12fbfb7cb18c5e967fec3ad3.png','http://pic2.178.com/132/1324875/month_1207/d207310836cebda7b967498d30cd9cd1.png','http://pic2.178.com/132/1324875/month_1207/a055d2ae7c3700d9dcfb3307dd954e02.png','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121bf21f66.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121c1e9ca6.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121c515585.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121c82b59b.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121cb35b5e.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121cfee466.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121d2865ff.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121d57c77c.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121d9c36fb.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516121e3794f6.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516122051a69e.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_5161220809d33.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_5161220ad0706.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_5161220d78465.gif','http://img6.ngacn.cc/attachments/mon_201304/07/-1324875_516122115bfa3.gif','http://img.ngacn.cc/attachments/mon_201207/30/-7_501659f095f86.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501659f46c92c.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501659f74f065.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501659fb92e28.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501659fef2d35.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_50165a095609b.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_50165a0c8f964.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_5016817445bdb.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_5016817c3f714.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501681825a85d.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501681873b6a9.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_5016818c54525.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_50168192b5000.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_5016819980fbc.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_5016819dcc612.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501681a579a75.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501681aa5d92a.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501686cde01cb.jpg','http://img.ngacn.cc/attachments/mon_201202/04/-447601_4f2d1e80ab343.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_5016ae12ae284.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_5016ae1989baf.jpg','http://img.ngacn.cc/attachments/mon_201209/04/-47218_5045aeafd7372.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017a342b27.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017a6ec30d.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017ad66045.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017b09a8c3.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017b484549.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017ef537ea.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017f2f26a0.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017f5b84d6.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017f85b1b1.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-47218_505017fb0e250.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-7_505097122174c.png','http://pic3.178.com/142/1424179/month_1208/2acb155e2a5b9422a94186316b1aef60.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-7_5050972e61c94.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-7_50509738ceb3c.jpg','http://img.ngacn.cc/attachments/mon_201209/12/-7_50509743b31a9.png','http://img.ngacn.cc/attachments/mon_201209/12/-7_5050974c1df08.jpg','http://pic3.178.com/142/1424179/month_1208/6531e88e4f1209a5b404cc0f4507fc37.jpg','http://pic3.178.com/142/1424179/month_1208/9f097ebcdede8616e69b8966328cf52a.jpg','http://img.ngacn.cc/attachments/mon_201209/13/-47218_50515376c354c.jpg','http://img.ngacn.cc/attachments/mon_201209/13/-47218_50515379d93e2.jpg','http://img.ngacn.cc/attachments/mon_201209/13/-47218_5051537c6f0a7.jpg','http://pic3.178.com/142/1424179/month_1209/64e25c177c3a3761f715a3893588a093.jpg','http://pic3.178.com/142/1424179/month_1209/f0bc17b405346eb419e15d9a4078cc1a.jpg','http://pic3.178.com/142/1424179/month_1209/f523d833d988bd687d9205c8462cd69a.jpg','http://pic3.178.com/142/1424179/month_1209/159086d6643b2dd47809ae5311321e48.jpg','http://pic3.178.com/142/1424179/month_1209/a275c4400dc24c94c6b252495cfbf5d7.jpg','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5053040c1ff51.gif','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d8593397258.jpg','http://img6.ngacn.cc/attachments/mon_201302/11/-7_5118d1cacbf75.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501686d6c3bff.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501686d1e6d55.jpg','http://img.ngacn.cc/attachments/mon_201207/30/-7_501686c890c75.jpg','http://img.ngacn.cc/attachments/mon_201208/14/-7_502a289ca1256.jpg','http://pic2.178.com/79/799003/month_1207/28c5e844157dcd4c932427f8c9d3f51a.png','http://pic2.178.com/79/799003/month_1207/ffd6126dfa9a5994fef30f83a60c2650.png','http://pic2.178.com/79/799003/month_1207/8c57d3de7a471cf98e035476b4685579.png','http://pic2.178.com/79/799003/month_1207/f9cc7ce52e6381d468a511b88d34d70c.png','http://pic2.178.com/79/799003/month_1207/4e691d95d3d811a85c55d705df8aced0.png','http://pic2.178.com/79/799003/month_1207/b712d971a5fc63afaaed6354d91e376c.png','http://pic2.178.com/79/799003/month_1207/e70ae1e7346619b4b7266dbd02b73ca7.png','http://pic2.178.com/79/799003/month_1207/38e2db572feae5b33c20ea6f229c3759.png','http://pic2.178.com/79/799003/month_1207/b8169c2bbbe4665b4bf6f586a6ea2717.png','http://pic2.178.com/79/799003/month_1207/c9963cd620e2ff683c5939c071f2746c.png','http://pic2.178.com/79/799003/month_1207/a107ccf5274bf3c837ffb7909bd0d469.png','http://pic2.178.com/79/799003/month_1207/790acfd25773a45e527a723b2f6a40d4.png','http://pic2.178.com/79/799003/month_1207/08eee2e216d922b507eefb3318c64c77.png','http://pic2.178.com/79/799003/month_1207/791175d2f3c7005753c26956e99a9470.png','http://pic2.178.com/79/799003/month_1207/565a693819be4f62e7ee36b02c69ef70.png','http://pic2.178.com/79/799003/month_1207/889bafb318fbe216141eac72e0706f5b.png','http://pic2.178.com/79/799003/month_1207/1070c0f99fa75975e56a99a4f21707f0.png','http://pic2.178.com/130/1301667/month_1207/6cc10a4dba106faa171a36d691dac6bb.gif','http://pic2.178.com/27/278913/month_1207/7a2302f1845a0979df055bdb699cdede.png','http://pic2.178.com/27/278913/month_1207/abefd9e4c03ff38d467b6d771ea2e857.png','http://pic2.178.com/27/278913/month_1207/a0315c1460ff654da9b6e56ac34b5fac.png','http://pic2.178.com/27/278913/month_1207/bde7b8d04f40b2748137801729660a5e.png','http://pic2.178.com/27/278913/month_1207/dd44d413faa2a2e2505837c5fefc4f21.png','http://pic2.178.com/27/278913/month_1207/a43dd40a03c7726f56960123361021aa.png','http://pic2.178.com/27/278913/month_1207/31a3f5da298b101a4fc020ed8cda451b.png','http://pic2.178.com/27/278913/month_1207/ada5425f0263b65ffae1c9348a3c5d30.png','http://pic2.178.com/27/278913/month_1207/ebc20db6eebd5dd7f44106cebd63449f.png','http://pic2.178.com/27/278913/month_1207/4a0809e874350c2b76b251a98569df6a.png','http://pic2.178.com/27/278913/month_1207/4f7b4d5981b1f00ec7923b6eba5a985c.png','http://pic2.178.com/27/278913/month_1207/a165e0caf3ec1cccacb6dc3031ac9662.png','http://img.ngacn.cc/attachments/mon_201207/12/-7_4ffe8f28503c0.png','http://img.ngacn.cc/attachments/mon_201207/13/-7_4fffbda6559fd.png','http://img.ngacn.cc/attachments/mon_201207/13/-7_4fffbdad17999.png','http://pic2.178.com/27/278913/month_1207/243ea3433f225fe948dbb8c1c3462a70.png','http://img.ngacn.cc/attachments/mon_201207/13/-7_4fffa1319197d.png','http://img.ngacn.cc/attachments/mon_201207/13/-7_4fffa4c03caa1.png','http://img.ngacn.cc/attachments/mon_201207/13/-7_4fffaa9d30dac.png','http://img.ngacn.cc/attachments/mon_201207/13/-7_4fffaaa52673e.png','http://img.ngacn.cc/attachments/mon_201207/13/-7_4fffc468eb93e.png','http://img.ngacn.cc/attachments/mon_201207/16/-7_5003c666c1113.png','http://img.ngacn.cc/attachments/mon_201207/30/-7_501674e61bdc7.png','http://img.ngacn.cc/attachments/mon_201207/30/-7_50167f81bba1c.gif','http://img.ngacn.cc/attachments/mon_201207/16/-7_5003ceb826aa6.gif','http://pic2.178.com/132/1324875/month_1207/862cbe0df668b5df0d4a08f20960c810.gif']
},
{
	title:'宅音',
	id:'zhaiyin',
	check:true,
	img:['http://pic2.178.com/724/7247152/month_1201/614d41768bfa6ccfd5f09b94d38350ae.png','http://pic2.178.com/344/3445603/month_1202/f267d6e1e968b22829ae84def74383ee.gif','http://pic2.178.com/344/3445603/month_1202/8b30432cf1e996e5d54da1ce73ddf412.gif','http://pic2.178.com/344/3445603/month_1202/e27d85f225459a81190c7c4f88d8a059.gif','http://pic2.178.com/724/7247152/month_1201/86c8a51602d075a094b99b12e990df3b.png','http://pic2.178.com/130/1301667/month_1203/a2e39025c4b1616529d25139db825c51.gif','http://pic2.178.com/130/1301667/month_1203/c7757f253cebf2b6852740dcdd2c2577.gif','http://pic2.178.com/130/1301667/month_1203/8fb244b66fbe432e7c8057fabe25a92b.gif','http://pic2.178.com/724/7247152/month_1201/0844552367c35f2441e9cd311cbd1907.png','http://pic2.178.com/724/7247152/month_1201/14549eb96bb1cc17b56ced51950b86ef.png','http://pic2.178.com/130/1301667/month_1203/9fc702d34f09d0e5a34a7e91826105ca.gif','http://pic2.178.com/130/1301667/month_1203/c60351097d3766dcea25cdb4d73f5924.gif','http://pic2.178.com/724/7247152/month_1201/c1310062db8df7a975cbebd7c81e8061.png','http://pic2.178.com/344/3445603/month_1202/71c4d2261a4c3e76fea0ab6a1355baf3.gif','http://pic2.178.com/130/1301667/month_1203/ac28b3cc5dbd85e96a09ee347a2e8f54.gif','http://pic2.178.com/130/1301667/month_1203/0bf39dd8614dd1d240eadc426038ac15.gif','http://pic2.178.com/130/1301667/month_1203/cb995a1b73d741db306318c3c37101aa.gif','http://pic2.178.com/130/1301667/month_1203/55c354f3cf70e2c383cfad743c7e2a1e.gif','http://pic2.178.com/724/7247152/month_1202/b138b30c679345c54770f6a053e5f964.png','http://pic2.178.com/130/1301667/month_1203/e475039c32aee23393517cffba66cdd8.gif','http://pic2.178.com/130/1301667/month_1203/7765fb6834a209365dd14cad527f8540.gif']
},
{
	title:'潘斯特',
	id:'panst',
	check:true,
	img:['http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506272908ef1b.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_50627293b2592.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506272967b002.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506272999d5ae.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062729ca3b7c.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506272a0a8575.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506272a3de0d4.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506272a686c49.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506272a97036d.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506272d145458.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506272ffcb215.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506273037ba6d.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062730643705.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506273096faea.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062730c85f8d.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506273109a34d.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062731370b2a.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062731679a51.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062731985826.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062731e79f98.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062736f33888.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506273721ec26.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506273755a4e4.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062737965651.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062737bda08d.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_50627380522fc.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062738372c1a.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062738680f07.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062738a660e8.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062738d6dadc.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062740e7f696.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274115208a.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062741444503.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062741725247.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062741a338cd.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062741da9d01.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274206b981.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_50627422d1431.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_50627425f36d0.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_50627428c5b33.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062744c28f01.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062744fcb48b.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_50627452de510.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_50627456600b0.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274595587e.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274665a339.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274692b0fa.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062746c4a7ec.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062746f82ce0.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062747336be9.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_50627491cd254.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274a0f1f53.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274a768bc3.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274adedcd1.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274b1ec57a.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274b8210d9.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274d02acf9.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274d52947f.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274dad9c96.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506274e2325bd.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062757c08a2c.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062758004237.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506275840aef2.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506275877d503.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062758b350dc.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_50627591c48e9.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506275969f432.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_5062759a26e2b.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506275a692688.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506275aa7a8ed.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506275c85dcc0.gif','http://img.ngacn.cc/attachments/mon_201209/26/-1324875_506275cc1873f.gif']
},
{
	title:'林大B',
	id:'lindab',
	check:true,
	img:['http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aab2a0cf4.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aaafcff16.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aab573659.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aab9b99e8.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aabd04256.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aac28aebc.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aacb24112.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aad367525.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aad98b5ef.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9aae08fc66.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab0bf1c58.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab194e7ae.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab1c36a83.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab25dc4f8.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab286db1c.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab2cbd257.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab38dac03.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab40a0deb.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab4cc829b.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab4f9f102.png','http://img6.ngacn.cc/attachments/mon_201306/01/-1324875_51a9ab615af23.png']
},
{
	title:'AC娘',
	id:'acniang',
	check:true,
	img:['http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc4cc6331.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc4f51be7.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc521c04b.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc5579c24.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc587c6f9.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc7a0ee49.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc7d91913.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc80140e3.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc835856c.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bc8638067.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bca2a2f43.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bca55cb6e.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bca81a77f.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcaaacb45.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcad49530.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcb093870.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcb3b8944.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcb6e96d1.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcba15fcf.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcbe35760.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcdd279bc.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcdfd9c69.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bce27ab4d.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bce4f2963.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bce7cf096.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bceb823da.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcee3d6b3.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcf0ba2db.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcf37c4c9.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bcf68ddc2.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd2497822.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd27520ef.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd2a0d49a.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd2d0a416.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd2fa0790.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd330dfad.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd35aec58.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd38bdf43.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd3b4b3bd.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052bd40397e2.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c0f41d155.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c0f6da079.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c10182a21.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c104b8e27.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c1076f119.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c10aa0303.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c10d1f08c.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c1101747c.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c112b3b1b.png','http://img.ngacn.cc/attachments/mon_201209/14/-47218_5052c1156ec1c.png','http://img.ngacn.cc/attachments/mon_201212/07/-1324875_50c15374cd8f6.png','http://img.ngacn.cc/attachments/mon_201212/07/-1324875_50c1537cf22c8.png','http://img.ngacn.cc/attachments/mon_201212/07/-1324875_50c153963eb38.png','http://img.ngacn.cc/attachments/mon_201212/07/-1324875_50c153ad5bca3.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d84199dbdb2.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d8419e3e516.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d841a1676ab.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d841a63a673.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d841a969837.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d841ae691f0.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d841b17b503.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d841b488bcd.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d841b7282dd.png','http://img.ngacn.cc/attachments/mon_201212/24/-1324875_50d841ba3efd0.png','http://img.ngacn.cc/attachments/mon_201301/03/-1324875_50e597c090c58.png','http://img.ngacn.cc/attachments/mon_201301/03/-1324875_50e597cedefb0.png','http://img.ngacn.cc/attachments/mon_201301/03/-1324875_50e597e217236.png','http://img.ngacn.cc/attachments/mon_201301/03/-1324875_50e597e645550.png','http://img.ngacn.cc/attachments/mon_201301/03/-1324875_50e597e9d6319.png','http://img.ngacn.cc/attachments/mon_201301/03/-1324875_50e597edf1a10.png','http://img.ngacn.cc/attachments/mon_201301/03/-1324875_50e597f190a11.png','http://img.ngacn.cc/attachments/mon_201301/03/-1324875_50e597f5ce78d.png','http://img6.ngacn.cc/attachments/mon_201301/22/-1324875_50fe24fff3ca8.png','http://img6.ngacn.cc/attachments/mon_201301/22/-1324875_50fe25031f595.png','http://img6.ngacn.cc/attachments/mon_201301/22/-1324875_50fe2505d26ed.png','http://img6.ngacn.cc/attachments/mon_201301/22/-1324875_50fe25088e9cb.png','http://img6.ngacn.cc/attachments/mon_201301/22/-1324875_50fe250b9488c.png','http://img6.ngacn.cc/attachments/mon_201301/22/-1324875_50fe250eca35e.png','http://img6.ngacn.cc/attachments/mon_201301/22/-1324875_50fe2511c5254.png','http://img6.ngacn.cc/attachments/mon_201301/22/-1324875_50fe2515354fd.png','http://img6.ngacn.cc/attachments/mon_201301/22/-1324875_50fe25191c370.png','http://img6.ngacn.cc/attachments/mon_201301/31/-1324875_510a32e14f324.png','http://img6.ngacn.cc/attachments/mon_201301/31/-1324875_510a32e41a1c9.png','http://img6.ngacn.cc/attachments/mon_201301/31/-1324875_510a32ea8cbd2.png','http://img6.ngacn.cc/attachments/mon_201301/31/-1324875_510a32ed356aa.png','http://img6.ngacn.cc/attachments/mon_201301/31/-1324875_510a32f1a0345.png','http://img6.ngacn.cc/attachments/mon_201301/31/-1324875_510a32f4bdcab.png','http://img6.ngacn.cc/attachments/mon_201301/31/-1324875_510a335b9300d.png','http://img6.ngacn.cc/attachments/mon_201303/04/-1324875_513394f5c39c4.png','http://img6.ngacn.cc/attachments/mon_201303/04/-1324875_513394f8d0005.png','http://img6.ngacn.cc/attachments/mon_201303/04/-1324875_513394fbc54e1.gif','http://img6.ngacn.cc/attachments/mon_201303/04/-1324875_513394ffb78e2.gif','http://img6.ngacn.cc/attachments/mon_201303/04/-1324875_51339502d110b.gif','http://img6.ngacn.cc/attachments/mon_201303/04/-1324875_51339506d9c37.png','http://img6.ngacn.cc/attachments/mon_201303/04/-1324875_51339509ac4b4.png','http://img6.ngacn.cc/attachments/mon_201303/04/-1324875_5133950d008f9.png','http://img6.ngacn.cc/attachments/mon_201303/23/-1324875_514daeb78abaa.png','http://img6.ngacn.cc/attachments/mon_201303/25/-1324875_51505df66692d.png']
}];

//给数组中添加自定义表情
if (customEmoCheck){
	if (MojoEmoArr[MojoEmoArr.length-1].id != "custom"){
		MojoEmoArr.push({
			title:'自定义表情',
			id:'custom',
			check:true,
			img:[]
		});
		try{
			var customEmoa = customEmo.split("|");
			for (i=0;i<customEmoa.length-1;i++){
				MojoEmoArr[MojoEmoArr.length-1].img.push(customEmoa[i]);
			}
		}catch(e){};
	}
}

//获取已开启的表情并获取默认开启的表情组
var defaultmojogroup = "";
for (i=0;i<MojoEmoArr.length;i++){
	MojoEmoArr[i].check=ngaui_getCookie("mojoemo"+MojoEmoArr[i].id)=="false"?false:true;
	if (ngaui_getCookie("defaultmojogroup")==MojoEmoArr[i].id && MojoEmoArr[i].check){
		defaultmojogroup = MojoEmoArr[i].id;
	}
}

//如果默认开启的表情组被关闭则选择第一个开启的表情组作为默认表情组
if (defaultmojogroup == ""){
	for (i=0;i<MojoEmoArr.length;i++){
		if (MojoEmoArr[i].check){
			defaultmojogroup = MojoEmoArr[i].id;
			break;
		}
	}
}

//变更标题栏 done
if (checkCustomTitle==true){
document.title=document.title.replace("艾泽拉斯国家地理论坛",customTitle);}

//初始化设置项时的复选框是否选中状态
function getchecks(vars){
	if (vars) return "checked"; else return "";
}

//Webkit不支持input和button之外的其他元素的直接click，所以需要使用这个过程来兼容各个浏览器的click
function clickobj(obj) {
    try {
        var evt = document.createEvent("Event");
        evt.initEvent("click", true, true);
        obj.dispatchEvent(evt)
    } catch (d) {
        obj.click();
    }
}

//在个人菜单中添加插件设置
if (!isinstall){
	while (!document.getElementById("mainmenuavatar"))
	{
		includeteme = getTime();
	}
	clickobj(document.getElementById("mainmenuavatar").parentNode);
	clickobj(document.getElementById("mainmenuavatar").parentNode);
		var menutab = document.getElementById("startmenu").getElementsByTagName("tbody")[0];
		
		var trEl = document.createElement("tr");
		menutab.appendChild(trEl);
		
		var tdEl1 = document.createElement("td");
		var tdEl2 = document.createElement("td");
		tdEl2.className = "last";
		tdEl2.id = "modify_setting";
		
		var tdEl3 = document.createElement("td");
		tdEl3.className = "last";
		tdEl3.id = "modify_mojo";
		tdEl3.style.display = "none";
		
		var tdEl4 = document.createElement("td");
		tdEl4.className = "last";
		tdEl4.id = "modify_bl";
		tdEl4.style.display = "none";
		
		var divhtml = '<div>';
		divhtml += '<h4 style="silver">NGA界面插件设置<br>当前版本：' + version + '</h4>';
		divhtml += '<div class="item select"><a href="javascript:void(0);" onclick="Setsettingdiv(\'modify_setting\',this);">综合设置››</a></div>';
		divhtml += '<div class="item"><a href="javascript:void(0);" onclick="Setsettingdiv(\'modify_mojo\',this);">表情开关››</a></div>';
		divhtml += '<div class="item"><a href="javascript:void(0);" onclick="Setsettingdiv(\'modify_bl\',this);">屏蔽列表››</a></div>';
		divhtml += '</div>';
		tdEl1.innerHTML = divhtml;
		trEl.appendChild(tdEl1);
		
		divhtml = '<div>';
		divhtml += '<input title="该功能可以把标题栏的“艾泽拉斯国家地理论坛”修改为自定义文字" id="customtitlecheck" type="checkbox" onclick="document.getElementById(\'customtitletext\').disabled=!this.checked;" ' + getchecks(checkCustomTitle) + '>自定义标题</input><br>';
		if (checkCustomTitle) {
		divhtml += '<input id="customtitletext" type="textbox" value="' + customTitle + '" />';
		}else{
		divhtml += '<input id="customtitletext" type="textbox" value="' + customTitle + '" disabled />';
		}
		divhtml += '<br><button onclick="ngaui_setCookie(\'customcheck\',document.getElementById(\'customtitlecheck\').checked);ngaui_setCookie(\'customtitle\',document.getElementById(\'customtitletext\').value);alert(\'保存成功！\');">保存</button>';
		divhtml += '<br><input type="checkbox" onclick="ngaui_setCookie(\'rmbltopic\',this.checked);" ' + getchecks(rmbltopic) + ' title="是否屏蔽黑名单用户发表的主题">屏蔽主题</input>';
		divhtml += '<br><input type="checkbox" onclick="ngaui_setCookie(\'updateinfo\',this.checked);" ' + getchecks(updateinfo) + ' title="是否显示升级提示">升级提示</input>';
		divhtml += '<br><input type="checkbox" onclick="ngaui_setCookie(\'quickpage\',this.checked);" ' + getchecks(quickpage) + ' title="是否启用左右方向键快速翻页">快速翻页</input>';
		divhtml += '<br><input type="checkbox" onclick="ngaui_setCookie(\'termcheck\',this.checked);" ' + getchecks(customTermCheck) + ' title="是否启用快速输入自定义短语">自定义短语</input>';
		divhtml += '<div class="item"><a title="进入插件发布帖查看帮助、更新插件" href="http://bbs.ngacn.cc/read.php?tid=4956754" target="_blank">帮助</a></div>';
		divhtml += '</div>';
		tdEl2.innerHTML = divhtml;
		trEl.appendChild(tdEl2);
		
		divhtml = '<div>';
		divhtml += '<p title="该选项卡内所有选项，勾选或者去掉勾选，会立即保存，无需手动保存">该选项卡自动保存</p>';
		divhtml += '<input type="checkbox" onclick="ngaui_setCookie(\'mojoemocheck\',this.checked);" ' + getchecks(checkMojoEmo) + ' title="是否启用表情插件">启用表情</input><br>';
		divhtml += '<input type="checkbox" onclick="ngaui_setCookie(\'mojoemoquickcheck\',this.checked);" ' + getchecks(checkQuickMojoEmo) + ' title="是否在快速回复上方也显示表情按钮">任何地方</input><br>';
		for (i=0;i<MojoEmoArr.length;i++){
		divhtml += '<input type="checkbox" onclick="ngaui_setCookie(\'mojoemo' + MojoEmoArr[i].id + '\',this.checked);" ' + getchecks(MojoEmoArr[i].check) + '  title="是否启用表情组“' + MojoEmoArr[i].title + '”">启用“' + MojoEmoArr[i].title + '”</input><br>';
		}
		if (!customEmoCheck) divhtml += '<input type="checkbox" onclick="ngaui_setCookie(\'mojoemocustom\',this.checked);"  title="是否启用表情组“自定义表情”">启用“自定义表情”</input><br>';
		divhtml += '</div>';
		tdEl3.innerHTML = divhtml;
		trEl.appendChild(tdEl3);
		
		divhtml = '<div>';
		divhtml += '<select id="bllist" title="双击被屏蔽的ID后可以点击下面出现的链接打开该用户的用户中心。按住CRTL键多选。" size=5  multiple="multiple" ondblclick= "var urldiv = document.getElementById(\'openblurl\');urldiv.href=\'http://bbs.ngacn.cc/nuke.php?func=ucp2&uid=\'+/\\d+/.exec(this.value);urldiv.style.display=\'block\';urldiv.innerHTML=\'链接ID:\'+/\\d+/.exec(this.value);">';
		var blistarr = blist.split(",");
		for (i=0;i<blistarr.length-1;i++){
			divhtml += '<option>' + blistarr[i] + '</option>';
		}
		divhtml += '</select>';
		divhtml += '<a id="openblurl" style="display:none" title="打开该ID的用户中心" target="_blank">none</a><br>';
		divhtml += '<button onclick="clearuid(\'m\');">移除选定</button><button onclick="clearlist();">移除所有</button><br>';
		divhtml += '<button onclick="outlist();">导出列表</button><button onclick="intlist();">导入列表</button><br>';
		divhtml += '</div>';
		tdEl4.innerHTML = divhtml;
		trEl.appendChild(tdEl4);
		
}

//变更设置项table
function Setsettingdiv(tdid,div){
	document.getElementById('modify_setting').style.display = 'none';
	document.getElementById('modify_bl').style.display = 'none';
	document.getElementById('modify_mojo').style.display = 'none';
	document.getElementById(tdid).style.display = 'block';
	var settingdivs =  div.parentNode.parentNode.getElementsByTagName("div");
	for (i=0;i<settingdivs.length;i++){
		settingdivs[i].className = "item";
	}
	div.parentNode.className = "item select";
}

//表情测试
if (!isinstall){
	if ((document.URL.indexOf("post.php?fid=") >= 0) || (document.URL.indexOf("post.php?action=reply&fid=") >= 0) || (document.URL.indexOf("post.php?action=quote&fid=") >= 0) || (document.URL.indexOf("post.php?action=modify&fid=") >= 0)) 
	{
		postTables=document.getElementsByTagName("table");
		postboxTable=postTables[1];
		nowTd=postboxTable.rows[3].cells[0];
		nowTd.innerHTML=nowTd.innerHTML+"<BR>额外表情[Beta]: 点击图标插入表情，预览图经过缩小，显示为原版。<font color=red><b>第一次点开表情按钮后载入可能非常缓慢，请耐心等待</b></font><BR>"+GetMojoEmoSet();
	}
	else if (checkQuickMojoEmo==true){
		var divEl = document.createElement("div");
		divEl.innerHTML = GetMojoEmoSet();
		try{document.getElementById("fastpostiframec").parentNode.insertBefore(divEl,document.getElementById("fastpostiframec"));}catch(e){};
	}
	for (i=0;i<MojoEmoArr.length;i++){

	}
}

//生成表情模块
function GetMojoEmoSet(){
    if (checkMojoEmo==true)
	{
		var MojoEmoSet = "";
		MojoEmoSet += '<div style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(255, 255, 255); border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(255, 255, 255); float: left; display: block;">';
		MojoEmoSet += '<button style="font-size:12px;line-height:normal;padding:0px 2px" onclick="this.parentNode.style.display=\'none\';this.parentNode.nextSibling.nextSibling.style.display=\'block\';" type="button"><b>打开额外表情</b></button>';
		MojoEmoSet += '</div>';
		
		MojoEmoSet += '<div id="PreviewImgDiv" style="position:absolute;top:0px;left:0px;z-index:4;text-align:left;border:1px solid #A70;display:none;background:#fff;box-shadow:5px 5px 5px #444"></div>';
		MojoEmoSet += '<div style="display: none;">';
			MojoEmoSet += '<div style="OVERFLOW-Y:auto;OVERFLOW-X:hidden;WIDTH:818px;HEIGHT:400px;">';
			for(i=0;i<MojoEmoArr.length;i++){
				if (MojoEmoArr[i].check) 
				{
					if (defaultmojogroup==MojoEmoArr[i].id){
						MojoEmoSet += '<div id="mojogroup_' + MojoEmoArr[i].id + '" style="display:block;">';
					}else{
						MojoEmoSet += '<div id="mojogroup_' + MojoEmoArr[i].id + '" style="display:none;">';
					}
					for(j=0;j<MojoEmoArr[i].img.length;j++){
						MojoEmoSet += "<img style=\"cursor:pointer;width:40px;height:40px;\" onclick=\"SelectMojos('" + MojoEmoArr[i].img[j] + "');\" onmouseover=\"mousePosition('over',this,event);\" onmouseout=\"mousePosition('out');\" src='" + MojoEmoArr[i].img[j] + "' />";
						//MojoEmoSet += "<img style=\"cursor:pointer;width:40px;height:40px;\" onclick=\"SelectMojos('" + MojoEmoArr[i].img[j] + "');\" src='" + MojoEmoArr[i].img[j] + "' />";
					};
					MojoEmoSet += "</div>";
				}
			};
			if (customTermCheck){
				MojoEmoSet += '<div id="customTerm" style="display:none;">';
				for (i=0;i<customTerm.length;i++){
					MojoEmoSet += '<a href="javascript:void(0)" style="display:block;color:gray;float:left;border:1px solid #aaa;padding:0 2px;margin:2px;align:center" onclick="SelectTerms(customTerm['+i+'])" title="'+customTerm[i].replace(/\\n/g,"\n")+'"><nobr>'+customTerm[i].substr(0,20)+'</nobr></a>';
					//MojoEmoSet += 'customTerm[i].substr(0,20)';
				}
				MojoEmoSet += '</div>';
			}
		MojoEmoSet += '</div>';
		
		MojoEmoSet += '<div>';
		for(i=0;i<MojoEmoArr.length;i++){
			if (MojoEmoArr[i].check) 
			{
				if (defaultmojogroup==MojoEmoArr[i].id){
					MojoEmoSet += '[ <a style="color:#5674B9" href=### onclick="SelectMojoGroup(this);">' + MojoEmoArr[i].title + '</a> ]  ';
				}else{
					MojoEmoSet += '[ <a style="color:#aaa" href=### onclick="SelectMojoGroup(this);">' + MojoEmoArr[i].title + '</a> ]  ';
				}
			}
		}
		if (customTermCheck){
			MojoEmoSet += '[ <a style="color:#aaa" href=### onclick="SelectMojoGroup(this);">自定义短语</a> ]  ';
		}
		if (customTermCheck || customEmoCheck){
			MojoEmoSet += '</span><a style="color:#aaa" href=### onclick="ngaui_openmenu(this.nextSibling,1);">菜单</a>'
			
			MojoEmoSet += '<span id="ngaui_menu_span" style="background-color: rgb(255, 254, 225); border: 1px solid rgb(68, 68, 68); padding: 0px 2px 1px; position: absolute; display: none; margin-top: 20px; ">';
			if (customEmoCheck) MojoEmoSet += '<a style="color:#aaa" href="###" onclick="addcustomemo();this.parentNode.style.display = \'none\';">添加自定义表情</a>';
			if (customEmoCheck) MojoEmoSet += '<a style="color:#aaa" name="emo" href="###" onclick="delcustomemo();this.parentNode.style.display = \'none\';"><br>删除自定义表情</a>';
			
			if (customTermCheck && customEmoCheck) MojoEmoSet += '<h4 style="margin-bottom: 2px;margin-top:2px;border-bottom: 1px solid #AAA;"></h4>';
			if (customTermCheck) MojoEmoSet += '<a style="color:#aaa" href="###" onclick="addcustomTerm();this.parentNode.style.display = \'none\';">添加自定义短语</a>';
			if (customTermCheck) MojoEmoSet += '<a style="color:#aaa" name="term" href="###" onclick="editcustomTerm();this.parentNode.style.display = \'none\';"><br>编辑自定义短语</a>';
			if (customTermCheck) MojoEmoSet += '<a style="color:#aaa" name="term" href="###" onclick="delcustomTerm();this.parentNode.style.display = \'none\';"><br>删除自定义短语</a>';
			
			if (customTermCheck || MojoEmoArr[MojoEmoArr.length -1 ].check) MojoEmoSet += '<h4 style="margin-bottom: 2px;margin-top:2px;border-bottom: 1px solid #AAA;"></h4>';
			MojoEmoSet += '<a style="color:#aaa" href="###" onclick="this.parentNode.style.display = \'none\';">取消</a>';
			MojoEmoSet += '</span> <span id="ngaui_menu_help">'
		}
		MojoEmoSet += '</div>';
		MojoEmoSet += '</div>';
	}
	else
	{
		var MojoEmoSet="<font color=grey><b>提示：额外表情组件被禁用，如需启用表情，请至“用户中心”菜单内的“表情开关”中勾选“启用表情”。</b></font>"
	}
	return MojoEmoSet;
}

//展开菜单
function ngaui_openmenu(obj,act){
	if (act) obj.style.display = 'inline';
	var obja = obj.getElementsByTagName("a");
	for (i=0;i<obja.length;i++){
		if (obja[i].name=="emo"){
			if (ngaui_getCookie("defaultmojogroup") == "custom" && (customTermCheck?document.getElementById("customTerm").style.display != "block":true)){
				obja[i].style.display = 'inline';
			}else{
				obja[i].style.display = 'none';
			}
		}
		if (obja[i].name=="term"){
			if (document.getElementById("customTerm").style.display == "block"){
				obja[i].style.display = 'inline';
			}else{
				obja[i].style.display = 'none';
			}
		}
	}
}

//选择表情
function SelectMojos(src){
	if(ngaui_isaddemo){
		for (i=0;i<MojoEmoArr[MojoEmoArr.length-1].img.length;i++){
			if (src == MojoEmoArr[MojoEmoArr.length-1].img[i]){
				alert("该表情已经在自定义表情中，不需要重复添加");
				return;
			}
		}
		MojoEmoArr[MojoEmoArr.length-1].img.push(src);
		customEmo += src + "|";
		localStorage.ngaui_customEmo = customEmo;
		ngaui_isaddemo = false;
		$("ngaui_menu_help").style.display = "none";
		alert("添加完毕，刷新后生效");
	}else if(ngaui_isdelemo){
		customEmo = customEmo.replace(src + "|","");
		localStorage.ngaui_customEmo = customEmo;
		ngaui_isdelemo = false;
		$("ngaui_menu_help").style.display = "none";
		alert("删除完毕，刷新后生效");
	}else{
		postfunc.addsmile('[img]'+src+'[/img]');
	}
}

//添加自定表情
function addcustomemo(){
	if (ngaui_getCookie("defaultmojogroup") == "custom"){
		var newcustomemo = prompt("请将需要添加的表情图片的URL地址（网址）粘贴到这里，然后点击确定。\n如果需要将已有表情添加到自定义组，请先切换到非自定义组，\n然后点击“菜单”-“添加自定义表情”，在出现“选择一个表情以添加”提示后点击需要添加的表情图片即可。\n新添加的表情刷新后显示。：");
		if (newcustomemo == "" || newcustomemo == null)
			return;
		else{
			for (i=0;i<MojoEmoArr[MojoEmoArr.length-1].img.length;i++){
				if (newcustomemo == MojoEmoArr[MojoEmoArr.length-1].img[i]){
					alert("该表情已经在自定义表情中，不需要重复添加");
					return;
				}
			}
			MojoEmoArr[MojoEmoArr.length-1].img.push(newcustomemo);
			customEmo += newcustomemo + "|";
			localStorage.ngaui_customEmo = customEmo;
			ngaui_isaddemo = false;
			$("ngaui_menu_help").style.display = "none";
			alert("添加完毕，刷新后生效");
		}
	}else{
		if (ngaui_isaddemo){
			ngaui_isaddemo = false;
			$("ngaui_menu_help").style.display = "none";
		}else{
			ngaui_isaddemo = true;
			$("ngaui_menu_help").innerHTML = "请选择一个表情以添加";
			$("ngaui_menu_help").title = "您现在可以点击一个非自定义分组的表情来把这个表情添加到自定义分组中。";
			$("ngaui_menu_help").style.display = "inline";
		}
	}
}

//删除自定义表情
function delcustomemo(){
	if (ngaui_getCookie("defaultmojogroup") == "custom"){
		if (ngaui_isdelemo){
			ngaui_isdelemo = false;
			$("ngaui_menu_help").style.display = "none";
		}else{
			ngaui_isdelemo = true;
			$("ngaui_menu_help").innerHTML = "请选择一个表情以删除";
			$("ngaui_menu_help").title = "您现在可以点击一个自定义分组的表情来把这个表情从自定义分组中删除，不删除请再次点击菜单中的删除表情项目。";
			$("ngaui_menu_help").style.display = "inline";
		}
	}
}

//选择短语
function SelectTerms(s){
	if(ngaui_isdelterm){
		for (i=customTerm.length-1;i>-1;i--){
			if (customTerm[i]==s) {
				customTerm.splice(i,1);
			}
		}
		localStorage.ngaui_customTerm = JSON.stringify(customTerm);
		ngaui_isdelterm = false;
		$("ngaui_menu_help").style.display = "none";
		alert("删除完毕，刷新后生效");
	}else if(ngaui_iseditterm){
		for (i=customTerm.length-1;i>-1;i--){
			if (customTerm[i]==s) {
				ngaui_iseditterm = false;
				$("ngaui_menu_help").style.display = "none";
				var newcustomTerm = prompt("请编辑短语，完成后点击确定。\n刷新后方能显示编辑后的短语。：",s);
				if (newcustomTerm == "" || newcustomTerm == null)
					return;
				else{
					customTerm[i] = newcustomTerm;
					localStorage.ngaui_customTerm = JSON.stringify(customTerm);
					alert("编辑完毕，刷新后生效");
				}
				return;
			}
		}
	}else{
		postfunc.addsmile(s.replace(/\\n/g,"\n"));
	}
}

//添加自定短语
function addcustomTerm(){
	var newcustomTerm = prompt("请将需要添加的自定义短语粘贴到这里，然后点击确定。\n新添加的短语刷新后显示。：");
	if (newcustomTerm == "" || newcustomTerm == null)
		return;
	else{
		for (i=0;i<customTerm.length;i++){
			if (newcustomTerm == customTerm[i]){
				alert("该短语已经在自定义短语中，不需要重复添加");
				return;
			}
		}
		customTerm.push(newcustomTerm);
		localStorage.ngaui_customTerm = JSON.stringify(customTerm);
		alert("添加完毕，刷新后生效");
	}
}

//删除自定义短语
function delcustomTerm(){
	if (document.getElementById("customTerm").style.display == "block"){
		if (ngaui_isdelterm){
			ngaui_isdelterm = false;
			$("ngaui_menu_help").style.display = "none";
		}else{
			ngaui_iseditterm = false;
			ngaui_isdelterm = true;
			$("ngaui_menu_help").innerHTML = "请选择一个短语以删除";
			$("ngaui_menu_help").title = "您现在可以点击一个自定义短语以删除这个自定义短语，不删除请再次点击菜单中的删除表情项目。";
			$("ngaui_menu_help").style.display = "inline";
		}
	}
}

//编辑自定义短语
function editcustomTerm(){
	if (document.getElementById("customTerm").style.display == "block"){
		if (ngaui_iseditterm){
			ngaui_iseditterm = false;
			$("ngaui_menu_help").style.display = "none";
		}else{
			ngaui_isdelterm = false;
			ngaui_iseditterm = true;
			$("ngaui_menu_help").innerHTML = "请选择一个短语以编辑";
			$("ngaui_menu_help").title = "您现在可以点击一个自定义短语以编辑这个自定义短语，不编辑请再次点击菜单中的删除表情项目。";
			$("ngaui_menu_help").style.display = "inline";
		}
	}else{
	}
}

//选择表情组
function SelectMojoGroup(obja){
	for (i=0;i<MojoEmoArr.length;i++){
		if (MojoEmoArr[i].title == obja.innerHTML){
			document.getElementById("mojogroup_"+MojoEmoArr[i].id).style.display = "block";
			ngaui_setCookie("defaultmojogroup",MojoEmoArr[i].id);
		}else{
			try{document.getElementById("mojogroup_"+MojoEmoArr[i].id).style.display = "none";}catch(e){};
		}
	}
	if (obja.innerHTML == "自定义短语"){
		try{document.getElementById("customTerm").style.display = "block";}catch(e){};
		ngaui_isdelemo = false;
		ngaui_isaddemo = false;
		$("ngaui_menu_help").style.display = "none";
	}else{
		try{document.getElementById("customTerm").style.display = "none";}catch(e){};
		ngaui_isdelterm = false;
		ngaui_iseditterm = false;
		$("ngaui_menu_help").style.display = "none";
	}
	if (ngaui_getCookie("defaultmojogroup") != "custom"){
		ngaui_isdelemo = false;
		ngaui_isaddemo = false;
		$("ngaui_menu_help").style.display = "none";
	}
	var ma = obja.parentNode.getElementsByTagName("a");
	for (i=0;i<ma.length;i++){
		if (ma[i] == obja){//高亮
			ma[i].style.color="#5674B9";
		}else{//普通
			if (ma[i].innerHTML != "添加" && ma[i].innerHTML != "删除") ma[i].style.color="#aaa";
		}
	}
	ngaui_openmenu($("ngaui_menu_span"));
}

function ngaui_elementLeft(e){
	try{
		var offset = e.offsetLeft;
		if(e.offsetParent != null) offset += ngaui_elementLeft(e.offsetParent);
		return offset;
	}catch(e){};
}
function ngaui_elementTop(e){
	try{
		var offset = e.offsetTop;
		if(e.offsetParent != null) offset += ngaui_elementTop(e.offsetParent);
		return offset;
	}catch(e){};
}

//表情预览
function mousePosition(action,obj,e){
	var previewdiv = document.getElementById('PreviewImgDiv');
	if(action=="out"&&previewdiv) timer = setTimeout("document.getElementById('PreviewImgDiv').style.display = 'none';",500);
	if(action=="over") {
		try{clearTimeout(timer);}catch(e){};
		previewdiv.innerHTML = "<img style='margin: 5px' src=\"" + obj.src + "\" \/>";
		//tTip.showdscp(e_,'PreviewImgDiv')
		previewdiv.style.display = 'block';
		previewdiv.style.left = ngaui_elementLeft(obj) + 'px';
		previewdiv.style.top = ngaui_elementTop(obj) + 45 + 'px';
	}
}

//快速翻页
var prevpageurl = "";
var nextpageurl = "";
if (quickpage){
	document.onkeydown = pageEvent;
	var pagea = document.getElementsByTagName("a");
	for (i=0;i<pagea.length;i++){
		if (pagea[i].title=="上一页") prevpageurl=pagea[i].href; 
		if (pagea[i].title=="下一页") nextpageurl=pagea[i].href; 
		if (pagea[i].title=="可能有此页") nextpageurl=pagea[i].href; 
	}
}

//快速翻页模块
function pageEvent(evt){ 
	evt = evt ||window.event; 
	var key=evt.which||evt.keyCode;
	var evtobj =evt.target||evt.srcElement;
	if(evtobj.tagName.toLowerCase()=="input" || evtobj.tagName.toLowerCase()=="textarea") return;
	if (key == 37 && prevpageurl != "") location = prevpageurl;
	if (key == 39 && nextpageurl != "") location = nextpageurl;
};

//用户黑名单测试
//用户黑名单主页面
var tables = document.getElementsByTagName("table");
var res = new Array();
for(i = 0, j = 0; i < tables.length; i++){
	if (tables[i].className == "forumbox postbox")
	{
		res[j] = tables[i];
		j++;
	}
}

//获取一个回帖(或楼主)的uid所在位置, 参数为回帖数组r和下标i
function getUidLocation(r, i){
	//理论上应该是第i个name = uid的元素位置, 但还是检验一下比较好
	var possibleLocation = document.getElementsByName("uid")[i];
	if(!r[i].contains(possibleLocation)){
		//uid不在res内, 它去哪了不知道, 让它出错停止吧
		throw(new Error("Incorrect UID! Please report it and wait for an update"));
	}
	if(isNaN(parseInt(possibleLocation.innerText))){
		//uid不是纯数字, 它是什么东西也不知道, 让它出错停止吧
		throw(new Error("Incorrect UID! Please report it and wait for an update"));
	}
	return possibleLocation;
}

//增加屏蔽按钮
if (!isinstall){
	for (i = 0; i < res.length; i++){
		btn=document.createElement("input");
		btn.type="button";
		btn.value="屏蔽";
		btn.onclick = function (i){
			var a = i.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
			var uid = getUidLocation(res,res.indexOf(a)).innerText;
			blist += "(" + uid + "),"; //新的界面里uid已经没有括号了, 为了兼容旧屏蔽列表所以这里加上括号进行处理
			ngaui_setCookie("blist", blist);
			a.parentNode.removeChild(a);
		};
		getUidLocation(res,i).parentNode.appendChild(btn);
	}
}

//移除屏蔽列表中的用户发表的回复
for (i = 0; i < res.length; i++){
	if (inBlackList("("+getUidLocation(res,i).innerHTML+")"))
		res[i].parentNode.removeChild(res[i]);
}

//移除黑名单用户发表的主题
if (rmbltopic){
	var reada = document.getElementsByTagName("a");
	for (i = 0; i< reada.length;i++){
		if (reada[i].title.indexOf("用户ID") != -1) {
			if (inBlackList("(" + /\d+/.exec(reada[i].title) + ")")){
				reada[i].parentNode.parentNode.parentNode.removeChild(reada[i].parentNode.parentNode);
			}
		}
	}
}

function ngaui_setCookie(c_name,value){ //写入cookie
	var expiredays = 10000;
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}


function ngaui_getCookie(c_name){ //获取cookie
	var cookies = document.cookie.split( ';' );
	var cookie = '';
	for(var i=0; i<cookies.length; i++) {
		cookie = cookies[i].split('=');
		if(cookie[0].replace(/^\s+|\s+$/g, '') == c_name) {
			return (cookie.length <= 1) ? "" : unescape(cookie[1].replace(/^\s+|\s+$/g, ''));
		}
	}
	return "";
}

function ngaui_delCookie(c_name){ //删除cookie
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=ngaui_getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

//判断是否处于屏蔽列表中
function inBlackList(name){
	if (blist.indexOf(name) > -1){
		return true;
	}else{
		return false;
	}
}

//建立一个div以标记插件加载完毕
if (!isinstall){
	var isinstallel = document.createElement("div");
	isinstallel.style.position = "none";
	isinstallel.id = "isinstalldiv";
	document.getElementsByTagName("body")[0].appendChild(isinstallel);
}

//更新提示
if (updateinfo){
	if (localversion == ""){
		alert("恭喜你安装成功本插件！\n有问题请点击“菜单”-“综合设置”-“帮助”来查看帮助和更新信息。");
	}else{
		if (localversion != version){
			alert("插件已经更新到" + version + "！\n" + updatetitle + "\n如需帮助请点击“菜单”-“综合设置”-“帮助”查看帮助和更新信息。");
		}
	}
	ngaui_setCookie("localversion",version);
}

//导入屏蔽列表
function intlist() { 
	var slist = prompt("请将导出的内容粘贴在这里：");
	if (slist == "" || slist == null)
		return;
	else{
		if (confirm("导入屏蔽列表会覆盖已有的屏蔽列表，是否确定？") == false)
			return;
		ngaui_setCookie("blist", slist);
		alert("导入成功，请刷新页面！");
	}
};

//导出屏蔽列表
function outlist(){
	prompt("请复制并保存下面的内容：", blist);
};

//解除单个或多个用户屏蔽
function clearuid(){
	var bllistmul = document.getElementById("bllist");
	for (i=0;i<bllistmul.options.length;i++){
		if(bllistmul.options[i].selected) blist = blist.replace(bllistmul.options[i].value+",","");
	}
	ngaui_setCookie("blist",blist);
	alert("成功解除屏蔽！");
}

//清空屏蔽列表
function clearlist(){
	if (confirm("确认清空屏蔽列表？") == false)
		return;
	ngaui_setCookie("blist", "");
	alert("屏蔽列表已清空，请刷新页面！");
}
