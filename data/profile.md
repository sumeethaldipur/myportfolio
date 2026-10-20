# Sumeet Haldipur — Knowledge Base

<!--
  This file IS the chatbot's brain. Everything the bot knows comes from here.
  To teach it something new, edit this file and redeploy the API.

  ⚠️ THIS FILE IS PUBLIC. It lives in a public GitHub repo and GitHub Pages
  serves it at /data/profile.md. Never put anything here you wouldn't put on
  your resume — no compensation numbers, no candid takes on employers, no
  private contact details beyond what's already on the site.

  Source of truth: ~/Desktop/Sumeet_Haldipur_Resume.pdf (Oct 2026), plus the
  portfolio site and public LinkedIn. NOTE: that resume lists
  sumeethaldipur.work@gmail.com, but Sumeet asked on 2026-10-19 to keep the
  CMU address everywhere on the site. Do not swap it.
-->

## Identity

- **Name:** Sumeet Haldipur
- **Current role:** Product Manager (most recently Product Manager II at
  ShareFile, Progress Software)
- **Location:** Mountain View, CA (San Francisco Bay Area)
- **Email:** shaldipu@andrew.cmu.edu
- **Phone:** (650) 764-9078
- **LinkedIn:** linkedin.com/in/shaldipur
- **Portfolio:** sumeethaldipur.com

## Summary

Product Manager with three years of experience in end-to-end ownership of
technical products across enterprise B2B software and consumer marketplaces.
Outcome-driven, with a computer engineering background and hands-on Python and
SQL — driving growth, retention and customer experience through 0-to-1 launches
and user-centric features. MS in Software Management at Carnegie Mellon
University, conferral December 2027.

Cumulative reach across products owned: 175M+ users.

## Current status and availability

**This is the single most important thing for a recruiter to learn.**

- Enrolled at **Carnegie Mellon University**, MS in Software Management,
  Mountain View campus, **Aug 2026 – Dec 2027**.
- **Available May 2027 for a 12-week internship** (Summer 2027).
- **Conferral December 2027** — a full semester remains after the summer
  internship window, so a return offer has a natural runway.
- Based in Mountain View, CA; open to Bay Area and remote roles.

## Education

### Carnegie Mellon University — Aug 2026 to Dec 2027
Master of Science in Software Management. Mountain View, CA.
Teaching Assistant, 18-658SV Software Requirements & Interaction Design.
Coursework: Product Management, AI Engineering, Product Leadership, Problem
Discovery & Definition.

### Sardar Patel Institute of Technology — Aug 2019 to May 2023
Bachelor of Technology, Computer Engineering. Mumbai, India.
GPA 3.9 / 4.00.
Coursework: Project Management, Database Management Systems, Big Data
Analytics, Data Structures & Algorithms.

## Professional experience

### Product Manager II — ShareFile, Progress Software (formerly Citrix ShareFile)
**Apr 2025 – Jul 2026 · Bengaluru, India**

- **Owned end-to-end product strategy and execution** for ShareFile's mobile
  and desktop apps (**6M+ business users**), across Windows, Mac, Android and
  iOS.
- **Led the zero-to-one development of the *ShareFile for Clients* mobile
  app**, driving mobile to account for **23% of all client task completions**
  across platforms within the first six months.
- **Reduced average client task completion time by 43%** by introducing
  tailored notifications and reminders, letting businesses collect documents
  and signatures faster.
- **Increased eSignature usage on the Desktop App by 31%** by streamlining the
  signing workflow and reducing friction.

### Associate Product Manager — Naukri.com, Info Edge
**Oct 2024 – Mar 2025 · Noida, India**

India's largest job portal.

- **Helmed the taxonomy charter** for India's largest job platform (**120M+
  jobseekers**), correcting and enriching the data behind algorithms across
  **14 separate Info Edge companies**.
- **Identified patterns, standardized data, built scalable processes and
  leveraged LLMs** to enhance data mapping: **+47% jobseeker location
  mapping**, **+60% language mapping** and **+25% institute mapping** against
  Naukri's database.
