let notes = [
  261.60, // C4
  277.18, // C#4
  293.67, // D4
  311.13, // D#4
  329.63, // E4
  349.23, // F4
  369.99, // F#4
  392.00, // G4
  415.30, // G#4
  440.00, // A4
  466.16, // A#4
  493.88, // B4
  523.25, // C5
  554.37, // C#5
  587.33, // D5
  622.25, // D#5
  659.26, // E5
  698.46, // F5
  739.99, // F#5
  783.99, // G5
  830.61, // G#5
  880.00, // A5
  932.33, // A#5
  987.77 // B5
];

let itervalz = [ "Unison", "Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd", "Perfect 4th", "Tritone", "Perfect 5th", "Minor 6th", "Major 6th", "Minor 7th", "Major 7th", "Octave"];


//create the context for the web audio
var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.AudioWorkletNode)();
var volume = audioCtx.createGain();
volume.connect(audioCtx.destination);
volume.gain.value=0.03;
//create, tune, start and connect oscillator sinea
var note;
var note1;
var note2;
var interval;

//working with the progress bar
var progress = document.getElementById('progress-bar');
var score = 0

function pickNotes() {
  let output = [];
  // chooses a random index within the list of frequences to have as note one (excluding very last note)
  note1 = Math.floor(Math.random() * notes.length - 1);
  // if note1 is greater than 12, then choose a random idx that is only within the array range, else choose a random idx within 1 and 12;
  note2 = ( note1 > 12 )?  note1 + Math.floor(Math.random() * (notes.length - note1 - 1)) + 1 : note1 + Math.floor(Math.random() * (12)) + 1;
  // return what interval these notes are
  interval = itervalz[note2 - note1]
  output.push(note1, note2, interval)

  return output;
}


// given two notes, this plays one after the other with a one second length for each note
function playInterval(noteIdx1, noteIdx2) {
  playOscillator(noteIdx1);
  setTimeout(function () { playOscillator(noteIdx2) }, 1000);
}

// given a note/frequency as an argument, this plays the note for 1 second
function playOscillator(noteIdx) {
  note = audioCtx.createOscillator();
  note.frequency.value = notes[noteIdx]
  note.connect(volume);
  note.start(audioCtx.currentTime);
  note.stop(audioCtx.currentTime + 1);
}

gameReset = true;

// play the interval and changes if user gets it right
document.getElementById("intervalRun").addEventListener("click", function(){
  if (gameReset) {
    intvData = pickNotes();
    gameReset = false;
  }
  if (!gameReset) {
    playInterval(intvData[0], intvData[1]);
  }
}, false);


// get the array of butttons in the class
var intervalButtons = document.getElementsByClassName("intervals");

// for each button, add an event listener
for (var i = 0; i < intervalButtons.length; i++) {
  intervalButtons[i].addEventListener('click', function() {
    // if user gets the interval right, reset to get new interval/notes and increase score
    if (this.id === intvData[2]) {
      gameReset = true;
      score++;
      //updates the progress bar
      progress.style.width = (score / 5) * 100 + "%";

      // if user gets 5 in a row, exit app
      if (score == 5) { Neutralino.app.exit(); }
    }
    else {
      // reset if you get one wrong and updates progress bar
      score = 0;
      progress.style.width = (score / 5) * 100 + "%";
    }
  }, false);
}
