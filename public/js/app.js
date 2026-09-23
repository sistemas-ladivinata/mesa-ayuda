let datosIniciales = null;
let identidad = null;
let ticketsActuales = [];
let filtroTicketActual = 'todos';

document.addEventListener('DOMContentLoaded', function () {

    console.log('Mesa de Ayuda cargada correctamente.');

    const boton = document.getElementById('btnIdentificar');
    const emailInput = document.getElementById('identityEmail');

    const correoGuardado =
        localStorage.getItem('laDivinataEmail');

    if (correoGuardado && emailInput) {
        emailInput.value = correoGuardado;
    }

    if (boton) {
        boton.addEventListener(
            'click',
            identificarUsuario
        );
    }

    if (emailInput) {
        emailInput.addEventListener(
            'keydown',
            function (event) {

                if (event.key === 'Enter') {
                    event.preventDefault();
                    identificarUsuario();
                }

            }
        );
    }

    document
        .getElementById('tabNew')
        .addEventListener('click', function () {
            mostrarVista('nuevo');
        });

    document
        .getElementById('tabTickets')
        .addEventListener('click', function () {
            mostrarVista('tickets');
        });

    document
        .getElementById('btnCambiarCorreo')
        .addEventListener(
            'click',
            cerrarSesionLocal
        );

    document
        .getElementById('ticketForm')
        .addEventListener(
            'submit',
            enviarTicket
        );

    document
        .getElementById('btnLimpiar')
        .addEventListener(
            'click',
            limpiarFormulario
        );

    document
        .getElementById('btnBuscar')
        .addEventListener(
            'click',
            buscarTickets
        );

    document
        .querySelectorAll('.ticket-filter')
        .forEach(function (boton) {

            boton.addEventListener(
                'click',
                function () {

                    cambiarFiltroTickets(
                        this.getAttribute('data-filtro')
                    );

                }
            );

        });

    document
        .getElementById('btnRegresarTickets')
        .addEventListener(
            'click',
            cerrarDetalle
        );

    document
        .getElementById('btnNuevoTicket')
        .addEventListener(
            'click',
            nuevoTicket
        );

    document
        .getElementById('btnVerMisTickets')
        .addEventListener(
            'click',
            irAMisTickets
        );

    document
        .getElementById('imagenes')
        .addEventListener(
            'change',
            mostrarPrevisualizacion
        );

});


/* ======================================================
   IDENTIFICAR USUARIO
====================================================== */

async function identificarUsuario() {

    const boton =
        document.getElementById(
            'btnIdentificar'
        );

    const emailInput =
        document.getElementById(
            'identityEmail'
        );

    const email =
        String(
            emailInput.value || ''
        )
        .trim()
        .toLowerCase();

    ocultarAviso(
        'globalNotice'
    );

    if (!email) {

        mostrarAviso(
            'Escribe tu correo corporativo.',
            'error'
        );

        return;
    }

    if (!email.endsWith('@ladivinata.mx')) {

        mostrarAviso(
            'Solo se permiten correos @ladivinata.mx.',
            'error'
        );

        return;
    }

    boton.disabled = true;
    boton.textContent = 'Validando...';

    mostrarAviso(
        'Conectando con Odoo...',
        'info'
    );

    try {

        const respuesta =
            await fetch(
                `/api/usuario?email=${encodeURIComponent(email)}`
            );

        const data =
            await respuesta.json();

        if (!respuesta.ok || !data.ok) {

            throw new Error(
                data.error ||
                data.mensaje ||
                'No fue posible identificar al usuario.'
            );
        }

        if (!data.usuario) {

            throw new Error(
                'Odoo respondió correctamente, pero no se encontró el contacto del usuario.'
            );
        }

        datosIniciales = data;
        identidad = data.usuario;

        localStorage.setItem(
            'laDivinataEmail',
            identidad.email
        );

        ocultarAviso(
            'globalNotice'
        );

        cargarAplicacion(
            data
        );

    } catch (error) {

        console.error(
            'Error identificando usuario:',
            error
        );

        mostrarAviso(
            obtenerMensajeError(error),
            'error'
        );

    } finally {

        boton.disabled = false;
        boton.textContent = 'Continuar';

    }

}


