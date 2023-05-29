import {useState,useEffect} from 'react';
import * as React from 'react';
import {Paper, Typography} from '@mui/material';
import axios from 'axios';
import Header from '../../components/Header.component';
import {useNavigate} from 'react-router-dom';
import EmpresasVerfied from '../../components/EmpresasVerfied.component';
import EmpresasNoVerfied from '../../components/EmpresasNoVerified.component';
import Card from '../../components/CardBienvenida.component';

export const ValidarEmpresas = () => {

    //todas las variables que queramos inicializar las debemos asignar a un useStyate con su respectivo
    //res.data.*** debido a aque si asignamos una variable general a la respuesta dara error
    const [userNombre, setUserNombre] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        axios({
          url: 'http://localhost:8080/user',
          method: 'GET',
          withCredentials: true,
        })
          .then(res => {
            if(res.data.rol != "admin"){
              navigate("/");
            }
            setUserNombre(res.data.nombre);
            document.title = 'Empresas';
          })
          .catch(err => {
            navigate('/');
            console.log(err);
          });
      }, []);

        return (
            <Paper>  
                <Header />          
                <Card username={userNombre} />
                <EmpresasNoVerfied />  
            </Paper>
        );
  };
