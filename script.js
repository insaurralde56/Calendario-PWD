const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Función para determinar si un año es bisiesto
function esBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
}

// Función auxiliar para formatear la fecha
function formatDate(day, month, year) {
  return `${day.toString().padStart(2, '0')}-${(month + 1).toString().padStart(2, '0')}`;
}

// Función para obtener la fecha completa con año
function formatFullDate(day, month, year) {
  return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Lista completa de feriados argentinos
const holidays = [
  // Feriados fijos
  { date: "01-01", name: "Año Nuevo" },
  { date: "24-03", name: "Día Nacional de la Memoria por la Verdad y la Justicia" },
  { date: "02-04", name: "Día del Veterano y de los Caídos en la Guerra de Malvinas" },
  { date: "01-05", name: "Día del Trabajador" },
  { date: "25-05", name: "Día de la Revolución de Mayo" },
  { date: "20-06", name: "Día de la Bandera" },
  { date: "09-07", name: "Día de la Independencia" },
  { date: "17-08", name: "Paso a la Inmortalidad del Gral. José de San Martín" },
  { date: "12-10", name: "Día del Respeto a la Diversidad Cultural" },
  { date: "20-11", name: "Día de la Soberanía Nacional" },
  { date: "08-12", name: "Día de la Inmaculada Concepción de María" },
  { date: "25-12", name: "Navidad" },
  
  // Feriados de 2025 (fechas variables como Carnaval, Semana Santa, etc.)
  { date: "03-03", name: "Carnaval", year: 2025 },
  { date: "04-03", name: "Carnaval", year: 2025 },
  { date: "18-04", name: "Viernes Santo", year: 2025 },
  { date: "19-06", name: "Corpus Christi", year: 2025 },
  
  // Feriados puente turístico 2025 (ejemplos)
  { date: "02-05", name: "Feriado Puente Turístico", year: 2025 },
  { date: "21-11", name: "Feriado Puente Turístico", year: 2025 }
];

const datesContainer = document.getElementById("dates");
const currentMonthElement = document.getElementById("month");
const currentYearElement = document.getElementById("year");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Función para cargar la animación inicial
function initAnimation() {
  const calendar = document.querySelector('.calendar');
  const events = document.querySelector('.events');
  
  calendar.style.opacity = '0';
  events.style.opacity = '0';
  
  setTimeout(() => {
    calendar.style.transition = 'opacity 0.8s ease-in-out';
    calendar.style.opacity = '1';
  }, 300);
  
  setTimeout(() => {
    events.style.transition = 'opacity 0.8s ease-in-out';
    events.style.opacity = '1';
  }, 600);
}

function loadCalendar(month = currentMonth, year = currentYear) {
  datesContainer.innerHTML = "";
  currentMonthElement.textContent = monthNames[month];
  currentYearElement.textContent = year;

  // Obtener el día de la semana del primer día del mes
  const firstDay = new Date(year, month, 1).getDay();
  
  // Calcular la cantidad total de días del mes
  let totalDays;
  if (month === 1) { // Febrero
    totalDays = esBisiesto(year) ? 29 : 28;
  } else {
    totalDays = new Date(year, month + 1, 0).getDate();
  }

  // Panel de eventos: mostrar todos los días que tengan feriado o evento
  const eventList = document.getElementById("event-list");
  eventList.innerHTML = "";
  
  for (let day = 1; day <= totalDays; day++) {
    const dateKey = formatDate(day, month); // Formato DD-MM para comparar con holidays
    const fullDateKey = formatFullDate(day, month, year); // Formato YYYY-MM-DD para localStorage
    
    // Filtrar feriados para este año específico o feriados sin año (recurrentes)
    const holiday = holidays.find(h => h.date === dateKey && (!h.year || h.year === year));
    const event = localStorage.getItem(fullDateKey);
    
    // Si no hay feriado ni evento, se salta este día
    if (!holiday && !event) continue;
    
    const eventElement = document.createElement("div");
    eventElement.classList.add("event-item");
    
    if (holiday) {
      eventElement.classList.add("holiday");
    }
    
    let itemHTML = `<span>${day} de ${monthNames[month]}, ${year} - `;
    if (holiday) {
      itemHTML += `<strong>${holiday.name}</strong>`;
    } else if (event) {
      itemHTML += event;
    }
    itemHTML += `</span>`;
    
    // Botón de eliminación según corresponda
    if (event) { // Solo permitir eliminar eventos personales, no feriados
      itemHTML += `<button class="delete-event" onclick="deleteEvent('${fullDateKey}')">✕</button>`;
    }
    
    eventElement.innerHTML = itemHTML;
    eventList.appendChild(eventElement);
  }

  // Agregar celdas vacías para alinear el primer día en el calendario
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    datesContainer.appendChild(emptyCell);
  }

  // Recorrer cada día del mes para mostrarlo en el calendario
  for (let day = 1; day <= totalDays; day++) {
    const dateKey = formatDate(day, month); // Formato DD-MM para comparar con holidays
    const fullDateKey = formatFullDate(day, month, year); // Formato YYYY-MM-DD para localStorage
    
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    dayElement.textContent = day;

    const currentDate = new Date(year, month, day);
    const today = new Date();

    // Día actual
    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayElement.classList.add("today");
    }

    // Fines de semana (sábado: 6 o domingo: 0)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dayElement.classList.add("weekend");
    }

    // Festivo - filtrar para este año específico o feriados sin año (recurrentes)
    const holiday = holidays.find(h => h.date === dateKey && (!h.year || h.year === year));
    if (holiday) {
      dayElement.classList.add("holiday");
      dayElement.title = holiday.name;
    }

    // Evento guardado en localStorage
    const event = localStorage.getItem(fullDateKey);
    if (event) {
      dayElement.classList.add("event");
      // Si ya es festivo, no sobrescribir el título
      if (!holiday) {
        dayElement.title = event;
      } else {
        dayElement.title = `${holiday.name} | ${event}`;
      }
    }

    dayElement.addEventListener("click", () => addEvent(fullDateKey, day, month, year));
    datesContainer.appendChild(dayElement);
  }
}

function addEvent(date, day, month, year) {
  // Comprobar si este día ya tiene un feriado
  const dateKey = formatDate(day, month);
  const holiday = holidays.find(h => h.date === dateKey && (!h.year || h.year === year));
  
  let holidayInfo = "";
  if (holiday) {
    holidayInfo = `\n\nEste día es feriado: ${holiday.name}`;
  }
  
  const eventTitle = prompt(`Ingrese el nombre del evento para el día ${day} de ${monthNames[month]}:${holidayInfo}`);
  if (eventTitle) {
    localStorage.setItem(date, eventTitle);
    loadCalendar(currentMonth, currentYear);
  }
}

function deleteEvent(date) {
  if (confirm("¿Seguro que deseas eliminar este evento?")) {
    localStorage.removeItem(date);
    loadCalendar(currentMonth, currentYear);
  }
}

// Función para añadir efectos visuales durante la navegación entre meses
function transitionEffect() {
  datesContainer.style.opacity = '0';
  setTimeout(() => {
    loadCalendar(currentMonth, currentYear);
    setTimeout(() => {
      datesContainer.style.transition = 'opacity 0.5s ease';
      datesContainer.style.opacity = '1';
    }, 50);
  }, 300);
}

prevMonthButton.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  transitionEffect();
});

nextMonthButton.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  transitionEffect();
});

datesContainer.style.transition = 'opacity 0.5s ease';
initAnimation();
loadCalendar();