/* ======================================================
   CARGAR APLICACION
====================================================== */

function cargarAplicacion(data) {

    document
        .getElementById('identityView')
        .classList
        .add('hidden');

    document
        .getElementById('appView')
        .classList
        .remove('hidden');

    identidad = {
        id:
            data.usuario.id,

        name:
            data.usuario.name || '',

        email:
            data.usuario.email || ''
    };

    document
        .getElementById('userName')
        .textContent =
        identidad.name;

    document
        .getElementById('userEmail')
        .textContent =
        identidad.email;

    const campoNombre =
        document.getElementById('nombre');

    const campoEmail =
        document.getElementById('email');

    if (campoNombre) {
        campoNombre.value =
            identidad.name;
    }

    if (campoEmail) {
        campoEmail.value =
            identidad.email;
    }

    const equipo =
        document.getElementById('equipo');

    if (equipo) {
        equipo.value =
            'Soporte';
    }

    mostrarVista(
        'nuevo'
    );

}


/* ======================================================
   CAMBIAR VISTA
====================================================== */

function mostrarVista(vista) {

    if (!identidad) {
        return;
    }

    const nuevo =
        document.getElementById(
            'viewNuevo'
        );

    const tickets =
        document.getElementById(
            'viewTickets'
        );

    nuevo.classList.toggle(
        'hidden',
        vista !== 'nuevo'
    );

    tickets.classList.toggle(
        'hidden',
        vista !== 'tickets'
    );

    document
        .getElementById('tabNew')
        .className =
        vista === 'nuevo'
            ? 'primary'
            : 'secondary';

    document
        .getElementById('tabTickets')
        .className =
        vista === 'tickets'
            ? 'primary'
            : 'secondary';

    if (vista === 'nuevo') {

        const campoNombre =
            document.getElementById('nombre');

        const campoEmail =
            document.getElementById('email');

        if (campoNombre) {
            campoNombre.value =
                identidad.name || '';
        }

        if (campoEmail) {
            campoEmail.value =
                identidad.email || '';
        }

    }

    if (vista === 'tickets') {
        buscarTickets();
    }

}


/* ======================================================
   PREVISUALIZAR IMAGENES
====================================================== */

function mostrarPrevisualizacion() {

    const input =
        document.getElementById(
            'imagenes'
        );

    const preview =
        document.getElementById(
            'previewImagenes'
        );

    preview.innerHTML = '';

    const archivos =
        Array.from(
            input.files || []
        );

    if (archivos.length > 3) {

        mostrarAviso(
            'Puedes adjuntar máximo 3 imágenes.',
            'error',
            'formNotice'
        );

        input.value = '';

        return;
    }

    archivos.forEach(
        function (file) {

            if (!file.type.startsWith('image/')) {
                return;
            }

            const container =
                document.createElement(
                    'div'
                );

            container.className =
                'image-preview';

            const img =
                document.createElement(
                    'img'
                );

            img.src =
                URL.createObjectURL(file);

            const name =
                document.createElement(
                    'div'
                );

            name.className =
                'image-preview-name';

            name.textContent =
                file.name;

            container.appendChild(img);
            container.appendChild(name);

            preview.appendChild(container);

        }
    );

}


/* ======================================================
   CREAR TICKET
====================================================== */

