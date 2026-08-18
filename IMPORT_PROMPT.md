# Discovery pass prompt template

Paste this into a new Claude or ChatGPT conversation (with web search enabled)
whenever you want to run a job search. Fill in the bracketed part, then paste
the JSON it gives you straight into Career Radar's Import page.

---

I'm searching for AEC digital delivery / BIM management leadership roles.
Search [LinkedIn, Naukri, company career pages, Google] for openings matching:

- Role families: Digital Delivery Manager, Digital Engineering Manager, BIM
  Manager, BIM & Digital Delivery Manager, BIM Lead, Digital Delivery Lead,
  Information Manager, BIM Operations Manager, BIM/VDC Manager, Digital
  Engineering Lead (and selectively: Head of Digital Delivery, Director –
  Digital Delivery, Digital Transformation Manager – AEC)
- Locations: Dubai, Abu Dhabi, wider UAE, Delhi NCR, Noida, Greater Noida,
  Gurugram
- Avoid: BIM Modeller, Revit Modeller, BIM Coordinator, Junior Information
  Manager, Civil 3D Specialist, Site Engineer, Planning Engineer/Scheduler,
  and roles requiring a licensed-architect credential
- Prefer large global engineering/architecture consultancies (AECOM, Egis,
  WSP, Arcadis, AtkinsRéalis, Jacobs, Mott MacDonald, Arup, Bechtel, Ramboll,
  COWI, GE Vernova, Gensler, Stantec, Parsons, Turner & Townsend, or
  comparable) over small local contractors or unclear staffing agencies

For each role you find, score it out of 100 using this weighting — and do
**not** just keyword-match; judge whether it's actually a good career move
for a Director-level Digital Delivery / BIM Management leader with 9+ years
AEC experience, ISO 19650 Information Manager Level 3, ACC/CDE governance
background, and reality-capture (Leica RTC360, NavVis VLX) as a differentiator
rather than a primary identity:

- Role & career alignment — 25%
- Leadership / seniority fit — 20%
- BIM & digital delivery technical fit — 20%
- Company quality — 15%
- Location — 10%
- Compensation — 10%

Don't penalize a sector gap (e.g. UK Water, substations, highways, deep
Civil 3D, advanced computational design) if the role is primarily BIM
governance or Digital Delivery leadership — just note it as a gap.

Return your findings as JSON matching this shape exactly — an array, or
`{ "jobs": [...] }`:

```json
{
  "jobs": [
    {
      "external_id": "linkedin-3812345",
      "title": "Digital Delivery Manager",
      "company": "AECOM",
      "location_city": "Dubai",
      "location_country": "UAE",
      "work_mode": "hybrid",
      "employment_type": "Full-time",
      "seniority": "Manager",
      "description": "Short summary of the role in your own words.",
      "source_name": "LinkedIn",
      "source_url": "https://www.linkedin.com/jobs/view/...",
      "official_company_url": "https://aecom.com/careers/...",
      "date_posted": "2026-08-10",
      "salary": {
        "min": 35000,
        "max": 45000,
        "currency": "AED",
        "type": "estimated"
      },
      "fit_score": 84,
      "score_breakdown": {
        "role_alignment": 22,
        "leadership_fit": 17,
        "technical_fit": 17,
        "company_quality": 14,
        "location": 8,
        "compensation": 6
      },
      "strengths": [
        "Directly matches Digital Delivery Manager title and scope",
        "AECOM is a top-tier target company",
        "ISO 19650 explicitly required, matches your certification"
      ],
      "gaps": [
        "Job description emphasizes highways experience, which isn't your background",
        "Salary not published — estimate is based on similar Dubai postings"
      ],
      "fit_reason": "One sentence explaining the overall recommendation."
    }
  ]
}
```

Notes:
- `external_id`, `location_city`, `location_country`, `employment_type`,
  `seniority`, `description`, `official_company_url`, `date_posted`,
  `salary`, `fit_score`, `score_breakdown`, `strengths`, `gaps`, and
  `fit_reason` are all optional — include whatever you can find, but
  `title`, `company`, `source_name`, and `source_url` are required.
- If you can't find a real salary, either omit `salary` entirely or set
  `"type": "estimated"` and say so in `fit_reason` — never state an
  estimated figure as if it were published.
- `work_mode` must be one of `remote`, `hybrid`, `onsite`, or `unknown`.
