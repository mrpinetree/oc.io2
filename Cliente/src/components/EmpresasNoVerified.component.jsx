import { useState, useEffect } from 'react';
import * as React from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { Button, Dialog, Alert, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DialogContentText from '@mui/material/DialogContentText';



export const EmpresasNoVerfied = () => {

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
          <Button variant="contained" color="primary" onClick={() => handleValidaClick(tableMeta.rowData[0])}>
            Validar
          </Button>
        ),
      },
    }
  ]

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [empresasValidadas, setEmpresasValidadas] = useState([]);
  const [idUsuario, setIdUsuario] = useState('');
  const [idEmpresa, setIdEmpresa] = useState('');
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState("");

  const options = {
    filterType: 'checkbox',
    download: 'false',
    print: 'false',
    selectableRows: 'none'
  };

  useEffect(() => {
    axios.get('http://localhost:8080/user', { withCredentials: true })
      .then(response => {
        setIdUsuario(response.data.id);
      })
      .catch(error => {

      });

    axios.get('http://localhost:8080/empresas/noValidadas')
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

  const handleValidaClick = id => {
    setIdEmpresa(id);
    setOpen(true);
  }

  const ValidaConfirm = () => {
    if (!!idEmpresa) {
      axios({
        url: 'http://localhost:8080/empresas/validar',
        method: 'POST',
        withCredentials: true,
        data: {
          id_empresa: idEmpresa
        }
      })
        .then(res => {
          setAlerta("La empresa ha sido validada");
          setOpen(false);        
        })
        .catch(err => console.error(err))
    }

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
      <MUIDataTable title={'Empresas no Validadas'} data={empresasValidadas} columns={columnsEmp} options={options} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Seguro desea validar Esta Empresa?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Si valida a esta empresa , ten en cuenta que podrá crear eventos.
            Esto supone un riesgo para la seguridad de los clientes ante
            posibles estafas.
            ¿Estás seguro que quieres valir a esta empresa?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Rechazar</Button>
          <Button onClick={ValidaConfirm} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>

  );
};

export default EmpresasNoVerfied;
