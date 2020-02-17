const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send({status: 1});
});

app.listen(8080, () => {
  console.log('started at 8080');
});