async function enviarTicket(event) {

    event.preventDefault();

    ocultarAviso(
        'formNotice'
    );

    if (!identidad) {

        mostrarAviso(
            'La sesión del usuario no está identificada.',
            'error',
            'formNotice'
        );

        return;
    }

    const boton =
        document.getElementById(
            'btnCrear'
        );

    const files =
        Array.from(
            document.getElementById(
                'imagenes'
            ).files || []
        );

    if (files.length > 3) {

        mostrarAviso(
            'Puedes adjuntar máximo 3 imágenes.',
            'error',
            'formNotice'
        );

        return;
    }

    for (const file of files) {

        if (!file.type.startsWith('image/')) {

            mostrarAviso(
                'Solo se permiten imágenes.',
                'error',
                'formNotice'
            );

            return;
        }

        if (file.size > 2 * 1024 * 1024) {

            mostrarAviso(
                `La imagen "${file.name}" supera los 2 MB.`,
                'error',
                'formNotice'
            );

            return;
        }

    }

    const asunto =
        document
            .getElementById('asunto')
            .value
            .trim();

    const descripcion =
        document
            .getElementById('descripcion')
            .value
            .trim();

    if (!asunto) {

        mostrarAviso(
            'El asunto es obligatorio.',
            'error',
            'formNotice'
        );

        return;
    }

    if (!descripcion) {

        mostrarAviso(
            'La descripción es obligatoria.',
            'error',
            'formNotice'
        );

        return;
    }

    boton.disabled = true;
    boton.textContent = 'Creando ticket...';

    try {

        const formulario = {

            email:
                identidad.email,

            equipoId:
                2,

            prioridad:
                document
                    .getElementById('prioridad')
                    .value,

            asunto:
                asunto,

            descripcion:
                descripcion

        };

        const respuesta =
            await fetch(
                '/api/tickets',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            formulario
                        )
                }
            );

        const resultado =
            await respuesta.json();

        if (!respuesta.ok || !resultado.ok) {

            throw new Error(
                resultado.error ||
                'No fue posible crear el ticket.'
            );
        }

        mostrarResultadoCreacion(
            resultado.resultado
        );

    } catch (error) {

        console.error(
            'Error creando ticket:',
            error
        );

        mostrarAviso(
            obtenerMensajeError(error),
            'error',
            'formNotice'
        );

    } finally {

        boton.disabled = false;
        boton.textContent = 'Crear ticket';

    }

}


/* ======================================================
   RESULTADO
====================================================== */

function mostrarResultadoCreacion(resultado) {

    document
        .getElementById('ticketForm')
        .classList
        .add('hidden');

    document
        .getElementById('successBox')
        .classList
        .remove('hidden');

    document
        .getElementById('successNumber')
        .textContent =
        resultado &&
        resultado.name
            ? resultado.name
            : 'Ticket creado';

    document
        .getElementById('successMessage')
        .textContent =
        resultado &&
        resultado.mensaje
            ? resultado.mensaje
            : 'Tu solicitud fue registrada en Odoo.';

}


/* ======================================================
   NUEVO TICKET
====================================================== */

function nuevoTicket() {

    document
        .getElementById('successBox')
        .classList
        .add('hidden');

    document
        .getElementById('ticketForm')
        .classList
        .remove('hidden');

    limpiarFormulario();

    mostrarVista(
        'nuevo'
    );

}


/* ======================================================
   LIMPIAR
====================================================== */

function limpiarFormulario() {

    document
        .getElementById('asunto')
        .value = '';

    document
        .getElementById('descripcion')
        .value = '';

    document
        .getElementById('prioridad')
        .value = '0';

    document
        .getElementById('equipo')
        .value = 'Soporte';

    document
        .getElementById('imagenes')
        .value = '';

    document
        .getElementById('previewImagenes')
        .innerHTML = '';

    ocultarAviso(
        'formNotice'
    );

}


/* ======================================================
   BUSCAR TICKETS
====================================================== */

