
let addProdForm = document.getElementById("Add-Product-Form")
    addProdForm.addEventListener("submit",getFormData)

fetch("../sidebar/sidebar.html")
.then((res) => res.text())
.then((data) => {
    document.getElementById("sidebar-container").innerHTML = data;
});

function getFormData(){

        event.preventDefault()
        let prodname = addProdForm.prodname.value
        let brand = addProdForm.brand.value
        let category = addProdForm.category.value
        let price = addProdForm.price.value
        let qty = addProdForm.qty.value
        let imgUrl = addProdForm.imgUrl.value
        let description = addProdForm.description.value
        let status = addProdForm.status.value

        let obj={
            prodname,
            brand,
            category,
            price,
            qty,
            imgUrl,
            description,
            status
        }

        console.log(obj)
        postdata(obj)
}



async function postdata(obj) {

    fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    
}