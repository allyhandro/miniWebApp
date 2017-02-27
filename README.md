Homework #03 - Home Made Mini Web Server Fansite
=====
#### author: Ally Han (awh264)

![We are the Crystal Gems!](https://secure.static.tumblr.com/7e486ccbef8c1adedc7bb6910f04d367/mlw98x4/xZ1o1axku/tumblr_static_8r6geohbazggko0g8s0k8os8s_640_v2.png)
######Steven and the Crystal Gems

This repository contains a module implementing a few exercises to get used to HTTP requests and response syntax and usage as well as a file `fansite.js` which utilizes classes defined in miniWeb.js to simulate a web server on the local port.

Also in the repository are all of the html and image files used in the mini web app. Bootstrap was used to style some of the basic css elements, with an additional `base.css` file added for customization.

## Usage
This program can be run through the command line.

### Command Line
In order to start the server, compile the `fansite.js` file in the command line.
```sh
$ node src\fansite.js
```
The terminal window should show an empty curser. Leave the program running in this terminal window. Next, in either another command line window or from the web browser, send the now open server a request.

#####From the Browser
In any browser of your choice, enter `http://localhost:8080` to see the homepage of the fansite. You can then follow the intuitive interaction of the website to view other files. In the original window you used to compile the `fansite.js` file, you will notice the request method and path, followed by the response code and description being printed each time you interact with the website.

#####From the Command Line
To send one request at a time, in a separate command line window, use the `curl` command to interact with the server. For example:

```sh
curl -i localhost:8080/about
```

Using curl will output the response header and body to the command line window. You'll notice in the window running the server, the same request method and path - response code pair will still be printed.


The program can be exited by typing Crl + C in your Command Line window.

# selfTaught