async function buscarTickets() {

    if (!identidad) {
        return;
    }

    const boton =
        document.getElementById(
            'btnBuscar'
        );

    boton.disabled = true;
    boton.textContent = 'Consultando...';

    document
        .getElementById('ticketsLoading')
        .classList
        .remove('hidden');

    document
        .getElementById('ticketsList')
        .innerHTML = '';

    document
        .getElementById('ticketDetail')
        .classList
        .add('hidden');

    try {

        const respuesta =
            await fetch(
                `/api/tickets?email=${encodeURIComponent(identidad.email)}`
            );

        const data =
            await respuesta.json();

        if (!respuesta.ok || !data.ok) {

            throw new Error(
                data.error ||
                'No fue posible consultar los tickets.'
            );
        }

        ticketsActuales =
            transformarTickets(
                data.tickets || []
            );

        filtroTicketActual = 'todos';

        actualizarBotonesFiltroTickets();

        renderTickets(
            ticketsActuales
        );

    } catch (error) {

        console.error(
            'Error consultando tickets:',
            error
        );

        mostrarAviso(
            obtenerMensajeError(error),
            'error'
        );

    } finally {

        boton.disabled = false;
        boton.textContent = '🔄 Actualizar';

        document
            .getElementById('ticketsLoading')
            .classList
            .add('hidden');

    }

}


/* ======================================================
   TRANSFORMAR TICKETS
====================================================== */

function transformarTickets(tickets) {

    return tickets.map(
        function (ticket) {

            return {

                id:
                    ticket.id,

                name:
                    ticket.name ||
                    `Ticket #${ticket.id}`,

                description:
                    ticket.description ||
                    '',

                create_date:
                    ticket.create_date ||
                    '',

                write_date:
                    ticket.write_date ||
                    '',

                priority:
                    String(
                        ticket.priority ?? '0'
                    ),

                stage:
                    ticket.stage_id
                        ? ticket.stage_id[1]
                        : 'Sin estado',

                team:
                    ticket.team_id
                        ? ticket.team_id[1]
                        : 'Sin equipo',

                responsable:
                    ticket.user_id
                        ? ticket.user_id[1]
                        : 'Sin asignar'

            };

        }
    );

}


/* ======================================================
   RENDER TICKETS
====================================================== */

function renderTickets(tickets) {

    const contenedor =
        document.getElementById(
            'ticketsList'
        );

    if (!tickets.length) {

        contenedor.innerHTML =
            '<div class="empty">No encontramos tickets asociados a tu correo.</div>';

        return;
    }

    contenedor.innerHTML = '';

    tickets.forEach(
        function (ticket) {

            const item =
                document.createElement(
                    'div'
                );

            item.className =
                'ticket';

            const left =
                document.createElement(
                    'div'
                );

            const title =
                document.createElement(
                    'div'
                );

            title.className =
                'ticket-title';

            title.textContent =
                ticket.name ||
                `Ticket #${ticket.id}`;

            const estadoBadge =
                document.createElement(
                    'div'
                );

            estadoBadge.className =
                'badge ticket-status ' +
                claseEstado(ticket.stage);

            estadoBadge.textContent =
                ticket.stage ||
                'Sin estado';

            const meta =
                document.createElement(
                    'div'
                );

            meta.className =
                'ticket-meta';

            meta.textContent =
                'Fecha: ' +
                formatearFecha(
                    ticket.create_date
                ) +
                ' · Equipo: ' +
                (
                    ticket.team ||
                    'Sin equipo'
                ) +
                ' · Responsable: ' +
                (
                    ticket.responsable ||
                    'Sin asignar'
                );

            left.appendChild(title);
            left.appendChild(estadoBadge);
            left.appendChild(meta);

            const badge =
                document.createElement(
                    'div'
                );

            badge.className =
                'badge priority-' +
                (
                    ticket.priority || '0'
                );

            badge.textContent =
                prioridadTexto(
                    ticket.priority
                );

            item.appendChild(left);
            item.appendChild(badge);

            item.addEventListener(
                'click',
                function () {
                    abrirDetalle(ticket.id);
                }
            );

            contenedor.appendChild(item);

        }
    );

}


/* ======================================================
   FILTROS
====================================================== */

function cambiarFiltroTickets(filtro) {

    filtroTicketActual =
        filtro || 'todos';

    actualizarBotonesFiltroTickets();

    let filtrados =
        ticketsActuales;

    if (filtroTicketActual !== 'todos') {

        filtrados =
            ticketsActuales.filter(
                function (ticket) {

                    return estadoCoincide(
                        ticket.stage,
                        filtroTicketActual
                    );

                }
            );

    }

    renderTickets(
        filtrados
    );

}


