



const express = require('express');
const nunjucks = require('nunjucks');
const cors = require('cors');


const app = express();
nunjucks.configure('views',{
	autoescape: true,
	express: app
});
app.set('view engine','njk');
app.use(express.json());
app.use('/static/',express.static('client/'));
app.use(cors());


app.get('/',(request,response) => {
	response.render('index');
})

app.listen(3000);
