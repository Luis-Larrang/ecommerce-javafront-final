//IMPUESTOS
function impuestos(impuesto){
    return (precio) => precio * impuesto;
}
const iva = impuestos(0.21);
const iibb = impuestos(0.035);
function precioNeto(montoBruto,impuestoIva,impuestoIibb){
    let neto = montoBruto + impuestoIva(montoBruto) + impuestoIibb(montoBruto);
    return neto;
}

//MOSTRAR EN HTML
function productosHud(lista) {
    let mostrarEnHud = document.getElementById("listadosProductos");
    mostrarEnHud.innerHTML="";
    for (const producto of lista) {
        let nuevoProducto = document.createElement("div");
        nuevoProducto.classList.add("col");
        nuevoProducto.innerHTML=    `<div class="card offset-2 mb-3" style="width: 20rem; position-absolute top-0 start-100 translate-middle">
                                    <img src="${producto.img}" class="card-img-top width="200" height="200" alt="imgProducto">
                                    <div class="card-body">
                                    <h5 class="card-title ">${producto.nombre}</h5>
                                    <p class="card-tex ">Precio: $${precioNeto(producto.precio,iva,iibb)}</p>
                                    <button id="${producto.id}" class="btnAgregarAlCarrito btn btn-light offset-1 fs-1 bx bx-cart-add"></button>
                                    <button id="${producto.id}" class="btnSacarDelCarrito btn btn-light offset-3 fs-1 bx bx-checkbox-minus"></button>
                                    </div>`       
        mostrarEnHud.append(nuevoProducto);
    }
    agregarAlCarrito(); 
    sacarDelCarrito();   
}

