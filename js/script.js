/*---------------------------------------------------------------------------------------- */
//Globale Variablen

/*ungeordnete liste wo die erratenen Buchstaben des spielers stehen */
const guessedLettersElement = document.querySelector(".guessed-letters");

// Button, um einen Buchstaben zu raten
const guessLetterButton = document.querySelector(".guess");

// Eingabefeld für den Buchstaben
const letterInput = document.querySelector(".letter");

// Anzeige des Wortes mit Platzhaltern oder geratenen Buchstaben
const wordInProgress = document.querySelector(".word-in-progress"); 

// Bereich, der die verbleibenden Versuche anzeigt
const remainingGuessesElement = document.querySelector(".remaining");

// Der genaue Wert der verbleibenden Versuche
const remainingGuessesSpan = document.querySelector(".remaining span")

 // Bereich, um Nachrichten an den Benutzer anzuzeigen (z. B. Fehler oder Erfolg)
const message = document.querySelector(".message");

// Button, um das Spiel neu zu starten
const playAgainButton = document.querySelector(".play-again");

/*------------------------------------------------------------------------------------------- */

/*globale variable für start word */
let word ="magnolia";
// Array zur Speicherung der geratenen Buchstaben
let guessedLetters = [];
// Anzahl der verbleibenden Versuche 
let remainingGuesses = 8;

/*---------------------------------------------------------------------------------------- */

//Funktion zum Abrufen eines zufälligen Wortes von einer externen Quelle und Initialisierung des Spiels
const getWord = async function () {
  const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
  const words = await response.text();
  const wordArray = words.split("\n");
  const randomIndex = Math.floor(Math.random() * wordArray.length);
  word = wordArray[randomIndex].trim();
  placeholder(word);
};

// Spiel starten
getWord();

/*---------------------------------------------------------------------------------------- */

/*Funktion zum Hinzufügen von Platzhaltern für jeden Buchstaben */
const placeholder = function (word) {
	const placeholderLetters = []; // Ein Array, das die Platzhalter speichert
	for (const letter of word) {
		// console.log(letter); // Debugging: Gibt jeden Buchstaben des Wortes in der Konsole aus
		placeholderLetters.push("●"); // Fügt für jeden Buchstaben einen Platzhalter (●) hinzu
	}
	wordInProgress.innerText = placeholderLetters.join(""); /* mit der Methode .join("") wieder zu einem String zusammenfügen. */
};

/*---------------------------------------------------------------------------------------- */

// Event Listener für den "Raten"-Button
guessLetterButton.addEventListener("click", function (e) {
	e.preventDefault();  /*verhindert neuladeverhalten */
	message.innerText = ""; // Leert die Nachricht
	const guess = letterInput.value; // Erfasst den eingegebenen Buchstaben
	const goodGuess = validateInput(guess); // Überprüft die Eingabe
	
	if (goodGuess) {
		makeGuess(guess); // Führt den Rateversuch durch, wenn die Eingabe gültig ist
	}
	letterInput.value = ""; // Leert das Eingabefeld
});

/*---------------------------------------------------------------------------------------- */
// Funktion zur Überprüfung der Benutzereingabe
const validateInput = function (input) {
  const acceptedLetter = /[a-zA-Z]/; // Regulärer Ausdruck für Buchstaben
  if (input.length === 0) {
	// Überprüfung: Hat der Benutzer nichts eingegeben?
    message.innerText = "Please enter a letter.";
  } else if (input.length > 1) {
	// Überprüfung: Hat der Benutzer mehr als einen Buchstaben eingegeben?
    message.innerText = "Please enter a single letter.";
  } else if (!input.match(acceptedLetter)) {
	// Überprüfung: Ist die Eingabe kein Buchstabe? (z. B. Zahl oder Sonderzeichen)
    message.innerText = "Please enter a letter from A to Z.";
  } else {
    return input; // Gibt den Buchstaben zurück, wenn er gültig ist
  }
};
/*---------------------------------------------------------------------------------------- */

// Funktion zur Verarbeitung des geratenen Buchstabens
const makeGuess = function (guess) {
  guess = guess.toUpperCase(); // Konvertiert den Buchstaben in Großbuchstaben
  if (guessedLetters.includes(guess)) {
	// Überprüfung: Wurde dieser Buchstabe bereits geraten?
    message.innerText = "You already guessed that letter, silly. Try again.";
  } else {
    guessedLetters.push(guess); // Fügt den Buchstaben zum Array der geratenen Buchstaben hinzu
    console.log(guessedLetters); // Debugging: Gibt das Array aller geratenen Buchstaben in der Konsole aus
	updateGuessesRemaining(guess); // Aktualisiere die Anzahl der verbleibenden Versuche
	showGuessedLetters(); // Aktualisiert die Anzeige der geratenen Buchstaben
	updateWordInProgress(guessedLetters); // Aktualisiert das Wort im Fortschritt
  }
};
/*---------------------------------------------------------------------------------------- */

