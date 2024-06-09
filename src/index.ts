import { app, initApp } from './app';

const port = process.env.PORT || 3000;

initApp().catch((error)=>{
  console.log(error);
});

app.listen(port, async () => {
  console.log(`Running on port ${port}`);
});
