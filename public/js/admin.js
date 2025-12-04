const deleteProductById = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const productElement = btn.closest("article");

  fetch("/admin/product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
        console.log(data);
        productElement.parentNode.removeChild(productElement)  //compatible with every browser new/old
        //productElement.remove()  //works with all modern browser

    })
    .catch((err) => console.log(err));
};


const showAlert = () => {
  alert("Product has been added to cart");
}
 