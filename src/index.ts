import App from './app';
import BakerRoute from './routes/baker.route';
import MemberRoute from './routes/member.route';

const app = new App([new BakerRoute(), new MemberRoute()]);

app.listen();