function actualizarBotonesFiltroTickets() {

    document
        .querySelectorAll('.ticket-filter')
        .forEach(
            function (boton) {

                boton.classList.toggle(
                    'active',
                    boton.getAttribute(
                        'data-filtro'
                    ) ===
                    filtroTicketActual
                );

            }
        );

}


function estadoCoincide(
    estado,
    filtro
) {

    const valor =
        String(estado || '')
            .trim()
            .toLowerCase();

    const mapa = {

        nuevo: [
            'nuevo',
            'new'
        ],

        progreso: [
            'en progreso',
            'in progress',
            'abierto',
            'open'
        ],

        pendiente: [
            'pendiente',
            'pending',
            'en espera',
            'waiting'
        ],

        resuelto: [
            'resuelto',
            'solved',
            'cerrado',
            'closed'
        ],

        cancelado: [
            'cancelado',
            'cancelled'
        ]

    };

    return (
        mapa[filtro] || []
    ).includes(valor);

}


function claseEstado(estado) {

    const valor =
        String(estado || '')
            .trim()
            .toLowerCase();

    if (
        valor === 'nuevo' ||
        valor === 'new'
    ) {
        return 'status-nuevo';
    }

    if (
        valor === 'en progreso' ||
        valor === 'in progress' ||
        valor === 'abierto' ||
        valor === 'open'
    ) {
        return 'status-progreso';
    }

    if (
        valor === 'pendiente' ||
        valor === 'pending' ||
        valor === 'en espera' ||
        valor === 'waiting'
    ) {
        return 'status-pendiente';
    }

    if (
        valor === 'resuelto' ||
        valor === 'solved' ||
        valor === 'cerrado' ||
        valor === 'closed'
    ) {
        return 'status-resuelto';
    }

    if (
        valor === 'cancelado' ||
        valor === 'cancelled'
    ) {
        return 'status-cancelado';
    }

    return '';

}


/* ======================================================
   DETALLE
====================================================== */

async function abrirDetalle(id) {

    document
        .getElementById('ticketsLoading')
        .classList
        .remove('hidden');

    try {

        const respuesta =
            await fetch(
                `/api/tickets/${encodeURIComponent(id)}?email=${encodeURIComponent(identidad.email)}`
            );

        const data =
            await respuesta.json();

        if (!respuesta.ok || !data.ok) {

            throw new Error(
                data.error ||
                'No fue posible consultar el ticket.'
            );
        }

        const ticket =
            data.ticket;

        document
            .getElementById('ticketsList')
            .classList
            .add('hidden');

        document
            .getElementById('ticketDetail')
            .classList
            .remove('hidden');

        const contenido =
            document.getElementById(
                'detailContent'
            );

        contenido.innerHTML = '';

        const titulo =
            document.createElement(
                'h3'
            );

        titulo.textContent =
            ticket.name ||
            `Ticket #${ticket.id}`;

        titulo.style.marginTop = '0';

        const estado =
            document.createElement(
                'p'
            );

        estado.innerHTML =
            '<strong>Estado:</strong> ' +
            escaparHtmlCliente(
                ticket.stage ||
                'Sin estado'
            );

        const equipo =
            document.createElement(
                'p'
            );

        equipo.innerHTML =
            '<strong>Equipo:</strong> ' +
            escaparHtmlCliente(
                ticket.team ||
                'Sin equipo'
            );

        const responsable =
            document.createElement(
                'p'
            );

        responsable.innerHTML =
            '<strong>Responsable:</strong> ' +
            escaparHtmlCliente(
                ticket.responsable ||
                'Sin asignar'
            );

        const prioridad =
            document.createElement(
                'p'
            );

        prioridad.innerHTML =
            '<strong>Prioridad:</strong> ' +
            escaparHtmlCliente(
                prioridadTexto(
                    ticket.priority
                )
            );

        const fecha =
            document.createElement(
                'p'
            );

        fecha.innerHTML =
            '<strong>Creado:</strong> ' +
            escaparHtmlCliente(
                formatearFecha(
                    ticket.create_date
                )
            );

        const descripcionBox =
            document.createElement(
                'div'
            );

        descripcionBox.className =
            'detail-box';

        const descripcionTitulo =
            document.createElement(
                'strong'
            );

        descripcionTitulo.textContent =
            'Descripción';

        const descripcion =
            document.createElement(
                'div'
            );

        descripcion.style.marginTop =
            '8px';

        descripcion.textContent =
            stripHtml(
                ticket.description || ''
            ) ||
            'Sin descripción.';

        descripcionBox.appendChild(
            descripcionTitulo
        );

        descripcionBox.appendChild(
            descripcion
        );

        contenido.appendChild(titulo);
        contenido.appendChild(estado);
        contenido.appendChild(equipo);
        contenido.appendChild(responsable);
        contenido.appendChild(prioridad);
        contenido.appendChild(fecha);
        contenido.appendChild(descripcionBox);

    } catch (error) {

        console.error(
            'Error obteniendo detalle:',
            error
        );

        mostrarAviso(
            obtenerMensajeError(error),
            'error'
        );

    } finally {

        document
            .getElementById('ticketsLoading')
            .classList
            .add('hidden');

    }

}


