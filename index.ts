import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';
import * as url from 'url';

const server = http.createServer();
const publicDir=p.resolve(__dirname,'public');

server.on('request',(request:IncomingMessage,response:ServerResponse)=>{
  const {method,url:path,headers}=request
  // @ts-ignore
  const {pathname,search}=url.parse(path)
  // @ts-ignore
  let fileName=pathname.substr(1)
  if(fileName===''){
    fileName='index.html'
  }
  fs.readFile(p.resolve(publicDir,fileName),(error,data)=>{
    if(error){
      if(error.errno===-4058){
        response.statusCode=404
        fs.readFile(p.resolve(publicDir,'404.html'),(error,data)=>{
          response.end(data)
        })
      }else if(error.errno===-4068){
        response.statusCode=403
        response.setHeader('content-Type','text/html;charset=UTF-8')
        response.end('无权查看目录内容')
      }
      else{
        response.statusCode=505
        response.setHeader('Content-Type','text/html;charset=UTF-8')
        response.end('服务器繁忙，请稍后再试')
      }
    }else{
      response.end(data);
    }
  })
})

server.listen(8888)