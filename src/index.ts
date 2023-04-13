import App from './app';
import BakerRoute from './routes/baker.route';

const app = new App([new BakerRoute()]);

app.listen();
