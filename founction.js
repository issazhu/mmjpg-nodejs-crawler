//引用库
http = require('http');
fs = require('fs');
//mkdirp = require('mkdirp');
//声明变量

var opt={
    path: 'http://www.mmjpg.com/mm/',
    header: '?Accept: text / html, application / xhtml + xml, application / xml; q = 0.9, image / webp,*/*;q=0.8%20Accept-Encoding:gzip,%20deflate,%20sdch%20Accept-Language:zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4%20Cache-Control:max-age=0%20Connection:keep-alive%20Host:www.mmjpg.com%20Referer:http://www.mmjpg.com/hot/%20Upgrade-Insecure-Requests:1%20User-Agent:Mozilla/5.0%20(Windows%20NT%2010.0;%20Win64;%20x64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/56.0.2924.87%20Safari/537.36',
    mmnum: 134,
    totalmm:942,
    page:1,
    totalpage:1,
    year:2016,
    title: 'hihi',
    img: 'http://img.mmjpg.com/',
    dir: './',
    xiegan: '/',
    wenben: '.jpg',
    i:1,
    //<a href="/mm/939/42">42</a>
    regexpys: /<a\shref="\/mm\/\d{0,4}\/\d{0,4}">(\d{0,4})<\/a>/g,
    //<img src="http://img.mmjpg.com/2017/939/1.jpg" alt="完美娇艳女人蒋小静圆润美臀勾人魂魄" style="position: static;">
    regexpnf: /<img\ssrc="http:\/\/img.mmjpg.com\/(\d{4}).*?"\s*alt="(.*?)"/g,
};
//爬网页
var req = function () {
    var data = '';
    var webpage = opt.path + opt.mmnum + opt.xiegan + opt.page + opt.header;
    console.log('web:'+webpage);
    http.get(webpage, function (res) {
        res.on('data', function (chunk) {
            data += chunk;

        }).on('end', function () {
            //console.log(data);
            parseNf(data);
            parseYs(data);
            console.log('step1');
        }).on('end', function () {
            console.log('step2');
            download();
        });

    });
}
//郑则表达式页数
var parseYs = function (data) {
    var news = data;
   // console.log(data);
    var matchys = new Array;
    var reg = opt.regexpys;
    console.log('reg:' + reg);
    while ((matchys = reg.exec(news)) != null) {

        console.log('ys:'+matchys);
        opt.totalpage = matchys[1];
        //console.log(reg.lastIndex);
    }

    console.log('totalpage:'+opt.totalpage+' last:'+opt.regexpys.lastIndex)
}
//正则表达式年份
var parseNf = function (data) {
    var news = data;
    var matchnf = new Array;
    var reg = opt.regexpnf;
    console.log('reg:' + reg);
    matchnf = reg.exec(news);
    //console.log(data);
    console.log('nf:'+matchnf);
    //console.log('year: ' + match[1] + ' name: ' + match[2]);
    opt.year = matchnf[1];
    opt.title = matchnf[2];
    console.log('last:'+reg.lastIndex);
    console.log('year:' + opt.year + ' title:' + opt.title);
}

//下载图片
var download = function () {

    var imgpage = opt.img + opt.year + opt.xiegan + opt.mmnum + opt.xiegan + opt.i + opt.wenben;
    console.log('get:' + imgpage);
    writestream = fs.createWriteStream(opt.dir+opt.mmnum+opt.xiegan + opt.i + '.jpg');
    http.get(imgpage, function (res) {
        res.pipe(writestream)
    });
    writestream.on('finish', function () {
        console.log('step2');
        if (opt.i < opt.totalpage) {
            opt.i++;
            download();
        } else {
            console.log('finish')
            opt.i = 1;
            opt.page = 1;
                    if (opt.mmnum < opt.totalmm) {
                        opt.mmnum++;
                       opent();
                    }
                    else { console.log('finish all'); }

        }
    });

};

var opent = function () {
    var dirpath = opt.dir + opt.mmnum + opt.xiegan;
    console.log('dir:' + dirpath);
    fs.mkdir(dirpath, 0777, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("creat done!");
            req();
        }
    })
};
/*var loopthreat = function () {
    for (; opt.mmnum < opt.totalmm; opt.mmnum++) {
        opent()
    }
}*/
opent();
//module.exports = req;
