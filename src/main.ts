interface Tarea {

    titulo: string
    descripcion: string
    categoria: string
    completada: boolean
}

let tareas: Tarea[] = []

const tituloInput = document.getElementById('titulo') as HTMLInputElement

const descripcionInput = document.getElementById('descripcion') as HTMLTextAreaElement

const categoriaSelect = document.getElementById('categoria') as HTMLSelectElement

const btnAgregar = document.getElementById('btnAgregar') as HTMLButtonElement

const listaTareas = document.getElementById('listaTareas') as HTMLUListElement

const ultimaTarea = document.getElementById('ultimaTarea') as HTMLHeadingElement


// Cargar tareas guardadas
function cargarTareas(): void {

    const tareasGuardadas = localStorage.getItem('tareas')

    if (tareasGuardadas) {

        tareas = JSON.parse(tareasGuardadas)

        mostrarTareas()
    }
}


// Guardar tareas
function guardarTareas(): void {

    localStorage.setItem(
        'tareas',
        JSON.stringify(tareas)
    )
}


// Mostrar tareas
function mostrarTareas(): void {

    listaTareas.innerHTML = ''

    tareas.forEach(
        (tarea, indice) => {

            const li = document.createElement('li')

            li.innerHTML = `
                <strong>${tarea.titulo}</strong>
                - ${tarea.descripcion}
                - ${tarea.categoria}
                - ${tarea.completada ? 'COMPLETADA' : 'PENDIENTE'}

                <button class="btnCompletar" data-id="${indice}">
                    Completar
                </button>

                <button class="btnEliminar" data-id="${indice}">
                    Eliminar
                </button>

                <hr>
            `

            listaTareas.appendChild(li)
        }
    )
}


// Agregar tarea
btnAgregar.addEventListener(
    'click',

    () => {

        const nuevaTarea: Tarea = {

            titulo:
                tituloInput.value,

            descripcion:
                descripcionInput.value,

            categoria:
                categoriaSelect.value,

            completada:
                false
        }

        tareas.push(
            nuevaTarea
        )

        guardarTareas()

        mostrarTareas()

        sessionStorage.setItem(
            'ultimaTareaEditada',
            nuevaTarea.titulo
        )

        ultimaTarea.textContent =
            'Última tarea editada: ' +
            nuevaTarea.titulo

        tituloInput.value = ''
        descripcionInput.value = ''
    }
)


// Delegación de eventos
listaTareas.addEventListener(
    'click',

    (event) => {

        const elemento =
            event.target as HTMLElement

        const indice =
            Number(
                elemento.getAttribute(
                    'data-id'
                )
            )

        // Eliminar
        if (
            elemento.classList.contains(
                'btnEliminar'
            )
        ) {

            tareas.splice(
                indice,
                1
            )

            guardarTareas()

            mostrarTareas()
        }

        // Completar
        if (
            elemento.classList.contains(
                'btnCompletar'
            )
        ) {

            tareas[indice].completada =
                true

            guardarTareas()

            mostrarTareas()

            sessionStorage.setItem(
                'ultimaTareaEditada',
                tareas[indice].titulo
            )

            ultimaTarea.textContent =
                'Última tarea editada: ' +
                tareas[indice].titulo
        }
    }
)


// Recuperar última tarea editada
const ultima =
    sessionStorage.getItem(
        'ultimaTareaEditada'
    )

if (ultima) {

    ultimaTarea.textContent =
        'Última tarea editada: ' +
        ultima
}


// IndexedDB
const request =
    indexedDB.open(
        'ServidorDB',
        1
    )

request.onupgradeneeded =
    () => {

        const db =
            request.result

        if (
            !db.objectStoreNames.contains(
                'categorias'
            )
        ) {

            db.createObjectStore(
                'categorias',
                {
                    keyPath: 'id',
                    autoIncrement: true
                }
            )
        }
    }

request.onsuccess =
    () => {

        const db =
            request.result

        const transaction =
            db.transaction(
                'categorias',
                'readwrite'
            )

        const store =
            transaction.objectStore(
                'categorias'
            )

        store.put({
            nombre: 'Servidores'
        })

        store.put({
            nombre: 'Base de Datos'
        })

        store.put({
            nombre: 'Redes'
        })

        store.put({
            nombre: 'Backups'
        })
    }


// Iniciar sistema
cargarTareas()