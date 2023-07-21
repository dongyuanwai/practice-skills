// const fs = require('fs');
// fs.readFile('./question.json', 'utf8', function(err, result){
//     if (err) {
//         return console.log('文件读取失败!' + err.message);
//      }
//     console.log('文件读取成功，内容是:' + result);

// });

// 读取文件 question.json的内容，把内容转换成正确的数据格式
// Path: 01node获取文本信息\index.js
const fs = require('fs');
fs.readFile('./question.json', 'utf8', function (err, result) {
    if (err) {
        return console.log('文件读取失败!' + err.message);
    }
    console.log('文件读取成功，内容是:' + result);
    // 把读取到的内容转换成正确的数据格式
    // 将每个 JSON 对象包装在数组中
    var jsonArray = "[" + result.trim().replace(/\}\s*\{/g, "},{") + "]";
    // 帮我解释下上面这段正则表达式
    // \} 代表匹配一个 } ，\s* 代表匹配 0 个或多个空白符，\{ 代表匹配一个 {
    // g 代表全局匹配，也就是匹配所有的 }{
    // replace 方法的第二个参数可以是一个字符串，也可以是一个函数
    // 这里我们传入的是一个函数，这个函数的参数是匹配到的字符串
    // 这个函数的返回值就是要替换成的字符串
    // 这里我们把匹配到的字符串替换成 },{ ，也就是在每个 }{ 中间加上 ,
    // 这样我们就得到了一个符合 JSON 语法的字符串了
    

    // 解析为 JSON 对象数组
    var parsedData = JSON.parse(jsonArray);

    //把处理后的数据写入文件
    fs.writeFile('./new_fe.json',jsonArray,function(err){
        if(err){
            return console.log("写入文件失败！"+err.message);
        }
        console.log("写入成绩成功！");
    });

});





