// ----------------------------------------------------------------------
// IMPORTACIÓN DE SUPABASE (MODULAR SDK via CDN)
// ----------------------------------------------------------------------
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Configuración de tu aplicación Supabase
const supabaseUrl = "https://bsbcedwcugqyposauepc.supabase.co";
const supabaseKey = "sb_publishable_bqp6dLNfk5va_FAiarC-vw_e9pahy06";

// Inicializar el cliente global de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Base de datos de 48 selecciones clasificadas para el mundial 2026
const countries = [
    { name: "Alemania", code: "de" }, { name: "Arabia Saudita", code: "sa" }, { name: "Argelia", code: "dz" },
    { name: "Argentina", code: "ar" }, { name: "Australia", code: "au" }, { name: "Austria", code: "at" },
    { name: "Bélgica", code: "be" }, { name: "Bosnia y Herzegovina", code: "ba" }, { name: "Brasil", code: "br" },
    { name: "Cabo Verde", code: "cv" }, { name: "Canadá", code: "ca" }, { name: "Catar", code: "qa" },
    { name: "Colombia", code: "co" }, { name: "Corea del Sur", code: "kr" }, { name: "Costa de Marfil", code: "ci" },
    { name: "Croacia", code: "hr" }, { name: "Curazao", code: "cw" }, { name: "Ecuador", code: "ec" },
    { name: "Egipto", code: "eg" }, { name: "Irak", code: "iq" }, { name: "Escocia", code: "gb-sct" },
    { name: "España", code: "es" }, { name: "Estados Unidos", code: "us" }, { name: "Francia", code: "fr" },
    { name: "Ghana", code: "gh" }, { name: "Haití", code: "ht" }, { name: "Inglaterra", code: "gb-eng" },
    { name: "Irán", code: "ir" }, { name: "Japón", code: "jp" }, { name: "Jordania", code: "jo" },
    { name: "Marruecos", code: "ma" }, { name: "México", code: "mx" }, { name: "Noruega", code: "no" },
    { name: "Nueva Zelanda", code: "nz" }, { name: "Países Bajos", code: "nl" }, { name: "Panamá", code: "pa" },
    { name: "Paraguay", code: "py" }, { name: "Portugal", code: "pt" }, { name: "República Checa", code: "cz" },
    { name: "República Democrática del Congo", code: "cd" }, { name: "Senegal", code: "sn" }, { name: "Suecia", code: "se" },
    { name: "Suiza", code: "ch" }, { name: "Sudáfrica", code: "za" }, { name: "Túnez", code: "tn" },
    { name: "Turquía", code: "tr" }, { name: "Uruguay", code: "uy" }, { name: "Uzbekistán", code: "uz" }
].sort((a, b) => a.name.localeCompare(b.name));