- **Drove a 104% increase in institute coverage** by scraping multiple sources
  and standardizing the institute names jobseekers commonly mis-enter.

### Associate Product Manager — WorkIndia
**Jul 2023 – Sep 2024 · Bengaluru, India**

Blue- and gray-collar job platform.

- **Raised NPS by 19 points and leads consumed per employer by 53%** by
  digging into lead relevance and product usability on a **50M+ jobseeker**
  portal through extensive data analysis and user interviews.
- **Increased relevant job applications by 54%** by owning the irrelevant-
  applications problem end to end, from identification through implementation.
- **Improved the onboarding funnel by 48%** by tracing drop-off to flow
  comprehension and shipping an image-based onboarding flow — jobseekers could
  not read the text, and India's linguistic diversity made localization
  infeasible.

## Internships

### Associate Product Manager Trainee — WorkIndia
**Jan 2023 – Jun 2023**

Drove SEO and schema changes that lifted Google for Jobs ranking by **9
places**, increasing site visitors **34%** and app downloads **27%**.

### Risk Advisory Intern — Deloitte
**Jan 2022 – Jun 2022**

Ran IT General Controls testing across access management, change management,
and data center operations for BFSI clients.

## Projects

### AI-Powered Portfolio Assistant
*JavaScript, Node.js, Vercel Serverless, NVIDIA Nemotron 3.5, RAG (Jina
Embeddings), OpenAI SDK, SSE, HTML/CSS*

This assistant. A portfolio featuring an LLM assistant that answers recruiter
questions about Sumeet's background, experience and projects, combining RAG
with Jina embeddings and full-context prompting through an automatic fallback
mechanism.

### the right job — Job-Hunting Agent That Compounds
*Data AI Hackathon, SF · team project · github.com/RoderickQiu/data-ai-hack*

An agent that runs the same job-search loop every day and gets cheaper,
sharper and quieter each time. The insight is that job search is a memory
problem, not a search problem: most tools relearn your taste every morning.
Between day 1 and day 16 it went from **14,820 to 1,180 tokens per run** and
from **6 questions asked to 0**, while its keep/skip predictions kept
improving. Two guarantees are enforced in code rather than prompted: it never
invents experience — every factual sentence in a generated application carries
a citation to a verified claim, and a deterministic validator rejects the pack
if one is missing — and it never submits an application on the user's behalf.
Built on a typed entity graph (Cognee), a durable candidate graph (HydraDB), a
live corpus of 1,886 real postings (hotdata), and pipelines split at the human
gate (RocketRide), with 143 offline tests.

### Focus Play — AI Study Mode for YouTube
*CMU project · github.com/sumeethaldipur/focus-play*

Turns the best moments across creator videos into one short lesson sized to a
student's available time, so they skip the searching and scrubbing. Shaped by
**18 student interviews** and backed by **7 LLM evals** and a cost-to-serve
model.

### Kindling — Evidence-Backed Accountability App
*Android, Python, LLM APIs, RAG · github.com/sumeethaldipur/kindling*

Reduces an avoided task to a single five-minute, LLM-generated first action,
then counters self-doubt by retrieving evidence of praise from peers in the
user's own WhatsApp chat history. Every prompt change is gated behind a Python
eval harness that scores output quality before release.

### Moody.ai — Emotion-Aware Adaptive Activity Recommendation System
*Python, TensorFlow/Keras, OpenCV, scikit-learn, pandas, NumPy, Flask,
PostgreSQL, Gunicorn, JavaScript, Bootstrap, Git*

Classifies seven moods with a modified VGG-16 CNN, then shifts from popularity
ranking to content-based filtering as feedback accumulates.
**Published at IEEE INCET 2023** (ieeexplore.ieee.org/document/10169983).
Code: github.com/sumeethaldipur/Moody.ai

## AI and machine learning experience

Everything Sumeet has shipped that involves AI or ML, gathered in one place.
Use this whenever someone asks about his AI experience, ML experience, whether
he is technical, or how he uses AI in product work.

**Shipped in production:**