/* ======================================================
   CERRAR DETALLE
====================================================== */

function cerrarDetalle() {

    document
        .getElementById('ticketDetail')
        .classList
        .add('hidden');

    document
        .getElementById('ticketsList')
        .classList
        .remove('hidden');

}


/* ======================================================
   MIS TICKETS
====================================================== */

function irAMisTickets() {

    mostrarVista(
        'tickets'
    );

}


/* ======================================================
   CAMBIAR CORREO
====================================================== */

function cerrarSesionLocal() {

    identidad = null;
    datosIniciales = null;
    ticketsActuales = [];

    document
        .getElementById('appView')
        .classList
        .add('hidden');

    document
        .getElementById('identityView')
        .classList
        .remove('hidden');

    ocultarAviso(
        'globalNotice'
    );

}


/* ======================================================
   HELPERS
====================================================== */

function prioridadTexto(valor) {

    if (String(valor) === '2') {
        return 'Urgente';
    }

    if (String(valor) === '1') {
        return 'Alta';
    }

    return 'Normal';

}


function formatearFecha(valor) {

    if (!valor) {
        return '';
    }

    const fecha =
        new Date(
            String(valor).replace(
                ' ',
                'T'
            )
        );

    if (isNaN(fecha.getTime())) {
        return valor;
    }

    return fecha.toLocaleString(
        'es-MX'
    );

}


function stripHtml(html) {

    const div =
        document.createElement(
            'div'
        );

    div.innerHTML =
        html;

    return (
        div.textContent ||
        div.innerText ||
        ''
    );

}


function escaparHtmlCliente(texto) {

    const div =
        document.createElement(
            'div'
        );

    div.textContent =
        String(
            texto || ''
        );

    return div.innerHTML;

}


function obtenerMensajeError(error) {

    if (
        error &&
        error.message
    ) {
        return error.message;
    }

    return String(
        error ||
        'Ocurrió un error.'
    );

}


function mostrarAviso(
    mensaje,
    tipo,
    id
) {

    const elemento =
        document.getElementById(
            id ||
            'globalNotice'
        );

    if (!elemento) {
        return;
    }

    elemento.textContent =
        mensaje;

    elemento.className =
        'notice ' +
        (
            tipo ||
            'info'
        );

    elemento.style.display =
        'block';

}


function ocultarAviso(id) {

    const elemento =
        document.getElementById(
            id
        );

    if (!elemento) {
        return;
    }

    elemento.textContent =
        '';

    elemento.className =
        'notice';

    elemento.style.display =
        'none';

}