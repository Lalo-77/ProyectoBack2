import bcrypt from "bcrypt";

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = ( password, usuario ) => bcrypt.compareSync(password, usuario.password);


const calcularTotal = (products) => {
    let total = 0;

    products.forEach(item => {
        total += item.product.price * item.quantity;
    });
    return total;

}
export { createHash, isValidPassword, calcularTotal };
