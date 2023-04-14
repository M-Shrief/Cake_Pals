import App from './app';
import BakerRoute from './routes/baker.route';
import MemberRoute from './routes/member.route';
import OrderRoute from './routes/order.route';

const app = new App([new BakerRoute(), new MemberRoute(), new OrderRoute()]);

app.listen();
