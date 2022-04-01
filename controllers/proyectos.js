const express = require("express");
const app = express();

let conn = require("../config/db");
const logger = require('../logs/logger');

// RUTA PARA OBTENER TODOS LOS PROYECTOS QUE NO ESTEN CANCELADOS
app.get("/", async (req, res) => {
  try {
    // SE EJECUTA UNA QUERY PARA OBTENER TODOS LOS PROYECTOS
    conn.query("SELECT PO.IDproyecto, PO.proyectonombre, PO.proyectodescripcion, ES.nombreestatus,CONCAT(US.usuarionombres,' ',US.usuarioapellidoP,' ',US.usuarioapellidoM) AS 'nombre' FROM proyecto PO INNER JOIN estado ES ON ES.ID=PO.IDestado INNER JOIN usuario US ON US.IDusuario=PO.IDusuario WHERE PO.IDestado != 5", (err, rows) => {
      if (err) {
        // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
        return res.status(500).send({
          estatus: "500",
          err: true,
          msg: "Ocurrio un error.",
          err,
        });
      } else if (rows.length > 0) {
        logger.warn(`Se consultaron todos los proyectos vigentes`)
        // SI LOS PROYECTOS SON MAYOR O IGUAL A UNO SE MUESTRAN
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: "PROYECTOS.",
          rows,
        });
      } else {
        // SI NO EXISTEN PROYECTOS SE MUESTRA
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: "SIN PROYECTOS.",
        });
      }
    });
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

// RUTA PARA OBTENER TODOS LOS PROYECTOS DE UN ID EN ESPECIFICO
app.get("/especific", async (req, res) => {
  try {
        // DECLARAMOS EL PARAMETRO ID
    let IDusuario = req.query.IDusuario;
        // SI SE ENVIA UN ID VACIO SE INDICA
    // SE EJECUTA UNA QUERY PARA OBTENER TODOS LOS PROYECTOS
    conn.query(
      "SELECT PO.IDproyecto, PO.proyectonombre, PO.proyectodescripcion, ES.nombreestatus,CONCAT(US.usuarionombres,' ',US.usuarioapellidoP,' ',US.usuarioapellidoM) AS 'nombre' FROM proyecto PO INNER JOIN estado ES ON ES.ID=PO.IDestado INNER JOIN usuario US ON US.IDusuario=PO.IDusuario WHERE PO.IDestado != 5 and US.IDusuario=?",
      [IDusuario],
      (err, rows) => {
      if (err) {
        // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
        return res.status(500).send({
          estatus: "500",
          err: true,
          msg: "Ocurrio un error.",
          err,
        });
      } else if (rows.length > 0) {
        logger.warn(`Se consultaron todos los proyectos personales`)
        // SI LOS PROYECTOS SON MAYOR O IGUAL A UNO SE MUESTRAN
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: "PROYECTOS.",
          rows,
        });
      } else {
        // SI NO EXISTEN PROYECTOS SE MUESTRA
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: "SIN PROYECTOS.",
        });
      }
    });
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

