const canvas = document.getElementById("escenario")
const ctx = canvas.getContext("2d")





//---------PERSONAJE PRINCIPAL "MOY" DERECHA
let personajeMoy = new Image()
personajeMoy.src = "images/personaje.png"

//---------PERSONAJE PRINCIPAL "MOY" IZQUIERDA
let personajeMoyIzq = new Image()
personajeMoyIzq.src = "images/personaje-izq.png"

//----------VIILLANO 1 "PERRO 1"
let personajeElvis = new Image()
personajeElvis.src = "images/enemigo-1.png";

//----------VILLANO 2 "PERRO 2"
let personajeBella = new Image()
personajeBella.src = "images/perrito.png";

//----------CHORRITO DE AGUA
const aguaImagen = new Image()
aguaImagen.src = "images/agua.png" 

//----------AREA DE TRABAJO
let areaTrabajoImagen = new Image()
areaTrabajoImagen.src = "images/area-de-fabricacion.png"

//----------AREA DE ENTREGA (META)
let areaDeEntregaImagen = new Image()
areaDeEntregaImagen.src = "images/area-de-entrega.png"

//----------GAME OVER
let gameOverImagen = new Image()
gameOverImagen.src = "images/game-over.png" 


//---------------------------------------------------------------------------------------

const moy = new Moy(10, 500, ctx, personajeMoy);


const enemigos = []
const agua = []

// const areaArreglo = []


let idFrame;



function empezarJuego(){
    const buttonStart = document.getElementById("start")
    
    buttonStart.classList.add("noDisplay")
    /*buttonStart.style.display = "none"    ESTA ES OTRA OPCION*/
    canvas.classList.remove("noDisplay")


    const buttonPlayAgain = document.getElementById("creditos")
    
    

    configurarAmbiente()

    actualizarEscenario()

    setInterval(() => {
        crearEnemigos()
    }, 3000)
}

const caja = new Caja(630,10, ctx, areaTrabajoImagen);

function actualizarEscenario(){

    ctx.clearRect(0,0,800,800)
    moy.dibujarse()
    caja.dibujarse()
    
    crearEnemigos()


//----------------ARREGLO-ENEMIGOS/POSICIÓN-----------------------------------
    enemigos.forEach((enemigo, index) => { 
        enemigo.x -= 2
        enemigo.dibujarse()
        if(enemigo.x === moy.x + 70 && (enemigo.y >= moy.y && enemigo.y <= moy.y+90
             || enemigo.y+90 >= moy.y && enemigo.y+90 <= moy.y+90)) {
            moy.recibirDano(20)
            enemigos.splice(index, 1)
        }
        
    })

//---------------COLISION META-----------------
    if(moy.y <= caja.y+90 && (moy.x >= caja.x && moy.x <= caja.x + 70 
        || caja.x+70 >= moy.x && caja.x+70 <= moy.x+70 || moy.x+70 >= caja.x)){
        
        setTimeout(() => {
            alert("¡FELICIDADES!")
        }, 100);
    }

//---------------ARREGLO - DISPAROS DE AGUA-----------------    
    agua.forEach((balaAgua, indexAgua) => {
        balaAgua.x += 3
        balaAgua.dibujarse()

        enemigos.forEach((enemigo, indexEnemigo) => {
            if(enemigo.x <= balaAgua.x +70 && (enemigo.y >= balaAgua.y && enemigo.y <= balaAgua.y+90
                || enemigo.y+90 >= balaAgua.y && enemigo.y+90 <= balaAgua.y+90)){
                enemigos.splice(indexEnemigo, 1)
                agua.splice(indexAgua, 1)
            }
        })
    })

    mostrarDatos(moy.vida, moy.x, moy.y, )
    idFrame = requestAnimationFrame(actualizarEscenario)

    if(!moy.estaVivo()){
        alert("¡Intentalo de Nuevo!")
        cancelAnimationFrame(idFrame)
    }


}

function mostrarDatos(vida,){
    ctx.font = "30px Balsamiq Sans"
    ctx.fillText(vida, 100, 40,)
     
}

function crearEnemigos(){
    const aleatorio = Math.floor(Math.random() * 200)
    const numeros = [1, 10, 75, 38, 56, 80]
    let Y = Math.floor(Math.random() * (canvas.height - 90) ) 

    if(numeros.includes(aleatorio)) {
        let tipoEnemigo = personajeElvis
        if (aleatorio % 2 === 0) {
            tipoEnemigo = personajeBella
        }
        const enemigo = new Enemigo(800, Y, ctx, tipoEnemigo)
        enemigos.push(enemigo)
    }
}



//--------------MOVIMIENTOS DE MI PERSONAJE

function configurarAmbiente() {
document.addEventListener("keydown", (event) => {
    switch(event.key){
    case "ArrowLeft":
        if(moy.x - 10 > 0){
            moy.moverAtras();console.log("Mover a la izquierda")
            moy.img = personajeMoyIzq
        }
        break;
    case "ArrowRight":
        if(moy.x + 100 < canvas.width){
            moy.moverAlFrente(); console.log("Mover a la derecha")
            moy.img = personajeMoy
        }        
        break;

    case "ArrowDown":
        if(moy.y + 200 < canvas.height){
            moy.moverAbajo();  console.log("Abajo")
            moy.img = personajeMoy
        }       
        break;
    
    case "ArrowUp":
        if(moy.y - 85 > 0 ){
            moy.moverArriba();  console.log("Arriba")
            moy.img = personajeMoy
        }
        break;

    case " ":
        if (agua.length < 3){
            const nuevaAgua = moy.disparar(moy.x+70, moy.y-10, aguaImagen)
            agua.push(nuevaAgua)
        }
        break;
  
    }
}) 
}