import express, { json } from 'express';
import bet from './controllers/bet';
import price from './controllers/price';
import user from './controllers/user';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use((req, __, next) => {
  console.log(
    `Request received || ${req.method} ${req.path} ${req.body || ''}`
  );
  next();
});

app.use('/api/bet', json(), bet());
app.use('/api/price', json(), price());
app.use('/api/user', json(), user());

app.listen(port, () => console.log(`server is listening on ${port}`));
export default app;
