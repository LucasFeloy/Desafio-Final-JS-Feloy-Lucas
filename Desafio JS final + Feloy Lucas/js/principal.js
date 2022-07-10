let caballeros = []
let maximoDeCaballeros = 5;
let caballerosSeleccionados = [];

fetch('./db/caballeros.json')
    .then(res => res.json())
    .then(res => {

        caballeros = res
        console.log(caballeros);

        const contenedorPrincipal = document.getElementById("caballeros")
        const contenedorBronce = document.getElementById("bronce")
        const contenedorPlata = document.getElementById("plata")
        const contenedorOro = document.getElementById("oro")
        const contenedorMarina = document.getElementById("marina")
        const contenedorEspectro = document.getElementById("espectro")
        const contenedorDios = document.getElementById("dios")

        for (const cab of caballeros) {
            const img = document.createElement("img")
            img.src = cab.avatar;
            img.alt = cab.nombre;
            img.dataset.id = cab.id;
            img.dataset.role = 'caballero'

            if (cab.clase == "Bronce") {
                contenedorBronce.append(img)
            } else if (cab.clase == "Plata") {
                contenedorPlata.appendChild(img)
            } else if (cab.clase == "Marina") {
                contenedorMarina.appendChild(img)
            } else if (cab.clase == "Oro") {
                contenedorOro.appendChild(img)
            } else if (cab.clase == "Espectro") {
                contenedorEspectro.appendChild(img)
            } else if (cab.clase == "Dios") {
                contenedorDios.appendChild(img)
            }

            img.addEventListener("click", event => {
                const caballeroClickeado = caballeros.find(item => item.id === Number(event.target.dataset.id))
                if (!caballerosSeleccionados.some(item => item.id === caballeroClickeado.id)) {
                    caballerosSeleccionados.push(caballeroClickeado)
                }
                console.log(caballerosSeleccionados)
                const node = contenedorPrincipal.querySelector(`[data-id='${caballeroClickeado.id}']`)
                node.classList.add('seleccionado')
                recargarTablaDePuntuacion()
                if (caballerosSeleccionados.length === maximoDeCaballeros) {
                    mostrarResultado()
                }
            })


            const mostrarResultado = () => {

                const puntos = caballerosSeleccionados.reduce((acc, curr) => {
                    acc += curr.poder
                    return acc
                }, 0)
                Swal.fire({
                    title: "Tu puntaje: " + puntos,
                    text: "¿Volver a jugar?",
                    icon: 'success',
                    showDenyButton: true,
                    confirmButtonColor: '#3085d6',
                    denyButtonColor: '#d33',
                    confirmButtonText: 'Sí',
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire('¡Vuelve a elegir!')
                    } else if (result.isDenied) {
                        Swal.fire("¡Gracias por jugar, hasta pronto!")
                    }

                    guardarPuntajesMasAltos(puntos)
                    mostrarPuntajesMasAltos()
                    borrar()
                })
            }

            
            const guardarPuntajesMasAltos = puntos => {
                
                let puntajes = JSON.parse(localStorage.getItem('puntajes'))
                if (!puntajes) {
                    puntajes = []
                }
                puntajes.push(puntos)
                localStorage.setItem('puntajes', JSON.stringify(puntajes))
            }

            const mostrarPuntajesMasAltos = ()=> {
                const contenedor = document.getElementById('contenedorPuntos')
                contenedor.innerHTML = ''
                let puntajes = JSON.parse(localStorage.getItem('puntajes'))
                if (!puntajes) {
                    puntajes = []
                }
                puntajes = [...new Set(puntajes)]
                puntajes.sort((a, b) => {
                    return b - a
                }).splice(3)
                for (const puntaje of puntajes) {
                    const li = document.createElement('li')
                    li.textContent = puntaje
                    contenedor.appendChild(li)
                }
            }


        }

        const borrar = () => {

            resetearTablaPuntuacion()
            caballerosSeleccionados = []
            const nodes = document.querySelectorAll('img.seleccionado')
            for (const node of nodes) {
                node.classList.remove('seleccionado')
            }
        }

        const resetearTablaPuntuacion = () => {

            const trs = document.getElementById('tabPuntaje').querySelectorAll('tr')
            for (const [index, tr] of trs.entries()) {
                if (index > 0) {
                    tr.remove()
                }
            }
        }

        const recargarTablaDePuntuacion = () => {

            const tablaPuntuacion = document.getElementById('tabPuntaje')
            resetearTablaPuntuacion()
            for (const caballero of caballerosSeleccionados) {
                const tr = document.createElement('tr')
                const tdNombre = document.createElement('td')
                const tdSigno = document.createElement('td')
                const tdClase = document.createElement('td')
                tdNombre.textContent = caballero.nombre
                tdSigno.textContent = caballero.signo
                tdClase.textContent = caballero.clase
                tr.append(tdNombre, tdSigno, tdClase)
                tablaPuntuacion.appendChild(tr)
            }
        }



        const resetBtn = document.getElementById("reseteo")
        resetBtn.addEventListener('click', event => {
            event.preventDefault()
            borrar()
        })



    })