// Configuración de los 5 países especiales y sus videos correspondientes
const specialVideos = {
    "Ecuador": { video: "luk_0x - 7650700291997846802.mp4", quote: "¡El Alma Tricolor! 18 millones de corazones empujando hacia el campeonato." },
    "Japón": { video: "0613(1).mp4", quote: "¡Los Samuráis Azules! Disciplina orientada al trono mundial." },
    "Francia": { video: "-France X 180db_[130]-.mp4", quote: "¡Les Bleus! Elegancia, velocidad y jerarquía europea." },
    "Brasil": { video: "copa do mundo começou.mp4", quote: "¡La Canarinha! El Jogo Bonito busca revivir su mística dorada." },
    "Portugal": { video: "El Comandante.mp4", quote: "¡La Selección das Quinas! Talento de élite listo para conquistar el mundo." }
};

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // MENU RESPONSIVE
    // ----------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('open');
        });
    }

    // ----------------------------------------------------------------------
    // PAGINA DE REGISTRO
    // ----------------------------------------------------------------------
    const countriesGrid = document.getElementById('countries-grid');
    if (countriesGrid) {
        // Renderizar parrilla de 48 banderas
        countries.forEach(country => {
            const card = document.createElement('div');
            card.className = 'country-card';
            card.dataset.name = country.name;
            card.innerHTML = `
                <img src="https://flagcdn.com/w160/${country.code}.png" alt="${country.name}" loading="lazy">
                <p>${country.name}</p>
            `;
            card.addEventListener('click', () => selectChampion(country.name, card));
            countriesGrid.appendChild(card);
        });

        // Buscador interno de países
        const searchInput = document.getElementById('country-search');
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            document.querySelectorAll('.country-card').forEach(card => {
                const name = card.dataset.name.toLowerCase();
                card.style.display = name.includes(query) ? 'block' : 'none';
            });
        });

        // Envío de Formulario Completo a Supabase
        const form = document.getElementById('prediction-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userName = document.getElementById('user-name').value.trim();
            const champion = document.getElementById('selected-champion').value;

            if (!userName) {
                alert("Por favor, escribe tu nombre antes de registrar el pronóstico.");
                return;
            }

            if (!champion) {
                alert("Por favor, selecciona a tu campeón mundial en el panel de banderas.");
                return;
            }

            const getScore = (id) => {
                const input = document.getElementById(id);
                return input && input.value !== '' ? Number(input.value) : 0;
            };

            // Recopilar marcadores de los partidos de Ecuador
            const match1 = {
                ecu: getScore('score-ecu-m1'),
                rival: getScore('score-rival-m1')
            };
            const match3 = {
                ecu: getScore('score-ecu-m3'),
                rival: getScore('score-rival-m3')
            };

            const prediction = {
                user_name: userName,
                champion: champion,
                scores: { m1: match1, m3: match3 }
            };

            // Insertar datos en Supabase usando async/await
            const { error } = await supabase
                .from('quinielas')
                .insert([prediction]);

            if (!error) {
                window.location.href = 'predicciones.html';
            } else {
                console.error("Error al guardar en Supabase: ", error);
                alert("Ocurrió un error al guardar tu pronóstico en la base de datos global.");
            }
        });
    }

    function selectChampion(name, element) {
        document.querySelectorAll('.country-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
        document.getElementById('selected-champion').value = name;
        document.getElementById('selection-indicator').textContent = name;

        if (specialVideos[name]) {
            openModal(name);
        }
    }

    // Eventos y lógicas para la ventana emergente
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        window.addEventListener('click', (e) => { if (e.target === videoModal) closeModal(); });
    }

    function openModal(name) {
        const countryObj = countries.find(c => c.name === name);
        if (!countryObj || !specialVideos[name]) return;

        document.getElementById('modal-team-name').textContent = `¿${name} Campeón?`;
        document.getElementById('modal-team-flag').src = `https://flagcdn.com/w80/${countryObj.code}.png`;
        document.getElementById('modal-iframe').src = `./${encodeURI(specialVideos[name].video)}`;
        document.getElementById('modal-team-quote').textContent = specialVideos[name].quote;
        videoModal.classList.add('active');
    }

    function closeModal() {
        document.getElementById('modal-iframe').src = "";
        videoModal.classList.remove('active');
    }

    // ----------------------------------------------------------------------
    // PAGINA DE PREDICCIONES (TABLA MUNDIALISTA ASÍNCRONA)
    // ----------------------------------------------------------------------
    const tableBody = document.getElementById('predictions-table-body');
    if (tableBody) {
        renderTable();

        // Filtro de búsqueda en la tabla
        const filterInput = document.getElementById('predictions-filter');
        filterInput.addEventListener('input', () => {
            const query = filterInput.value.toLowerCase();
            document.querySelectorAll('#predictions-table-body tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
        });
    }

    async function renderTable() {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        
        // Hacer la consulta asíncrona a Supabase ordenada por fecha de creación descendente
        const { data: quinielas, error } = await supabase
            .from('quinielas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error al obtener datos de Supabase: ", error);
            tableBody.innerHTML = `<tr><td colspan="4"><p style="text-align:center; padding: 20px; color: var(--ecu-red);">Error al cargar las predicciones de la comunidad.</p></td></tr>`;
            return;
        }

        if (!quinielas || quinielas.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><i class="fa-solid fa-users-slash" style="font-size:2.5rem;margin-bottom:10px;"></i><p>Nadie ha registrado sus predicciones todavía.</p></div></td></tr>`;
            return;
        }

        quinielas.forEach((item) => {
            const championObj = countries.find(c => c.name === item.champion);
            const championFlag = championObj ? `https://flagcdn.com/w40/${championObj.code}.png` : '';
            
            const s = item.scores || { m1: {ecu:0, rival:0}, m3: {ecu:0, rival:0} };

            const row = document.createElement('tr');
            const displayDate = item.created_at
                ? new Date(item.created_at).toLocaleString('es-EC')
                : (item.date || '');

            row.innerHTML = `
                <td class="table-user-name">${item.user_name}</td>
                <td>
                    <div class="table-matches-column">
                        <div class="table-mini-match">
                            <img src="https://flagcdn.com/w20/ec.png" alt="ECU">
                            <span>ECU</span>
                            <span class="score-badge">${s.m1.ecu}</span>
                            <span>-</span>
                            <span class="score-badge">${s.m1.rival}</span>
                            <span>ALE</span>
                            <img src="https://flagcdn.com/w20/de.png" alt="ALE">
                        </div>
                        <div class="table-mini-match">
                            <img src="https://flagcdn.com/w20/ec.png" alt="ECU">
                            <span>ECU</span>
                            <span class="score-badge">${s.m3.ecu}</span>
                            <span>-</span>
                            <span class="score-badge">${s.m3.rival}</span>
                            <span>CUW</span>
                            <img src="https://flagcdn.com/w20/cw.png" alt="CUW">
                        </div>
                    </div>
                </td>
                <td>
                    <div class="table-champion-cell">
                        <img src="${championFlag}" alt="${item.champion}">
                        <span>${item.champion}</span>
                    </div>
                </td>
                <td style="color:var(--text-muted); font-size:0.9rem;">${displayDate}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});