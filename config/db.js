var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "jira",
  port: 3306,
});

connection.connect((err)=>{
    if(err){
        console.log("[SERVER]".red, `Conexion fallida: ${err}`);
        return;
    }else{
        console.log("[SERVER]".green, `Base de datos en linea`);
    }
 });

module.exports = connection;