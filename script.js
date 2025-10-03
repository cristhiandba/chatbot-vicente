console.log("✅ script.js cargado correctamente");

// ----------------------
// Utilidades UI
// ----------------------
function addMessage(text, sender, isLast = true) {
  const messages = document.getElementById("messages");
  const parrafos = text.split(/\n+/);

  parrafos.forEach((p, index) => {
    if (p.trim() !== "") {
      let formatted = p.replace(/"([^"]+)"/g, "<b>$1</b>");
      formatted = formatted.replace(/{([^}]+)}/g, "<b>$1</b>");

      const div = document.createElement("div");
      div.className = "message " + sender;
      if (isLast && index === parrafos.length - 1) div.classList.add("last");
      div.innerHTML = formatted;

      const meta = document.createElement("div");
      meta.className = "meta";
      const now = new Date();
      const hora = now.getHours().toString().padStart(2, "0");
      const min = now.getMinutes().toString().padStart(2, "0");
      const timeSpan = document.createElement("span");
      timeSpan.textContent = `${hora}:${min}`;
      meta.appendChild(timeSpan);

      if (sender === "user") {
        const checks = document.createElement("span");
        checks.className = "checks";
        checks.textContent = "✔✔";
        meta.appendChild(checks);
      }

      div.appendChild(meta);
      messages.appendChild(div);
    }
  });

  messages.scrollTop = messages.scrollHeight;
}

function addButtons(buttons = []) {
  if (!buttons || !buttons.length) return;
  const messages = document.getElementById("messages");
  const wrapper = document.createElement("div");
  wrapper.className = "message bot last";

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.gap = "8px";

  buttons.forEach(({ label, onClick }) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.padding = "8px 12px";
    btn.style.border = "none";
    btn.style.background = "#e0e0e0";
    btn.style.cursor = "pointer";
    btn.style.borderRadius = "16px";
    btn.onclick = () => {
      addMessage(label, "user", true);
      onClick();
    };
    container.appendChild(btn);
  });

  const meta = document.createElement("div");
  meta.className = "meta";
  const now = new Date();
  const hora = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  meta.textContent = `${hora}:${min}`;

  wrapper.appendChild(container);
  wrapper.appendChild(meta);
  messages.appendChild(wrapper);
  messages.scrollTop = messages.scrollHeight;
}

