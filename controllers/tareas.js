const express = require("express");
const app = express();

let conn = require("../config/db");
const logger = require("../logs/logger");

// RUTA PARA OBTENER TODAS LAS TAREAS QUE NO ESTEN CANCELADAS
app.get("/", async (req, res) => {
  try {
    conn.query(
      "SELECT TA.IDtareas,PO.proyectonombre,CONCAT(US.usuarionombres,' ',US.usuarioapellidoP,' ',US.usuarioapellidoM) AS 'usuario',TA.tareanombre,TA.tareadescripcion, ES.nombreestatus FROM tareas TA INNER JOIN proyecto PO ON PO.IDproyecto=TA.IDproyecto INNER JOIN usuario US ON US.IDusuario = TA.IDusuario INNER JOIN estado ES ON ES.ID=TA.IDestado WHERE TA.IDestado!=5 ORDER BY TA.IDestado,TA.IDtareas",
      (err, rows) => {
        if (err) { 
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else {
          return res.status(200).send({ 
            estatus: "200",
            err: false,
            msg: "Tareas obtenidas con exito.",
            rows,
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

//RUTA PARA TRAER UNA TAREA SEGUN EL USUARIO
app.get("/especific", async (req, res) => {
  try {
        // DECLARAMOS EL PARAMETRO ID
    let IDusuario = req.query.IDusuario;
        // SI SE ENVIA UN ID VACIO SE INDICA
    // SE EJECUTA UNA QUERY PARA OBTENER TODOS LOS PROYECTOS
    conn.query(
      "SELECT TA.IDtareas,PO.proyectonombre,CONCAT(US.usuarionombres,' ',US.usuarioapellidoP,' ',US.usuarioapellidoM) AS 'usuario',TA.tareanombre,TA.tareadescripcion, ES.nombreestatus FROM tareas TA INNER JOIN proyecto PO ON PO.IDproyecto=TA.IDproyecto INNER JOIN usuario US ON US.IDusuario = TA.IDusuario INNER JOIN estado ES ON ES.ID=TA.IDestado WHERE TA.IDestado!=5 && US.IDusuario = ?  ORDER BY TA.IDestado,TA.IDtareas",
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
        logger.warn(`Se consultaron todas las tareas personales`)
        // SI LOS PROYECTOS SON MAYOR O IGUAL A UNO SE MUESTRAN
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: "Tareas.",
          rows,
        });
      } else {
        // SI NO EXISTEN PROYECTOS SE MUESTRA
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: "SIN TAREAS.",
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

// RUTA PARA OBTENER UNA TAREA EN ESPECIFICO
app.get("/tarea", async (req, res) => {
  try {
    let IDtareas = req.query.IDtareas;
    conn.query(
      "SELECT * FROM tareas where IDtareas=?",
      [IDtareas],
      (err, rows) => {
        if (err) {
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else if (rows.length > 0) {
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "Tareas obtenidas con exito.",
            rows:  rows[0],
          });
        }else {
          // SI NO HAY ENCARGADOS DE PROYECTO SE MUESTRA EL MENSAJE
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "Sin tareas.",
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
   

// RUTA PARA OBTENER TODAS LAS TAREAS QUE ESTEN CANCELADAS
app.get("/cancel", async (req, res) => {
  try {
    conn.query(
      "SELECT TA.IDtareas,PO.proyectonombre,CONCAT(US.usuarionombres,'',US.usuarioapellidoP,'',US.usuarioapellidoM) AS 'usuario',TA.tareanombre,TA.tareadescripcion, ES.nombreestatus FROM tareas TA INNER JOIN proyecto PO ON PO.IDproyecto=TA.IDproyecto INNER JOIN usuario US ON US.IDusuario = TA.IDusuario INNER JOIN estado ES ON ES.IDestado=TA.IDestado WHERE TA.IDestado=5",
      (err, rows) => {
        if (err) {
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else {
          if (rows.length > 0) {
            msg = "Tareas obtenidas con exito";
          } else {
            msg = "Sin tareas encontradas";
          }
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: msg,
            rows,
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

// RUTA PARA OBTENER TODAS LAS TAREAS POR EL ESTADO
app.get("/estado", async (req, res) => {
  try {
    let estado = req.query.estado;
    conn.query(
      "SELECT TA.IDtareas,PO.proyectonombre,CONCAT(US.usuarionombres,'',US.usuarioapellidoP,'',US.usuarioapellidoM) AS 'usuario',TA.tareanombre,TA.tareadescripcion, ES.nombreestatus FROM tareas TA INNER JOIN proyecto PO ON PO.IDproyecto=TA.IDproyecto INNER JOIN usuario US ON US.IDusuario = TA.IDusuario INNER JOIN estado ES ON ES.IDestado=TA.IDestado WHERE TA.IDestado=?",
      [estado],
      (err, rows) => {
        if (err) {
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else {
          if (rows.length > 0) {
            msg = "Tareas obtenidas con exito";
          } else {
            msg = "Sin tareas encontradas";
          }
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: msg,
            rows,
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

// RUTA PARA OBTENER TODAS LAS TAREAS POR EL USUARIO
app.get("/usuario", async (req, res) => {
  try {
    let IDusuario = req.query.IDusuario;
    conn.query(
      "SELECT TA.IDtareas,PO.proyectonombre,CONCAT(US.usuarionombres,'',US.usuarioapellidoP,'',US.usuarioapellidoM) AS 'usuario',TA.tareanombre,TA.tareadescripcion, ES.nombreestatus FROM tareas TA INNER JOIN proyecto PO ON PO.IDproyecto=TA.IDproyecto INNER JOIN usuario US ON US.IDusuario = TA.IDusuario INNER JOIN estado ES ON ES.IDestado=TA.IDestado WHERE TA.IDusuario=?",
      [IDusuario],
      (err, rows) => {
        if (err) {
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else {
          if (rows.length > 0) {
            msg = "Tareas obtenidas con exito";
          } else {
            msg = "Sin tareas encontradas";
          }
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: msg,
            rows,
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

// RUTA PARA REGISTRAR UNA TAREA
app.post("/", async (req, res) => {
  try {
    let { IDproyecto, IDusuario, tareanombre, tareadescripcion } =
      req.body;
    if (IDproyecto == "") {
      return res.status(500).send({
        estatus: "500",
        err: true,
        msg: "Se requiere un proyecto.",
        err,
      });
    }
    if (IDusuario == "") {
      return res.status(500).send({
        estatus: "500",
        err: true,
        msg: "Se requiere un usuario.",
        err,
      });
    }
    if (tareanombre == "") {
      return res.status(500).send({
        estatus: "500",
        err: true,
        msg: "Se requiere el nombre de la tarea.",
        err,
      });
    }
    if (tareadescripcion == "") {
      return res.status(500).send({
        estatus: "500",
        err: true,
        msg: "Se requiere la descripción de la tarea.",
        err,
      });
    } else {
      conn.query(
        "INSERT INTO tareas(IDproyecto, IDusuario, tareanombre, tareadescripcion, IDestado) VALUES(?,?,?,?, 1)",
        [
          IDproyecto,
          IDusuario,
          tareanombre,
          tareadescripcion,
        ],
        (err) => {
          if (err) {
            return res.status(500).send({
              estatus: "500",
              err: true,
              msg: "Ocurrio un error.",
              err,
            });
          } else {
            logger.info(`SE REGISTRO LA TAREA: ${tareanombre}`);
            conn.query(
              "UPDATE proyecto SET IDestado=2 WHERE IDproyecto=?",
              [IDproyecto],
              (err) => {
                if (err) {
                  return res.status(500).send({
                    estatus: "500",
                    err: true,
                    msg: "Ocurrio un error.",
                    err,
                  });
                } else {
                  logger.info(
                    `EL PROYECTO CON ID: ${IDproyecto} COMENZO SU DESARROLLO`
                  );
                  return res.status(200).send({
                    estatus: "200",
                    err: false,
                    msg: `Se registro la tarea: ${tareanombre}`,
                  });
                }
              }
            );
          }
        }
      );
    }
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

// RUTA PARA ACTUALIZAR UNA TAREA
app.put("/", async (req, res) => {
  try {
    let { IDusuario, tareanombre, tareadescripcion, IDestado} = req.body;
    let IDtareas = req.query.IDtareas;
    conn.query(
      "SELECT * FROM tareas WHERE IDtareas=?",
      [IDtareas],
      (err, row) => {
        if (err) {
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else if (row.length > 0) {
          if (IDusuario == "") {
            IDusuario = row[0].IDusuario;
          }
          if (tareanombre == "") {
            tareanombre = row[0].tareanombre;
          }
          if (tareadescripcion == "") {
            tareadescripcion = row[0].tareadescripcion;
          }
          if (IDestado == "") {
            IDestado = row[0].IDestado;
          }
          conn.query(
            "UPDATE tareas SET  tareadescripcion=?, IDestado=? WHERE IDtareas=?",
            [tareadescripcion, IDestado, IDtareas],
            (err) => {
              if (err) {
                return res.status(500).send({
                  estatus: "500",
                  err: true,
                  msg: "Ocurrio un error.",
                  err,
                });
              } else {
                logger.warn(` SE ACTUALIZO EL PROYECTO CON ID: ${IDtareas}
                Datos Antiguos:
                    Descripcion: ${row[0].tareadescripcion}, 
                    Estado: ${row[0].IDestado}                
                Datos Nuevos:
                    Descripcion: ${tareadescripcion},      
                    Estado: ${IDestado},  
                `);
                return res.status(200).send({
                  estatus: "200",
                  err: false,
                  msg: "Se actualizo la tarea.",
                });
              }
            }
          );
        } else {
          return res.status(200).send({
            estatus: "200",
            err: true,
            msg: "Sin tareas.",
            err,
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

// RUTA PARA PAUSAR UNA TAREA
app.put("/estado", async (req, res) => {
  try {
    let estado = req.body.estado;
    let IDtareas = req.query.IDtareas;
    conn.query(
      "SELECT * FROM tareas WHERE IDtareas=?",
      [IDtareas],
      (err, row) => {
        if (err) {
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            err,
          });
        } else {
          conn.query(
            "UPDATE tareas SET IDestado=? WHERE IDtareas=?",
            [estado, IDtareas],
            (err) => {
              if (err) {
                return res.status(500).send({
                  estatus: "500",
                  err: true,
                  msg: "Ocurrio un error.",
                  err,
                });
              } else {
                logger.warn(`LA TAREA ${row[0].tareanombre} CAMBIO DE ESTADO`);
                return res.status(200).send({
                  estatus: "200",
                  err: false,
                  msg: "Tarea modificada",
                });
              }
            }
          );
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

// RUTA PARA ELIMINAR UNA TAREA
app.delete("/", async (req, res) => {
  try {
    let IDtareas = req.query.IDtareas;
    conn.query("DELETE FROM tareas WHERE IDtareas=?", [IDtareas], (err) => {
      if (err) {
        return res.status(500).send({
          estatus: "500",
          err: true,
          msg: "Ocurrio un error.",
          err,
        });
      } else {
        logger.warn(`LA TAREA CON ID ${IDtareas} FUE ELIMINADA`);
        return res.status(200).send({
          estatus: "200",
          err: false,
          msg: "Tarea eliminada.",
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

app.delete("/react", async (req, res) => {
  try {
    let IDtareas = req.query.IDtareas;
    conn.query(
      "UPDATE tareas SET IDestado=2 WHERE IDtareas=?",
      [IDtareas],
      (err) => {
        if (err) {
          return res.status(500).send({
            estatus: "500",
            err: true,
            msg: "Ocurrio un error.",
            cont: {
              err: Object.keys(err).length === 0 ? err.message : err,
            },
          });
        } else {
          logger.warn(`LA TAREA CON ID ${IDtareas} FUE REACTIVADA`);
          return res.status(200).send({
            estatus: "200",
            err: false,
            msg: "Tarea reactivada.",
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