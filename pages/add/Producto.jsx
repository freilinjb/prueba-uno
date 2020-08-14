import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";
import Navegacion from "../../components/layout/Navegacion";
import FileUploader from "react-firebase-file-uploader";
import useMensajesAlertas from "../../hooks/useMensajesAlertas";

import { FirebaseContext } from "../../firebase";

//Validaciones
import useValidacion from "../../hooks/useValidacion";
import validarCrearProducto from "../../validacion/validarCrearProducto";
//Copia todo del crear-cuenta
import useSector from "../../hooks/useSector";

const STATE_INICIAL = {
  nombre: "",
  proveedor: "",
  precioCompra: "",
  precioVenta: "",
  categoria: "",
  foto: "",
  observacion: "",
};

const Cliente = () => {
  const { sectores } = useSector("creado");
  const { Toast } = useMensajesAlertas();

  //state de las imagenes
  const [nombreimagen, guardarNombre] = useState("");
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgrerso] = useState(0);
  const [urlFoto, guardarUrlImagen] = useState("");

  const [error, setError] = useState("");

  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const {
    nombre,
    proveedor,
    precioCompra,
    precioVenta,
    categoria,
    cantidad,
    foto,
    observacion,
  } = valores;

  //hook de routing para redireccionar
  const router = useRouter();

  //Context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);
  //   console.log(usuario);

  async function crearProducto() {
    //Inicia la carga
    //Si el usuario no esta autenticado llevat al login
    if (!usuario) {
      console.log("no esta loqueado");
      return router.push("/SignIn");
      firebase.cargando = false;
    }

    try {
      //Crear el objeto de nuevo producto

      const producto = {
        nombre,
        proveedor,
        precioCompra,
        precioVenta,
        categoria,
        observacion,
        urlFoto,
        observacion,
        creado: Date.now(),
        estado: "En existencia",
        creador: {
          id: usuario.uid,
          nombre: usuario.displayName,
        },
      };

      //Insertar en la BD
      firebase.cargando = true;

      console.log(producto);
      console.log('producto');

      firebase.db.collection("Productos").add(producto);
      // console.log(cliente);
      // alert.success('Se ha guardo correctamente');
      Toast.fire({
        icon: "success",
        title: "Se ha guardado correctamente!!",
      });
      // console.log(usuario);
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Ha ocurrido un error!!",
      });
    } finally {
      firebase.cargando = false;
    }

    //Despues de registrar un Producto redireccionar al
    return router.push("/Productos");
  }

  const handleUploadStart = () => {
    guardarProgrerso(0);
    guardarSubiendo(true);
  };

  //El progreso se va guardando automaticamente
  const handleProgress = (progreso) => guardarProgrerso({ progreso });

  //Cuando haya un error
  const handleUploadError = (error) => {
    guardarSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = (nombre) => {
    guardarSubiendo(100);
    guardarSubiendo(false);
    guardarNombre(nombre);
    firebase.storage
      .ref("Clientes")
      .child(nombre)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        guardarUrlImagen(url);
      }); //Dice en que parte esta la imagen
  };

  return (
    <Layout>
      <Navegacion titulo={"Registro"}>
        <div className="row justify-content-center">
          {/* <!-- ============================================================== --> */}
          {/* <!-- validation form --> */}
          {/* <!-- ============================================================== --> */}
          <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12">
            <div className="card">
              <h5 className="card-header">
                Registro de Producto <span className="fas fa-user-plus"></span>
              </h5>
              <div className="card-body">
                <form
                  className="needs-validation"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <fieldset>
                    <legend>Datos Personales</legend>
                    <div className="form-row">
                      <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <label htmlFor="nombre">Nombre del producto</label>
                        <input
                          type="text"
                          className={`form-control ${
                            nombre.length >= 5 ? "is-valid" : "is-invalid"
                          }`}
                          id="nombre"
                          name="nombre"
                          value={nombre}
                          placeholder="Ingrese el nombre"
                          onChange={handleChange}
                          autoComplete="off"
                          required
                        />
                        {errores.nombre && (
                          <p className="alert alert-danger">{errores.nombre}</p>
                        )}
                      </div>
                      <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <label htmlFor="sexo">Proveedor</label>
                        <input
                          type="text"
                          className="form-control"
                          id="proveedor"
                          name="proveedor"
                          value={proveedor}
                          onChange={handleChange}
                          placeholder="Ingrese el nombre del proveedor"
                          autoComplete="off"
                        />
                        {errores.proveedor && (
                          <p className="alert alert-danger">{errores.proveedor}</p>
                        )}
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <label htmlFor="cedula">Precio de venta</label>
                        <input
                          type="number"
                          className="form-control"
                          id="precioVenta"
                          name="precioVenta"
                          value={precioVenta}
                          onChange={handleChange}
                          placeholder="Ingrese el precio de Venta"
                          autoComplete="off"
                        />
                      </div>

                      <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <label htmlFor="cedula">Precio de compra</label>
                        <input
                          type="number"
                          className="form-control"
                          id="precioCompra"
                          name="precioCompra"
                          value={precioCompra}
                          onChange={handleChange}
                          placeholder="Ingrese el precio de la compra"
                          autoComplete="off"
                        />
                        {errores.precioCompra && (
                          <p className="alert alert-danger">{errores.precioCompra}</p>
                        )}
                      </div>

                      <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <label htmlFor="cedula">Stock</label>
                        <input
                          type="number"
                          className="form-control"
                          id="cantidad"
                          name="cantidad"
                          value={cantidad}
                          onChange={handleChange}
                          placeholder="Ingrese la cantidad existente"
                          autoComplete="off"
                        />
                        {errores.cantidad && (
                          <p className="alert alert-danger">{errores.cantidad}</p>
                        )}
                      </div>
                      <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <label htmlFor="Categoria">Categoria</label>
                        <select
                          className="form-control"
                          name="categoria"
                          value={categoria}
                          id="categoria"
                          onChange={handleChange}
                        >
                          <option selected value="Hombre">
                            Hombre
                          </option>
                          <option value="mujer">Mujer</option>
                          <option value="mo definido">No definido</option>
                        </select>
                        </div>
                      <div className="col-12 mb-3">
                        <label htmlFor="foto">Foto del producto</label>

                        <div className="input-group">
                          <div className="custom-file">
                            <FileUploader
                              className="custom-file-input"
                              accept="image/*"
                              name="foto"
                              id="foto"
                              randomizeFilename
                              storageRef={firebase.storage.ref("Productos")}
                              onUploadStart={handleUploadStart}
                              onUploadError={handleUploadError}
                              onUploadSuccess={handleUploadSuccess}
                              onProgress={handleProgress}
                            />
                            <label className="custom-file-label" htmlFor="foto">
                              Elegir archivo
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 mb-3">
                              <textarea
                                className="form-control"
                                placeholder="Observaciones a tomar en cuanta"
                                name="observacion"
                                value={observacion}
                                id="observacion"
                                onChange={handleChange}
                                autoComplete="off"
                                rows="2"
                              ></textarea>
                            </div>
                    </div>

                    <div className="row">
                    <div className="col-sm-6">
                        <button
                          type="submit"
                          className="btn btn-space btn-primary"
                          disabled={firebase.cargando}
                          type="submit"
                        >
                          {firebase.cargando ? (
                            <>
                              <span
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Cargando...
                            </>
                          ) : (
                            <>Guardar</>
                          )}
                        </button>
                        <button className="btn btn-space btn-secondary">
                          Cancel
                        </button>
                    </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- ============================================================== --> */}
          {/* <!-- end validation form --> */}
          {/* <!-- ============================================================== --> */}
        </div>
      </Navegacion>
    </Layout>
  );
};

export default Cliente;
