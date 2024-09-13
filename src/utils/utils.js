import bcrypt from "bcrypt";
//se crearan dos funciones:
// createHash: aplica el hash al password
// isValiPasswprd: compara el password ingresado con el almacenado en la base de datos.
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = ( password, user ) => bcrypt.compareSync(password, user.password);

export { createHash, isValidPassword };
