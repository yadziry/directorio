// Contraseña de administrador (CAMBIAR ESTA CONTRASEÑA)
const ADMIN_PASSWORD = 'admin123';

// Array para almacenar los administrativos
let administrativos = [];
let isAdmin = false;

// Cargar datos del localStorage al iniciar
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('administrativos');
    if (savedData) {
        administrativos = JSON.parse(savedData);
        renderDirectory();
    }
});

// Manejar clic en el botón flotante
document.getElementById('adminAccessBtn').addEventListener('click', () => {
    if (isAdmin) {
        // Si ya es admin, mostrar/ocultar el formulario
        const adminSection = document.getElementById('adminSection');
        adminSection.classList.toggle('hidden');
    } else {
        // Si no es admin, mostrar modal de login
        document.getElementById('loginModal').classList.remove('hidden');
        document.getElementById('password').focus();
    }
});

// Cerrar modal al hacer clic fuera de él
document.getElementById('loginModal').addEventListener('click', (e) => {
    if (e.target.id === 'loginModal') {
        closeLoginModal();
    }
});

// Función para cerrar el modal
function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('password').value = '';
}

// Manejar el login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;

    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        closeLoginModal();
        document.getElementById('adminSection').classList.remove('hidden');
        document.getElementById('adminAccessBtn').textContent = '🔓';
        document.getElementById('adminAccessBtn').title = 'Gestionar Directorio';
        renderDirectory(); // Actualizar para mostrar botones de eliminar
        
        // Scroll suave hacia el formulario
        document.getElementById('adminSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        alert('❌ Contraseña incorrecta');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
});

// Cerrar sesión
function logout() {
    isAdmin = false;
    document.getElementById('adminSection').classList.add('hidden');
    document.getElementById('adminAccessBtn').textContent = '✏️';
    document.getElementById('adminAccessBtn').title = 'Acceso Administrativo';
    renderDirectory(); // Actualizar para ocultar botones de eliminar
    alert('✅ Sesión cerrada correctamente');
}

// Manejar el envío del formulario
document.getElementById('adminForm').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!isAdmin) {
        alert('❌ No tienes permisos para agregar administrativos');
        return;
    }

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const area = document.getElementById('area').value.trim();

    // Crear objeto administrativo
    const nuevoAdmin = {
        id: Date.now(),
        nombre,
        correo,
        telefono,
        area
    };

    // Agregar al array
    administrativos.push(nuevoAdmin);

    // Guardar en localStorage
    localStorage.setItem('administrativos', JSON.stringify(administrativos));

    // Limpiar formulario
    document.getElementById('adminForm').reset();

    // Actualizar visualización
    renderDirectory();

    // Mensaje de confirmación
    alert('✅ Administrativo agregado exitosamente');
});

// Función para renderizar el directorio
function renderDirectory() {
    const directoryList = document.getElementById('directoryList');
    const totalCount = document.getElementById('totalCount');

    totalCount.textContent = administrativos.length;

    if (administrativos.length === 0) {
        directoryList.innerHTML = '<p class="empty-message">No hay administrativos registrados.</p>';
        return;
    }

    directoryList.innerHTML = administrativos.map(admin => `
        <div class="person-card">
            ${isAdmin ? `<button class="delete-btn" onclick="deleteAdmin(${admin.id})" title="Eliminar">×</button>` : ''}
            <h3>${admin.nombre}</h3>
            <div class="person-info">
                <p><strong>📧 Correo:</strong> ${admin.correo}</p>
                <p><strong>📱 Teléfono:</strong> ${admin.telefono}</p>
                <p><strong>🏢 Área:</strong> ${admin.area}</p>
            </div>
        </div>
    `).join('');
}

// Función para eliminar un administrativo
function deleteAdmin(id) {
    if (!isAdmin) {
        alert('❌ No tienes permisos para eliminar administrativos');
        return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este administrativo?')) {
        administrativos = administrativos.filter(admin => admin.id !== id);
        localStorage.setItem('administrativos', JSON.stringify(administrativos));
        renderDirectory();
    }
}