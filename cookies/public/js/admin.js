const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
  const productElement = btn.closest("article");
  fetch(`/admin/delete-product/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((res) => res.json())
    .then((data) => productElement.parentNode.removeChild(productElement))
    .catch((err) => console.log(err));
};
