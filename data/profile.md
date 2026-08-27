# Sumeet Haldipur — Knowledge Base

<!--
  This file IS the chatbot's brain. Everything the bot knows comes from here.
  To teach it something new, edit this file and redeploy the API.

  ⚠️ THIS FILE IS PUBLIC. It lives in a public GitHub repo and GitHub Pages
  serves it at /data/profile.md. Never put anything here you wouldn't put on
  your resume — no compensation numbers, no candid takes on employers, no
  private contact details beyond what's already on the site.

  Source of truth: Sumeet-Haldipur-Resume.pdf (Aug 2026), plus the portfolio
  site and public LinkedIn.
-->

## Identity

- **Name:** Sumeet Haldipur
- **Current role:** Product Manager (most recently Product Manager II at
  ShareFile, Progress Software)
- **Location:** Mountain View, CA (San Francisco Bay Area)
- **Email:** shaldipu@andrew.cmu.edu
- **Phone:** (650) 764-9078
- **LinkedIn:** linkedin.com/in/shaldipur
- **Portfolio:** sumeethaldipur.github.io/myportfolio

## Summary

Product Manager with three years of experience in end-to-end ownership of
technical products across enterprise B2B software and consumer marketplaces.
Computer engineering background, hands-on with Python and SQL, having shipped
LLM-based matching and validation systems to production. MS in Software
Management at Carnegie Mellon University, conferral December 2027.

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
Coursework: Product Management, AI Engineering Fundamentals, Product
Leadership, Problem Discovery & Definition.

### Sardar Patel Institute of Technology — Aug 2019 to May 2023
Bachelor of Technology, Computer Engineering. Mumbai, India.
GPA 3.86 / 4.00.
Coursework: Data Structures & Algorithms, Computer Networks, Operating
Systems, Database Management Systems.

## Professional experience

### Product Manager II — ShareFile, Progress Software (formerly Citrix ShareFile)
**Apr 2025 – Jul 2026 · Bengaluru, India**

- **Cut client resubmissions from 32% to 18%** for tasks assigned by service
  providers, by introducing ML-based document validation on uploads.
- **Led strategy and roadmap and defined success criteria** for ShareFile's
  **3 mobile and desktop apps** (**6M+ business users**).
- **Scaled mobile adoption:** spearheaded the 0-to-1 development of *ShareFile
  for Clients*, which accounts for **23% of all tasks completed on ShareFile**
  and reached **270K downloads within its first six months**.
- **Reduced client task completion time by 43%** by introducing tailored
  notification and reminder flows in the client app.
- **Deployed MCP agents across 6 APIs** (Salesforce, Jira, and others),
  enabling the entire product team to query customer signals in natural
  language and automate ticket triage.

### Associate Product Manager — Naukri.com, Info Edge
**Oct 2024 – Mar 2025 · Noida, India**

India's largest job portal.

- **Enriched 110K+ Indian localities with 98% sampled accuracy** by using LLMs
  for geospatial entity resolution and geocoding with human-in-the-loop
  validation, powering job recommendations for **120M+ jobseekers**.
- **Expanded jobseeker-institute mapping from 51% to 96%** by enriching the
  database through crawling trusted sources, using similarity scores to
  automate high-confidence matches and routing the rest for human labelling.

### Associate Product Manager — WorkIndia
**Jul 2023 – Sep 2024 · Bengaluru, India**

Blue- and gray-collar job platform.

- **Boosted NPS by 39 points, job application relevance by 54%, and candidates
  contacted per recruiter by 57%** by developing role-specific matching
  algorithms, based on **40+ user interviews, 40K+ survey responses** and
  usage data.
- **Improved the onboarding funnel by 48%** on the jobseeker app (**50M+
  users**) by replacing English-only flows with an image-based approach —
  jobseekers could not read the text, and India's linguistic diversity made
  localization infeasible.

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

### Moody.ai — Emotion-Aware Adaptive Activity Recommendation System
*Python, TensorFlow/Keras, OpenCV, scikit-learn, pandas, NumPy, Flask,
PostgreSQL, Gunicorn, JavaScript, Bootstrap, Git*

An emotion-aware recommendation system that detects a user's mood from facial
expressions and recommends personalized activities to improve well-being.
**Published at IEEE INCET 2023.**

## AI and machine learning experience

Everything Sumeet has shipped that involves AI or ML, gathered in one place.
Use this whenever someone asks about his AI experience, ML experience, whether
he is technical, or how he uses AI in product work.

**Shipped in production:**

- **ML-based document validation (ShareFile).** Flags mismatched client uploads
  before submission. Sumeet set the precision and false-positive thresholds
  himself so correct files were never blocked and no rejection lacked a
  reviewable reason. **Resubmissions fell from 32% to 18%.** This is classical
  ML, not an LLM — worth stating precisely rather than calling it "AI".
- **MCP agents across 6 APIs (ShareFile).** Salesforce, Jira and others behind
  one natural-language query surface, letting the whole product team
  interrogate customer signals and automating ticket triage.
- **LLM-based geospatial entity resolution (Naukri).** Enriched **110K+ Indian
  localities at 98% sampled accuracy** using LLMs for entity resolution and
  geocoding, with human-in-the-loop validation, powering recommendations for
  120M+ jobseekers.
- **LLM-assisted institute mapping (Naukri).** Raised jobseeker-institute
  matching **51% → 96%**, auto-accepting high-confidence similarity matches and
  routing everything below threshold to human labelling rather than trusting
  unverified model output.

**Built himself:**

