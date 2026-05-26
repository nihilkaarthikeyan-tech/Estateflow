# EstateFlow n8n Automation Setup

## What These Workflows Do

| Workflow | Trigger | What It Does |
|---|---|---|
| 01 - WhatsApp Lead Capture | WATI sends webhook | Captures WhatsApp message → AI analyzes → saves lead in CRM → sends auto-reply |
| 02 - Follow-up Sequence | Daily 9 AM Mon-Sat | Finds leads needing follow-up → generates AI message → sends via WhatsApp → logs in CRM |
| 03 - Rent Reminder | Daily 10 AM | Finds tenants with rent due in 3 days → sends WhatsApp reminder with amount + date |

---

## Step 1 — Set Up WATI (WhatsApp Business API)

1. Go to https://www.wati.io → Sign up (free trial available)
2. Connect your WhatsApp Business number
3. Get your **Account ID** and **API Key** from WATI dashboard → Settings → API
4. In WATI → Settings → Webhooks → add your n8n webhook URL (you get this in Step 3)

---

## Step 2 — Add Environment Variables to Vercel

Go to your Vercel project → Settings → Environment Variables → add these:

```
N8N_SECRET          = any_random_secret_string_you_choose   (e.g. "estateflow-n8n-2024")
WATI_API_KEY        = your_wati_api_key_from_wati_dashboard
WATI_ACCOUNT_ID     = your_wati_account_id_from_wati_dashboard
WEBHOOK_SECRET      = estateflow-secret-2024   (already set, keep same)
```

After adding, redeploy Vercel (it will redeploy automatically).

---

## Step 3 — Set Up n8n

### Option A: n8n Cloud (Easiest)
1. Go to https://n8n.io → Start for free
2. Create an account

### Option B: Hostinger (Self-host)
1. Go to Hostinger → buy a VPS (minimum 2GB RAM)
2. SSH into server
3. Run:
```bash
npm install -g n8n
n8n start
```
Or use Docker:
```bash
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

---

## Step 4 — Add Environment Variables in n8n

In n8n → Settings → Variables → add:

| Variable Name | Value |
|---|---|
| ESTATEFLOW_URL | https://your-vercel-app.vercel.app |
| ORG_ID | your organization ID from Supabase profiles table |
| WEBHOOK_SECRET | estateflow-secret-2024 |
| N8N_SECRET | same value you set in Vercel above |
| WATI_API_KEY | your WATI API key |
| WATI_ACCOUNT_ID | your WATI account ID |
| NEXT_PUBLIC_SB_URL | your Supabase project URL |
| SUPABASE_SERVICE_ROLE_KEY | your Supabase service role key |

---

## Step 5 — Import Workflows into n8n

1. In n8n → click **+** → **Import from File**
2. Import in order:
   - `n8n/workflows/01-whatsapp-lead-capture.json`
   - `n8n/workflows/02-followup-sequence.json`
   - `n8n/workflows/03-rent-reminder.json`

---

## Step 6 — Configure Workflow 01 (WhatsApp Capture)

1. Open **01 - WhatsApp Lead Capture**
2. Click on **WATI Webhook** node → copy the webhook URL shown
3. Go to WATI → Settings → Webhooks → paste that URL
4. Click **Activate** (toggle at top of workflow)

---

## Step 7 — Activate All Workflows

1. Open each workflow
2. Toggle **Active** switch at the top
3. All 3 workflows are now live

---

## How to Find Your ORG_ID

1. Go to Supabase → your project → Table Editor → profiles
2. Find your user row → copy the `organization_id` value
3. Paste as `ORG_ID` in n8n variables

---

## Testing

### Test WhatsApp Lead Capture:
Send a WhatsApp message to your business number. Within seconds:
- Lead should appear in EstateFlow → Leads
- You should receive an auto-reply on WhatsApp

### Test Follow-up Manually:
In n8n → open Workflow 02 → click **Test Workflow** → it will run immediately

### Test Rent Reminder Manually:
In n8n → open Workflow 03 → click **Test Workflow** → check console for output

---

## Total Cost Estimate

| Service | Cost |
|---|---|
| WATI | ~$40/month (or free trial) |
| n8n Cloud | Free (up to 5 workflows) |
| n8n Self-host on Hostinger VPS | ~₹800/month |
| Everything else | Already paid (Vercel, Supabase) |