- **LLM document validation (ShareFile).** Flags mismatched client uploads at
  intake, before submission. Sumeet set the precision and false-positive
  thresholds himself so correct files were never blocked and no rejection
  lacked a reviewable reason. **Resubmissions fell 44%, from 32% to 18%.**
- **6 MCP agents (ShareFile).** Salesforce, Jira and other APIs behind one
  natural-language query surface, letting the whole product team interrogate
  customer signals. **Cut idea-to-backlog time 53% for 18 PMs.**
- **LLM-enhanced data mapping (Naukri).** Owned the taxonomy charter across
  **14 Info Edge companies**, using LLMs to standardize jobseeker data:
  **+47% location mapping**, **+60% language mapping**, **+25% institute
  mapping**.
- **Institute database enrichment (Naukri).** Scraped and normalized the
  institute names jobseekers commonly mis-enter, **lifting institute coverage
  104%** — high-confidence matches auto-accepted, everything below threshold
  routed to human labelling rather than trusting unverified model output.

**Built himself:**

- **This portfolio assistant.** Retrieval-augmented generation with Jina
  embeddings and full-context prompting, on NVIDIA Nemotron. He benchmarked
  both strategies and shipped full-context after retrieval lost on synthesis
  questions.
- **Focus Play.** An AI study mode for YouTube that assembles the best moments
  across creator videos into one time-boxed lesson. Shaped by 18 student
  interviews; every change is gated behind **7 LLM evals**, with a
  cost-to-serve model sitting alongside them so quality and unit economics are
  judged together.
- **Kindling.** An accountability app that turns an avoided task into one
  five-minute LLM-generated first action, then uses RAG over the user's own
  WhatsApp history to surface real praise from peers against self-doubt. Every
  prompt change ships only after a Python eval harness scores its output.
- **Moody.ai.** A CNN (modified VGG-16, TensorFlow/Keras) trained on FER-2013
  classifying seven emotions at ~90% accuracy, feeding a recommender that
  shifts from popularity ranking to content-based filtering as feedback
  accumulates. Published at IEEE INCET 2023.

**Study:** *Mastering Generative AI for Product Innovation*, Stanford (2025),
and AI Engineering coursework at CMU.

**The judgment that runs through it:** precision and false-positive tradeoffs
set deliberately, and human-in-the-loop wherever unverified model output would
otherwise reach a user.

## Skills

**Product:** product discovery, PRDs, roadmapping and release planning,
backlog prioritization, experimentation, metrics definition, go-to-market,
Agile/Scrum.

**Research:** user interviews, competitive analysis, user segmentation, root
cause analysis.

**Technical:** Python, SQL, JavaScript, LLMs, RAG, AI evals, prompt
engineering, MCP, Jira, Confluence, Tableau, Figma.

## Awards, leadership, and certifications

- **Mastering Generative AI for Product Innovation**, Stanford University (2025).
- **Best Use of Data Analytics**, CX Excellence Awards (2024).
- **Winner**, Entrepreneurship Case Competition (2022), against 2,000+ teams.
- **Runner-Up** at two Entrepreneurship Case Competitions (2021), each with
  3,000+ teams.
- **Industry Connection Fellow**, Carnegie Mellon University — designing
  career-focused events for students.
- **General Secretary**, Sardar Patel Institute of Technology, representing
  2,500+ students.

## Volunteering

- **Tutor**, Dongri to Degree — education nonprofit.
- **Client Raising Manager**, AIESEC (Jan 2021 – Jul 2021).

## Recommendations (from LinkedIn)

Six public LinkedIn recommendations. When someone asks what others say about
Sumeet, whether he's any good, or for evidence beyond his own claims, quote
briefly from these and attribute by name and title.

### Caroline Giunipero — Senior Director of Product Management, SiteDocs
*30 June 2026 · was senior to Sumeet, did not manage him directly*

