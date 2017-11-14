import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

const port = process.env.PORT || 8000;
const app = express();
const httpServer = http.createServer(app);

app.use('/', express.static(path.resolve(__dirname, '../..', 'dist-app')));
app.use('/!/public', express.static(path.resolve(__dirname, '../..', 'public')));
app.all('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../..', 'dist-app/index.html'));
});

httpServer.listen(port, () => {
  console.log('HTTP Server is listening on %s', httpServer.address().port);
});
