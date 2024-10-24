const socket = io("http://localhost:8080"); 
////////////////////////////////////CLIENTE//////////////////////////////////////////

socket.on("enviodeproductos", (obj) => {
  if (Array.isArray(obj)) {
    uppdateProductList(obj);
  } else {
        console.error("Se esperaba un array, pero se reccibo:", obj);
  }
})

function uppdateProductList(productList) {

  const productosHome = document.getElementById("list-products")

  if (!Array.isArray(productList)) {
    console.error("productList no es un array:", productList);
    return ;
  }

  let productosHTML = "";

  productList.forEach((product) => {
    productosHTML += `<div class="card ">
        <div class="cart-header "> code:${product.code}</div>
        <div class="card-body>
            <h4 class="card-title">${product.title}</h4>
            <p class="card-text">
            <ul class="card-text">
            <li>id: ${product.id}</li>
            <li>title: ${product.title}</li>
            <li>description: ${product.description}</li>
            <li>price: ${product.price}</li>
            <li>status: ${product.status}</li> 
            <li>stock: ${product.stock}</li>
            <li>category: ${product.category}</li>
            <li>thumbnail: <img src="${product.thumbnail}"></li></ul>
            </p>
            </div>
            <div class="">
            <button type="button" class="btn btn-danger delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        </div>
    </div>`;
  });

  productosHome.innerHTML = productosHTML;
}

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let category = form.elements.category.value;
  let price = form.elements.price.value;
  let code = form.elements.code.value;
  let status = form.elements.status.checked; // Obtiene el valor del checkbox

  socket.emit("addProduct", {
    title,
    description,
    stock,
    thumbnail,
    category,
    price,
    code,
    status, // Agrega el campo status al objeto enviado al servidor

  });

  form.reset();
});

//para eliminar por ID
document.getElementById("delete-btn").addEventListener("click", function () {
  const deleteIdInput = document.getElementById("id-prod");
  const deleteId = parseInt(deleteIdInput.value);
  socket.emit("deleteProduct", deleteId);
  deleteIdInput.value = "";
})


//para eliminar el producto directamente 
function deleteProduct(productId) {
  socket.emit("deleteProduct", productId);
}