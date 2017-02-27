// evenWarmer.js
// create Request and Response constructors...
const net = require('net');
const fs = require('fs');

const [HOST, PORT] = ['127.0.0.1', 8080];

/* class Request represents an http request
- Properties:
    * path - the path requested (for example, /foo/bar/baz.html)
    * method - the http verb (for example, GET or POST)
    * headers - an object that has header names as property names and header values as property values (for example, {"Host": "localhost:8080", "User-Agent": "Mozilla/5.0 ..."})
    * body - the body of the request (for example, username=foo)
*/
class Request{
    // Request constructor parses httpRequest string into class properties
    constructor(httpRequest){
        this.path = httpRequest.split(' ')[1];
        this.method = httpRequest.split(' ')[0];

        const hdArray = httpRequest.split('\r\n');
        const headTemp = {};
        for (let i = 1; i < hdArray.length; i++){
            let element = hdArray[i];
            let key = element.split(" ")[0];
            let val = element.split(" ")[1];
            if(key !== undefined && val !== undefined){
                headTemp[key.slice(0,key.length - 1)] = val;
            }
        }
        this.headers = headTemp;

        let body = hdArray[hdArray.length - 1]
        this.body = body;
    }

    // toString returns a string representation of the request
    toString(){
        let toRet = this.method + " " + this.path + " HTTP/1.1\r\n";
        for (var key in this.headers){
            if(!this.headers.hasOwnProperty(key)){
                continue;
            } else {
                toRet += key + ": " + this.headers[key] + "\r\n";
            }
        }
        toRet += "\r\n";
        toRet += this.body;
        return toRet;
    }
}

/* Response class
- Properties:
    * sock - the socket associated with the http response
    * headers - an object that has response header names as property
              names and response header values as property values
              (for example, {"Content-Type": "text/html", "Cache-Control": "max-age=3600"})
    * body - the body of the response (such as an html document or an image)
    * statusCode - the status code of the http response as a Number (for example: 200)
    * statusDescription - an object that holds the status code descriptions within the scope of this project
*/
class Response{
    /* constructor method creates a Response obj
    @param sock - a socket object
    */
    constructor(sock){
        this.sock = sock;
        this.statusDescription = {"200": "OK",
        "404": "Not Found",
        "500" : "Internal Server Error",
        "400" : "Bad Request",
        "301" : "Moved Permanently",
        "302" : "Found",
        "303" : "See Other"
        };
        this.statusCode = (sock + "").split(" ")[1];
        this.headers = {};
    }

    /* setHeader adds a key value pair to the property headers object
    @param name - string value representing the key, or header name ie Content-Type
    @param value - string value representing the value, ie text/css
    */
    setHeader(name, value){
        this.headers[name] = value;
    }

    /* write writes data to the Response object's sock property
    @param data - a string or buffer (binaryData)
    */
    write(data){
        this.sock.write(data);
    }

    /* end ends the Response object's sock connection. If provided with an s argument, end writes s to
    the socket first, and then terminates connection.
    @parm s - string or buffer to be written to the sock (optional)
    */
    end(s){
        if (s !== undefined){
            this.sock.write(s, 'utf-8', (err) => {
                this.sock.end();
            });
        } else {
            this.sock.end();
        }

    }

    /*  send sets the statusCode and the body of this Request object,
        sends the valid http response to the client, and closes the connection
        @param statusCode - status code of the http response (limited by this implementation)
        @param body - the body of the http response
    */
    send(statusCode, body){
        this.statusCode = statusCode;
        this.body = body;
        this.sock.write(this.toString());
        this.sock.end();
    }

    /*  writeHead sets the statusCode, and writes everything but the body, and leaves the connection open;
        @param statusCode - the status code of the http response
    */
    writeHead(statusCode){
        this.statusCode = statusCode;
        this.write("HTTP/1.1 " + this.statusCode + " " + this.statusDescription[this.statusCode] + "\r\n" +
            "Content-Type: " + this.headers["Content-Type"] + "\r\n\r\n");
    }

