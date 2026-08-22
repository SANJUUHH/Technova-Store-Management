const form = document.getElementById("editForm");

const prodname = document.getElementById("prodname");
const brand = document.getElementById("brand");
const category = document.getElementById("category");
const price = document.getElementById("price");
const qty = document.getElementById("qty");
const imgUrl = document.getElementById("imgUrl");
const description = document.getElementById("description");
const status = document.getElementById("status");


fetch("../sidebar/sidebar.html")
.then((res) => res.text())
.then((data) => {
    document.getElementById("sidebar-container").innerHTML = data;
});


// get id from url

const params = new URLSearchParams(window.location.search);

const id = params.get("id");


// fetch single product

async function fetchSingleProduct(){

    try {

        const res = await fetch(`http://localhost:3000/products/${id}`);

        const product = await res.json();

        fillForm(product);

    } 
    catch (error) {

        console.log(error);

    }

}


function fillForm(product){

    prodname.value = product.prodname;
    brand.value = product.brand;
    category.value = product.category;
    price.value = product.price;
    qty.value = product.qty;
    imgUrl.value = product.imgUrl;
    description.value = product.description;
    status.value = product.status;

}


// update product

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const updatedProduct = {

        prodname: prodname.value,
        brand: brand.value,
        category: category.value,
        price: Number(price.value),
        qty: Number(qty.value),
        imgUrl: imgUrl.value,
        description: description.value,
        status: status.value

    };

    try {

        await fetch(`http://localhost:3000/products/${id}`, {

            method:"PATCH",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(updatedProduct)

        });

        alert("Product Updated Successfully");

        window.location.href = "../dashboard/dashboard.html";

    } 
    catch (error) {

        console.log(error);

    }

});


fetchSingleProduct();