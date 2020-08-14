import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../components/layout/Layout";
import Navegacion from "../components/layout/Navegacion";
import ListaProductos from "../components/ui/ListaProductos";
import useMensajesAlertas from "../hooks/useMensajesAlertas";

import { FirebaseContext } from "../firebase";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearCliente from "../validacion/validarCrearCliente";
//Copia todo del crear-cuenta
import useCliente from "../hooks/useCliente";
import useProducto from "../hooks/useProducto";
import Checkbox from "../components/ui/Checkbox";

const Facturacion = () => {
  const { Toast } = useMensajesAlertas();
  const { clientes } = useCliente("desc");
  const { productos } = useProducto("desc");

  //state
  const [productoTemp, setProductoTemp] = useState([]);
  const [sumatoria, setSumatoria] = useState(0);

  const [idProducto, setIdProducto] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [cantidadProducto, setCantidadProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState("");
  const [cliente, setCliente] = useState("");

  const clienteChange = (e) => {
    setCliente(e.target.value);
  };

  const productoChange = (e) => {
    setNombreProducto(e.target.value);

    let precio = productos.filter((x) => x.id === nombreProducto);
    console.log("nombreProducto: ", nombreProducto);

    if (precio.length > 0) {
      console.log("precio: ", precio[0].precioVenta);
      setPrecioProducto(precio[0].precioVenta);
    }
  };

  const cantidadChange = (e) => {
    setCantidadProducto(e.target.value);
  };

  const [error, setError] = useState("");
  //hook de routing para redireccionar
  const router = useRouter();

  //Context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);
  //   console.log(usuario);

  const agregarProducto = () => {
    if (nombreProducto) {
      const producto = productos.filter((x) => x.id === nombreProducto);
      let sumatoria = 0;

      if(producto) {
        setProductoTemp([...productoTemp,
          {
            idProducto: producto[0].id,
            producto: producto[0].nombre,
            categoria: producto[0].categoria,
            precio: producto[0].precioVenta,
            cantidad: cantidadProducto,
          },
        ]);

      productoTemp.forEach(producto => {
          sumatoria += (producto.cantidad * producto.precio);
      });

      setSumatoria(sumatoria);

      }

      

  

      console.log("producto: ", producto);
      console.log("productoTemp: ", productoTemp);
      console.log("nombreProducto: ", nombreProducto);
      setNombreProducto("");
      setPrecioProducto("");
      setCantidadProducto("");
    }
  };
  async function crearFactura() {
    //Inicia la carga
    //Si el usuario no esta autenticado llevat al login
    if (!usuario) {
      console.log("no esta loqueado");
      return router.push("/SignIn");
      firebase.cargando = false;
    }

    try {
      //Crear el objeto de nuevo producto

      const factura = {
        fecha: Date.now,
        cliente: nombre,
        productos: [],
        creado: Date.now(),
        estado: "",
        creador: {
          id: usuario.uid,
          nombre: usuario.displayName,
        },
      };

      //Insertar en la BD
      firebase.cargando = true;

      firebase.db.collection("Factura").add(factura);
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
    return router.push("/Clientes");
  }

  return (
    <Layout>
      <Navegacion titulo={"Facturación"}>
        <>
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12">
              <div className="card">
                <div className="card-header p-4">
                  <a className="pt-2 d-inline-block" href="index.html">
                    United Nearshore Operations (UNO)
                  </a>

                  <div className="float-right">
                    {" "}
                    <h3 className="mb-0">Invoice #1</h3>
                    13/08/2020
                  </div>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-sm-6">
                      <h5 className="mb-3">From:</h5>
                      <h3 className="text-dark mb-1">
                        Parque Industrial D' Clase Corporation , KM 6 1/2,
                      </h3>

                      <div>Phone: + (829) 947-8866</div>
                    </div>
                    <div className="col-sm-6">
                      <h5 className="mb-3">To:</h5>
                      <div>Phone: +614-837-8483</div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="idcliente">Cliente</label>
                        <select
                          className="form-control"
                          name="cliente"
                          id="cliente"
                          value={cliente}
                          onChange={clienteChange}
                          required
                        >
                          <option selected disabled value="">
                            Seleccione un cliente
                          </option>
                          {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                              {cliente.nombre + " " + cliente.apellido}
                            </option>
                          ))}
                          {!clientes && <p>No tiene registros de productos</p>}
                        </select>
                      </div>
                    </div>
                    <div className="w-100"></div>

                    <div className="col-md-4 mb-3">
                      <div className="form-group">
                        <label htmlFor="producto">Producto</label>
                        <select
                          className="form-control"
                          name="producto"
                          id="producto"
                          value={nombreProducto}
                          onChange={productoChange}
                          required
                        >
                          <option selected disabled value="">
                            Seleccione un producto
                          </option>
                          {productos.map((producto) => (
                            <option key={producto.id} value={producto.id}>
                              {producto.nombre}
                            </option>
                          ))}
                          {!productos && <p>No tiene registros de Productos</p>}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2 mb-3">
                      <label htmlFor="precio">Precio</label>
                      <input
                        type="text"
                        className="form-control"
                        id="precio"
                        placeholder="Ingrese la cantidad"
                        name="precio"
                        value={precioProducto}
                        autoComplete="off"
                        disabled
                        required
                      />
                    </div>
                    <div className="col-md-2 mb-3">
                      <label htmlFor="telefono">Cantidad</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cantidad"
                        placeholder="Ingrese la cantidad"
                        name="cantidad"
                        value={cantidadProducto}
                        onChange={cantidadChange}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="row m-auto p-auto">
                      <div className="col-sm-12">
                        <button
                          type="submit"
                          className="btn btn-space btn-primary"
                          type="button"
                          onClick={agregarProducto}
                        >
                          Colocar
                        </button>
                        <button className="btn btn-space btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive-sm">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th className="center">#</th>
                          <th>Producto</th>
                          <th>Categoria</th>
                          <th>Precio</th>
                          <th className="right">Cantidad</th>
                          <th className="center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <ListaProductos productoTemp={productoTemp}/>
                      </tbody>
                    </table>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-sm-5"></div>
                    <div className="col-lg-4 col-sm-5 ml-auto">
                      <table className="table table-clear">
                        <tbody>
                          <tr>
                            <td className="left">
                              <strong className="text-dark">Total</strong>
                            </td>
                            <td className="right">
                          <strong className="text-dark">{sumatoria}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white">
                  <p className="mb-0">CONTROL DE FACTURACION</p>
                </div>
              </div>
            </div>
          </div>
        </>
      </Navegacion>
    </Layout>
  );
};

export default Facturacion;
