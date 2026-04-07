const URL_BASE="http://localhost:3000"

const catalog=document.getElementsByClassName("catalog-section")
const divcar=document.getElementById("pizzas-grid")
const ploading=document.getElementsByClassName("loading-text")
const filtres=document.getElementById("filters-container")

function mostrasPizzas(){
    fetch(`${URL_BASE}/pizzas`)
    .then(response=>response.json())
    .then(pizzas=>{
        let arraypiz=pizzas;
        arraypiz.forEach(pizza => {
            let cart=document.createElement("div")
            cart.innerHTML=`
                <div class="pizza-card">
                    <span class="pizza-emoji" id=${pizza.imagen}>${pizza.imagen}</span>
                    <span class="pizza-title" id=${pizza.nombre}>${pizza.nombre}</span>
                    <span class="pizza-category"id=${pizza.categoria}>${pizza.categoria}</span>
                    <span class="pizza-price" id=${pizza.precio}>${pizza.precio}€</span>
                    <button class="btn-add" data-id="${pizza.id}">Añadir</button>
                </div>
            `
            divcar.appendChild(cart)
        });
    })
    .catch(
        error=>console.log(error)
    )
}

function filter(categoria){
    fetch(`${URL_BASE}/pizzas`)
    .then(response=>response.json())
    .then(pizzas=>{
        let arraypiz=pizzas.filter(pizzas.categoria==categoria);
        arraypiz.forEach(pizza => {
            let cart=document.createElement("div")
            cart.innerHTML=`
                <div class="pizza-card">
                    <span class="pizza-emoji" id=${pizza.imagen}>${pizza.imagen}</span>
                    <span class="pizza-title" id=${pizza.nombre}>${pizza.nombre}</span>
                    <span class="pizza-category"id=${pizza.categoria}>${pizza.categoria}</span>
                    <span class="pizza-price" id=${pizza.precio}>${pizza.precio}€</span>
                    <button class="btn-add" data-id="${pizza.id}">Añadir</button>
                </div>
            `
            divcar.appendChild(cart)
        });
    })
    .catch(
        error=>console.log(error)
    )
}

filtres.addEventListener("click",(e)=>{
    e.preventDefault()

    const categoryButton=document.getElementsByClassName("btn-filter")
    filter(categoryButton.data)
    
})

mostrasPizzas()