const express = require("express");
const app = express();

app.use('/login',require('./login'));
app.use('/usuario',require('./usuario'));
app.use('/cargos',require('./cargos'));
app.use('/role',require('./roles'));
app.use('/proyectos',require('./proyectos'))
app.use('/tareas',require('./tareas'))


module.exports = app;