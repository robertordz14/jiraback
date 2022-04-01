const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

let conn = require("../config/db");

// RUTA PARA OBTENER LOS CARGOS ACTIVOS
app.get("", async (req, res) => {
  try {
    // SE EJECUTA UNA QUERY PARA OBTENER LOS CARGOS QUE SE ENUENTREN ACTIVOS
    conn.query(
      "SELECT * FROM cargo WHERE cargoestado=1 ORDER BY cargonombre ASC",
      (err, rows) => {
        if (err) {
          // SI HUBO UN ERROR EN LA QUERY SE INDICA
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
          });
        } else {
          // SE MUESTRA EL MENSAJE DE EXITO
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "Cargos activos.",
            rows
          });
        }
      }
    );
  } catch (err) {
    return res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Ocurrio un error.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