- **This portfolio assistant.** Retrieval-augmented generation with Jina
  embeddings and full-context prompting, on NVIDIA Nemotron. He benchmarked
  both strategies and shipped full-context after retrieval lost on synthesis
  questions.
- **Moody.ai.** A CNN (modified VGG-16, TensorFlow/Keras) trained on FER-2013
  classifying seven emotions at ~90% accuracy, feeding a content-based
  recommender. Published at IEEE INCET 2023.

**Study:** *Mastering Generative AI for Product Innovation*, Stanford (2025),
and AI Engineering Fundamentals coursework at CMU.

**The judgment that runs through it:** precision and false-positive tradeoffs
set deliberately, and human-in-the-loop wherever unverified model output would
otherwise reach a user.

## Skills

**Product and program management:** product lifecycle management, PRDs,
roadmapping and release planning, strategy, PRFAQ, customer research,
competitive analysis, data-driven decision making, risk mitigation, industry
mapping, data analytics, go-to-market, stakeholder alignment, problem solving,
OKRs and KPIs, Agile methodologies, UX design, A/B testing, feature
prioritization, prompt engineering.

**Technologies:** Python, SQL, HTML/CSS, JavaScript, generative AI, LLMs, RAG,
AI evals, AWS, Tableau, Jira, Figma, Salesforce, REST APIs.

## Awards, leadership, and certifications

- **Mastering Generative AI for Product Innovation**, Stanford University (2025).
- **Best Use of Data Analytics**, CX Excellence Awards (2024).
- **Winner**, Entrepreneurship Case Competition (2022), against 2,000+ teams.
- **Runner-Up** at two Entrepreneurship Case Competitions (2021), each with
  3,000+ teams.
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

Data-led, and specifically root-cause-led. The pattern in most of my work is
that the obvious explanation was wrong and the telemetry said something else.
At ShareFile, everyone assumed clients were abandoning tasks midway — the data
showed they never started. Power users looked like they disliked eSignature;
they were actually routing around slow folder navigation. At WorkIndia,
employer churn looked like a pricing problem and turned out to be a relevance
problem. I try hard to separate what we've confirmed from what the team
assumes.

### How do you approach a problem?

I always start with two questions, in this order:

1. **What is the problem to solve?**
2. **Why is it the biggest problem to solve right now?**

I genuinely believe fifty percent of the job is done the moment you pick the
right problem. Solutioning is the easier half — understanding which problem
actually deserves to be solved, and why it deserves to be solved *now* rather
than later, is the hard part. Most teams skip straight to solutions and end up
building something well-executed that nobody needed.

That's the thread running through my work. At ShareFile the assumed problem was
that clients abandoned tasks midway; the real one was that they never started.
At WorkIndia the assumed problem was pricing; the real one was relevance. In
both cases the solution was almost obvious once the problem was named correctly.

### What drives you?

Empathy, honestly. I'm an empathetic person by nature, and that's the whole
reason I ended up in product management. My motivation for building anything is
to solve a problem someone is actually facing in their life.

That thread runs through everything I've done, not just my job. It's why I took
up leadership roles, why I've worked with NGOs like Dongri to Degree and AIESEC,
and why I moved into product. The goal has always been the same: do something
that has a real impact on society and on people.

It's also why the marketplace work mattered to me. Lead relevance at WorkIndia
and taxonomy at Naukri weren't abstract data problems — they decided whether
someone looking for work actually found it.

### What's your view on AI innovation?

AI is a genuinely important domain and I want to build in it. But innovation
has to be done while accounting for what use case it actually serves, how it
works toward the betterment of humanity, and how people genuinely benefit from
it — not creating random things to appease investors or to look fancy.

If we're building something, it needs to solve an actual problem. That's the
same test I'd apply to any feature; AI doesn't get an exemption from it. It's a
large part of why I chose a program centred on AI product management rather
than just AI.

### Why the move from computer engineering into product?

I have always felt that engineering is more about execution but true value lies in identifying the right problem and then building a solution for the creating the most optimal product. I feel like having technical knowledge but being able to understand what a user truly needs and what the user's problems are is the best way to go since that leads to building with empathy by keeping the user in mind instead of just executing and shipping things without a thought. Product management makes me build things that actually solve a problem in the world whereas my computer engineering background helps me coordinate with engineers and technical stakeholders better by actually understanding the technical feasibilities and often helps me build things on my own.

### Why an MS in Software Management at CMU, and why AI Product Management?

The MS in Software Management program at CMU is centered around AI product management which is what I want to invest in deeply since with the evolution of AI, it is important for me to understand how we build ethically while ensuring that we solve an actual problem rather than just shipping things because we can. The program is taught by Professors who have their own companies or are full time working professionals at big tech companies so learning about how AI is revolutionizing both entrepreneurship as well as tech ventures firsthand is very valuable. Down the line I want to either create my own company or play a pivotal role in shaping the strategy for a company which works very well with this program since it is very much into tech centered entrepreneurship.

### What are you looking for in a Summer 2027 internship?

I am looking to work with a company that thinks problem first and then actually tries to understand whether AI is something that's needed rather than shoving it everywhere just to appease investors or to create a buzz. I want to solve real world problems that afflict majority of the world's population and have an impact towards it. I work the best when I am allowed to own an entire product and have proven to be a great leader and strategist when it comes to product management.

### What's the work you're proudest of?

<!-- TODO: Pick one and tell the story — situation, what you did, what
     happened. -->

### How do you work with engineers?

<!-- TODO: -->

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
