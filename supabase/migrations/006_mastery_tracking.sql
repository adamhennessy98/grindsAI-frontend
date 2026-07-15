-- Curriculum taxonomy, append-only graded events, and derived mastery state.
-- Seeded from SUBJECT_TOPICS in src/lib/constants.ts (excludes "general").
-- subject stores app subject ids (e.g. maths); topic stores display names.

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  topic text not null,
  subtopic text,
  parent_topic_id uuid references public.topics (id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists topics_subject_topic_unique
  on public.topics (subject, topic)
  where subtopic is null;

create index if not exists topics_subject_idx on public.topics (subject);
create index if not exists topics_parent_idx on public.topics (parent_topic_id);

create table if not exists public.interaction_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  session_id uuid,
  -- PRIVACY: truncate or omit raw student answers. Prefer first ~200 chars only.
  -- Full free-text answers must not be stored indefinitely without a retention plan.
  raw_excerpt text,
  correctness text not null
    check (correctness = any (array['correct'::text, 'partial'::text, 'incorrect'::text])),
  misconception_tag text,
  created_at timestamptz not null default now()
);

create index if not exists interaction_events_student_topic_created_idx
  on public.interaction_events (student_id, topic_id, created_at desc);

create index if not exists interaction_events_student_created_idx
  on public.interaction_events (student_id, created_at desc);

