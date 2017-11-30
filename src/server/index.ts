import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socketIO from 'socket.io';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';

import { KUser } from '../common/k-user';

import { Database } from './database';


const port = process.env.PORT || 8000;
const app = express();
const httpServer = http.createServer(app);
const sockerServer = socketIO(httpServer);
const database = new Database('../../json/db.json');

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'kmedia-session-key',
  resave: false,
  saveUninitialized: false
}));

app.use('/', express.static(path.resolve(__dirname, '../..', 'dist-app')));
app.use('/!/public', express.static(path.resolve(__dirname, '../..', 'public')));

app.get('/!/initialize', async (request, response) => {
  if (request.session.userID && request.session.userID === request.cookies.id) {
    response.cookie('id', request.cookies.id, {
      maxAge: 86400000,
      path: '/'
    });
    response.cookie('email', request.cookies.email, {
      maxAge: 86400000,
      path: '/'
    });
    response.cookie('nickname', request.cookies.nickname, {
      maxAge: 86400000,
      path: '/'
    });
  } else {
    response.cookie('id', '', {
      maxAge: -1,
      path: '/'
    });
    response.cookie('email', '', {
      maxAge: -1,
      path: '/'
    });
    response.cookie('nickname', '', {
      maxAge: -1,
      path: '/'
    });
  }
  response.send({ result: true });
});

app.get('/!/textfile/:target', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../..', 'public/' + request.params.target));
});

app.get('/!/check-email/:target', async (request, response) => {
  try {
    await database.connect();
    database.count('users', { 'account.email': request.params.target }).then((result) => {
      response.send({ result: result > 0 });
    }).catch((error) => {
      response.send({ result: false, message: 'database' });
    });
  } catch (error) {
    response.send({ result: false, message: error });
  }
});

app.get('/!/check-nickname/:target', async (request, response) => {
  try {
    await database.connect();
    database.count('users', { 'account.nickname': request.params.target }).then((result) => {
      response.send({ result: result > 0 });
    }).catch((error) => {
      response.send({ result: false, message: 'database' });
    });
  } catch (error) {
    response.send({ result: false, message: error });
  }
});

app.post('/!/sign-up', async (request, response) => {
  if (!request.session.userID) {
    try {
      await database.connect();
      let agreement = request.body.fields.agreement;
      if (!agreement || !agreement.termsOfService || !agreement.privacyPolicy) {
        throw 'agreement';
      }
      if (request.body['personal.birth']) {
        request.body.personal.birth = new Date(request.body.personal.birth);
      }
      let user: KUser = new KUser(request.body);
      user.setField({ activated: false });
      database.count('users', {
        $or: [
          { 'account.email': user.account.email },
          { 'account.nickname': user.account.password }
        ]
      }).then((result) => {
        if (result === 0) {
          database.insert('users', user.toJSON()).then((result) => {
            if (result.insertedCount > 0) {
              response.send({ result: true });
            } else {
              throw 'insert';
            }
          }).catch((error) => {
            response.send({ result: false, message: 'insert' });
          });
        } else {
          response.send({ result: false, message: 'already' });
        }
      }).catch((error) => {
        response.send({ result: false, message: 'database' });
      });
    } catch (error) {
      response.send({ result: false, message: error });
    }
  } else {
    response.send({ result: false, message: 'signed' });
  }
});

app.post('/!/sign-in', async (request, response) => {
  if (!request.session.userID) {
    try {
      await database.connect();
      let cursor = database.find('users', {
        'account.email': request.body.email,
        'account.password': request.body.password
      });
      cursor.count().then(async (result) => {
        if (result === 1) {
          while (await cursor.hasNext()) {
            let value = await cursor.next();
            if (value) {
              request.session.userID = value._id.toString();
              response.cookie('id', value._id.toString(), {
                maxAge: 86400000,
                path: '/'
              });
              response.cookie('email', value.account.email, {
                maxAge: 86400000,
                path: '/'
              });
              response.cookie('nickname', value.account.nickname, {
                maxAge: 86400000,
                path: '/'
              });
              response.send({ result: true });
            } else {
              response.send({ result: false, message: 'unknown' });
            }
          }
        } else {
          response.send({ result: false, message: 'failed' });
        }
      }).catch((error) => {
        response.send({ result: false, message: error });
      });
    } catch (error) {
      response.send({ result: false, message: error });
    }
  } else {
    response.send({ result: false, message: 'signed' });
  }
});

app.post('/!/sign-out', async (request, response) => {
  if (request.session.userID) {
    request.session.destroy((error) => {
      if (error) {
        response.send({ result: false, message: error });
      } else {
        response.cookie('id', '', {
          maxAge: -1,
          path: '/'
        });
        response.cookie('email', '', {
          maxAge: -1,
          path: '/'
        });
        response.cookie('nickname', '', {
          maxAge: -1,
          path: '/'
        });
        response.send({ result: true });
      }
    });
  } else {
    response.send({ result: false, message: 'unsigned' });
  }
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
