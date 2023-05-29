import {useState,useEffect} from 'react';
import * as React from 'react';
import {Paper} from '@mui/material';
import Eventos from '../../components/Eventos.component';
import axios from 'axios';
import Header from '../../components/Header.component';
import {useNavigate} from 'react-router-dom';
import Footer from '../../components/Footer.component';
import Card from '../../components/CardBienvenida.component';
import Alert from '@mui/material/Alert';

export const HomePage = () => {

    //todas las variables que queramos inicializar las debemos asignar a un useStyate con su respectivo
    //res.data.*** debido a aque si asignamos una variable general a la respuesta dara error
    const [userNombre, setUserNombre] = useState();
    const [idData, setIdData] = useState();
    const [mensaje , setMensaje] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios({
          url: 'http://localhost:8080/user',
          method: 'GET',
          withCredentials: true,
        })
          .then(res => {
            setUserNombre(res.data.nombre);
            setIdData(res.data.id);
            document.title = `Home`;
            if(res.data.rol === "empresa"){
              if(res.data.isVerified === false){
                setMensaje("La empresa aún no ha sido verificada!!!")
              }
            }           
          })
          .catch(err => {
            navigate('/');
            console.log(err);
          });
      }, [idData,mensaje]);

        return (
            <Paper>  
                <Header />  
                <Card username={userNombre} />
                {mensaje && ( 
                <div style={{ display: 'flex', justifyContent: 'center' , marginTop: '10px' , marginBottom: '10px'}}>                             
                    <Alert variant="filled" severity="warning">La empresa aún no está verificada!!</Alert>    
                </div>         
                )}        
                <Eventos />   
                <Footer/>   
            </Paper>
        );
  };
