import app from './app';

const port = process.env.PORT || 5005;
app.listen(port, () => {
  console.log(`App listening at http://127.0.0.1:${port}`);
});
