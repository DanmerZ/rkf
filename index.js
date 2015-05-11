var express = require('express');
var app = express();
var hbs = require('hbs');
var bodyParser = require('body-parser');
var jf = require('jsonfile');

app.use('/static',express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine','html');
app.engine('html',hbs.__express);

hbs.registerPartials(__dirname + '/views/partials');

app.get('/',function(req,res){
    res.render('index');
});
app.get('/about',function(req,res){
    res.render('about');
});
app.get('/products',function(req,res){
    res.render('products');
});
app.get('/prices',function(req,res){
    res.render('prices');
});
app.get('/articles',function(req,res){
    res.render('articles');
});
app.get('/links',function(req,res){
    res.render('links');
});
app.get('/contacts',function(req,res){
    res.render('contacts');
});
app.get('/info',function(req,res){
    res.render('info');
});
app.get('/order',function(req,res){
    res.render('order');
});
app.get('/thanks',function(req,res){
    res.render('thanks');
});


app.post('/processOrder',function(req,res){   
    
    var ord = jf.readFileSync('orders/order.json');
    var currentOrder = req.body;
    currentOrder.date = (new Date()).toJSON();
    ord.orders.push(currentOrder);
    
    jf.writeFile('orders/order.json',ord,function(err){
        if(err) console.error(err);
    });    
    
    res.redirect(303,'/thanks');
});

app.route('/admin')
    .get(function(req,res){
        res.render('admin',{logged: false});
    })
    .post(function(req,res){          
        if(req.body.pass === 'hello') {
            var ord = jf.readFileSync('orders/order.json');
            for (var i = 0; i < ord.orders.length; i++) {
                ord.orders[i].date = (new Date(ord.orders[i].date)).toLocaleDateString();                
            }            
            res.render('admin',{logged: true, orders: ord['orders']});
        }
        else {
            res.render('admin',{logged: false, wrongPass: true});
        }
    }
);

app.use(function(req,res){
    res.render('404');
});

app.use(function(err,req,res){
    res.render('500');
});

app.listen(process.env.PORT || 3000);