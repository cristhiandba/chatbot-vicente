console.log("✅ script.js cargado correctamente");

let aliasList = [];
let nicknameMap = {}; // Mapeo de alias normalizado a objeto {Name, Alias}
let accessGranted = false;
let userName = ""; // Nombre del usuario autenticado

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
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function cerrarChat() {
  addMessage('Gracias por conversar conmigo 🙏. Si necesitas algo más, escribe “Hola” para volver a empezar.', "bot", true);
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  // Si no hay acceso, validar el nickname
  if (!accessGranted) {
    const normalizedText = norm(text);
    
    console.log("🔍 Validando nickname:");
    console.log("  - Texto ingresado:", text);
    console.log("  - Texto normalizado:", normalizedText);
    console.log("  - Tamaño del mapeo:", Object.keys(nicknameMap).length);
    console.log("  - ¿Existe en mapeo?:", normalizedText in nicknameMap);
    console.log("  - Datos encontrados:", nicknameMap[normalizedText]);
    console.log("  - Mapeo completo (primeros 10):", Object.keys(nicknameMap).slice(0, 10));

    addMessage(text, "user", true);
    input.value = "";

    // Verificar si el mapeo está vacío (JSON no se cargó)
    if (Object.keys(nicknameMap).length === 0) {
      console.error("❌ El mapeo de nicknames está vacío. El JSON no se cargó correctamente.");
      addMessage("⚠️ Error: La base de datos de usuarios no se cargó. Por favor, recarga la página o verifica que el archivo nicknames.json esté disponible.", "bot", true);
      return;
    }

    // Verificar directamente en el mapeo (más confiable que la lista)
    const userData = nicknameMap[normalizedText];
    if (userData && userData.Name) {
      console.log("✅ Acceso concedido para:", userData.Name);
      userName = userData.Name;
      accessGranted = true;
      showMainMenu();
    } else {
      console.log("❌ Nickname no encontrado");
      addMessage('❌ Nickname incorrecto, introduzca uno válido para continuar.', "bot", true);
    }
    return;
  }

  // Si ya hay acceso, procesar mensajes normalmente
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


// Agregar event listener para Enter en el input
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
  
  // Cargar datos de nicknames directamente (incrustados para evitar problemas de CORS)
  try {
    // Datos incrustados del nicknames.json
    const nicknamesData = [
      { "Name": "Abigail", "Alias": "hernabig" }, { "Name": "Abigail", "Alias": "rodriabi" }, { "Name": "Absalon", "Alias": "quirozab" },
      { "Name": "Ada", "Alias": "moriad" }, { "Name": "Adam", "Alias": "siiulesc" }, { "Name": "Adriana", "Alias": "gaadria2" },
      { "Name": "Adriana", "Alias": "itzelgon" }, { "Name": "Adriana", "Alias": "guerra" }, { "Name": "Adriana", "Alias": "vazadria" },
      { "Name": "Adriana", "Alias": "quezada" }, { "Name": "Adriana", "Alias": "valencad" }, { "Name": "Adriana", "Alias": "anguloca" },
      { "Name": "Alberto", "Alias": "abeltran" }, { "Name": "Alberto", "Alias": "vido" }, { "Name": "Alejandra", "Alias": "aargueta" },
      { "Name": "Alejandra", "Alias": "caldeale" }, { "Name": "Alejandra", "Alias": "amondrag" }, { "Name": "Alejandra", "Alias": "agomez9" },
      { "Name": "Alejandra", "Alias": "gualeja2" }, { "Name": "Alejandra", "Alias": "gilale" }, { "Name": "Alejandro", "Alias": "schotza" },
      { "Name": "Alejo", "Alias": "marcozza" }, { "Name": "Alexis", "Alias": "gutalexi" }, { "Name": "Alina", "Alias": "bustaali" },
      { "Name": "Alisson", "Alias": "arteaali" }, { "Name": "Alma", "Alias": "brisenoa" }, { "Name": "Alma", "Alias": "luciaalm" },
      { "Name": "Alonso", "Alias": "ortizalo" }, { "Name": "Amilcar", "Alias": "adeleonl" }, { "Name": "Ana", "Alias": "huacuja" },
      { "Name": "Ana", "Alias": "domreze" }, { "Name": "ANA", "Alias": "valenana" }, { "Name": "Ana", "Alias": "francoan" },
      { "Name": "Ana", "Alias": "gomezana" }, { "Name": "Ana", "Alias": "acampos8" }, { "Name": "Ana", "Alias": "ortegan3" },
      { "Name": "Ana", "Alias": "crukarim" }, { "Name": "Ana", "Alias": "riosfran" }, { "Name": "ANA", "Alias": "leivaan" },
      { "Name": "Ana", "Alias": "maanalil" }, { "Name": "Anderson", "Alias": "foreroan" }, { "Name": "ANDREA", "Alias": "cabreand" },
      { "Name": "Andrea", "Alias": "agarcesr" }, { "Name": "Andrea", "Alias": "huerta" }, { "Name": "Andrea", "Alias": "jiandre2" },
      { "Name": "Andres", "Alias": "bernaand" }, { "Name": "Andrés", "Alias": "canoandr" }, { "Name": "Andres", "Alias": "aherrer6" },
      { "Name": "Andres", "Alias": "juradoor" }, { "Name": "Ane", "Alias": "mezaolme" }, { "Name": "Angela", "Alias": "beangela" },
      { "Name": "ANGELA", "Alias": "jiangela" }, { "Name": "Angela", "Alias": "elizaban" }, { "Name": "Angelica", "Alias": "gaange11" },
      { "Name": "Angélica", "Alias": "vasquang" }, { "Name": "Antonio", "Alias": "amoral18" }, { "Name": "Antonio", "Alias": "munozant" },
      { "Name": "Araceli", "Alias": "asalaza4" }, { "Name": "Arantza", "Alias": "pelaez" }, { "Name": "Ariadna", "Alias": "goariadn" },
      { "Name": "Armando", "Alias": "perezarm" }, { "Name": "Asha", "Alias": "kumaash3" }, { "Name": "ASHLEI", "Alias": "sancheas" },
      { "Name": "Astrid", "Alias": "moraleas" }, { "Name": "Astrid", "Alias": "francast" }, { "Name": "Atali", "Alias": "jimeneat" },
      { "Name": "Atenas", "Alias": "hernaate" }, { "Name": "Avilash", "Alias": "sharavil" }, { "Name": "AZAREEL", "Alias": "cuellaaz" },
      { "Name": "Azucena", "Alias": "huertaa" }, { "Name": "Azucena", "Alias": "ramosaz" }, { "Name": "Barbara", "Alias": "verdugba" },
      { "Name": "Bayron", "Alias": "agueerba" }, { "Name": "BELEM", "Alias": "penabe" }, { "Name": "Belen", "Alias": "estevbel" },
      { "Name": "Benjamín", "Alias": "alonsosu" }, { "Name": "Benjamin", "Alias": "vegacoli" }, { "Name": "Berenice", "Alias": "arandab" },
      { "Name": "BERNARDO", "Alias": "ramibern" }, { "Name": "Bertha", "Alias": "maringoa" }, { "Name": "Blanca", "Alias": "bguevara" },
      { "Name": "BLANCA", "Alias": "bgastelu" }, { "Name": "Blanca", "Alias": "olivosb" }, { "Name": "Bonifacia", "Alias": "aguilerb" },
      { "Name": "Brandon", "Alias": "pina" }, { "Name": "Brayan", "Alias": "perebray" }, { "Name": "Brenda", "Alias": "altamirb" },
      { "Name": "Brenda", "Alias": "mattalon" }, { "Name": "Brenda", "Alias": "vargabre" }, { "Name": "Bruno", "Alias": "alvebrun" },
      { "Name": "Bulmaro", "Alias": "serranbu" }, { "Name": "Camila", "Alias": "campocam" }, { "Name": "Camila", "Alias": "quincami" },
      { "Name": "Camila", "Alias": "ramocami" }, { "Name": "Camilo", "Alias": "arevalca" }, { "Name": "CARLA", "Alias": "jaen" },
      { "Name": "Carla", "Alias": "paredes" }, { "Name": "Carlos", "Alias": "alcarl16" }, { "Name": "Carlos", "Alias": "espinoca" },
      { "Name": "Carlos", "Alias": "cbadalot" }, { "Name": "Carlos", "Alias": "casallas" }, { "Name": "Carlos", "Alias": "chaparca" },
      { "Name": "Carlos", "Alias": "colinc" }, { "Name": "Carlos", "Alias": "damil" }, { "Name": "Carlos", "Alias": "graniel" },
      { "Name": "Carlos", "Alias": "leyvaca" }, { "Name": "Carlos", "Alias": "munoz" }, { "Name": "Carlos", "Alias": "vallejot" },
      { "Name": "Carlos", "Alias": "vivarc" }, { "Name": "Carolina", "Alias": "albores" }, { "Name": "Carolina", "Alias": "aristcar" },
      { "Name": "Carolina", "Alias": "moyacar" }, { "Name": "Carolina", "Alias": "torres" }, { "Name": "Catalina", "Alias": "calvcata" },
      { "Name": "Catalina", "Alias": "chavez" }, { "Name": "Cecilia", "Alias": "carteag2" }, { "Name": "Cecilia", "Alias": "garciac" },
      { "Name": "Cecilia", "Alias": "corta" }, { "Name": "Celia", "Alias": "jimenece" }, { "Name": "César", "Alias": "garamend" },
      { "Name": "Cesar", "Alias": "goncesa4" }, { "Name": "Cesar", "Alias": "navace" }, { "Name": "Cesar", "Alias": "ponceces" },
      { "Name": "Cesar", "Alias": "csalas2" }, { "Name": "Christopher", "Alias": "carvajch" }, { "Name": "Cindy", "Alias": "tenoriob" },
      { "Name": "Cinthya", "Alias": "locinthy" }, { "Name": "Cintia", "Alias": "mariarod" }, { "Name": "Claudia", "Alias": "uribarri" },
      { "Name": "Claudia", "Alias": "arrout" }, { "Name": "Claudia", "Alias": "marti" }, { "Name": "Claudia", "Alias": "suarezc" },
      { "Name": "Claudia", "Alias": "cmarino5" }, { "Name": "Claudia", "Alias": "rodrigue" }, { "Name": "Claudia", "Alias": "jimenecl" },
      { "Name": "Claudio", "Alias": "cortecla" }, { "Name": "Corrie", "Alias": "bryacorr" }, { "Name": "Cristhian", "Alias": "astoc" },
      { "Name": "Cristian", "Alias": "villegcr" }, { "Name": "Cristian", "Alias": "montcris" }, { "Name": "Daiana", "Alias": "silaghid" },
      { "Name": "Daneli", "Alias": "dmunoz2" }, { "Name": "Daniel", "Alias": "dnunez" }, { "Name": "Daniel", "Alias": "aldanie8" },
      { "Name": "Daniel", "Alias": "aviladan" }, { "Name": "Daniel", "Alias": "rodani36" }, { "Name": "Daniela", "Alias": "dsiuvazq" },
      { "Name": "Daniela", "Alias": "aldanie2" }, { "Name": "Daniela", "Alias": "chinchda" }, { "Name": "Daniela", "Alias": "rodani37" },
      { "Name": "Daniela", "Alias": "hedani10" }, { "Name": "Daniela", "Alias": "nadanie3" }, { "Name": "Daniela", "Alias": "zaragozd" },
      { "Name": "Dany", "Alias": "rea" }, { "Name": "David", "Alias": "santos" }, { "Name": "David", "Alias": "godavidr" },
      { "Name": "David", "Alias": "ramdavi5" }, { "Name": "Dayana", "Alias": "ledezmad" }, { "Name": "Debabrata", "Alias": "jenade" },
      { "Name": "Débora", "Alias": "dansker" }, { "Name": "Denise", "Alias": "vegaden" }, { "Name": "Diana", "Alias": "quimbayd" },
      { "Name": "Diana", "Alias": "mejidian" }, { "Name": "Diana", "Alias": "mezadi" }, { "Name": "Diana", "Alias": "matallad" },
      { "Name": "Diana", "Alias": "roadi" }, { "Name": "Diego", "Alias": "lamaagui" }, { "Name": "Diego", "Alias": "alvdieg2" },
      { "Name": "Diego", "Alias": "rosentdi" }, { "Name": "Dilan", "Alias": "lagunas" }, { "Name": "Dolores", "Alias": "cassinid" },
      { "Name": "Dolores", "Alias": "lopezdol" }, { "Name": "Dora", "Alias": "cruzrodr" }, { "Name": "Dulce", "Alias": "mendozdu" },
      { "Name": "Edgar", "Alias": "perezbee" }, { "Name": "Edith", "Alias": "benavied" }, { "Name": "Edna", "Alias": "emedrano" },
      { "Name": "Edson", "Alias": "maldedso" }, { "Name": "Eduardo", "Alias": "corteedu" }, { "Name": "Eduardo", "Alias": "vegaedua" },
      { "Name": "Eduardo", "Alias": "navaed" }, { "Name": "Edwin", "Alias": "chaveedw" }, { "Name": "Edwyn", "Alias": "hernedwy" },
      { "Name": "Elena", "Alias": "villael" }, { "Name": "Elizabeth", "Alias": "angulo" }, { "Name": "Elsa", "Alias": "ealmeida" },
      { "Name": "Emilio", "Alias": "saemilio" }, { "Name": "EMMANUEL", "Alias": "echaize" }, { "Name": "Emmanuel", "Alias": "egonza24" },
      { "Name": "Emmanuel", "Alias": "rosasem" }, { "Name": "Enrique", "Alias": "etorresp" }, { "Name": "Enrique", "Alias": "resendie" },
      { "Name": "Eric", "Alias": "aburtoe" }, { "Name": "Eric", "Alias": "ojedaer" }, { "Name": "Erick", "Alias": "barajaer" },
      { "Name": "Erick", "Alias": "palomier" }, { "Name": "Erika", "Alias": "aguerik2" }, { "Name": "Erika", "Alias": "rogel" },
      { "Name": "Erika", "Alias": "peterfy" }, { "Name": "Ernesto", "Alias": "carrione" }, { "Name": "Ernesto", "Alias": "delcarer" },
      { "Name": "ESMERALDA", "Alias": "arangoe" }, { "Name": "Esther", "Alias": "goesthe2" }, { "Name": "Estibeyesbo", "Alias": "plasesai" },
      { "Name": "Eva", "Alias": "fajardev" }, { "Name": "Evelyn", "Alias": "diazev" }, { "Name": "Evelyn", "Alias": "gaonaev" },
      { "Name": "Fabián", "Alias": "gonzfabi" }, { "Name": "Fabián", "Alias": "munozfab" }, { "Name": "Fabiana", "Alias": "romanif" },
      { "Name": "Fabiola", "Alias": "gafabiol" }, { "Name": "Facundo", "Alias": "mezafa" }, { "Name": "Fanny", "Alias": "piconmej" },
      { "Name": "Farydhe", "Alias": "miranda" }, { "Name": "Fátima", "Alias": "changfat" }, { "Name": "Fátima", "Alias": "molinfat" },
      { "Name": "Felipa", "Alias": "camacho4" }, { "Name": "Fernanda", "Alias": "rojas" }, { "Name": "Fernanda", "Alias": "sanucci" },
      { "Name": "Fernando", "Alias": "faltube" }, { "Name": "Fernando", "Alias": "dallasen" }, { "Name": "Fernando", "Alias": "fmendoz2" },
      { "Name": "Fidel", "Alias": "fguzman" }, { "Name": "Flor", "Alias": "fnunez4" }, { "Name": "Francisca", "Alias": "santibaf" },
      { "Name": "Francisco", "Alias": "fbonetju" }, { "Name": "Francisco", "Alias": "coronaf" }, { "Name": "FRANCISCO", "Alias": "crfranc3" },
      { "Name": "Francisco", "Alias": "loyda" }, { "Name": "FRANCISCO", "Alias": "adrianal" }, { "Name": "Francisco", "Alias": "tofranci" },
      { "Name": "Frida", "Alias": "gonzalef" }, { "Name": "Gabriel", "Alias": "sotogil" }, { "Name": "Gabriel", "Alias": "gsuviasr" },
      { "Name": "Gabriela", "Alias": "bardasu" }, { "Name": "Gabriela", "Alias": "logegara" }, { "Name": "Gabriela", "Alias": "pinaga" },
      { "Name": "Gabriela", "Alias": "rodrgabr" }, { "Name": "Galo", "Alias": "floresg" }, { "Name": "Gaston", "Alias": "gpujalt" },
      { "Name": "Gaurav", "Alias": "agagaura" }, { "Name": "Georgina", "Alias": "gomegeor" }, { "Name": "Geraldina", "Alias": "morggera" },
      { "Name": "Gibran", "Alias": "vivancgi" }, { "Name": "Gisela", "Alias": "fridmang" }, { "Name": "Gloria", "Alias": "gagloria" },
      { "Name": "Gloria", "Alias": "gjarami2" }, { "Name": "Gonzalo", "Alias": "ignacios" }, { "Name": "Graciela", "Alias": "galvarad" },
      { "Name": "Graciela", "Alias": "galindgr" }, { "Name": "Guadalupe", "Alias": "ggarcia5" }, { "Name": "Guillermo", "Alias": "gabregu" },
      { "Name": "Gustavo", "Alias": "jimegust" }, { "Name": "Hector", "Alias": "gomezanh" }, { "Name": "Héctor", "Alias": "romero" },
      { "Name": "Hernan", "Alias": "aldaxhe" }, { "Name": "HIVE", "Alias": "hiveltm" }, { "Name": "Horacio", "Alias": "cordovah" },
      { "Name": "Hugo", "Alias": "garcihug" }, { "Name": "Ignacio", "Alias": "villavii" }, { "Name": "Imilce", "Alias": "saenzjim" },
      { "Name": "Indira", "Alias": "porfirii" }, { "Name": "Indira", "Alias": "duranin" }, { "Name": "Irielys", "Alias": "madridi" },
      { "Name": "Irma", "Alias": "ramirezi" }, { "Name": "Irving", "Alias": "medinair" }, { "Name": "Irving", "Alias": "sanchirv" },
      { "Name": "Isaac", "Alias": "lermai" }, { "Name": "Ismael", "Alias": "archiboi" }, { "Name": "Isolda", "Alias": "ienrique" },
      { "Name": "Israel", "Alias": "igarciac" }, { "Name": "Israel", "Alias": "meza" }, { "Name": "Israel", "Alias": "rosas" },
      { "Name": "Israel", "Alias": "velasisr" }, { "Name": "Italo", "Alias": "duertohe" }, { "Name": "Itze", "Alias": "jimeneit" },
      { "Name": "Itzel", "Alias": "morales" }, { "Name": "Ivan", "Alias": "aguiriva" }, { "Name": "Iván", "Alias": "cazaresd" },
      { "Name": "Iván", "Alias": "rangel" }, { "Name": "Ivan", "Alias": "ortegai" }, { "Name": "Jacob", "Alias": "jacobabr" },
      { "Name": "JACOB", "Alias": "florejac" }, { "Name": "Jacobo", "Alias": "jgonza33" }, { "Name": "Jaime", "Alias": "lrodri23" },
      { "Name": "Janeth", "Alias": "alducin" }, { "Name": "Jaqueline", "Alias": "castjaqu" }, { "Name": "Jasmín", "Alias": "morajasm" },
      { "Name": "Jason", "Alias": "jseet" }, { "Name": "Javier", "Alias": "aguiljav" }, { "Name": "Javier", "Alias": "reyesj" },
      { "Name": "Javiera", "Alias": "vasquezj" }, { "Name": "Jean", "Alias": "lostauje" }, { "Name": "Jehu", "Alias": "martijeh" },
      { "Name": "Jeisson", "Alias": "burgosje" }, { "Name": "Jenifer", "Alias": "bozeta" }, { "Name": "Jennifer", "Alias": "jsalas3" },
      { "Name": "Jeronimo", "Alias": "epitasio" }, { "Name": "Jessica", "Alias": "ramirezj" }, { "Name": "Jesus", "Alias": "gajesusa" },
      { "Name": "Jesus", "Alias": "jmarti50" }, { "Name": "Jesus", "Alias": "garjes13" }, { "Name": "Jesus", "Alias": "gojesusf" },
      { "Name": "JESUS", "Alias": "pinaje" }, { "Name": "Joaquim", "Alias": "candidjo" }, { "Name": "Joaquín", "Alias": "delficoj" },
      { "Name": "Joaquin", "Alias": "olivenjo" }, { "Name": "Johanna", "Alias": "pejohan2" }, { "Name": "John", "Alias": "jospina" },
      { "Name": "Jonathan", "Alias": "galindo" }, { "Name": "Jorge", "Alias": "lopezj" }, { "Name": "Jorge", "Alias": "molanoj" },
      { "Name": "Jorge", "Alias": "ortijorg" }, { "Name": "Jorge", "Alias": "jmitetie" }, { "Name": "José", "Alias": "ramirez" },
      { "Name": "Jose", "Alias": "atoledog" }, { "Name": "José", "Alias": "bazanj" }, { "Name": "Jose", "Alias": "amancill" },
      { "Name": "Jose", "Alias": "jacostap" }, { "Name": "Jose", "Alias": "jfloresf" }, { "Name": "José", "Alias": "gonzjo38" },
      { "Name": "Jose", "Alias": "jalvar13" }, { "Name": "Jose", "Alias": "wallacjo" }, { "Name": "Jose", "Alias": "delossjo" },
      { "Name": "Jose", "Alias": "fljosel4" }, { "Name": "Jose", "Alias": "martjo26" }, { "Name": "José", "Alias": "martjo27" },
      { "Name": "José", "Alias": "nivar" }, { "Name": "Jose", "Alias": "pinzonjo" }, { "Name": "Jose", "Alias": "ploweshj" },
      { "Name": "JOSE", "Alias": "ramijos9" }, { "Name": "José", "Alias": "saavjos2" }, { "Name": "José", "Alias": "jtorre23" },
      { "Name": "Josue", "Alias": "martjosu" }, { "Name": "Juan", "Alias": "lozanole" }, { "Name": "Juan", "Alias": "arayajua" },
      { "Name": "JUAN", "Alias": "alvajua7" }, { "Name": "Juan", "Alias": "anayasaa" }, { "Name": "JUAN", "Alias": "beljuanc" },
      { "Name": "Juan", "Alias": "marqjua4" }, { "Name": "Juan", "Alias": "jpenamej" }, { "Name": "Juan", "Alias": "sajuanca" },
      { "Name": "Juan", "Alias": "jtlahuiz" }, { "Name": "Juan", "Alias": "cruzjua5" }, { "Name": "Juan", "Alias": "gonzju14" },
      { "Name": "Juan", "Alias": "jherna65" }, { "Name": "Juan", "Alias": "huertas" }, { "Name": "Juan", "Alias": "lopejua9" },
      { "Name": "Juan", "Alias": "barrermi" }, { "Name": "Juan", "Alias": "terrazju" }, { "Name": "Juan", "Alias": "varjuanp" },
      { "Name": "Juana", "Alias": "jdelaveg" }, { "Name": "Juanita", "Alias": "jrodri55" }, { "Name": "Judith", "Alias": "jgarci34" },
      { "Name": "Julian", "Alias": "hanselju" }, { "Name": "Julieta", "Alias": "alvjulie" }, { "Name": "Julieta", "Alias": "gonjulie" },
      { "Name": "Julieta", "Alias": "roajul" }, { "Name": "Julio", "Alias": "castjuli" }, { "Name": "Julio", "Alias": "conejerj" },
      { "Name": "Julio", "Alias": "montanej" }, { "Name": "Karen", "Alias": "salask" }, { "Name": "Karen", "Alias": "rochaka" },
      { "Name": "Karina", "Alias": "reyekari" }, { "Name": "Karina", "Alias": "rodrkari" }, { "Name": "Karina", "Alias": "tinajerk" },
      { "Name": "Karla", "Alias": "espindka" }, { "Name": "Karla", "Alias": "guadalup" }, { "Name": "Karla", "Alias": "samanok" },
      { "Name": "Katia", "Alias": "dominkat" }, { "Name": "Katiusca", "Alias": "delcarmk" }, { "Name": "Kelly", "Alias": "vasquez" },
      { "Name": "Kena", "Alias": "klopez2" }, { "Name": "Keshia", "Alias": "aparicke" }, { "Name": "Kimberly", "Alias": "mireleki" },
      { "Name": "Kira", "Alias": "chavezki" }, { "Name": "Kiranjoy", "Alias": "deykir" }, { "Name": "Kirian", "Alias": "kcorrea" },
      { "Name": "Kyrhiam", "Alias": "kcastil4" }, { "Name": "Larisa", "Alias": "perezlar" }, { "Name": "Larry", "Alias": "leolarr3" },
      { "Name": "Laura", "Alias": "avillaur" }, { "Name": "Laura", "Alias": "carbonla" }, { "Name": "Laura", "Alias": "cruzlau" },
      { "Name": "Laura", "Alias": "cuelaura" }, { "Name": "Laura", "Alias": "viedassa" }, { "Name": "Laura", "Alias": "vorhauer" },
      { "Name": "LESLIE", "Alias": "fabianl" }, { "Name": "Leslie", "Alias": "medinles" }, { "Name": "LESLY", "Alias": "felipaes" },
      { "Name": "LETICIA", "Alias": "heletici" }, { "Name": "Leticia", "Alias": "ropertol" }, { "Name": "Leticia", "Alias": "torrleti" },
      { "Name": "Liliana", "Alias": "mondragl" }, { "Name": "Liliana", "Alias": "lesmesl" }, { "Name": "Liliana", "Alias": "rosanol" },
      { "Name": "LINDA", "Alias": "yanezli" }, { "Name": "Lisset", "Alias": "farfanli" }, { "Name": "Lizbeth", "Alias": "campos" },
      { "Name": "Lizbeth", "Alias": "lmirand8" }, { "Name": "Lorena", "Alias": "lvallejo" }, { "Name": "LORENA", "Alias": "jiloren3" },
      { "Name": "Lorena", "Alias": "velazqlo" }, { "Name": "Lucciana", "Alias": "rosalluc" }, { "Name": "Lucero", "Alias": "ltoledo" },
      { "Name": "Lucia", "Alias": "antunez" }, { "Name": "Lucía", "Alias": "gonluci7" }, { "Name": "LUCIA", "Alias": "prietluc" },
      { "Name": "Luciano", "Alias": "chiaralu" }, { "Name": "Luciano", "Alias": "villluci" }, { "Name": "Luis", "Alias": "maluisad" },
      { "Name": "Luis", "Alias": "floluisa" }, { "Name": "LUIS", "Alias": "meluisan" }, { "Name": "Luis", "Alias": "villluis" },
      { "Name": "Luis", "Alias": "barblui2" }, { "Name": "Luis", "Alias": "bernallu" }, { "Name": "Luis", "Alias": "gillu" },
      { "Name": "Luis", "Alias": "moncayol" }, { "Name": "Luis", "Alias": "estradla" }, { "Name": "Luis", "Alias": "lperez14" },
      { "Name": "LUIS", "Alias": "hernlu20" }, { "Name": "Luis", "Alias": "delao" }, { "Name": "Luis", "Alias": "jimelui8" },
      { "Name": "Luis", "Alias": "luengas" }, { "Name": "Luis", "Alias": "manuelgo" }, { "Name": "Luis", "Alias": "lmarque5" },
      { "Name": "Luis", "Alias": "salasl" }, { "Name": "Luis", "Alias": "moreno" }, { "Name": "Luis", "Alias": "fueluisp" },
      { "Name": "Luis", "Alias": "rodrlui8" }, { "Name": "Luis", "Alias": "escluisr" }, { "Name": "Luisa", "Alias": "barajlui" },
      { "Name": "Luz", "Alias": "perezlu4" }, { "Name": "Mackarenna", "Alias": "ripollma" }, { "Name": "Magdiel", "Alias": "carrimag" },
      { "Name": "Manuel", "Alias": "sotmanue" }, { "Name": "Marcela", "Alias": "nietmarc" }, { "Name": "Marcelo", "Alias": "leomarce" },
      { "Name": "Marco", "Alias": "mdejesu4" }, { "Name": "Marco", "Alias": "moramarc" }, { "Name": "Margarita", "Alias": "ramarga4" },
      { "Name": "MARGARITA", "Alias": "lozamarg" }, { "Name": "Maria", "Alias": "rumaria3" }, { "Name": "Maria", "Alias": "fimaria2" },
      { "Name": "Maria", "Alias": "bauza" }, { "Name": "Maria", "Alias": "aguinmar" }, { "Name": "Maria", "Alias": "fermar26" },
      { "Name": "Maria", "Alias": "casaluis" }, { "Name": "Maria", "Alias": "anmariac" }, { "Name": "María", "Alias": "crmaria7" },
      { "Name": "Maria", "Alias": "gamari17" }, { "Name": "Maria", "Alias": "mcastil2" }, { "Name": "Maria", "Alias": "mmarti45" },
      { "Name": "Maria", "Alias": "albam" }, { "Name": "Maria", "Alias": "bauzama" }, { "Name": "Maria", "Alias": "fabian" },
      { "Name": "Maria", "Alias": "crumari2" }, { "Name": "Maria", "Alias": "gomari40" }, { "Name": "María", "Alias": "malacarm" },
      { "Name": "Maria", "Alias": "deverilm" }, { "Name": "María", "Alias": "holmaria" }, { "Name": "Maria", "Alias": "mcal" },
      { "Name": "Maria", "Alias": "izqumari" }, { "Name": "Maria", "Alias": "fortinim" }, { "Name": "Maria", "Alias": "solormar" },
      { "Name": "Maria", "Alias": "mirmari6" }, { "Name": "Maria", "Alias": "mmonge" }, { "Name": "Maria", "Alias": "ortmari8" },
      { "Name": "María", "Alias": "rumiem" }, { "Name": "María", "Alias": "tejama" }, { "Name": "Maria", "Alias": "mmaldon6" },
      { "Name": "Maria", "Alias": "ramundo" }, { "Name": "Marian", "Alias": "melchor" }, { "Name": "Mariana", "Alias": "marenasv" },
      { "Name": "MARIANA", "Alias": "camaria9" }, { "Name": "Mariana", "Alias": "delcamma" }, { "Name": "Mariana", "Alias": "mdalel" },
      { "Name": "Mariano", "Alias": "bemaria8" }, { "Name": "Mariano", "Alias": "mberdasc" }, { "Name": "Mariano", "Alias": "veramar" },
      { "Name": "Maribel", "Alias": "cassani" }, { "Name": "Maricruz", "Alias": "gaticmar" }, { "Name": "Mariela", "Alias": "sequeirm" },
      { "Name": "Mariela", "Alias": "mperezpe" }, { "Name": "Marina", "Alias": "covarrum" }, { "Name": "Marina", "Alias": "mariagar" },
      { "Name": "Mario", "Alias": "valmario" }, { "Name": "Mario", "Alias": "mpuyana" }, { "Name": "Marisol", "Alias": "caldmari" },
      { "Name": "Marisol", "Alias": "villanma" }, { "Name": "Maritza", "Alias": "mamarit2" }, { "Name": "Maritza", "Alias": "zambmari" },
      { "Name": "Martha", "Alias": "mgalicia" }, { "Name": "Martha", "Alias": "gomarth4" }, { "Name": "Martha", "Alias": "robledma" },
      { "Name": "Martha", "Alias": "ospinmar" }, { "Name": "Martha", "Alias": "marroyoa" }, { "Name": "Martha", "Alias": "sfrancom" },
      { "Name": "Martin", "Alias": "mbeccari" }, { "Name": "Martín", "Alias": "espimart" }, { "Name": "Martin", "Alias": "massuh" },
      { "Name": "Matheus", "Alias": "limam" }, { "Name": "Matías", "Alias": "layam" }, { "Name": "Mauro", "Alias": "salvom" },
      { "Name": "Mayela", "Alias": "silvmaye" }, { "Name": "Mayra", "Alias": "mattomay" }, { "Name": "Melany", "Alias": "villmela" },
      { "Name": "Melisa", "Alias": "guzmanm" }, { "Name": "Melissa", "Alias": "becerra" }, { "Name": "Melissa", "Alias": "roame" },
      { "Name": "Meztli", "Alias": "zolache" }, { "Name": "Micaela", "Alias": "viglioni" }, { "Name": "Michael", "Alias": "abellomi" },
      { "Name": "Michael", "Alias": "femicha9" }, { "Name": "Michelle", "Alias": "merazm" }, { "Name": "Miguel", "Alias": "gallemig" },
      { "Name": "Miguel", "Alias": "mtellezj" }, { "Name": "Miguel", "Alias": "crmiguel" }, { "Name": "Miguel", "Alias": "dimiguel" },
      { "Name": "Miguel", "Alias": "marcomig" }, { "Name": "Miguel", "Alias": "mrojasma" }, { "Name": "Mildred", "Alias": "fernmild" },
      { "Name": "Minerva", "Alias": "valenzmi" }, { "Name": "Mireya", "Alias": "roblesmi" }, { "Name": "Miriam", "Alias": "mmezamar" },
      { "Name": "Miriam", "Alias": "mgutier6" }, { "Name": "Mitzi", "Alias": "lavana" }, { "Name": "Monica", "Alias": "alvaremo" },
      { "Name": "Mónica", "Alias": "mendoza" }, { "Name": "Mónica", "Alias": "mrodri57" }, { "Name": "Monserrat", "Alias": "dimonser" },
      { "Name": "Monserrat", "Alias": "urtubiam" }, { "Name": "Nancy", "Alias": "romernan" }, { "Name": "Nancy", "Alias": "velezna" },
      { "Name": "Nancy", "Alias": "vpaulett" }, { "Name": "Nassin", "Alias": "ahcar" }, { "Name": "Natalia", "Alias": "saldarri" },
      { "Name": "Natanni", "Alias": "fernatan" }, { "Name": "Nathali", "Alias": "contrnat" }, { "Name": "Neftali", "Alias": "camernef" },
      { "Name": "Neill", "Alias": "yangalin" }, { "Name": "Nelkys", "Alias": "serranom" }, { "Name": "Nelly", "Alias": "barreton" },
      { "Name": "Nelson", "Alias": "leonfern" }, { "Name": "Nicolas", "Alias": "bossion" }, { "Name": "Nidia", "Alias": "barragni" },
      { "Name": "Nidia", "Alias": "garcinid" }, { "Name": "Nidia", "Alias": "romernid" }, { "Name": "Nishma", "Alias": "herrenis" },
      { "Name": "Nora", "Alias": "garcnora" }, { "Name": "Norma", "Alias": "alonson" }, { "Name": "Norma", "Alias": "nvillase" },
      { "Name": "Norma", "Alias": "canchola" }, { "Name": "Nubia", "Alias": "njimene3" }, { "Name": "Nubia", "Alias": "serrano" },
      { "Name": "NURIA", "Alias": "ortiznu" }, { "Name": "Nydia", "Alias": "lopezny" }, { "Name": "Nydia", "Alias": "membriny" },
      { "Name": "Ofelia", "Alias": "ofelia" }, { "Name": "Olga", "Alias": "ramireol" }, { "Name": "Olivo", "Alias": "herolivo" },
      { "Name": "Omar", "Alias": "carmooma" }, { "Name": "Omar", "Alias": "reyesoma" }, { "Name": "Orlando", "Alias": "vargaorl" },
      { "Name": "OSCAR", "Alias": "amavizco" }, { "Name": "Oscar", "Alias": "campoosc" }, { "Name": "Oscar", "Alias": "riveosca" },
      { "Name": "Oscar", "Alias": "ogarcia4" }, { "Name": "Oscar", "Alias": "oropezos" }, { "Name": "Osvaldo", "Alias": "rangelo" },
      { "Name": "Osvaldo", "Alias": "ibacetao" }, { "Name": "Oswaldo", "Alias": "aguilaos" }, { "Name": "Oziel", "Alias": "morin" },
      { "Name": "Pablo", "Alias": "dacosta" }, { "Name": "Pablo", "Alias": "marottap" }, { "Name": "Pablo", "Alias": "perpablo" },
      { "Name": "Pablo", "Alias": "prosasro" }, { "Name": "Pablo", "Alias": "salomonp" }, { "Name": "Pablo", "Alias": "casullop" },
      { "Name": "Pamela", "Alias": "jeldresp" }, { "Name": "Pamela", "Alias": "munozpam" }, { "Name": "Paola", "Alias": "pcordova" },
      { "Name": "Paola", "Alias": "sevillpa" }, { "Name": "Paola", "Alias": "uribepa" }, { "Name": "Paramita", "Alias": "mallikpa" },
      { "Name": "Pasante", "Alias": "sopas" }, { "Name": "Patricia", "Alias": "chenpatr" }, { "Name": "Patricia", "Alias": "solipatr" },
      { "Name": "Paulina", "Alias": "dionisip" }, { "Name": "Pedro", "Alias": "casteped" }, { "Name": "Pedro", "Alias": "cuinpe" },
      { "Name": "Pedro", "Alias": "narespe" }, { "Name": "Pedro", "Alias": "megchun" }, { "Name": "Pedro", "Alias": "saldivap" },
      { "Name": "Perla", "Alias": "cerdanp" }, { "Name": "Piero", "Alias": "monja" }, { "Name": "Pilar", "Alias": "munozpi" },
      { "Name": "Priscila", "Alias": "vacapr" }, { "Name": "Queipo", "Alias": "mariadeq" }, { "Name": "Rafael", "Alias": "reyerafa" },
      { "Name": "Ramiro", "Alias": "dominram" }, { "Name": "Ramkrishna", "Alias": "maityra" }, { "Name": "Ramon", "Alias": "salasra" },
      { "Name": "Raquel", "Alias": "rbellosa" }, { "Name": "Raúl", "Alias": "mejiara" }, { "Name": "Raymundo", "Alias": "paniagra" },
      { "Name": "Read", "Alias": "mlata" }, { "Name": "Regina", "Alias": "bello" }, { "Name": "Renata", "Alias": "flatsch1" },
      { "Name": "Renato", "Alias": "raguila4" }, { "Name": "Reynaldo", "Alias": "eksilvad" }, { "Name": "Ricardo", "Alias": "antoniri" },
      { "Name": "Ricardo", "Alias": "rramir10" }, { "Name": "Ricardo", "Alias": "robledri" }, { "Name": "Roberto", "Alias": "rrioscam" },
      { "Name": "Rocio", "Alias": "careaga" }, { "Name": "Rocio", "Alias": "jimeroci" }, { "Name": "Rodolfo", "Alias": "gonzalez" },
      { "Name": "Rodrigo", "Alias": "bonilrod" }, { "Name": "Rodrigo", "Alias": "rfraustr" }, { "Name": "Rodrigo", "Alias": "rgray4" },
      { "Name": "Rodrigo", "Alias": "munorodr" }, { "Name": "Romario", "Alias": "romario" }, { "Name": "Ronald", "Alias": "odiorona" },
      { "Name": "Rosa", "Alias": "rgonzal9" }, { "Name": "Rosa", "Alias": "mancilro" }, { "Name": "Rosa", "Alias": "rcastil9" },
      { "Name": "Roxana", "Alias": "sanroxan" }, { "Name": "Ruben", "Alias": "garciar" }, { "Name": "Ruben", "Alias": "rbonill5" },
      { "Name": "Ruben", "Alias": "rvillalv" }, { "Name": "Rubí", "Alias": "martrubi" }, { "Name": "Ruth", "Alias": "martrut2" },
      { "Name": "Sajjad", "Alias": "ansasajj" }, { "Name": "Salustiano", "Alias": "snonoalb" }, { "Name": "Sandra", "Alias": "gasand12" },
      { "Name": "Sandra", "Alias": "gasand15" }, { "Name": "Sandra", "Alias": "narios" }, { "Name": "Sandra", "Alias": "sorozcoy" },
      { "Name": "Santiago", "Alias": "dimegsan" }, { "Name": "Sara", "Alias": "gonzsar6" }, { "Name": "SARA", "Alias": "sosasa" },
      { "Name": "Sara", "Alias": "velazsar" }, { "Name": "Saúl", "Alias": "hernande" }, { "Name": "SAÚL", "Alias": "portills" },
      { "Name": "Serena", "Alias": "lopezgse" }, { "Name": "Sergio", "Alias": "torsergi" }, { "Name": "Silvana", "Alias": "scastro5" },
      { "Name": "Siria", "Alias": "perezsir" }, { "Name": "Sissy", "Alias": "viejo" }, { "Name": "Sofía", "Alias": "guzman" },
      { "Name": "Solange", "Alias": "gasalla" }, { "Name": "Sophia", "Alias": "brunetso" }, { "Name": "Stalin", "Alias": "cruzst" },
      { "Name": "STEPHANIA", "Alias": "garsteph" }, { "Name": "Stephanie", "Alias": "lozanost" }, { "Name": "Stephanie", "Alias": "sebasste" },
      { "Name": "Suguely", "Alias": "larasu" }, { "Name": "Susana", "Alias": "guitars" }, { "Name": "Susana", "Alias": "sasusan3" },
      { "Name": "Susmita", "Alias": "sasusmi2" }, { "Name": "Susy", "Alias": "chansusy" }, { "Name": "Sweety", "Alias": "kajarisw" },
      { "Name": "Talía", "Alias": "torresgt" }, { "Name": "Tamara", "Alias": "cassinit" }, { "Name": "Tania", "Alias": "romertan" },
      { "Name": "Tarun", "Alias": "mondtaru" }, { "Name": "Teodulo", "Alias": "tfloresr" }, { "Name": "Uriel", "Alias": "ortizu" },
      { "Name": "Ursula", "Alias": "palaciou" }, { "Name": "Valentina", "Alias": "montserv" }, { "Name": "Valeria", "Alias": "duranval" },
      { "Name": "Valeria", "Alias": "martinez" }, { "Name": "Valerie", "Alias": "baylyva" }, { "Name": "Vanessa", "Alias": "carrerva" },
      { "Name": "Vanessa", "Alias": "hernvane" }, { "Name": "Vanessa", "Alias": "mavanes4" }, { "Name": "Vanessa", "Alias": "vsanche6" },
      { "Name": "Verenice", "Alias": "alvarver" }, { "Name": "VERONICA", "Alias": "maveron4" }, { "Name": "Veronica", "Alias": "cortescv" },
      { "Name": "Veronica", "Alias": "maldonve" }, { "Name": "Veronica", "Alias": "peres" }, { "Name": "Veronica", "Alias": "pinov" },
      { "Name": "Vicente", "Alias": "ortizvic" }, { "Name": "Víctor", "Alias": "campovic" }, { "Name": "Victor", "Alias": "vvelit" },
      { "Name": "Víctor", "Alias": "laravi" }, { "Name": "Victor", "Alias": "martivic" }, { "Name": "Victor", "Alias": "peralvic" },
      { "Name": "VICTOR", "Alias": "veravict" }, { "Name": "Virginia", "Alias": "vcastill" }, { "Name": "Viridiana", "Alias": "leon" },
      { "Name": "Waldo", "Alias": "wgarciar" }, { "Name": "Walter", "Alias": "chavezw" }, { "Name": "Walter", "Alias": "ditsch" },
      { "Name": "Wendy", "Alias": "bazurto" }, { "Name": "Wilbert", "Alias": "villwilb" }, { "Name": "Ximena", "Alias": "calvox" },
      { "Name": "Ximena", "Alias": "chaparrx" }, { "Name": "Ximena", "Alias": "melladox" }, { "Name": "Ximena", "Alias": "varela" },
      { "Name": "Yael", "Alias": "floreyae" }, { "Name": "Yameli", "Alias": "yronquil" }, { "Name": "Yanett", "Alias": "olascoag" },
      { "Name": "Yanett", "Alias": "penayan" }, { "Name": "Yanine", "Alias": "marruffo" }, { "Name": "Yareth", "Alias": "pallarey" },
      { "Name": "Yazmin", "Alias": "barreto" }, { "Name": "Yazmin", "Alias": "yvelazqu" }, { "Name": "Yebel", "Alias": "ferrerye" },
      { "Name": "Yeny", "Alias": "yhernan5" }, { "Name": "Yerson", "Alias": "ysaenz2" }, { "Name": "Yesenia", "Alias": "arauzy" },
      { "Name": "Yesica", "Alias": "velazquy" }, { "Name": "Yuli", "Alias": "suarezyu" }, { "Name": "Yunatzi", "Alias": "gomezyun" },
      { "Name": "Zafar", "Alias": "iqbalzaf" }
    ];
    
    // Crear lista de alias normalizados y mapeo completo
    aliasList = [];
    nicknameMap = {};
    
    nicknamesData.forEach((item, index) => {
      if (item && item.Alias) {
        const normalizedAlias = norm(item.Alias);
        aliasList.push(normalizedAlias);
        nicknameMap[normalizedAlias] = item; // Guardar el objeto completo
      }
    });
    
    console.log("✅ Total de alias cargados:", aliasList.length);
    askForAlias(); // 🔐 primer mensaje del chatbot
  } catch (err) {
    console.error("❌ Error procesando nicknames:", err);
    askForAlias(); // Aún así, pedir el alias
  }
});



function askForAlias() {
  addMessage("🔑 Escribe tu nickname para poder acceder al chat:", "bot", true);
}

// ----------------------
// Menú principal y opciones
// ----------------------
function showMainMenu() {
  // Si hay un nombre de usuario, personalizar el mensaje
  const greeting = userName 
    ? `¡Hola, ${userName}! 👋 ¿En qué puedo ayudarte hoy?`
    : "¡Hola! 👋 ¿En qué puedo ayudarte hoy?";
  
  addMessage(greeting, "bot", true);
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
  addMessage('Entiendo, ¿en qué tema deseas?', "bot", true);
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
  addMessage("Genial 😃, ¿en qué tema deseas?", "bot", true);
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
