console.log('Hola');

var express = require('express');
var app = express();
var PUERTO = 3777;

app.listen(PUERTO, function(){
	console.log('API corriendo en el puerto: ' + PUERTO);
});

app.get('/', function(req, res) {
	res.sendFile('/export/estudiantes/juan.martinez23/api_saldos/index.html');	
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.post('/postPrueba', function(req, res) {
	console.log(req.body);
});

var pg = require('pg');
var URL = 'postgres://dvutcvug:NV59n6ZeDGJoVO2-x6hbIumzx4eUGibD@pellefant.db.elephantsql.com:5432/dvutcvug';

var client = new pg.Client(URL);
client.connect(function(err){
	if (err) {
		return console.log('Error en la conexión a la db');
	}
	console.log('Conexión realizada');
	client.end();
});

app.post('/api/insertar', function(req, res){
	var cedula = req.body.cedula;
	var propietario = req.body.propietario;
	var dinero = req.body.dinero;
	
	var queryInsertar = 'INSERT INTO saldo VALUES('
				+ cedula + ', '
				+ '\'' + propietario + '\', '
				+ dinero + ');'
	console.log(queryInsertar);
	
	pg.connect(URL, function(err, client, done){
		if (err){
			res.send('Error :(');
			return console.log('Error de conexión');
		}
		client.query(queryInsertar, function(err, result){
			if(err){
				res.send('Error :(');
				client.end();
				return console.log('Error en el query');
			}
			console.log('Se insertó');
			res.send('OK c:');
			client.end();
		});
	});
});

app.get('/api/obtener',  function(req, res) {
        var cedula = req.query.cedula;
        var queryObtener = 'SELECT * FROM SALDO WHERE cedula = ' 
				+ cedula + ';';
        console.log(queryObtener);

        pg.connect(URL, function(err, client, done) {
                if(err) {
                        res.send('Error :(')
                        return console.log('Error de conexión');
                }
                 var query = client.query(queryObtener, function(err, result) {
                        if(err) {
                                res.send('Error :(')
				client.end();
                                return console.log('Error en el query');
                                }
                        console.log('Se hizo la consulta!');
                        client.end();
                        });
                query.on('row', function(row){
				return res.json(row);
			});
		});
});