//CARRITO
function carritoFull(){
    confirmarCarrito.addEventListener("click",()=>{                       
        dineroCarrito(saldoCliente).then((mensaje)=>{
            //DATOS DE ENVIO
            fetch("https://apis.datos.gob.ar/georef/api/provincias")
            .then((respuesta)=>{
                return respuesta.json()
            }).then((datos)=>{
                productosCarrito.innerHTML =   `<h3>Info envio</h3>
                                                <select id="provFiltro"></select>
                                                <select id="muniFiltro"></select>
                                                <button id="btnEnvio">Enviar</button>`;
                const provFiltro = document.getElementById("provFiltro");
                for (const provincia of datos.provincias) {
                    provFiltro.innerHTML+=`<option value="${provincia.id}">${provincia.nombre}</option>`;
                }
                provFiltro.onchange=()=>{
                    let provId = provFiltro.value;                    
                    let rutaBusqueda = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${provId}&campos=id,nombre&max=100`;
                    fetch(rutaBusqueda)
                    .then(respuesta=>respuesta.json())
                    .then((datos)=>{                        
                        let muniFiltro = document.getElementById("muniFiltro");
                        for (const municipio of datos.municipios) {
                            muniFiltro.innerHTML+=`<option value="${municipio.id}">${municipio.nombre}</option>`;
                        }
                        document.getElementById("btnEnvio").onclick=()=>{
                            console.log("Enviar producto a " + muniFiltro.value + " provincia " + provId);
                            fetch("https://jsonplaceholder.typicode.com/posts",{
                                method: 'POST',
                                body: JSON.stringify({
                                  carrito: carrito,
                                  idProvincia: provId,
                                  idMunicipio: muniFiltro.value
                                }),
                                headers: {
                                  'Content-type': 'application/json; charset=UTF-8',
                                },
                            })
                            .then(respuesta => respuesta.json())
                            .then(dato=>{
                                Swal.fire(
                                    "Compra confirmada",
                                    `El pedido N°${dato.id} fue confirmado`,        
                                    "success"
                                    );
                            })
                        }                                                
                    })
                }    
            }).catch((mensaje)=>{console.log(mensaje);})
                carritoAlert(mensaje,"success")  
        }).catch((mensaje)=>{
                carritoAlert(mensaje,"error");
                })
        limpiarCarrito();        
            }); 
}

//AGREGAR AL CARRITO
function agregarAlCarrito() {    
    let botones = document.getElementsByClassName("btnAgregarAlCarrito");
    for (const boton of botones) {
        boton.addEventListener("click", (e)=>{                
            let elegido = carrito.find(producto => producto.id == e.target.id)            
            if(elegido){
                elegido.sumarItems();
            }
            else{
                elegido=productos.find(producto => producto.id == e.target.id);
                carrito.push(elegido);
            }  
            console.log(carrito);
            localStorage.setItem("Carrito", JSON.stringify(carrito));
            carritoHud(carrito);
            tostada(`Agregaste: ${elegido.nombre} Precio: $${elegido.subTotal()}`,3500,"bottom","right");                   
        })
    }
}
//SACAR DEL CARRITO
function sacarDelCarrito() {    
    let botones = document.getElementsByClassName("btnSacarDelCarrito");
    for (const boton of botones) {
        boton.addEventListener("click", (e)=>{                
            let elegido = carrito.find(producto => producto.id == e.target.id)            
            if(elegido.cantidad>1){
                elegido.restarItems();
                tostada(`Quitaste: ${elegido.nombre} Precio: $${elegido.subTotal()}`,3500,"bottom","right");
            }            
            console.log(carrito);
            localStorage.setItem("Carrito", JSON.stringify(carrito));
            carritoHud(carrito);
                               
        })
    }
}

//CARRITO HUD
function carritoHud(lista){
    carritoCantidad.innerHTML = lista.length; 
    productosCarrito.innerHTML="";
    let totalCarrito = sumaCarrito();        
        saldoCliente-=totalCarrito; 
    for (const producto of lista) {
        let productoAlCarrito = document.createElement("div"); 
        productoAlCarrito.innerHTML =   `<h5>${producto.nombre}</h5>
                                        <span class="bordeCarrito mb-2">Precio: $ ${producto.precio}</span>
                                        <span class="bordeCarrito mb-2">Cantidad: ${producto.cantidad}</span>
                                        <span class="bordeCarrito mb-2">Sub-total: $${producto.subTotal()}</span>                                      
                                        <a id="${producto.id}" class="btn btn-sumar mb-2"><img src="imagenes/plus.png" alt="btnSumar"></a>
                                        <a id="${producto.id}" class="btn btn-restar mb-2"><img src="imagenes/minus-button.png" alt="btnRestar"></a>
                                        <a id="${producto.id}" class="btn btn-eliminar mb-2"><img src="imagenes/delete.png" alt="btnEliminar"></a>`;
        productosCarrito.append(productoAlCarrito);                                  
    }
    document.querySelectorAll(".btn-sumar").forEach(boton => boton.onclick = sumarAlCarrito);
    document.querySelectorAll(".btn-restar").forEach(boton => boton.onclick = restarDelCarrito);
    document.querySelectorAll(".btn-eliminar").forEach(boton => boton.onclick = eliminarDelCarrito);
}

//FUNCIONES EN CARRITO
//ELIMINAR
function eliminarDelCarrito(e) {
    let posicion = carrito.findIndex(producto => producto.id = e.target.id);
    carrito.splice(posicion,1);
    carritoHud(carrito);
    localStorage.setItem("Carito", JSON.stringify(carrito));
}

//SUMAR
function sumarAlCarrito() {
    let producto = carrito.find(p => p.id ==this.id)
    producto.sumarRestar(1);
    this.parentNode.children[1].innerHTML = "Cantidad: " + producto.cantidad;
    this.parentNode.children[2].innerHTML = "Precio: " + producto.subTotal();
    sumaCarrito();
    localStorage.setItem("Carito", JSON.stringify(carrito));
}

//RESTAR
function restarDelCarrito() {
    let producto = carrito.find(p => p.id ==this.id)
    if(producto.cantidad > 1){
        producto.sumarRestar(-1);
        this.parentNode.children[1].innerHTML = "Cantidad: " + producto.cantidad;
        this.parentNode.children[2].innerHTML = "Precio: " + producto.subTotal();
        sumaCarrito();
        localStorage.setItem("Carito", JSON.stringify(carrito));
    }    
}

//SWEET ALERT
function tostada(texto,duracion,gravedad,posicion,click){
    Toastify({
        text:   texto,                
        duration: duracion,
        gravity: gravedad, 
        position: posicion, 
        stopOnFocus: true,
        onClick:()=>{click},
        style: {
            background: "linear-gradient(to right, rgba(205,235,139,1) 0%,rgba(205,235,139,1) 100%)",                                                          
          },                
        }).showToast();  
}

//CHAT DEMO
function chat(){
   converse.initialize({
        bosh_service_url: 'https://conversejs.org/http-bind/',
        show_controlbox_by_default: true
    });
}

//PROMESA CARRITO
function dineroCarrito(dinero) {
    return new Promise((aceptado,rechazado)=>{
        if(dinero>0){
            aceptado("Compra exitosa, elegi datos de envio");
        }
        else{
            rechazado("Ups compra rechazada, comunicate con tu banco");
        }
    })    
}

//ALERTA RESULTADO CARRITO
function carritoAlert(mensaje,resolution){
    Swal.fire(
        "Estado de compra",
        mensaje,        
        resolution
        );
}

//LIMPIAR CARRITO
function limpiarCarrito(){
    localStorage.clear();  
    carrito.splice(0,carrito.length);
    carritoHud(carrito);
}

//TOTAL CARRITO
function sumaCarrito(){
    let totalCarrito = carrito.reduce((totalCompra,actual)=>totalCompra+=actual.subTotal(),0);
        totalCarritoInterfaz.innerHTML = `Total $${totalCarrito}`;
        return totalCarrito; 
}

//CARGA DE NUEVO PRODUCTO
/* Aca me surge un problema que no pude resolver, cuando refresco la pagina despues de cargar un nuevo producto me hace el append duplicado, mostrando 2 veces cada producto. y si vuelvo a cargar un producto despues de refrescar la pagina me lo duplica en el local storage. Y asi cada vez que actualizo la pagina. Quiza esto se pueda resolver trabajando con un servidor en lugar del local storage? */ 
function cargaProducto(){
    let ingresoProductoNuevo = document.getElementById("cargaNuevoProducto");
    productoExiste = productos.some(obj => obj.producto === productos.producto);
    if (!productoExiste) {
        ingresoProductoNuevo.onsubmit= (e) =>{
            e.preventDefault();
            let agregar = ingresoProductoNuevo.children;
            productos.push(new producto(agregar[0].value,agregar[1].value,agregar[2].value,agregar[3].value));                
            e.target.reset();
            localStorage.setItem("Productos",JSON.stringify(productos));
        }
    }
}

//LLAMADO JSON NUEVO PRODUCTO
function llamadoJsonNuevoProducto(){
    productoExiste = productos.some(obj => obj.producto === productos.producto);
    if (!productoExiste) {
        if("Productos" in localStorage){
            const productosGuardados = JSON.parse(localStorage.getItem("Productos")); 
            if (!productos.includes(producto)){
                for (const generico of productosGuardados) {
                    productos.push(new producto(generico.id,generico.nombre,generico.precio,generico.categoria));
                } 
            }            
            productosHud(productos);
        } 
    }   
}