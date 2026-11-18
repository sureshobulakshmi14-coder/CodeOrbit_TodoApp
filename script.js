// To-Do List App: add, edit, delete, complete. Saved with localStorage.
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const emptyMsg = document.getElementById("empty");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clearDone");
const filterBtns = document.querySelectorAll(".chip");

let tasks = [];
let filter = "all";
let editingId = null;

// Load saved tasks
try {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (e) {
  tasks = [];
}

function save() {
  try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {}
}

function render() {
  list.innerHTML = "";
  const shown = tasks.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  shown.forEach((t) => {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = t.done;
    cb.setAttribute("aria-label", "Mark task as done");
    cb.addEventListener("change", () => { t.done = cb.checked; save(); render(); });
    li.appendChild(cb);

    if (editingId === t.id) {
      const edit = document.createElement("input");
      edit.type = "text";
      edit.className = "edit-input";
      edit.value = t.text;
      li.appendChild(edit);
      const saveBtn = document.createElement("button");
      saveBtn.className = "act";
      saveBtn.textContent = "Save";
      const commit = () => {
        const v = edit.value.trim();
        if (v) t.text = v;
        editingId = null; save(); render();
      };
      saveBtn.addEventListener("click", commit);
      edit.addEventListener("keydown", (e) => { if (e.key === "Enter") commit(); });
      li.appendChild(saveBtn);
      setTimeout(() => edit.focus(), 0);
    } else {
      const span = document.createElement("span");
      span.className = "text";
      span.textContent = t.text;
      li.appendChild(span);
      const editBtn = document.createElement("button");
      editBtn.className = "act";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => { editingId = t.id; render(); });
      li.appendChild(editBtn);
    }

    const del = document.createElement("button");
    del.className = "act del";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      tasks = tasks.filter((x) => x.id !== t.id);
      save(); render();
    });
    li.appendChild(del);
    list.appendChild(li);
  });

  emptyMsg.style.display = shown.length ? "none" : "block";
  const left = tasks.filter((t) => !t.done).length;
  countEl.textContent = left + (left === 1 ? " task left" : " tasks left");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now(), text: text, done: false });
  input.value = "";
  save(); render();
});

filterBtns.forEach((b) =>
  b.addEventListener("click", () => {
    filter = b.dataset.filter;
    filterBtns.forEach((x) => x.classList.toggle("active", x === b));
    render();
  })
);

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save(); render();
});

render();
