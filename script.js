const eingabe = document.getElementById("eingabe");
const btn = document.getElementById("hinzufuegen");
const aufgabeListe = document.getElementById("aufgabeListe");

// Nach neuladen der Seite, daten aus localStorage holen und anzeigen
window.addEventListener("DOMContentLoaded", () => {
  const gespeicherteAufgaben =
    JSON.parse(localStorage.getItem("aufgaben")) || [];
  gespeicherteAufgaben.forEach((aufgabeText) => {
    aufgabeErstellen(aufgabeText.text, aufgabeText.erledigt);
  });
  if (gespeicherteAufgaben.length > 0) {
    document.getElementById("loescheErledigte").style.display = "block";
  }
});

// Aufgaben erstellen funktion
function aufgabeErstellen(text, erledigt) {
  const neueAufgabe = document.createElement("li");
  neueAufgabe.classList.add("aufgabe");
  const textSpan = document.createElement("span");
  textSpan.classList.add("aufgabe-text");
  textSpan.textContent = erledigt ? "✅ " + text : text;

  neueAufgabe.appendChild(textSpan);

  if (erledigt) {
    neueAufgabe.classList.toggle("erledigt");
  }

  // Erledigt toggeln
  neueAufgabe.addEventListener("click", () => {
    neueAufgabe.classList.toggle("erledigt");
    textSpan.textContent = neueAufgabe.classList.contains("erledigt")
      ? "✅ " + text
      : text;
    let daten = JSON.parse(localStorage.getItem("aufgaben")) || [];
    let geaendert = daten.map((aufgabe) => {
      if (aufgabe.text === text) {
        aufgabe.erledigt = !aufgabe.erledigt; // Status in localStorage umkehren
      }
      return aufgabe;
    });
    localStorage.setItem("aufgaben", JSON.stringify(geaendert));
  });

  // Löschen-Button
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "🗑️";
  clearBtn.classList.add("clearBtn");
  clearBtn.addEventListener("click", () => {
    let aktuelleAufgaben = JSON.parse(localStorage.getItem("aufgaben")) || [];
    const neueAufgabenListe = aktuelleAufgaben.filter((n) => n.text !== text);
    localStorage.setItem("aufgaben", JSON.stringify(neueAufgabenListe));
    neueAufgabe.remove();

    // "Erledigte löschen" Button ausblenden, wenn keine Aufgaben mehr da sind
    if (aufgabeListe.children.length === 0) {
      document.getElementById("loescheErledigte").style.display = "none";
    }
  });

  neueAufgabe.appendChild(clearBtn);
  aufgabeListe.appendChild(neueAufgabe);
}

// hinzufügen button
btn.addEventListener("click", () => {
  const aufgabeText = eingabe.value.trim();
  if (aufgabeText === "") return;

  // Array holen oder neu starten
  let namen = JSON.parse(localStorage.getItem("aufgaben")) || [];

  // Doppelte aufgabe blockieren
  if (namen.some((aufgabe) => aufgabe.text === aufgabeText)) {
    alert("Diese Aufgabe hast du bereits schon in deiner Liste gespeichert.");
    return;
  }

  // In localStorage hinzufügen und speichern
  namen.push({ text: aufgabeText, erledigt: false });
  localStorage.setItem("aufgaben", JSON.stringify(namen));

  aufgabeErstellen(aufgabeText, false);

  // "Erledigte löschen" - Button erscheinen, sobald Aufgabe hinzugefügt wird
  document.getElementById("loescheErledigte").style.display = "block";

  // Eingabefeld leeren nach klicken oder Enter drücken
  eingabe.value = "";
});

// Enter drücken auf das Eingabefeld
eingabe.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Seite neu laden verhindern
    btn.click(); // Klick auf Button simulieren
  }
});

// Alle erledigte aufgabe löschen
const clearAll = document.getElementById("loescheErledigte");

clearAll.addEventListener("click", () => {
  // 1. DOM löschen
  const erledigte = document.querySelectorAll(".erledigt");
  erledigte.forEach((aufgabe) => aufgabe.remove());

  // 2. Speicher aktualisieren
  let aktuelleAufgaben = JSON.parse(localStorage.getItem("aufgaben")) || [];
  let gefiltert = aktuelleAufgaben.filter((aufgabe) => !aufgabe.erledigt);
  localStorage.setItem("aufgaben", JSON.stringify(gefiltert));

  // 3. Button ausblenden, wenn nichts mehr da ist
  const nochVorhandene = document.querySelectorAll("#aufgabeListe li");
  if (nochVorhandene.length === 0) {
    document.getElementById("loescheErledigte").style.display = "none";
  }
});
