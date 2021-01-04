'use strict';

const http = require('http');

const port = 8000;
 
var server = http.createServer();
server.on('request', doRequest);
 
// ファイルモジュールを読み込む
const fs = require('fs');
 
// リクエストの処理
function doRequest(req, res) {
    
    // ファイルを読み込んだら、コールバック関数を実行する。
    fs.readFile('./index.html', 'utf-8' , doReard );
    
    // コンテンツを表示する。
    function doReard(error, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }
    
}
 
server.listen(port, () => {
  console.log('Listening on ' + port);
});