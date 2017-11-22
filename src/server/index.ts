import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socketIO from 'socket.io';
import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';

const port = process.env.PORT || 8000;
const app = express();
const httpServer = http.createServer(app);
const sockerServer = socketIO(httpServer);

app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(path.resolve(__dirname, '../..', 'dist-app')));

app.get('/!/textfile/:target', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../..', 'public/' + request.params.target));
});

app.get('/!/check-email/:target', (request, response) => {
  let result = false;
  const SAMPLE = [
    'test1@email.test',
    'krad@email.test'
  ];
  if (SAMPLE.findIndex((element) => { return element === request.params.target }) !== -1) {
    result = true;
  }
  response.send({ result: result });
});

app.get('/!/check-nickname/:target', (request, response) => {
  let result = false;
  const SAMPLE = [
    'krad',
    'yoozeh'
  ];
  if (SAMPLE.findIndex((element) => { return element === request.params.target }) !== -1) {
    result = true;
  }
  response.send({ result: result });
});

app.post('/!/sign-up', (request, response) => {
  console.log(request.body);
  response.send({ result: 'done' });
});

app.all('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../..', 'dist-app/index.html'));
});

httpServer.listen(port, () => {
  console.log('HTTP Server is listening on %s', httpServer.address().port);
});

const clients = new Map<string, any>();
sockerServer.on('connection', (socket) => {
  console.log('Client [' + socket.client.id + '] connected');
  clients.set(socket.client.id, clients);
  socket.on('disconnect', () => {
    console.log('Client [' + socket.client.id + '] disconnected');
    clients.delete(socket.client.id);
  });
  socket.on('k-message', (message) => {
    console.log('Client [' + socket.client.id + '] received message: ' + message);
    socket.send(message);
    socket.disconnect(true);
  });
});