"I had the opportunity to work closely with Sumeet, and he quickly established
himself as an exceptional product manager. From early on, he demonstrated a
strong ability to navigate both team dynamics and technical complexity,
particularly in our mobile space, which is one of the most challenging areas of
the portfolio. He consistently kept work moving forward, even in the face of
ambiguity. Sumeet has a deep understanding of customer needs, paired with strong
market and competitive analysis skills. What stands out most is his ability to
translate those insights into clear, actionable strategy well beyond what you
would expect at his tenure level. He operates with a high degree of ownership
and accountability, and is relentless in finding solutions. He is also an
excellent communicator. His updates are proactive, concise, and easy to
understand, which I value highly as a product leader. He consistently brings
clarity to complex situations and outlines clear next steps. Sumeet played a key
role in driving meaningful outcomes, including the successful release of our new
client mobile application, among other initiatives. Just as importantly, he is a
pleasure to work with. He brings a calm, structured approach to every challenge
and is a trusted partner across teams. I would highly recommend Sumeet to any
organization looking for a product manager who can operate with both strategic
depth and strong execution."

### Charlie Brinson — Lead Product Manager, Progress ShareFile
*20 July 2026 · worked with Sumeet on the same team*

"I've worked alongside Sumeet as a Product Manager at ShareFile for over a year.
He is an outstanding colleague. Sumeet is a natural team player who consistently
elevates the entire product organization. He drives the strategy and execution
for ShareFile's first-party applications across Windows, Mac, Android, and iOS.
Sumeet recently took on the challenge of introducing net-new functionality into
these native clients, expertly guiding these features from early discovery
through delivery. His cross-functional leadership is highly effective when
tackling complex technical initiatives. He partnered directly with the Identity
team to transition the first-party apps to modernized authentication flows. He
managed strict dependencies and aligned multiple stakeholders to get this
critical update across the finish line. Sumeet balances strong technical acumen
with a deeply collaborative mindset. He knows exactly how to rally engineering
teams around a shared roadmap. Any product organization would be incredibly
lucky to have him."

### Nitin Kumar — Director of Product Management, Progress ShareFile
*28 July 2026 · managed Sumeet directly*

"I had the pleasure of working closely with Sumeet at ShareFile, where he
consistently demonstrated the qualities of a high-impact Product Manager. Sumeet
is a quick learner who combines strong ownership, accountability, and curiosity
with a relentless drive to deliver results. He made significant contributions to
our desktop and mobile product portfolio, including playing a key role in the
successful launch of the ShareFile Client Mobile App — one of the most impactful
initiatives for the business. He has a knack for understanding customer needs,
collaborating effectively across teams, and driving execution from concept to
delivery. Beyond his individual contributions, Sumeet is an outstanding team
player who is always willing to step in, help others, and do what is best for
the team and our customers. His positive attitude, growth mindset, and ability
to take on new challenges made him a valuable asset to ShareFile. As he heads to
Carnegie Mellon University for his master's degree, I have no doubt he will
continue to excel and make a meaningful impact. I strongly recommend Sumeet and
wish him tremendous success in this exciting next chapter."

### Snehal Kumar — EVP of Product Management, Info Edge India Ltd. (Naukri.com)
*21 August 2026 · was senior to Sumeet, did not manage him directly*

"I remember fast-tracking Sumeet's hiring process immediately after interviewing
him — his first-principles thinking was that impressive. He had a rare ability to
look at problems without being constrained by how things had traditionally been
done and build solutions from the ground up. After joining, he quickly proved
that we had made the right decision. His ability to work independently and
navigate ambiguity, especially at such a young age, was a pleasant surprise.
Once he understood the objective, he required very little guidance and took
complete ownership of moving the work forward. Sumeet was also among the early
few who genuinely thought AI-first. He did not use AI simply because it was the
latest trend; he consistently found practical ways to use it to improve the
speed, quality, and impact of his work. His ability to align stakeholders stood
out equally. He listened to different perspectives, communicated his thinking
clearly, and built consensus around the way forward. He was also never hesitant
to present to senior leadership and handled such conversations with confidence
and clarity. Sumeet brings together independent thinking, ownership, stakeholder
management, and an instinct for using emerging technology to create impact. I am
confident he will continue to do exceptionally well."

