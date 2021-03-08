
import app from './app'
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
// let server = app;
// module.exports = server;