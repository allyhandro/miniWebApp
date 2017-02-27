// fansite.js
// create your own fansite using your miniWeb framework
const App = require('./miniWeb.js').App;
const app = new App();

function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/', (req, res) => {
    res.sendFile("/html/index.html");
});

app.get('/about', function(req, res){
    res.sendFile("/html/about.html");
});

app.get('/css/base.css', function(req, res){
    res.sendFile("/css/base.css");
});

app.get('/css/bootstrap.css', function(req, res){
    res.sendFile("/css/bootstrap.css");
});

app.get('/rando', function(req, res){
    const num = getRandom(1,4);
    if (num < 2){
        res.sendFile("/html/image1.html");
    } else if (num < 3){
        res.sendFile("/html/image2.html");
    } else {
         res.sendFile("/html/image3.html");
    }
});

app.get('/image1.jpg', function(req, res){
    res.sendFile("/img/image1.jpg");
});

app.get('/image2.png', function(req, res){
    res.sendFile("/img/image2.png");
});

app.get('/image3.gif', function(req, res){
    res.sendFile("/img/image3.gif");
});

app.get('/home', function(req, res){
    res.redirect(301, "http://localhost:8080");
});

app.listen(8080, '127.0.0.1');