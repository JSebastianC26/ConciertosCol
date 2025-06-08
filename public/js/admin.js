let events = [
    {id: 1, name: 'Concierto Rock Nacional', date: '2025-07-15', city: 'Medellín', category: 'Música', status: 'Activo'},
    {id: 2, name: 'Conferencia Tech 2025', date: '2025-08-20', city: 'Bogotá', category: 'Tecnología', status: 'Cancelado'}
];
let editingId = null;

function switchTab(tab) {
    // Actualizar pestañas activas
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Aquí podrías cargar contenido diferente para cada pestaña
    console.log('Cambiando a pestaña:', tab);
    
    // Simular cambio de contenido
    if (tab !== 'eventos') {
        document.querySelector('.content').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>🚧 Sección en desarrollo</h2>
                <p>La sección de ${tab} estará disponible pronto.</p>
                <button class="btn btn-primary" onclick="location.reload()">Volver a Eventos</button>
            </div>
        `;
    }
}

function renderEvents() {
    const tbody = document.getElementById('eventsTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredEvents = events.filter(event => 
        event.name.toLowerCase().includes(searchTerm) ||
        event.city.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm)
    );

    tbody.innerHTML = filteredEvents.map(event => `
        <tr>
            <td>${event.id}</td>
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.city}</td>
            <td>${event.category}</td>
            <td><span class="status-badge ${event.status === 'Activo' ? 'status-active' : 'status-cancelled'}">${event.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit btn-small" onclick="editEvent(${event.id})">✏️ Editar</button>
                    <button class="btn btn-delete btn-small" onclick="deleteEvent(${event.id})">🗑️ Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = '➕ Nuevo Evento';
    document.getElementById('eventForm').reset();
    document.getElementById('eventModal').classList.add('show');
}

function closeModal() {
    document.getElementById('eventModal').classList.remove('show');
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (event) {
        editingId = id;
        document.getElementById('modalTitle').textContent = '✏️ Editar Evento';
        document.getElementById('eventName').value = event.name;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventCity').value = event.city;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventStatus').value = event.status;
        document.getElementById('eventModal').classList.add('show');
    }
}

function deleteEvent(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        events = events.filter(e => e.id !== id);
        renderEvents();
        
        // Animación de notificación
        showNotification('Evento eliminado correctamente', 'success');
    }
}

function exportData() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Nombre,Fecha,Ciudad,Categoría,Estado\n"
        + events.map(e => `${e.id},"${e.name}",${e.date},${e.city},${e.category},${e.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "eventos_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Datos exportados correctamente', 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        border-radius: 10px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Handlers
document.getElementById('searchInput').addEventListener('input', renderEvents);

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        city: document.getElementById('eventCity').value,
        category: document.getElementById('eventCategory').value,
        status: document.getElementById('eventStatus').value
    };

    if (editingId) {
        // Editar evento existente
        const index = events.findIndex(e => e.id === editingId);
        events[index] = { ...events[index], ...formData };
        showNotification('Evento actualizado correctamente', 'success');
    } else {
        // Crear nuevo evento
        const newEvent = {
            id: Math.max(...events.map(e => e.id), 0) + 1,
            ...formData
        };
        events.push(newEvent);
        showNotification('Evento creado correctamente', 'success');
    }

    closeModal();
    renderEvents();
});

// Cerrar modal al hacer clic fuera
document.getElementById('eventModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Inicializar
renderEvents();