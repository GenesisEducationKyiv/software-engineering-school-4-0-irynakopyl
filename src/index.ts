import { app, initApp } from './app';

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await initApp();
  console.log(`Running on port ${port}`);
});
