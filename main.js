'use strict';

 const http = require('http');
const { isNumber } = require('util');

 const port = 9999;
 const statusNotFound = 404;
 const statusBadRequest = 400;
 const statusOk= 200;
 const posts = [];
 let nextId = 1;

 const metods = new Map();

 metods.set('/posts.get',function(request,response){
     response.writeHead(statusOk,{'Content-Type':'application/json'});
     response.end(JSON.stringify(posts));
 });
 metods.set('/posts.getById',function(request,response){
      const url = new URL(request.url,`https://${request.headers.host}`);

      const searchParams = url.searchParams;
      
      const idString = searchParams.get('id');
      const id = Number(idString);

      if(!searchParams.has('id') || Number.isNaN(id)===true){
          response.writeHead(statusBadRequest);
          response.end();
          return;
      }
 
       for (let i = 0; i < posts.length; i++) {
          const post = posts[i];
     
           if(post.Id === id){
            response.writeHead(statusOk,{'Content-Type':'application/json'});
            response.end(JSON.stringify(post));
            return;
           }

           response.writeHead(statusNotFound);
           response.end();
       }

       
 });
 metods.set('/posts.post',function(request,response){

       const url = new URL(request.url, `http://${request.headers.host}`);

       const searchParams = url.searchParams;

        if(!searchParams.has('content')){
              
            response.writeHead(statusBadRequest);
            response.end();
            return;
        }

        const content = searchParams.get('content');

        const post = {
            Id:nextId++,
            content:content,
            created:Date.now(),
        }

      posts.unshift(post);
        response.writeHead(statusOk,{'Content-Type':'application/json'});
        response.end(JSON.stringify(post));


 });
 metods.set('/posts.edit',function(request,response){});
 metods.set('/posts.delete',function(request,response){});


 const server = http.createServer(function(request,response){

    const url = new URL(request.url,`http://${request.headers.host}`);
    const pathName = url.pathname;
  
    const method = metods.get(pathName)
    if(method === undefined){
        response.writeHead(statusNotFound);
        response.end();
        return;
    }
  
    method(request,response);

 });

 server.listen(port);