// Funktion zur Anzeige der geratenen Buchstaben
const showGuessedLetters = function () {
  guessedLettersElement.innerHTML = ""; // Leert die Liste
  for (const letter of guessedLetters) {
    const li = document.createElement("li"); // Erstellt ein neues Listenelement
    li.innerText = letter; // Setzt den Text des Listenelements auf den geratenen Buchstaben
    guessedLettersElement.append(li); // Fügt das Element zur Liste hinzu
  }
};
/*---------------------------------------------------------------------------------------- */

// Funktion zur Aktualisierung des Wortes im Fortschritt
const updateWordInProgress = function (guessedLetters) {
  const wordUpper = word.toUpperCase(); // Konvertiert das Wort in Großbuchstaben
  const wordArray = wordUpper.split(""); // Teilt das Wort in ein Array von Buchstaben
  const revealWord = []; // Array zur Speicherung des aktuellen Fortschritts im Wort
  for (const letter of wordArray) {
    if (guessedLetters.includes(letter)) {
      revealWord.push(letter.toUpperCase()); // Zeigt geratene Buchstaben
    } else {
      revealWord.push("●"); // Zeigt nicht geratene Buchstaben als Punkt
    }
  }
  // console.log(revalWord);
  wordInProgress.innerText = revealWord.join(""); // Aktualisiert die Anzeige des Fortschritts im HTML
  checkIfWin(); // Überprüft, ob das Spiel gewonnen wurde
};
/*---------------------------------------------------------------------------------------- */

//Funktion zum Aktualisieren der verbleibenden Versuche
const updateGuessesRemaining = function (guess) {
 // Konvertiere das zu erratende Wort in Großbuchstaben
  const upperWord = word.toUpperCase();
  // Überprüfe, ob der geratene Buchstabe im Wort vorkommt
  if (!upperWord.includes(guess)) {
  // Wenn nicht, reduziere die Anzahl der verbleibenden Versuche
    message.innerText = `Sorry, the word has no ${guess}.`;
    remainingGuesses -= 1;
  } else {
  // Wenn ja, gib eine positive Nachricht aus
    message.innerText = `Good guess! The word has the letter ${guess}.`;
  }
 // Überprüfe den Spielstatus basierend auf den verbleibenden Versuchen
  if (remainingGuesses === 0) {
  // Wenn keine Versuche mehr übrig sind, beende das Spiel
    message.innerHTML = `Game over! The word was <span class="highlight">${word}</span>.`;
	startOver();
  } else if (remainingGuesses === 1) {
  // Wenn nur noch ein Versuch übrig ist, verwende Einzahl
    remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
  } else {
  // Ansonsten verwende Mehrzahl  
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
  }
};

/*---------------------------------------------------------------------------------------- */

// Funktion zur Überprüfung, ob das Spiel gewonnen wurde
const checkIfWin = function () {
  if (word.toUpperCase() === wordInProgress.innerText) {
	// Vergleich: Ist das geheime Wort vollständig erraten?  
    message.classList.add("win"); // Fügt eine CSS-Klasse hinzu, um eine Gewinnnachricht hervorzuheben
    message.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
	/* Zeigt eine Erfolgsnachricht an */
	startOver();
  }
};

/*---------------------------------------------------------------------------------------- */

// Funktion zum Beenden des aktuellen Spiels und Vorbereiten eines neuen Spiels
const startOver = function () {
  guessLetterButton.classList.add("hide"); // Verstecke den Button zum Raten von Buchstaben
  remainingGuessesElement.classList.add("hide"); // Verstecke das Element, das die verbleibenden Versuche anzeigt
  guessedLettersElement.classList.add("hide"); // Verstecke die Liste der bereits geratenen Buchstaben
  playAgainButton.classList.remove("hide"); // Zeige den "Erneut spielen"-Button an
};

/*---------------------------------------------------------------------------------------- */

// Event-Listener für den "Erneut spielen"-Button
playAgainButton.addEventListener("click", function () {
  // Zurücksetzen aller Werte und Starten eines neuen Spiels
  message.classList.remove("win"); // Entferne die "Gewonnen"-Klasse von der Nachricht
  guessedLetters = []; // Leere das Array der geratenen Buchstaben
  remainingGuesses = 8; // Setze die Anzahl der verbleibenden Versuche zurück
  remainingGuessesSpan.innerText = `${remainingGuesses} guesses`; // Aktualisiere den Text für die verbleibenden Versuche
  guessedLettersElement.innerHTML = ""; // Leere die Liste der angezeigten geratenen Buchstaben
  message.innerText = ""; // Leere die Nachricht
  // Hole ein neues Wort für das Spiel
  getWord();
  
/*---------------------------------------------------------------------------------------- */
 
// Anzeigen der richtigen UI-Elemente für ein neues Spiel
  guessLetterButton.classList.remove("hide"); // Zeige den Button zum Raten von Buchstaben wieder an
  playAgainButton.classList.add("hide"); // Verstecke den "Erneut spielen"-Button
  remainingGuessesElement.classList.remove("hide"); // Zeige das Element für die verbleibenden Versuche wieder an
  guessedLettersElement.classList.remove("hide"); // Zeige die Liste der geratenen Buchstaben wieder an
});

/*---------------------------------------------------------------------------------------- */