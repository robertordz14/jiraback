const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const logger = require('../logs/logger');

let conn = require("../config/db");

app.post("/", async (req, res) => {
  try {
    let { usuarioemail, usuariocontrasenya } = req.body;
    if (usuarioemail == "" || usuariocontrasenya=="") {
      res.status(200).send({
        estatus: "500",
        err: true,
        msg: "Se requieren las credenciales de acceso.",
      });
    } else {
      conn.query(
        "SELECT * FROM usuario WHERE usuarioemail=?",
        [usuarioemail],
        (err, rows) => {
          if (err) {
            res.status(200).send({
              estatus: "500",
              err: true,
              msg: "Ocurrio un error.",
              err
            });
          } else if (rows.length > 0) {
            let coincide = bcrypt.compareSync(
              usuariocontrasenya,
              rows[0].usuariocontrasenya
            );
            if (coincide == true) {
              logger.warn(`Inició sesión el usuario: ${rows[0].usuarionombres} con el correo ${rows[0].usuarioemail}`)
              res.status(200).send({
                estatus: "500",
                err: false,
                msg: `Bienvenido ${rows[0].usuarionombres} ${rows[0].usuarioapellidoP} ${rows[0].usuarioapellidoM}`,
                Info: rows[0],
              });
            } else {
              res.status(200).send({
                estatus: "500",
                err: true,
                msg: "Contraseña incorrecta.",
              });
            }
          } else {
            res.status(200).send({
              estatus: "500",
              err: true,
              msg: "Correo incorrecto.",
            });
          }
        }
      );
    }
  } catch (error) {
    res.status(500).send({
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
