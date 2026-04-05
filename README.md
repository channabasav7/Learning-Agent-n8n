# Daily Learning Task Agent (n8n)

This setup gives you a ready n8n workflow that sends daily learning tasks for:
- Java DSA
- Python
- Flutter
- SQL

It now also builds a roadmap for a full 3-month plan (or any preferred number of months) to complete your selected courses.

## Files
- `n8n/daily-learning-agent.workflow.json` - Import this into n8n
- `n8n/live-learning-tracker.workflow.json` - Real-time progress tracker webhook
- `n8n/.env.example` - Environment variable template
- `frontend/index.html` - Dashboard UI
- `frontend/styles.css` - UI styling
- `frontend/app.js` - Plan generator + live tracker client

## How to use
1. Open n8n.
2. Import `n8n/daily-learning-agent.workflow.json`.
3. Create credentials in n8n:
   - Telegram credentials for `Send Telegram Message` node, OR
   - SMTP credentials for `Send Email` node.
4. Set environment variables in your n8n environment using `n8n/.env.example`.
5. In workflow settings, keep `NOTIFICATION_CHANNEL` as:
   - `telegram` to use Telegram, or
   - `email` to use email.
6. Set roadmap env variables:
   - `PREFERRED_MONTHS=3` (or any preferred value)
   - `SELECTED_COURSES=java dsa,python,flutter,sql` (choose what you want)
   - Optional: `STUDY_PLAN_START_DATE=2026-04-05`
7. Test run the workflow.
8. Activate the workflow.

## Schedule
By default, this workflow runs every day at 07:00 local server time.

To change schedule:
- Open `Daily Trigger` node
- Update hour/minute

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
Use the live tracker workflow to record progress throughout the day and get instant completion stats.

### Setup
1. Import `n8n/live-learning-tracker.workflow.json`.
2. Activate the workflow.
3. Copy the Production webhook URL from `Track Progress Webhook` node.

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
