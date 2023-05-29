import React from 'react';

const Footer = () => {
  const añoactual = new Date().getFullYear();

  return (
    <footer style={{ textAlign: 'center', padding: '20px' }}>
      <p>
        &copy; {añoactual} OC.io. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;