### Thufail Mohammed — Senior UX Designer, Progress ShareFile
*20 July 2026 · worked with Sumeet on the same team*

"I've had the pleasure of working with Sumeet as my Product Manager on the Client
Mobile App team at Progress ShareFile, and it has been a great experience. He is
someone who always brings clarity, professionalism, and a positive attitude to
every challenge. What I admire most about Sumeet is the way he thinks about the
product. He doesn't just focus on solving the problem in front of him but he
looks at the bigger picture and finds solutions that are practical, scalable,
and future-ready. I also admire his strong interest in AI and how he explores
ways it can create better product experiences and solve real user problems. His
forward-thinking mindset makes him someone who is always looking for what's next.
Sumeet is a great collaborator who works closely with different teams, keeps
everyone aligned, and communicates ideas in a way that's simple and easy to
understand. As a designer, I really appreciate how clearly he explains the
reasoning behind product decisions, which makes collaboration much smoother. He
never misses an opportunity to appreciate the team's efforts, and that creates a
supportive and motivating environment. He is not only an exceptional Product
Manager but also a great teammate, mentor and a good friend."

### Aditya Muralidharan — Senior Product Designer, Simpplr
*9 September 2024 · was senior to Sumeet, did not manage him directly*

"Sumeet — A growth-minded PM, who excels at maintaining a clear, metrics-driven
focus, constantly using data to guide decisions and ensure product success. His
ability to pivot swiftly based on feedback while staying agile in the process
makes him a standout. What sets him apart even further is his genuine commitment
to learning and adapting in real-time, always seeking to improve and refine his
approach."

<!-- ─────────────────────────────────────────────────────────────────────
     EVERYTHING ABOVE is factual record from your resume, site, and LinkedIn.
     EVERYTHING BELOW is your voice. This is what separates a good bot from a
     resume parser — fill these in and it stops sounding generic.
     ───────────────────────────────────────────────────────────────────── -->

## In Sumeet's own words

These are Sumeet's own answers. When a question matches one of these, lead with
this framing rather than reciting bullet points.

### What kind of PM are you?

Data-led, and more specifically root-cause-led. A pattern runs through most of
my work: the obvious explanation proves wrong, and the telemetry points
elsewhere. At ShareFile, the working assumption was that clients abandoned
tasks midway; the data showed they were never starting them. Power users
appeared to dislike eSignature, when in fact they were routing around slow
folder navigation. At WorkIndia, employer churn presented as a pricing problem
and proved to be a relevance problem. I work to keep a clear line between what
we have confirmed and what we have assumed.

### How do you approach a problem?

I begin with two questions, in this order:

1. **What is the problem to solve?**
2. **Why is it the most important problem to solve now?**

A substantial share of the work is settled the moment the right problem is
chosen. Solution design is the more tractable half; identifying which problem
genuinely merits attention, and why it merits attention *now* rather than
later, is the harder one. Without that step, a team can execute well and still
deliver something its users did not need.

That thread runs through my work. At ShareFile, the assumed problem was that
clients abandoned tasks midway; the actual problem was that they never started
them. At WorkIndia, the assumed problem was pricing; the actual problem was
relevance. In both cases the solution became clear once the problem was named
correctly.

### What drives you?

Empathy. I am an empathetic person by nature, and it is the reason I moved into
product management. My motivation for building anything is to address a problem
someone is genuinely facing.

That thread runs through more than my work. It is why I have taken on
leadership roles, why I have worked with organisations such as Dongri to Degree
and AIESEC, and why I moved into product. The intent has been consistent: to do
work that has a real effect on people.

It is also why the marketplace work mattered to me. Lead relevance at WorkIndia
and taxonomy at Naukri were not abstract data problems; they determined whether
someone looking for work actually found it.

### What's your view on AI innovation?

AI is a genuinely important domain, and it is where I want to build. I believe
innovation in it should be grounded in the use case it serves, the benefit
people actually receive, and the ethical implications of deploying it at scale.
Novelty on its own is not a sufficient reason to ship.

