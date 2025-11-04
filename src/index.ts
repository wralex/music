import express from 'express';
import { engine } from 'express-handlebars';

import path from 'path';

const app = express();
const port: number = 3000;
const hbs = engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
});

app.engine('hbs', hbs);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'views'));

const bsCssPath = path.join(__dirname,'../node_modules/bootstrap/dist/css');
const bsIconsCssPath = path.join(__dirname,'../node_modules/bootstrap-icons/font');
const bsJsPath = path.join(__dirname,'../node_modules/bootstrap/dist/js');
const jqueryPath = path.join(__dirname,'../node_modules/jquery/dist');
const publicPath = path.join(__dirname, '../public');

app.use('/', express.static(publicPath));
app.use('/assets/libs/bootstrap/css', express.static(bsCssPath));
app.use('/assets/libs/bootstrap-icons', express.static(bsIconsCssPath));
app.use('/assets/libs/bootstrap/js', express.static(bsJsPath));
app.use('/assets/libs/jquery', express.static(jqueryPath));

app.get('/', (_, res) => {
  res.render('home');
});
app.get('/ssb', (_, res) => {
  res.render('ssb', { layout: 'music' });
});

app.listen(port, () => {
 console.log(`Server is running at http://localhost:${port}`);
});