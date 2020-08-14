export default function validaCrearCuenta(valores) {
  let errores = {};

  //validar el nombrer de usuario
  if (!valores.nombre) {
    errores.nombre = "Dede espesificar el nombre del producto";
  }

  //validar el nombrer de usuario
  if (!valores.proveedor) {
    errores.proveedor = "El nombre del proveedor";
  }

  //validar el nombrer de usuario
  if (!valores.precioCompra) {
    errores.precioCompra = "El precio de compra";
  }

  //validar el nombrer de usuario
  if (!valores.precioVenta) {
    errores.precioVenta = "El precio de venta";
  }

  //validar el nombrer de usuario
  if (!valores.categoria) {
    errores.categoria = "Ingrerse la categoria";
  }


    //validar el nombrer de usuario
    if (!valores.cantidad) {
        errores.cantidad = "Ingrerse la cantidad";
      }

  return errores;
}
