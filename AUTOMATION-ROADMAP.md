# EstateFlow — Automation Roadmap (Ideas Backlog)

More problems solved = more automations = more revenue. These all reuse the
existing pattern (n8n cron → `/api/n8n/*` endpoint → WhatsApp), so they're cheap
to add unless noted.

## ✅ Already built (Workflows 01–09)
1. WhatsApp Lead Capture
2. AI Follow-up Sequence
3. Rent Reminder
4. Visit Confirmation
5. Visit Reminder
6. Off-Plan Payment Reminder
7. Lease Renewal Alert
8. Lead Re-engagement Campaign
9. Post-Sale Referral Follow-up
+ Golden Visa pipeline (auto-flag AED 2M+ leads)

---

## 🔥 Tier 1 — Directly saves/makes money (build next)

1. **Lead Response-Time SLA Alert** — new lead uncontacted >15 min → escalate to manager on WhatsApp. *Faster response = #1 driver of UAE conversion.* (reuses infra)
2. **Post-Visit Feedback & Close Nudge** — 2h after a completed visit, WhatsApp buyer ("how was it? shall we proceed?") + flag agent. *Captures peak intent → pushes to negotiation.* (reuses infra)
3. **Price-Drop Alert to Matched Buyers** — when a property price is lowered, AI finds leads whose budget now fits and WhatsApps them. *Sells stale inventory fast.* (small new logic)
4. **No-Show Recovery** — visit marked `no_show` → auto-WhatsApp to reschedule. *Recovers 20–30% of no-shows.* (reuses infra)
5. **Mortgage Pre-Approval Nudge** — serious buyer with no financing → send mortgage-partner info. *Unsticks deals + bank referral fees.* (reuses infra)

## ⚡ Tier 2 — Owner visibility & agent productivity

6. **Daily Agent Briefing** — each morning WhatsApp each agent their day (priority leads, visits, follow-ups due). *More calls = more deals.*
7. **Owner KPI Digest** — weekly WhatsApp to owner: new leads, conversion %, revenue, best agent/area. *Owners pay for this visibility.*
8. **Negotiation Stall Alert** — lead in `negotiation` >5 days, no activity → nudge agent to close or release. *Stops deals dying in limbo.*
9. **Duplicate Lead Merge** — same phone across Bayut + WhatsApp → auto-detect/merge, avoid double-contact. *Cleaner data, looks professional.*

## 🏢 Tier 3 — Property-management side (recurring revenue)

10. **Maintenance Escalation** — ticket unresolved 48h → alert manager + reassure tenant.
11. **PDC / Cheque Bounce Alert** — bounced cheque → instant formal notice + agent task.
12. **Ejari Renewal Reminder** — 30 days before Ejari expiry → remind agent + tenant.
13. **New Listing Match** — new property added → AI alerts agent which existing leads it fits.
14. **Weekly Market Report to Leads** — Sunday WhatsApp digest to active leads.

## 💎 Tier 4 — Reputation (compounds)

15. **Google Review Request** — after a closed deal, ask for a Google review (separate from referrals). *More reviews = more inbound = free marketing.*

---

**Recommended next build:** Tier 1 (1–5) as Workflows 10–14 — the ones that visibly print money and reuse existing plumbing.
