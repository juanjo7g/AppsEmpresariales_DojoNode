console.log('API empieza a correr')

var express = require('express');
var app = express();

app.listen(3777, function() {
	console.log('Puerto 3777 escuchando')
})

app.get('/index', (req, res) => {
	res.sendFile('/home/juan/saldosManagerApi/index.html')
})

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))

app.post('/postPrueba', (req, res) => {
	console.log(req.body.hola)
})

var pg = require('pg');
var url = "postgres://dvutcvug:NV59n6ZeDGJoVO2-x6hbIumzx4eUGibD@pellefant.db.elephantsql.com:5432/dvutcvug";

var client = new pg.Client(url);

client.connect((err) => {
	if(err){
		return console.log("Error conectado a la base de datos")
	}
	console.log("Conexión hecha!")
})

app.post('/api/insertar', (req, res) => {
	var cedula = req.body.cedula;
	var propietario = req.body.propietario;
	var dinero = req.body.dinero;

	var queryInsertar = 'insert into saldo values (' + cedula + ', \'' + propietario + '\', ' + dinero + ');'

	console.log(queryInsertar)

	pg.connect(url, function(err, client, done) {
  		if(err) {
    			return console.error('Error de conexión con la bd', err);
  		}
  		client.query(queryInsertar, function(err, result) {
	    		if(err) {
      				return console.error('Error en el query', err);
    				}
  			console.log('Se inserto!')
			})
		})

})