create table if not exists public.mastery_state (
  student_id uuid not null references public.profiles (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  proficiency_score numeric not null
    check (proficiency_score >= 0 and proficiency_score <= 1),
  last_updated timestamptz not null default now(),
  trend text
    check (trend is null or trend = any (array['improving'::text, 'declining'::text, 'stable'::text])),
  primary key (student_id, topic_id)
);

create index if not exists mastery_state_student_score_idx
  on public.mastery_state (student_id, proficiency_score);

-- RLS: topics are public-read curriculum; no client writes.
alter table public.topics enable row level security;

drop policy if exists "topics_select_all" on public.topics;
create policy "topics_select_all"
  on public.topics for select
  to authenticated, anon
  using (true);

-- RLS: interaction_events — no client access. Writes/reads via service role only (bypasses RLS).
alter table public.interaction_events enable row level security;
-- intentionally no policies for anon/authenticated

-- RLS: mastery_state — owning student may read; no client writes.
alter table public.mastery_state enable row level security;

drop policy if exists "mastery_state_select_own" on public.mastery_state;
create policy "mastery_state_select_own"
  on public.mastery_state for select
  using (auth.uid() = student_id);

-- Seed taxonomy
insert into public.topics (subject, topic)
values
  ('accounting', 'Conceptual Framework and Accounting Principles'),
  ('accounting', 'Final Accounts and Financial Statements'),
  ('accounting', 'Company Accounting'),
  ('accounting', 'Published Accounts and Interpretation'),
  ('accounting', 'Cash Flow Statements'),
  ('accounting', 'Club, Farm, Service and Non-Profit Accounts'),
  ('accounting', 'Incomplete Records and Control Accounts'),
  ('accounting', 'Cost Accounting'),
  ('accounting', 'Budgeting and Forecasting'),
  ('accounting', 'Marginal Costing and Decision Making'),
  ('accounting', 'Accounting Technology and Computer Applications'),
  ('applied-maths', 'Mathematical Modelling'),
  ('applied-maths', 'Networks and Graphs'),
  ('applied-maths', 'Algorithms and Optimisation'),
  ('applied-maths', 'Kinematics'),
  ('applied-maths', 'Forces and Newtonian Mechanics'),
  ('applied-maths', 'Projectiles and Connected Particles'),
  ('applied-maths', 'Collisions and Impacts'),
  ('applied-maths', 'Circular Motion'),
  ('applied-maths', 'Differential Equations and Rates of Change'),
  ('applied-maths', 'Discrete Dynamical Systems'),
  ('applied-maths', 'Modelling with Data and Technology'),
  ('biology', 'Scientific Method and Investigation'),
  ('biology', 'Ecology and Ecosystems'),
  ('biology', 'Food, Nutrition and Enzymes'),
  ('biology', 'Cell Structure and Cell Function'),
  ('biology', 'Photosynthesis and Respiration'),
  ('biology', 'Genetics, DNA and Evolution'),
  ('biology', 'Microbiology and Biotechnology'),
  ('biology', 'Plant Biology'),
  ('biology', 'Human Biology'),
  ('biology', 'Reproduction and Growth'),
  ('biology', 'Homeostasis and Coordination'),
  ('business', 'People in Business'),
  ('business', 'Enterprise and Entrepreneurship'),
  ('business', 'Management and Leadership'),
  ('business', 'Business Communication'),
  ('business', 'Marketing'),
  ('business', 'Finance and Accounting in Business'),
  ('business', 'Human Resource Management'),
  ('business', 'Business Operations'),
  ('business', 'Domestic Business Environment'),
  ('business', 'International Business Environment'),
  ('business', 'Business Ethics and Social Responsibility'),
  ('chemistry', 'Atomic Structure and Periodic Table'),
  ('chemistry', 'Chemical Bonding'),
  ('chemistry', 'Stoichiometry and Chemical Calculations'),
  ('chemistry', 'Acids, Bases and pH'),
  ('chemistry', 'Volumetric Analysis'),
  ('chemistry', 'Organic Chemistry'),
  ('chemistry', 'Fuels and Heats of Reaction'),
  ('chemistry', 'Rates of Reaction and Equilibrium'),
  ('chemistry', 'Oxidation and Reduction'),
  ('chemistry', 'Water Chemistry and Environmental Chemistry'),
  ('chemistry', 'Electrochemistry'),
  ('chemistry', 'Industrial and Applied Chemistry'),
  ('chemistry', 'Laboratory Experiments and Practical Skills'),
  ('computer-science', 'Computational Thinking'),
  ('computer-science', 'Algorithms and Logic'),
  ('computer-science', 'Programming'),
  ('computer-science', 'Computer Systems'),
  ('computer-science', 'Data Representation'),
  ('computer-science', 'Web and Digital Artefacts'),
  ('computer-science', 'Modelling and Simulation'),
  ('computer-science', 'Robotics'),
  ('computer-science', 'Computers and Society'),
  ('computer-science', 'Ethics and Technology'),
  ('computer-science', 'Applied Learning Tasks'),
  ('economics', 'What Economics Is About'),
  ('economics', 'Economic Decision Making'),
  ('economics', 'Markets, Demand and Supply'),
  ('economics', 'Market Structures and Competition'),
  ('economics', 'Government Intervention and Regulation'),
  ('economics', 'National Income and Economic Growth'),
  ('economics', 'Money, Banking and Inflation'),
  ('economics', 'Employment and Unemployment'),
  ('economics', 'International Trade and Globalisation'),
  ('economics', 'Public Finances and Taxation'),
  ('economics', 'Economic Inequality and Sustainability'),
  ('economics', 'Research Study and Economic Data'),
  ('english', 'Comprehension and Language Skills'),
  ('english', 'Writing and Composition'),
  ('english', 'Functional Writing'),
  ('english', 'Comparative Study'),
  ('english', 'Single Text Study'),
  ('english', 'Shakespearean Drama'),
  ('english', 'Poetry'),
  ('english', 'Unseen Poetry'),
  ('english', 'Media and Visual Literacy'),
  ('english', 'Critical Literacy and Argument'),
  ('english', 'Oral and Aural Language'),
  ('french', 'Oral Communication'),
  ('french', 'Listening Comprehension'),
  ('french', 'Reading Comprehension'),
  ('french', 'Written Production'),
  ('french', 'Grammar and Language Accuracy'),
  ('french', 'Vocabulary and Idiom'),
  ('french', 'Personal Life and Identity'),
  ('french', 'School, Work and Future Plans'),
  ('french', 'Travel, Holidays and Daily Life'),
  ('french', 'Society, Culture and Current Issues'),
  ('french', 'French-Speaking Culture'),
  ('geography', 'Geographical Skills'),
  ('geography', 'Physical Geography'),
  ('geography', 'Regional Geography'),
  ('geography', 'Human Geography'),
  ('geography', 'Economic Geography'),
  ('geography', 'Population and Migration'),
  ('geography', 'Settlement and Urban Geography'),
  ('geography', 'Environmental Geography'),
  ('geography', 'Climate and Weather'),
  ('geography', 'Geoecology'),
  ('geography', 'Fieldwork and Geographical Investigation'),
  ('geography', 'Map, Photograph and Data Interpretation'),
  ('german', 'Oral Communication'),
  ('german', 'Listening Comprehension'),
  ('german', 'Reading Comprehension'),
  ('german', 'Written Production'),
  ('german', 'Grammar and Language Accuracy'),
  ('german', 'Vocabulary and Idiom'),
  ('german', 'Personal Life and Identity'),
  ('german', 'School, Work and Future Plans'),
  ('german', 'Travel, Holidays and Daily Life'),
  ('german', 'Society, Culture and Current Issues'),
  ('german', 'German-Speaking Culture'),
  ('history', 'Historical Skills and Evidence'),
  ('history', 'Research Study Report'),
  ('history', 'Early Modern Ireland'),
  ('history', 'Early Modern Europe and the Wider World'),
  ('history', 'Later Modern Ireland'),
  ('history', 'Later Modern Europe and the Wider World'),
  ('history', 'Politics and Government'),
  ('history', 'Society and Economy'),
  ('history', 'Religion and Culture'),
  ('history', 'War, Conflict and Diplomacy'),
  ('history', 'Nationalism and Identity'),
  ('history', 'Documents-Based Question'),
  ('irish', 'Oral Communication'),
  ('irish', 'Listening Comprehension'),
  ('irish', 'Reading Comprehension'),
  ('irish', 'Written Production'),
  ('irish', 'Grammar and Language Accuracy'),
  ('irish', 'Vocabulary and Idiom'),
  ('irish', 'The Student and Their Environment'),
  ('irish', 'School and Working Life'),
  ('irish', 'The Irish Language Around Us'),
  ('irish', 'Youth Life and Contemporary Issues'),
  ('irish', 'Irish Culture'),
  ('irish', 'Literature, Prose and Poetry'),
  ('maths', 'Algebra'),
  ('maths', 'Functions & Graphs'),
  ('maths', 'Calculus'),
  ('maths', 'Sequences & Series'),
  ('maths', 'Complex Numbers'),
  ('maths', 'Financial Maths'),
  ('maths', 'Coordinate Geometry'),
  ('maths', 'Geometry & Proofs'),
  ('maths', 'Trigonometry'),
  ('maths', 'Probability'),
  ('maths', 'Statistics'),
  ('maths', 'Area, Volume & Measurement'),
  ('physics', 'Mechanics'),
  ('physics', 'Temperature and Heat'),
  ('physics', 'Waves'),
  ('physics', 'Sound'),
  ('physics', 'Light and Optics'),
  ('physics', 'Electricity'),
  ('physics', 'Magnetism and Electromagnetism'),
  ('physics', 'Modern Physics'),
  ('physics', 'Nuclear and Particle Physics'),
  ('physics', 'Applied Electricity'),
  ('physics', 'Mathematical Skills and Formulae'),
  ('physics', 'Laboratory Experiments and Practical Skills'),
  ('spanish', 'Oral Communication'),
  ('spanish', 'Listening Comprehension'),
  ('spanish', 'Reading Comprehension'),
  ('spanish', 'Written Production'),
  ('spanish', 'Grammar and Language Accuracy'),
  ('spanish', 'Vocabulary and Idiom'),
  ('spanish', 'Personal Life and Identity'),
  ('spanish', 'School, Work and Future Plans'),
  ('spanish', 'Travel, Holidays and Daily Life'),
  ('spanish', 'Society, Culture and Current Issues'),
  ('spanish', 'Spanish-Speaking Culture'),
  ('technology', 'Design Process'),
  ('technology', 'Project and Portfolio Work'),
  ('technology', 'Materials and Manufacturing'),
  ('technology', 'Mechanisms and Structures'),
  ('technology', 'Electronics and Control Systems'),
  ('technology', 'Energy and Power'),
  ('technology', 'Information and Communications Technology'),
  ('technology', 'Graphics and Communication'),
  ('technology', 'Systems and Problem Solving'),
  ('technology', 'Safety, Standards and Quality'),
  ('technology', 'Technology, Society and the Environment')
on conflict (subject, topic) where subtopic is null do nothing;