function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function cerrarChat() {
  addMessage('Vicente: “Gracias por conversar conmigo 🙏. Si necesitas algo más, escribe “Hola” para volver a empezar.”', "bot", true);
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user", true);
  input.value = "";

  const t = norm(text);
  if (t === "hola" || t === "menu") {
    showMainMenu();
  } else if (t === "salir") {
    cerrarChat();
  } else {
    addMessage('😅 Perdón, no entendí tu mensaje. Usa los botonones o escribe "Hola" 👇', "bot", true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showMainMenu();
});

// ----------------------
// Menú principal y opciones
// ----------------------
function showMainMenu() {
  addMessage("¡Hola! 👋 ¿En qué puedo ayudarte hoy?", "bot", true);
  addButtons([
    { label: "1️⃣ Cuentas", onClick: showOpcion1 },
    { label: "2️⃣ Asignación de cuentas", onClick: showOpcion2 },
    { label: "3️⃣ Visitas", onClick: showOpcion3 },
    { label: "4️⃣ TOT", onClick: showOpcion4 },
    { label: "5️⃣ FCPA / DPSS", onClick: showOpcion5 },
    { label: "6️⃣ Eventos", onClick: showOpcion6 },
    { label: "7️⃣ Soporte", onClick: showOpcion7 },
  ]);
}

// ----------------------
// Opción 1: Cuentas
// ----------------------
function showOpcion1() {
  addMessage('Vicente: “Entiendo, ¿en qué tema deseas?”', "bot", true);
  addButtons([
    { label: "Altas ⬆️", onClick: showAltas },
    { label: "Bajas ⬇️", onClick: showBajas },
    { label: "Modificación de datos ✏️", onClick: showModificacion },
  ]);
}

function showAltas() {
  addMessage("\"SalesForce\": En la sección \"Mis Cuentas\", encontrarás la opción \"Nuevo\" y te dirigirá a una pestaña donde elegirás la cuenta a crear (\"HCP o HCO\")", "bot", true);
  addMessage("\"Veeva iRep\": En la sección \"Mis Cuentas\", habrá un símbolo \"➕\" en la parte superior izquierda; aparecerá una ventana en donde en el campo \"Términos de búsqueda\" deberás escribir una palabra, para que se active la opción \"Nueva Cuenta\", y comiences a crear la cuenta (\"HCP o HCO\")", "bot", true);
  addMessage("⚠️ Recuerda que debe estar toda la información correcta para que el equipo de BI lo apruebe ✅ y cumplir con las fechas de calendario 📅.", "bot", true);
  addButtons([
    { label: "Calendario 📅", onClick: () => addFileBubble("Calendario LAMEX (Versión final 2025).xlsx", "Calendario LAMEX (Versión final 2025).xlsx") },
    { label: "Menú 🔙", onClick: showMainMenu },
    { label: "Salir 🚪", onClick: cerrarChat },
  ]);
}

function showBajas() {
  addMessage("Para dar de baja una cuenta en Veeva se da en las siguientes ocasiones:", "bot", false);
  addMessage("- \"Sacarlo de tu panel\": Desmarcar la opción \"Mi Objetivo\" en la sección \"Campo Territorio\".", "bot", false);
  addMessage("- \"Inactivar la cuenta\": Se desactiva por situaciones excepcionales (⚰️ fallecimiento, ✈️ migración, etc.). Esto se realiza cambiando los campos \"Estado de la cuenta\" y \"Razón del estado de la cuenta\". ", "bot", true);
  addButtons([
    { label: "Menú 🔙", onClick: showMainMenu },
    { label: "Salir 🚪", onClick: cerrarChat },
  ]);
}

function showModificacion() {
  addMessage("Para modificar datos como \"nombre, especialidad, Medical ID, celular, email, entre otros\":", "bot", false);
  addMessage("- Usa la opción \"Editar\" dentro de la cuenta, está a lado de la opción Registrar una Visita.", "bot", false);
  addMessage("- Los campos con ícono de 🔑 requieren \"aprobación\".", "bot", true);
  addButtons([
    { label: "Menú 🔙", onClick: showMainMenu },
    { label: "Salir 🚪", onClick: cerrarChat },
  ]);
}

// ----------------------
// Opción 2: Asignación de cuentas
// ----------------------
function showOpcion2() {
  addMessage("Vicente: Genial 😃, ¿en qué tema deseas?", "bot", true);
  addButtons([
    { label: "🔍 Búsqueda de cuenta global", onClick: showBusquedaGlobal },
    { label: "📩 Asignación por BI", onClick: showAsignacionBI },
  ]);
}

function showBusquedaGlobal() {
  addMessage("La búsqueda de cuenta global te ayuda a \"agregar una cuenta desde el universo de Veeva\" de manera inmediata 🌐.", "bot", true);
  addMessage("👉 En SalesForce Lightning, dirígete al \"Cuadrado de 9 puntos\" debajo de la imagen de ORGANON. Busca \"Global Account Search Lightning\".", "bot", true);
  addMessage("🪄 Cuando estás en el buscador; escribe el nombre en \"Términos de búsqueda\" 🔍 y selecciona la cuenta para que al final presiones \"Add to territory\"-", "bot", true);
  addButtons([
    { label: "Menú 📂", onClick: showMainMenu },
    { label: "Salir ✋", onClick: cerrarChat },
  ]);
}

function showAsignacionBI() {
  addMessage("El equipo de BI puede ayudarte si tienes \"incovenientes con el buscador global\" y no encuentras la cuenta.", "bot", true);
  addMessage("📧 Envía un correo a: \"soporte_fdv_organon.com\" con el nombre 👨‍⚕️ y especialidad 🩺 del médico.", "bot", true);
  addMessage("⏳ El proceso puede \"tardar 24 horas\" desde la confirmación de BI.", "bot", true);
  addButtons([
    { label: "Menú 📂", onClick: showMainMenu },
    { label: "Salir ✋", onClick: cerrarChat },
  ]);
}

// ----------------------
// Opción 3: Visitas
// ----------------------
function showOpcion3() {
  addMessage("Maravilloso ✨, ¿qué tipo de visita quieres registrar?", "bot", true);
  addButtons([
    { label: "👨‍⚕️ HCP", onClick: showVisitaHCP },
    { label: "🏥 HCO", onClick: showVisitaHCO },
  ]);
}

function showVisitaHCP() {
  addMessage("Desde \"Veeva iRep\", en la sección \"Planificación\" 📅 podrás \"arrastrar la cuenta\" en la hora y fecha de la visita 🕒.", "bot", true);
  addMessage("Luego presiona \"Editar\" ✏️ para registrar la información según el tipo de visita 📲:", "bot", true);
  addButtons([
    { label: "1️⃣ Presencial (F2F)", onClick: () => {
      addMessage(
        "Para F2F, el tipo de registro es \"Reporte de Visita Core\" 📝:\n" +
        "- ✅ Verifica: \"dirección 📍, cuenta 👤, duración ⏱️, fecha 📆 y hora\" 🕒." +
        "👥 Si un usuario de la organización te acompañó, regístralo en el campo \"Co visita\"." +
        "💊 Asigna los productos en \"Prioridad de Detailing\"." +
        "🎥 Y si usaste CLM, añádelo en el ícono de \"Video\" en la parte superior izquierda.\n\n" +
        "- 🧪 Si la visita incluye muestra médica: El \"Motivo Muestra\" debe ser Nueva indicación. En \"Samples and Promotional Items\", agrega la muestra 🧴 registrando cantidad y producto 📦.\n" +
        "- ✍️ \"Dependiendo del país\", puede que necesites firma. En ese caso, encontrarás el ícono de \"Firma\" en la parte superior izquierda.",
        "bot",
        true
      );
      addButtons([
          { label: "Menú 📂", onClick: showMainMenu },
          { label: "Salir ✋", onClick: cerrarChat },
        ]);
      }
    },
    { label: "2️⃣ Llamada telefónica", onClick: () => {
      addMessage(
      "Para llamadas, el tipo de visita es \"Teléfono\" 📞:\n\n" +
        "- ✅ Verifica que \"dirección 📍, duración ⏱️, cuenta 👤, fecha 📆 y hora\" 🕒 estén correctas.\n" +
        "- 💊 Agrega los productos en \"Prioridad de Detailing\".",
        "bot",
        true
      );
      addButtons([
          { label: "Menú 📂", onClick: showMainMenu },
          { label: "Salir ✋", onClick: cerrarChat },
        ]);
      }  
    },
  ]);
}

function showVisitaHCO() {
  addMessage("Desde \"Veeva iRep\", en la sección \"Planificación\" 📅 podrás arrastrar la cuenta en la hora y fecha de la visita 🕒.  Luego de ello, presiona la visita 👆 y te aparecerá un recuadro donde deberás presionar \"Editar\" ✏️.", "bot", true);
  addMessage("Esto te dirigirá a una pestaña donde podrás cambiar el tipo de registro a \"Llamada de cuenta no personal\" 🏢. Luego deberás verificar: 👤 \"Cuenta ⏱️ Duración 📍 Dirección 📆 Fecha y 🕒 Hora\".", "bot", true);
  addButtons([
    { label: "Menú 📂", onClick: showMainMenu },
    { label: "Salir ✋", onClick: cerrarChat },
  ]);
}

// ----------------------
// Opción 4: TOT
// ----------------------
function showOpcion4() {
  addMessage("⏳ El tiempo fuera de territorio es cualquier actividad fuera de campo 🏞️.", "bot", true);
  addImageBubble("TOT.png", "Imagen explicativa del TOT");
  addMessage("\"SalesForce\": En la sección \"Tiempo Fuera de Territorio\" 🌍, presiona \"Nuevo\" para luego seleccionar \"Organon Approval TOT\" ✅. 📆 Registra la \"fecha, ⏱️ duración, 📌 razón y 🧾 sub motivo\". Finalmente lo guardas 💾 y podrás enviarlo a aprobación con la opción \"Submit for approval\" 📤 (lo encuestra en el ícono 🔽)", "bot", true);
  addMessage("\"Veeva iRep\": En la sección \"Planificación\" 📅, presiona el símbolo ➕ para luego seleccionar \"Organon Approval TOT\" ✅. 📆 Registra la \"fecha, ⏱️ duración, 📌 razón y 🧾 sub motivo\". Finalmente lo guardas 💾 y, en este caso, para \"enviarlo a aprobación\" debes ingresar a SalesForce; antes sincroniza la app 🔄. Dentro de la versión online 🌐, \"busca el TOT y seleccionas la opción Submit for approval\" 📤 (lo encuestra en el ícono 🔽).", "bot", true);
  addButtons([
    { label: "Menú 📂", onClick: showMainMenu },
    { label: "Salir ✋", onClick: cerrarChat },
  ]);
}

// ----------------------
// Opción 5: FCPA / DPSS
// ----------------------
function showOpcion5() {
  addMessage("🎉 ¡Genial! Estas opciones se usan cuando hay transferencia de valor 💸 o requerimientos de privacidad 🧾.", "bot", true);
  addButtons([
    { label: "📋 FCPA", onClick: showFCPA },
    { label: "📝 DPSS", onClick: showDPSS },
  ]);
}

function showFCPA() {
  addMessage("🧠 Lo encuentras en la sección \"Objetivos de cuestionario\" 📋 dentro de la cuenta del profesional 👨‍⚕️. Presionas la opción \"Nuevo objetivo de cuestionario\" , seleccionas la encuestas \"FCPA Due Dillengece\", y das click 🖱️ al botón \"Añadir objetivo de cuestionario\".", "bot", true);
  addMessage("La encuesta consta de 5 preguntas ❓ que, al contestarlas, generarán una \"categoría\" 🗂️. ⏳  Recuerda que la actualización en la cuenta es de \"24 horas\" después de la aprobación de tu gerente 👔.", "bot", true);
  addButtons([
    { label: "Menú 📂", onClick: showMainMenu },
    { label: "Salir ✋", onClick: cerrarChat },
  ]);
}

function showDPSS() {
  addMessage("🔍 En la sección de \"Información FCPA\" ℹ️ de la cuenta, deberás marcar con ✅ el campo de \"Privacy Requirements for DPSS\" 🔒. Luego, selecciona el ícono de 🔽 al costado del botón Resgistrar una Visita , para presionar \"Validate DPSS\" ✔️.", "bot", true);
  addMessage("⚡ Esta validación es al instante.  📌 Recuerda que se debe \"adjuntar el archivo de consentimiento del DPSS\" 🗂️ brindado por \"Compliance\" 🛡️ y subirlo 📤 en la sección \"Notas y archivos adjuntos\" 📎.", "bot", true);
  addButtons([
    { label: "Menú 📂", onClick: showMainMenu },
    { label: "Salir ✋", onClick: cerrarChat },
  ]);
}

// ----------------------
// Opción 6: Eventos
// ----------------------
function showOpcion6() {
  addMessage("¡Súper! 🎉 ¿Qué evento quieres registrar?", "bot", true);
  addButtons([
    { label: "🍽️ Detailing with Refreshment", onClick: () => addFileBubble("Detailing with Refreshment - Manual.pdf", "Detailing with Refreshment - Manual.pdf") },
    { label: "🏥 Patrocinios de Coffee Break", onClick: () => addFileBubble("Patrocinios de Coffee Break - Manual.pdf", "Patrocinios de Coffee Break - Manual.pdf") },
    { label: "🗣️ Reuniones locales con HCPs", onClick: () => addFileBubble("Reuniones locales con HCPs - Manual.pdf", "Reuniones locales con HCPs - Manual.pdf") },
    { label: "Menú 📂", onClick: showMainMenu },
    { label: "Salir ✋", onClick: cerrarChat },
  ]);
}

// ----------------------
// Opción 7: Soporte
// ----------------------
function showOpcion7() {
  addMessage("Para cualquier otra consulta ❓ o duda 🤔 sobre los procesos en Veeva 📲, por favor envía un correo a \"soporte_fdv_organon.com\" 📧.", "bot", true);
  addMessage("📬 Esperamos tu mensaje con gusto.", "bot", true);
  addButtons([
    { label: "Menú 📂", onClick: showMainMenu },
    { label: "Salir ✋", onClick: cerrarChat },
  ]);
}

// ----------------------
// Archivos e imágenes
// ----------------------
function addFileBubble(filename, label = null) {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = "message bot last";

  const card = document.createElement("div");
  card.style.display = "flex";
  card.style.alignItems = "center";
  card.style.gap = "10px";

  const icon = document.createElement("div");
  icon.textContent = "📄";
  icon.style.fontSize = "20px";

  const name = document.createElement("div");
  name.textContent = label ? label : filename;
  name.style.fontWeight = "bold";

  const actions = document.createElement("div");
  actions.style.marginLeft = "auto";
  actions.style.display = "flex";
  actions.style.gap = "8px";

  const dlLink = document.createElement("a");
  dlLink.textContent = "Descargar";
  dlLink.href = filename;
  dlLink.download = filename;
  dlLink.style.padding = "6px 10px";
  dlLink.style.background = "#ff9800";
  dlLink.style.color = "#fff";
  dlLink.style.textDecoration = "none";
  dlLink.style.borderRadius = "4px";

  actions.appendChild(dlLink);
  card.appendChild(icon);
  card.appendChild(name);
  card.appendChild(actions);

  const meta = document.createElement("div");
  meta.className = "meta";
  const now = new Date();
  const hora = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  meta.textContent = `${hora}:${min}`;

  div.appendChild(card);
  div.appendChild(meta);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function addImageBubble(filename, captionText) {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = "message bot last";

  const img = document.createElement("img");
  img.src = filename;
  img.alt = filename;
  img.style.maxWidth = "220px";
  img.style.borderRadius = "10px";
  img.style.cursor = "pointer";
  img.onclick = () => openModalImage(filename);

  const caption = document.createElement("div");
  caption.style.marginTop = "6px";
  caption.innerHTML = captionText.replace(/"([^"]+)"/g, "<b>$1</b>").replace(/{([^}]+)}/g, "<b>$1</b>");

  const dlLink = document.createElement("a");
  dlLink.textContent = "Descargar imagen";
  dlLink.href = filename;
  dlLink.download = filename;
  dlLink.style.display = "inline-block";
  dlLink.style.marginTop = "6px";
  dlLink.style.padding = "6px 10px";
  dlLink.style.background = "#ff9800";
  dlLink.style.color = "#fff";
  dlLink.style.textDecoration = "none";
  dlLink.style.borderRadius = "4px";

  const meta = document.createElement("div");
  meta.className = "meta";
  const now = new Date();
  const hora = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  meta.textContent = `${hora}:${min}`;

  div.appendChild(img);
  div.appendChild(caption);
  div.appendChild(dlLink);
  div.appendChild(meta);

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function openModalImage(filename) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.9)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const img = document.createElement("img");
  img.src = filename;
  img.style.maxWidth = "90%";
  img.style.maxHeight = "90%";
  img.style.borderRadius = "10px";
  img.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Volver al chat";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "20px";
  closeBtn.style.right = "20px";
  closeBtn.style.padding = "8px 12px";
  closeBtn.style.background = "#ff9800";
  closeBtn.style.color = "#fff";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = () => document.body.removeChild(overlay);

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
}
