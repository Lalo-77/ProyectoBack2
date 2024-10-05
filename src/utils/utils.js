import bcrypt from "bcrypt";

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = ( password, usuario ) => bcrypt.compareSync(password, usuario.password);

export { createHash, isValidPassword };
