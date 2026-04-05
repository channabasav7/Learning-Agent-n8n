const COURSE_LABELS = {
  java_dsa: "Java DSA",
  python: "Python",
  flutter: "Flutter",
  sql: "SQL",
};

const COURSE_ALIASES = {
  java: "java_dsa",
  dsa: "java_dsa",
  java_dsa: "java_dsa",
  dsa_java: "java_dsa",
  python: "python",
  flutter: "flutter",
  sql: "sql",
};

const COURSE_TASK_BANK = {
  java_dsa: {
    foundation: [
      "Java arrays and strings: solve 3 easy problems, then review complexity.",
      "Implement stack and queue in Java with add, remove, peek methods.",
      "Binary search basics: solve 3 variants and write edge-case notes.",
    ],
    intermediate: [
      "Solve 3 medium linked-list problems (reverse, cycle, merge).",
      "Sliding window practice: 2 medium problems and dry-run each.",
      "Recursion + backtracking: solve subsets and permutation problems.",
    ],
    project: [
      "Build a Java DSA tracker app (problem, topic, status, notes).",
      "Create reusable Java templates for BFS, DFS, and binary search.",
      "Take one 60-minute mixed DSA mock and analyze weak topics.",
    ],
    revision: [
      "Revise all Java DSA notes and re-solve 2 previously failed problems.",
      "Run a final timed set: 1 easy, 2 medium, 1 hard and review solutions.",
      "Prepare interview-style explanation for 5 core patterns.",
    ],
  },
  python: {
    foundation: [
      "Revise core syntax, list and dict comprehensions, and functions.",
      "Practice file handling and exception handling with mini exercises.",
      "Solve 3 beginner problems using loops, conditions, and functions.",
    ],
    intermediate: [
      "Use collections (Counter, defaultdict, deque) in 3 coding tasks.",
      "Practice OOP: class design, inheritance, and dataclass examples.",
      "Write 2 utility scripts and add pytest tests for both.",
    ],
    project: [
      "Build a CLI study planner in Python with CSV or JSON persistence.",
      "Use requests to fetch API data and generate a clean summary report.",
      "Refactor one previous script with modular functions and tests.",
    ],
    revision: [
      "Revise Python notes and reattempt 3 mistakes from your log.",
      "Do one 45-minute Python coding sprint and inspect complexity.",
      "Prepare a one-page cheat sheet for modules, OOP, and testing.",
    ],
  },
  flutter: {
    foundation: [
      "Build one responsive UI screen with Row, Column, Expanded, and ListView.",
      "Create a validated form using TextFormField and GlobalKey.",
      "Practice navigation with arguments across 2-3 screens.",
    ],
    intermediate: [
      "Implement Provider or Riverpod basics for state management.",
      "Consume a REST API and handle loading, success, and error states.",
      "Create 2 reusable widgets and document their parameters.",
    ],
    project: [
      "Build a mini study progress app with local storage.",
      "Add filtering and progress tracking to the Flutter app UI.",
      "Polish app UX: empty states, validation, and loading indicators.",
    ],
    revision: [
      "Review Flutter layout and state concepts from project code.",
      "Refactor one screen for readability and widget reuse.",
      "Prepare a demo walkthrough of app structure and decisions.",
    ],
  },
  sql: {
    foundation: [
      "Write 10 SELECT queries using WHERE, ORDER BY, and LIMIT.",
      "Practice INNER and LEFT JOIN on sample tables with notes.",
      "Solve aggregate basics with GROUP BY and HAVING.",
    ],
    intermediate: [
      "Solve 5 subquery and CTE practice questions.",
      "Practice window functions: ROW_NUMBER, RANK, SUM OVER.",
      "Design a normalized schema for a learning tracker database.",
    ],
    project: [
      "Create schema + seed data + 10 analysis queries for study progress.",
      "Add indexes and compare query execution before and after.",
      "Build an SQL report for weekly completion and weak topics.",
    ],
    revision: [
      "Revise all SQL query patterns and retry 5 difficult questions.",
      "Take one timed SQL challenge set and review mistakes.",
      "Prepare a compact SQL revision sheet with common templates.",
    ],
  },
};

const state = {
  selectedCourses: ["java_dsa", "python", "flutter", "sql"],
  months: 3,
  planStartDate: new Date(),
  baseUrl: "",
  completionPercent: 0,
  totalMinutes: 0,
};

const refs = {
  baseUrl: document.getElementById("baseUrl"),
  months: document.getElementById("months"),
  courseSelect: document.getElementById("courseSelect"),
  saveConfig: document.getElementById("saveConfig"),
  generatePlan: document.getElementById("generatePlan"),
  configNotice: document.getElementById("configNotice"),
  planDay: document.getElementById("planDay"),
  planPhase: document.getElementById("planPhase"),
  planWindow: document.getElementById("planWindow"),
  completion: document.getElementById("completion"),
  focusMinutes: document.getElementById("focusMinutes"),
  updatedAt: document.getElementById("updatedAt"),
  todayTasks: document.getElementById("todayTasks"),
  previewDays: document.getElementById("previewDays"),
  progressForm: document.getElementById("progressForm"),
  logCourse: document.getElementById("logCourse"),
  logStatus: document.getElementById("logStatus"),
  logMinutes: document.getElementById("logMinutes"),
  logNote: document.getElementById("logNote"),
  trackerResponse: document.getElementById("trackerResponse"),
};

function normalizeCourse(value) {
  const key = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
  return COURSE_ALIASES[key] || key;
}

function dateNoTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function resolvePhase(progress) {
  if (progress >= 0.9) return "revision";
  if (progress >= 0.7) return "project";
  if (progress >= 0.35) return "intermediate";
  return "foundation";
}

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function createPlanForDate(forDate) {
  const startDate = dateNoTime(state.planStartDate);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + state.months);

  const totalDays = Math.max(1, Math.ceil((endDate - startDate) / 86400000));
  let dayNumber = Math.floor((dateNoTime(forDate) - startDate) / 86400000) + 1;
  dayNumber = Math.min(Math.max(dayNumber, 1), totalDays);

  const progress = (dayNumber - 1) / totalDays;
  const phase = resolvePhase(progress);

  const tasks = state.selectedCourses.map((course, index) => {
    const list = COURSE_TASK_BANK[course][phase];
    return {
      course,
      text: list[(dayNumber + index * 3) % list.length],
    };
  });

  return {
    startDate,
    endDate,
    dayNumber,
    totalDays,
    phase,
    tasks,
  };
}

function renderCourseChips() {
  refs.courseSelect.innerHTML = "";
  Object.entries(COURSE_LABELS).forEach(([key, label]) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "course-chip";
    chip.textContent = label;
    if (state.selectedCourses.includes(key)) {
      chip.classList.add("active");
    }

    chip.addEventListener("click", () => {
      if (state.selectedCourses.includes(key)) {
        state.selectedCourses = state.selectedCourses.filter((item) => item !== key);
      } else {
        state.selectedCourses.push(key);
      }
      if (!state.selectedCourses.length) {
        state.selectedCourses = ["java_dsa"];
      }
      renderCourseChips();
      renderCourseOptions();
      renderPlan();
    });

    refs.courseSelect.appendChild(chip);
  });
}

function renderCourseOptions() {
  refs.logCourse.innerHTML = "";
  state.selectedCourses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course;
    option.textContent = COURSE_LABELS[course];
    refs.logCourse.appendChild(option);
  });
}

function renderPlan() {
  const today = createPlanForDate(new Date());
  refs.planDay.textContent = `Day ${today.dayNumber}/${today.totalDays}`;
  refs.planPhase.textContent = `Phase: ${today.phase}`;
  refs.planWindow.textContent = `Window: ${formatDate(today.startDate)} to ${formatDate(today.endDate)}`;

  refs.todayTasks.innerHTML = "";
  today.tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = `${COURSE_LABELS[task.course]}: ${task.text}`;
    refs.todayTasks.appendChild(li);
  });

  refs.previewDays.innerHTML = "";
  for (let i = 0; i < 7; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayPlan = createPlanForDate(date);
    const card = document.createElement("article");
    card.className = "preview-card";
    card.innerHTML = `
      <h4>${date.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}</h4>
      <p>Phase: ${dayPlan.phase}</p>
      <p>${COURSE_LABELS[dayPlan.tasks[0].course]}: ${dayPlan.tasks[0].text}</p>
    `;
    refs.previewDays.appendChild(card);
  }
}

function saveSettings() {
  state.baseUrl = refs.baseUrl.value.trim().replace(/\/$/, "");
  const parsedMonths = Number(refs.months.value || 3);
  state.months = Math.min(Math.max(Math.floor(parsedMonths || 3), 1), 24);

  const persisted = {
    baseUrl: state.baseUrl,
    months: state.months,
    selectedCourses: state.selectedCourses,
  };

  localStorage.setItem("learningCommandCenter", JSON.stringify(persisted));
  refs.configNotice.textContent = "Settings saved.";
  renderPlan();
}

function loadSettings() {
  const raw = localStorage.getItem("learningCommandCenter");
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    state.baseUrl = String(parsed.baseUrl || "");
    state.months = Math.min(Math.max(Number(parsed.months || 3), 1), 24);
    state.selectedCourses = Array.isArray(parsed.selectedCourses)
      ? parsed.selectedCourses.map((course) => normalizeCourse(course)).filter((course) => COURSE_LABELS[course])
      : state.selectedCourses;

    if (!state.selectedCourses.length) {
      state.selectedCourses = ["java_dsa", "python", "flutter", "sql"];
    }
  } catch {
    refs.configNotice.textContent = "Could not load saved settings.";
  }
}

async function postProgress(event) {
  event.preventDefault();

  if (!state.baseUrl) {
    refs.configNotice.textContent = "Set n8n Base URL first.";
    return;
  }

  const payload = {
    course: refs.logCourse.value,
    status: refs.logStatus.value,
    minutes: Number(refs.logMinutes.value || 0),
    note: refs.logNote.value.trim(),
  };

  const endpoint = `${state.baseUrl}/webhook/learning-progress`;

  refs.trackerResponse.textContent = "Sending update...";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    refs.trackerResponse.textContent = JSON.stringify(data, null, 2);

    if (data.ok) {
      state.completionPercent = Number(data.completionPercent || 0);
      state.totalMinutes = Number(data.message?.match(/Total Focus Minutes: (\d+)/)?.[1] || 0);
      refs.completion.textContent = `${state.completionPercent}%`;
      refs.focusMinutes.textContent = `Focus Minutes: ${state.totalMinutes}`;
      refs.updatedAt.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
      refs.logNote.value = "";
    }
  } catch (error) {
    refs.trackerResponse.textContent = `Request failed: ${error.message}`;
  }
}

function init() {
  loadSettings();
  refs.baseUrl.value = state.baseUrl;
  refs.months.value = String(state.months);

  renderCourseChips();
  renderCourseOptions();
  renderPlan();

  refs.saveConfig.addEventListener("click", saveSettings);
  refs.generatePlan.addEventListener("click", renderPlan);
  refs.progressForm.addEventListener("submit", postProgress);
}

init();