app.get("/proyecto", async (req, res) => {
  try {
    // SE SOLICITA EL ID
    let IDproyecto = req.query.IDproyecto;
    // SE EJECUTA EL QUERY PARA OBTENER A LOS ENCARGADOS DE PROYECTO
    conn.query(
      "SELECT * FROM proyecto WHERE IDproyecto=?",
      [IDproyecto],
      (err, rows) => {
        if (err) {
          // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else if (rows.length > 0) {
          // SI LOS ENCARGADOS DE PROYECTO SON MAYOR O IGUAL A UNO SE MUESTRAN
          return res.status(200).send({
            estatus: "200",
            err: false,
            rows: rows[0],
          });
        } else {
          // SI NO HAY ENCARGADOS DE PROYECTO SE MUESTRA EL MENSAJE
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "Sin usuario.",
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


//obtener los estaods
app.get("/estados", async (req, res) => {
  try {
    // SE EJECUTA UNA QUERY PARA OBTENER TODOS LOS PROYECTOS
    conn.query("SELECT * FROM estado ", (err, rows) => {
      if (err) {
        // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
        return res.status(500).send({
          estatus: "500",
          err: true,
          msg: "Ocurrio un error.",
          err,
        });
      } else if (rows.length > 0) {
        logger.warn(`Se consultaron todos los estados disponibles`)
        // SI LOS PROYECTOS SON MAYOR O IGUAL A UNO SE MUESTRAN
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: "Estados.",
          rows,
        });
      } else {
        // SI NO EXISTEN PROYECTOS SE MUESTRA
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: "Sin Estados.",
        });
      }
    });
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

// RUTA PARA OBTENER TODOS LOS PROYECTOS QUE  ESTEN CANCELADOS
app.get("/cancel", async (req, res) => {
  try {
    // SE EJECUTA UNA QUERY PARA OBTENER TODOS LOS PROYECTOS
    conn.query(
      "SELECT PO.proyectonombre, PO.proyectodescripcion, ES.nombreestatus,CONCAT(US.usuarionombres,' ',US.usuarioapellidoP,' ',US.usuarioapellidoM) AS 'nombre' FROM proyecto PO INNER JOIN estado ES ON ES.IDestado=PO.IDestado INNER JOIN usuario US ON US.IDusuario=PO.IDusuario WHERE PO.IDestado = 5",
      (err, rows) => {
        if (err) {
          // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else if (rows.length > 0) {
          // SI LOS PROYECTOS SON MAYOR O IGUAL A UNO SE MUESTRAN
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "PROYECTOS.",
            rows,
          });
        } else {
          // SI NO EXISTEN PROYECTOS SE MUESTRA
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "SIN PROYECTOS.",
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

// RUTA PARA OBTENER LOS PROYECTOS DEPENDIENDO DEL ESTADO
app.get("/estado", async (req, res) => {
  try {
    let estado = req.query.estado;
    // SE EJECUTA UNA QUERY PARA OBTENER TODOS LOS PROYECTOS
    conn.query(
      "SELECT PO.proyectonombre, PO.proyectodescripcion, ES.nombreestatus,CONCAT(US.usuarionombres,' ',US.usuarioapellidoP,' ',US.usuarioapellidoM) AS 'nombre' FROM proyecto PO INNER JOIN estado ES ON ES.IDestado=PO.IDestado INNER JOIN usuario US ON US.IDusuario=PO.IDusuario WHERE PO.IDestado = ?",
      [estado],
      (err, rows) => {
        if (err) {
          // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else if (rows.length > 0) {
          // SI LOS PROYECTOS SON MAYOR O IGUAL A UNO SE MUESTRAN
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "PROYECTOS.",
            rows,
          });
        } else {
          // SI NO EXISTEN PROYECTOS SE MUESTRA
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "SIN PROYECTOS.",
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

// RUTA PARA OBTENER LOS PROYECTOS DEPENDIENDO DEL ESTADO
app.get("/usuario", async (req, res) => {
  try {
    let IDusuario = req.query.IDusuario;
    // SE EJECUTA UNA QUERY PARA OBTENER TODOS LOS PROYECTOS
    conn.query(
      "SELECT PO.proyectonombre, PO.proyectodescripcion, ES.nombreestatus,CONCAT(US.usuarionombres,' ',US.usuarioapellidoP,' ',US.usuarioapellidoM) AS 'nombre' FROM proyecto PO INNER JOIN estado ES ON ES.IDestado=PO.IDestado INNER JOIN usuario US ON US.IDusuario=PO.IDusuario WHERE PO.IDusuario = ?",
      [IDusuario],
      (err, rows) => {
        if (err) {
          // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else if (rows.length > 0) {
          // SI LOS PROYECTOS SON MAYOR O IGUAL A UNO SE MUESTRAN
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "PROYECTOS.",
            rows,
          });
        } else {
          // SI NO EXISTEN PROYECTOS SE MUESTRA
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "SIN PROYECTOS.",
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

// RUTA PARA REGISTRAR UN PROYECTO
app.post("/", async (req, res) => {
  try {
    let { proyectonombre, proyectodescripcion, IDusuario } = req.body;
    if (proyectonombre == "") {
      // SI EL CAMPO ESTA VACIO SE MUESTRA LA ALERTA
      return res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Se requiere un nombre para el proyecto.",
      });
    } else if (IDusuario == "") {
      // SI EL CAMPO ESTA VACIO SE MUESTRA LA ALERTA
      return res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Se requiere un encargado de proyecto.",
      });
    } else {
      conn.query(
        "SELECT proyectonombre FROM proyecto WHERE proyectonombre=?",
        [proyectonombre],
        (err, row) => {
          if (err) {
            // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
            return res.status(500).send({
              estatus: "500",
              err: true,
              msg: "Ocurrio un error.",
              err,
            });
          } else if (row.length > 0) {
            // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
            return res.status(200).send({
              estatus: "200",
              err: true,
              msg: `El proyecto ${proyectonombre} ya existe.`,
              err,
            });
          } else {
            // SI TODO ESTA CORRECTO SE HACE LA INSERCION
            conn.query(
              "INSERT INTO proyecto( proyectonombre, proyectodescripcion, IDusuario, IDestado) VALUES(?,?,?, 1)",
              [proyectonombre, proyectodescripcion, IDusuario],
              (err) => {
                if (err) {
                  // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
                  return res.status(500).send({
                    estatus: "500",
                    err: true,
                    msg: "Ocurrio un error.",
                    err,
                  });
                } else {
                  logger.info(`Se creo el proyeco con nombre: ${proyectonombre}`)
                  // SI TODO SALIO BIEN SE INDICA
                  return res.status(200).send({
                    estatus: "200",
                    err: false,
                    msg: `Se registro el proyecto ${proyectonombre}.`,
                  });
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
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

//RUTA PARA ACTUALIZAR UN PROYECTO
app.put("/", async (req, res) => {
  try {
    let { 
      proyectonombre, 
      proyectodescripcion, 
      IDestado 
    } = req.body;
    let IDproyecto = req.query.IDproyecto;
    if (proyectonombre == "") {
      // SI EL CAMPO ESTA VACIO SE MUESTRA LA ALERTA
      return res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Se requiere un nombre para el proyecto.",
      });
    } else {
      conn.query(
        "UPDATE proyecto SET  proyectodescripcion=?, IDestado=? WHERE IDproyecto=?",
        [ proyectodescripcion,IDestado, IDproyecto],
        (err) => {
          if (err) {
            // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
            return res.status(500).send({
              estatus: "500",
              err: true,
              msg: "Ocurrio un erro",
              err,
            });
          } else {
            logger.warn(`
            SE ACTUALIZO EL PROYECTO CON EL ID: ${IDproyecto}              
              Datos Nuevos:
                Estado: ${IDestado},
                Descripcion: ${proyectodescripcion}
            `)
            // SI TODO SALIO BIEN SE INDICA
            return res.status(200).send({
              estatus: "200",
              err: false,
              msg: `Se actualizo el proyecto ${IDproyecto}.`,
            });
          }
        }
      );
    }
  } catch (error) {
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

// RUTA PARA PAUSAR UN PROYECTO
app.put("/pause", async (req, res) => {
  try {
    let IDproyecto = req.query.IDproyecto;
    conn.query(
      "UPDATE proyecto SET IDestado=6 WHERE IDproyecto=?",
      [IDproyecto],
      (err) => {
        if (err) {
          // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else {
          logger.warn(`SE PAUSO EL PROYECTO CON EL ID: ${IDproyecto}`)
          // SI TODO SALIO BIEN SE INDICA
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: `Se actualizo el proyecto`,
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

// RUTA PARA ELIMINAR UN PROYECTO
app.delete("/", async (req, res) => {
  try {
    let IDproyecto = req.query.IDproyecto;
    conn.query("DELETE FROM proyecto WHERE IDproyecto=?", [IDproyecto], (err) => {
      if (err) {
        // SI HUBO UN ERROR EN LA CONSULTA SE INDICA
        return res.status(500).send({
          estatus: "500",
          err: true,
          msg: "Ocurrio un error.",
          err,
        });
      } else {
        logger.info(`SE ELIMINO EL PROYECTO CON ID ${IDproyecto}`)
        // SI TODO SALIO BIEN SE INDICA
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: `Se elimino el proyecto`,
        });
      }
    });
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