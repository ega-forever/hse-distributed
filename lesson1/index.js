const express = require('express'),
  app = express();


app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/info', (req, res) => {
  res.send({status: 1});
});

app.get('/template', (req, res) => {
  res.render('index', {title: 'Hey', message: 'Hello there!'})
});

app.listen(8080, () => {
  console.log('server started!');
});