If we are building something, it should address a real problem. That is the
same standard I would apply to any feature, and AI is not exempt from it. It is
a large part of why I chose a programme centred on AI product management rather
than on AI alone.

### Why the move from computer engineering into product?

Engineering taught me how things are built; product management is where I can
shape what gets built, and why. For me the greater leverage sits in identifying
the right problem and then designing the most effective solution to it.

A technical foundation paired with a genuine understanding of user needs is the
strongest combination I know of. It supports building with empathy, with the
user held in view throughout rather than considered after the fact. My computer
engineering background also helps me work closely with engineers and technical
stakeholders, because I can reason about feasibility and trade-offs directly —
and it often lets me build things myself.

### Why an MS in Software Management at CMU, and why AI Product Management?

CMU's MS in Software Management is centred on AI product management, which is
the area I want to invest in deeply. As AI continues to evolve, I want to
understand how to build in it ethically while ensuring we are solving a real
problem rather than shipping capability for its own sake.

The programme is taught by faculty who run their own companies or work full
time at major technology firms, so there is a direct line to how AI is
reshaping both entrepreneurship and established tech ventures. Longer term, I
would like either to start my own company or to help shape strategy at one, and
the programme's focus on technology-centred entrepreneurship aligns closely
with that.

### What are you looking for in a Summer 2027 internship?

I am looking for a team that works problem-first: one that starts from a
clearly defined user need and then asks honestly whether AI is the right
instrument for it, rather than applying it by default. How AI can be used
ethically to create genuine human impact is the question I most want to work
on.

I am drawn to problems that affect people at scale, where a better product
decision translates into a measurable difference in someone's day. I do my best
work with end-to-end ownership of a product, and my experience has been in
leading cross-functional teams and setting product direction.

### What's the work you're proudest of?

The matching and ranking work at WorkIndia, a job platform for blue- and
gray-collar roles.

Employers reached candidates two ways: a database product, where they browsed
candidate profiles and decided who was worth contacting, and job posts on the
app that candidates applied to directly. Underneath both ran a persistent
complaint — the candidates were not relevant. I was asked to improve relevance,
which in practice meant improving employer satisfaction.

I began by establishing what employers actually meant by "relevant" rather than
assuming it. I took the five role types with the highest posting volume and the
lowest satisfaction, and worked with the consumer insights team on a
large-scale survey: we called employers about candidates they had connected
with very recently, asked whether each was relevant, and then asked why — which
parameters had driven that judgement. I ran my own user interviews alongside
it.

Mapping those answers back to role types surfaced the real problem. The
definition of relevance varies drastically from one role to the next, and our
ranking logic did not reflect that at all: we had a one-size-fits-all
algorithm, so whatever you posted for, candidates were ordered the same way.

To test that against data rather than interviews alone, I defined a **match
score** that took the role-specific parameters as inputs. Satisfaction rose and
fell with it, which gave me the same answer from two independent directions. I
then rebuilt the matching and ranking algorithm around that score, so each role
type surfaced the candidates it actually needed.

Net Promoter Score rose **19 points** over the following year. What I valued
most was that employers raised the improvement unprompted, saying the quality
of candidates had changed significantly.

### How do you work with engineers?

Collaboratively, and as early in the process as possible. I treat engineers as
participants in the product process rather than recipients of its output, which
means bringing them in during discovery rather than at handoff.

In practice that means establishing regular cadences to brainstorm together and
involving engineers directly in discovery work. When the team has seen the
problem first-hand, the reasoning behind a decision travels with the decision
itself: trade-offs are better informed when we reach them, and the solutions
are often ones I would not have arrived at on my own.

### Tell me about a time something failed.

<!-- TODO: A real one. Bots that only know wins read as brochures. -->

### What do you do outside of work?

<!-- TODO: -->

## Boundaries

Questions the bot should decline and redirect to email:

- Compensation expectations or salary history.
- Opinions about specific employers, managers, or colleagues.
- Visa, immigration, or work-authorization specifics.
- Anything personal not covered above.
- Confidential product details, unreleased roadmaps, or internal metrics
  beyond the outcomes already published here.
