import { useState, useEffect } from 'react';
import * as React from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Grid } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';


export const EmpresasVerfied = () => {

  const columnsEmp = [
    { name: 'id', label: 'id' },
    { name: 'email', label: 'Correo' },
    { name: 'nombre', label: 'Nombre' },
    { name: 'cif', label: 'CIF' },
    { name: 'domicilio', label: 'Domicilio' },
    { name: 'telefono', label: 'Contacto' },
    { name: 'persona_responsable', label: 'Persona Responsable' },
    { name: 'capital_social', label: 'Capital Social' },
    {
      name: '', label: 'acciones', options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <Button variant="contained" color="primary" onClick={() => handleBorrar(tableMeta.rowData[0])}>
            Borrar
          </Button>
        ),
      },
    }
  ]

  const [empresasValidadas, setEmpresasValidadas] = useState([]);
  const [idE, setIdE] = useState('');
  const [open, setOpen] = React.useState(false);
  const [alerta, setAlerta] = useState("");

  const options = {
    filterType: 'checkbox',
    download: 'false',
    print: 'false',
    selectableRows: 'none'
  };

  useEffect(() => {

    axios.get('http://localhost:8080/empresas/Validadas')
      .then(response => {
        setEmpresasValidadas(response.data);
      })
      .catch(error => console.error(error));

    let timeout;

    if (alerta) {
      timeout = setTimeout(() => {
        setAlerta("");
      }, 5000); // 10 segundos
    }

  }, [alerta]);

  const handleBorrar = id => {
    setIdE(id);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const borrar = () => {
    axios({
      url: `http://localhost:8080/user/${idE}`,
      method: 'DELETE',
      withCredentials: true,
    })
      .then(res => {
        setAlerta("La empresa se ha eliminado correctamente");
        setOpen(false);
      }).catch(err => console.error(err))
  }

  return (
    <>
      {alerta && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
          <Alert severity="success">
            {alerta}
          </Alert>
        </div>
      )}
      <MUIDataTable title={'Empresas Validadas'} data={empresasValidadas} columns={columnsEmp} options={options} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Seguro desea eliminar definitivamente esta Empresa?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Si elimina a esta empresa , ten en cuenta que sera suprimida definitivamente
            de la base de datos y debera volver a registrarse en el sistema.
            La empresa eliminada podría tomar acciones legales debido a la
            eliminación de su cuenta.
            ¿Estás seguro que quieres eliminar esta empresa?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Rechazar</Button>
          <Button onClick={borrar} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmpresasVerfied;
