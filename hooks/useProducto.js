import React,{useState,useEffect,useContext} from 'react';
import {FirebaseContext} from '../firebase'; 
import useAutenticacion from './useAutenticacion';

const useProducto = orden => {

  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [productos, setProductos] = useState([]);
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if(usuario && busqueda.trim() === '' && firebase.cargando === false) {
        const { uid } = usuario;
        console.log(' se cumplio');
        
        //Esta funcion te da acceso a todos los datos
        //y snapshot realiza operaciones con ellos
        try {

          const obtenerProductos = async() => {
            await firebase.db.collection("Productos").where("creador.id","==",uid).orderBy("creado", `${orden}`).onSnapshot(manejarSnapshot);//Ordena por creado
          }
          obtenerProductos();
        } catch (error) {
          console.log(error);
        }
        finally {
          setCargando(false);
        }
    }
  },[usuario, busqueda, firebase.cargando]);
  //se ejecuta cuando el componente esta listo
  function manejarSnapshot(snapshot) {
    const productos = snapshot.docs.map(doc => {
      //Extrae todo el registro completo
      return {
        id: doc.id,
        ...doc.data()
      }
    });
 
    //resultado de la consulta
    setProductos(productos);   
    // console.log(clientes);
     
  }

    return {
      busqueda,
      setBusqueda,
      cargando,
      productos,
      setProductos
    }
}

export default useProducto;

//Se copio todo el codigo desde index y se agrergaron los hooks arriba
//Y funciono todo bien