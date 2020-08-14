import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import ProductoMiniaturaDetalle from "../components/ui/ProductoMiniaturaDetalle";
import Spinner from "../components/ui/Spinner";
import ButtonFloat from "../components/ui/ButtonFloat";
import LayoutPrincipal from "../components/layout/LayoutPrincipal";
import useProducto from '../hooks/useProducto';

const Clientes = () => {
  //hook cliente
  const {productos, setProductos, cargando, busqueda, setBusqueda} =  useProducto("desc");

  const handleChange = (e) => {
    setBusqueda(e.target.value);
    // console.log(busqueda);
  };

  const hanbleBuscar = (e) => {
    e.preventDefault();

    if (busqueda.trim()) {
      const buscar = busqueda.toLowerCase().trim();
      const filtro = productos.filter((producto) => {
        return (
          (
            producto.nombre.toLowerCase() +
            " " +
            producto.proveedor.toLowerCase()
          ).includes(buscar) || producto.categoria.toLowerCase().includes(buscar)
        );
      });

      //filtro itera en cada uno de ellos, combierte el nombrer en minusculas
      //y luego si lo encuentra lo agrega a filter
      // console.log(filtro,' BUSQUEDA: ', busqueda);
      setProductos(filtro);
      // console.log(clientes);
    }
  };
  const Componente = cargando ? (
    <Spinner />
  ) : (
    <>

    <div className="col-lg-12 p-0">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Lista de productos</h5>
        </div>
        <div className="campaign-table table-responsive">
          <table id="example" className="table table-striped table-bordered second table-hover">
            <thead>
              <tr className="border-0">
                <th className="border-0">Foto</th>
                <th className="border-0">Producto</th>
                <th className="border-0">Proveedor</th>
                <th className="border-0">Categoria</th>
                <th className="border-0">Accion</th>
              </tr>
            </thead>
            <tbody>
              
            {productos.map((producto) => (
              <ProductoMiniaturaDetalle key={producto.id} producto={producto} />
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
  return (
    <>
      <LayoutPrincipal
        cargando={false}
        handleChange={handleChange}
        hanbleBuscar={hanbleBuscar}
        titulo="Listas de productos"
        busqueda={busqueda}
        btnIr="/add/Producto"
      >
          <ButtonFloat modal={false} ir="/add/Producto"/>
        {Componente}
      </LayoutPrincipal>
    </>
  );
};

export default Clientes;
