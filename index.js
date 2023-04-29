// console.log("hello world!");
const http = require('http');
const fs = require('fs');
const path = require('path');

// importing mongoclient
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://dipesh:shrestha@shresthacluster.gvlddte.mongodb.net/?retryWrites=true&w=majority";
// let data = []


// Update Data.json file with updated data from MongoDB
async function modifyData(products){
    console.log("----Modifying Data.json file:----");
    console.log(products);
    fs.writeFile('./public/assets/data.json',JSON.stringify(products),(err)=>{
        console.log(err);
    })
    console.log("----Modifying Data.json successful:----");
}

//Listing all data from mongoDB
async function accessAllData(client){
    
    console.log("----Accessing all the products:----");
    const cursor = client.db("lucidmarketplace").collection("productcollection").find({});
    const products = await cursor.toArray();
    // console.log(products);
    console.log("----Accessing all the products successful:----");
    // console.log(JSON.parse(products));
    await modifyData(products);
}

// Connecting to MongoDB
async function connectToMongoDB(){
    const client = new MongoClient(uri);
    try{
        client.connect();
        console.log("----Connection is successful.----");
        //Reading all the data from MongoDB (productcollection)
        await accessAllData(client);
    }catch(e){
        console.log("----Error occured while establishing connection----",e);

    }finally{
        client.close();
        console.log("----Closing the connection----")
    }
}

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
        //Connecting to MongoDB
        connectToMongoDB();
        
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