# Daily Learning Task Agent (n8n)

This setup gives you a ready n8n workflow that sends daily learning tasks for:
- Java DSA
- Python
- Flutter
- SQL

## Files
- `n8n/daily-learning-agent.workflow.json` - Import this into n8n
- `n8n/.env.example` - Environment variable template

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
6. Test run the workflow.
7. Activate the workflow.

## Schedule
By default, this workflow runs every day at 07:00 local server time.

To change schedule:
- Open `Daily Trigger` node
- Update hour/minute

## Customize tasks
Open `Generate Daily Tasks` node and edit the arrays:
- `java_dsa`
- `python`
- `flutter`
- `sql`

The workflow rotates tasks automatically by date so you get a different mix each day.
