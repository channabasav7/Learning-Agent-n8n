# Daily Learning Task Agent (Single n8n Workflow)

This setup gives you a single n8n workflow that powers your website-only learning system (no Telegram or Email dependency) for:
- Java DSA
- Python
- Flutter
- SQL

It now also builds a roadmap for a full 3-month plan (or any preferred number of months) to complete your selected courses.

The daily plan workflow uses an AI agent in n8n to generate dynamic tasks per selected course. If AI credentials are missing or the model call fails, it automatically falls back to deterministic tasks.

## Files
- `n8n/learning-agent-unified.workflow.json` - Single workflow with both APIs
- `n8n/.env.example` - Environment variable template
- `frontend/index.html` - Dashboard UI
- `frontend/styles.css` - UI styling
- `frontend/app.js` - Plan generator + live tracker client

## How to use
1. Open n8n.
2. Import `n8n/learning-agent-unified.workflow.json`.
3. Set environment variables in your n8n environment using `n8n/.env.example`.
4. Set roadmap env variables:
   - `PREFERRED_MONTHS=3` (or any preferred value)
   - `SELECTED_COURSES=java dsa,python,flutter,sql` (choose what you want)
   - Optional: `STUDY_PLAN_START_DATE=2026-04-05`
5. Set AI variables:
   - `OPENAI_API_KEY=...`
   - Optional: `OPENAI_MODEL=gpt-4o-mini`
   - Optional: `OPENAI_BASE_URL=https://api.openai.com/v1`
6. Activate the workflow.
7. Use the daily plan webhook from your website.

## Daily Plan API
- Method: `POST`
- Path: `/webhook/daily-learning-plan`

Example body:
```json
{
  "preferredMonths": 3,
  "selectedCourses": ["java dsa", "python", "flutter", "sql"],
  "studyPlanStartDate": "2026-04-05"
}
```

This returns today's structured tasks plus a 7-day preview for the frontend.

AI-related response fields:
- `aiEnabled` - `true` when AI generated tasks were used
- `aiProvider` - currently `openai`
- `aiCoachTip` - optional daily coaching tip

## Customize tasks
Open `Generate Daily Tasks` node and edit the arrays:
- `courseTaskBank.java_dsa`
- `courseTaskBank.python`
- `courseTaskBank.flutter`
- `courseTaskBank.sql`

Each course has phase-based tasks:
- `foundation`
- `intermediate`
- `project`
- `revision`

The workflow maps each day in your plan window to a phase and sends daily actionable tasks from that phase.

## Live Learning Tracker
Use the live tracker endpoint in the same workflow to record progress throughout the day and get instant completion stats.

### Setup
1. Activate the same unified workflow.
2. Copy the Production webhook URL from `Track Progress Webhook` node.

### Webhook endpoint
- Method: `POST`
- Path: `/webhook/learning-progress`

### JSON body
```json
{
   "course": "python",
   "status": "done",
   "minutes": 45,
   "note": "Solved 3 dict problems"
}
```

### Supported values
- `course`: `java dsa`, `python`, `flutter`, `sql`
- `status`: `done`, `in_progress`, `skip`
- `minutes`: optional number
- `note`: optional text

### Example command (PowerShell)
```powershell
Invoke-RestMethod -Method POST -Uri "https://YOUR_N8N_HOST/webhook/learning-progress" -ContentType "application/json" -Body '{"course":"flutter","status":"in_progress","minutes":30,"note":"UI layout practice"}'
```

The response returns a live snapshot with completion percentage, per-course stats, and total focus minutes for today.

## Frontend Dashboard
The frontend gives you one place to:
- Configure your n8n base URL
- Set preferred months and selected courses
- See today's tasks and 7-day preview
- Send live progress updates to your tracker webhook

### Run locally
Use a local static server (recommended):

```powershell
cd frontend
python -m http.server 5500
```

Open:
- `http://localhost:5500`

### Frontend usage
1. Enter your n8n base URL (example: `https://your-n8n-host`).
2. Choose preferred months and selected courses.
3. Click `Save Settings` and `Generate Plan`.
4. Use `Log Live Progress` to send updates.
5. Check the response panel for completion percentage and stats.
