// console.log("hello world!");
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req,res)=>{
    if(req.url === '/'){
        fs.readFile(path.join(__dirname,'public','index.html'),(err, content)=>{
            if(err) throw err;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHead(200,{'Content-type': 'text/html'});
            res.end(content);
        })
    }else if(req.url.match('\.css$')){
        var cssPath = path.join(__dirname,'public',req.url);
        // console.log(cssPath);
        var filestream = fs.createReadStream(cssPath,'utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200,{'Content-Type':'text/css'});
        filestream.pipe(res);
    }else if(req.url.match('\.js$')){
        var jsPath = path.join(__dirname,'public',req.url);
        var filestream = fs.createReadStream(jsPath,'utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        filestream.pipe(res);
    }
    else if(req.url.match('\.jpg$')){
        var jpgImagePath = path.join(__dirname,'public',req.url);
        var filestream = fs.createReadStream(jpgImagePath);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200,{'Content-Type': 'image/jpg'});
        filestream.pipe(res);
    }else if(req.url.match('\.png$')){
        var pngImagePath = path.join(__dirname,'public',req.url);
        var filestream = fs.createReadStream(pngImagePath);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200,{'Content-Type': 'image/png'});
        filestream.pipe(res);
    }
    else if(req.url === '/api'){
        fs.readFile(path.join(__dirname,'public/assets','data.json'),(err,content)=>{
            if(err) throw err;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHead(200,{'Content-Type' : 'application/json'});
            res.end(content);
        })
    } else{
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write("404 Page not found.");
    }
    
    // res.write("Hello World!");
    // res.end();   
    
    // console.log(req.url);
});
server.listen(5959,()=>console.log("Server is up and running."))