    /*  redirect redirects to the supplied url using the supplied statusCode…
        if statusCode is no given, then default to permanent redirect, 301
        immediately sends response and closes connection.
        @param statusCode - status code of http response
        @url - url to redirect to
    */
    redirect(statusCode, url){
        if (arguments.length < 2){
            this.statusCode = 301;
            this.headers["Location"] = arguments[0];
        } else {
            this.statusCode = statusCode;
            this.headers["Location"] = url;
        }
        this.send(this.statusCode);
    }

    //  toString returns a string representation of this response object that can serve as a valid http response
    toString(){
        let res = "HTTP/1.1 ";
        res += this.statusCode + " " + this.statusDescription[this.statusCode] + "\r\n";
        for(var key in this.headers){
            res += key + ": " + this.headers[key] + "\r\n";
        }
        if(this.body !== undefined){
            res += "\r\n" + this.body;
        } else {
            res += "\r\n";
        }
        return res;
    }

    /*  sendFile sends file specified by fileName to client by
        specifying appropriate content type, writing the data
        from the file… and immediately closing the connection
        after the data is sent
        @fileName - the name of the file to be sent
    */
    sendFile(fileName){
        ////////   get full path detail   ///////////
        const path = __dirname + "/../public" + fileName;
        ////////   get the content type   ///////////
        const ext = fileName.split('.')[1];
        let contentType = "";
        if (ext === 'jpeg' || ext === 'png' || ext === 'gif'){
            contentType += "image/" + ext;
            ////////   read file content type (image)   ///////////
            fs.readFile(path, (err, data) => {
                if(err){
                    this.statusCode = 500;
                    this.writeHead(500);
                    this.body = "500 Internal Server Error";
                    this.write(this.body);
                    this.end();
                } else {
                    this.headers["Content-Type"] = contentType;
                    this.writeHead(200);
                    this.body = data;
                    this.write(this.body);
                    this.end();
                }
            });
        }
        else if (ext === 'html' || ext === 'css' || ext === 'txt'){
            if (ext === 'txt'){
                contentType += "text/plain";
            } else {
                contentType += "text/" + ext;
            }
            ////////   read file content type (text)   ///////////
            fs.readFile(path, 'utf8', (err, data) => {
                if(err){
                    this.statusCode = 500;
                    this.writeHead(500);
                    this.body = "500 Internal Server Error";
                    this.write(this.body);
                    this.end();
                } else {
                    this.headers["Content-Type"] = contentType;
                    this.writeHead(200);
                    this.body = data;
                    this.write(this.body + "");
                    this.end();
                }
            });
        }

        else {
            ////////   in the case of a different file extension   ///////////
            this.headers["Content-Type"] = "text/plain";
            this.writeHead(500);
            this.write("500 Internal Server Error");
        }
    }
}

const server = net.createServer((sock) =>{
    console.log(sock.remoteAddress, sock.remotePort);
    sock.on('data', (binaryData) => {
        let req = new Request(binaryData + '');
        let res = new Response(sock);
        if (req.path === "/"){
            res.setHeader("Content-Type" , "text/html");
            res.send(200, "<link href='/foo.css' rel='stylesheet'>" +
                "<h2>this is a red header!</h2>" +
                "<em>Hello</em><strong>World</strong>");
            res.end();
        }
        else if (req.path === "/foo.css"){
            res.setHeader("Content-Type", "text/css");
            res.send(200, "h2 {color: red;}");
            res.end();
        }
        else if (req.path === "/test"){
            res.sendFile("/html/test.html");
        }
        else if (req.path === "/bmo1.gif"){
            res.sendFile("/img/bmo1.gif");
        }
        else {
            res.setHeader("Content-Type", "text/plain");
            res.send(404, "uh oh... 404 page not found!");
            res.end();
        }
    });
});

server.listen(PORT,HOST);


module.exports = {
    Request: Request,
    Response: Response
}

