import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";
import "./App.css";

export default function App() {
  //I initialised the note state from the browser localStorage
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes(oldNotes => {
      // Create a new empty array
      const newArray = [];
      // Loop over the original array
      for (let i = 0; i < oldNotes.length; i++) {
        // if the id matches
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          // put the updated note at the
          // beginning of the new array
          newArray.unshift({ ...oldNote, body: text });
          // else
        } else {
          // push the old note to the end
          // of the new array
          newArray.push(oldNote);
        }
      }
      // return the new array
      return newArray;
    });
  }
  //  to delete notes from thearray based on noteId
  function deleteNote(event, noteId) {
    event.stopPropagation();
    // Filterd and return a new array without the note that the Id a clicked on
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId));
  }

  function findCurrentNote() {
    return (
      notes.find(note => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
