const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  }
})

const CartProducts = sequelize.define("CartProducts", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = { Cart, CartProducts };


// const fs = require("fs");
// const path = require("path");

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   "data",
//   "cart.json"
// );

// const getCartFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb({ totalPrice: 0, products: [] });
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Cart {
//   static addProduct(product) {
//     getCartFromFile((cart) => {
//       const productIdx = cart.products.findIndex((el) => product.id);
//       if (productIdx !== -1) {
//         // The item is already in the cart, we increment the qty
//         cart.products[productIdx].quantity++;
//       } else {
//         // We add the item
//         product.quantity = 1;
//         cart.products.push(product);
//       }
//       cart.totalPrice += parseFloat(product.price);
//       fs.writeFile(p, JSON.stringify(cart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static remove(productId, productPrice) {
//     getCartFromFile((cart) => {
//       const updatedProducts = cart.products.filter((el) => el.id !== productId);
//       const productQty = cart.products.find(
//         (el) => el.id === productId
//       ).quantity;
//       const updatedCart = {
//         products: updatedProducts,
//         totalPrice: cart.totalPrice - productQty * productPrice,
//       };
//       fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static getCart(cb) {
//     getCartFromFile((cart) => {
//       cb(cart);
//     });
//   }
// };
