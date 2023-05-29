import { Strategy as LocalStrategy } from "passport-local"
import User from '../models/Usuario.model.js'

export const strategyInit = passport => {
    passport.use('local',
  new LocalStrategy(
    { usernameField: 'email',
    passwordField: 'password'},
    (email, password, done) => {
        User.query().findOne({email: email}).then(email =>{
            if (!email) return done(null, false, {err:'Usuario no encontrado'});
            email.verifyPassword(String(password), ((err, passwordIsCorrect) => {
              if (!!err) return done({err:'Contraseña incorrecta'});
              if (!passwordIsCorrect) return done(null, false);
              return done(null,email);
            }))
          }).catch(function(err){
            done(err)
          })
    }
  )
);

    // Serializar usuarios
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })
  
    // Deserializar usuarios
    passport.deserializeUser((id, done) => {
      User.query().findById(id).then((user) => {
        if (!user) {
          // El usuario no existe en la base de datos
          return done(null, false);
        }
        done(null, user);
      }).catch((err) => {
        done(err);
      });
    });
}
  
  export default strategyInit;