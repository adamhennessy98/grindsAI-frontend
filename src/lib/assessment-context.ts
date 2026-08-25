import { getTopic } from "@/lib/constants";

type AssessmentSection = {
  title: string;
  /** Annual briefs are only relevant to the matching examination cohort. */
  year?: number;
  topics?: string[];
  keywords?: string[];
  guidance: string;
};

type SubjectAssessmentPack = {
  subject: string;
  sections: AssessmentSection[];
};

const ASSESSMENT_CONTEXT: Record<string, SubjectAssessmentPack> = {
  accounting: {
    subject: "Accounting",
    sections: [
      { title: "Assessment conventions", guidance: "Use the layouts, labels, workings and presentation conventions established by the Leaving Certificate syllabus and official marking schemes. When helping with accounts, distinguish an arithmetical error from an incorrect treatment and show where marks are commonly earned for correct method and format." },
      { title: "Current standards and law", keywords: ["standard", "law", "legislation", "company", "tax", "ethics"], guidance: "Accounting and company-law details can change. Do not present an unverified contemporary rule, tax rate or accounting-standard detail as examinable fact. Ask for the student’s class material or identify that the detail should be checked against the current official guidance." },
    ],
  },
  "applied-maths": {
    subject: "Applied Mathematics",
    sections: [
      { title: "Verified 2023 Mathematical Modelling Project brief", year: 2023, keywords: ["2023", "2022/23", "sporting projectile", "projectile motion"], guidance: "For the Leaving Certificate 2023 cohort, the Mathematical Modelling Project used the motion of a sporting projectile. Students selected one or more aspects to model through the modelling cycle. It was common to Higher and Ordinary level; treat it as the 2023 brief only." },
      { title: "Verified 2024 Mathematical Modelling Project brief", year: 2024, keywords: ["2024", "2023/24", "rollercoaster", "fairground"], guidance: "For the Leaving Certificate 2024 cohort, the Mathematical Modelling Project concerned rollercoaster motion. Students modelled one or more aspects of the motion, including possible force and energy considerations, through the modelling cycle. Treat it as the 2024 brief only." },
      { title: "Verified 2025 Mathematical Modelling Project brief", year: 2025, keywords: ["2025", "2024/25", "population change", "population"], guidance: "For the Leaving Certificate 2025 cohort, the official Mathematical Modelling Project brief concerned population change in humans or other organisms. It asked students to select one or more aspects of population change and model them through the full modelling cycle. Relevant approaches named in the brief include linear, polynomial, logarithmic or exponential functions, recurrence relations and difference equations. It was common to Higher and Ordinary level; treat it as the 2025 brief only." },
      { title: "Verified 2026 Mathematical Modelling Project brief", year: 2026, keywords: ["2026", "2025/26", "collision", "collisions", "impact", "impacts", "coefficient of restitution"], guidance: "For the Leaving Certificate 2026 cohort, the Mathematical Modelling Project concerns impacts and collisions. Students select one or more aspects to model through the modelling cycle, with relevant ideas including forces, momentum, energy and coefficient of restitution. Treat it as the 2026 brief only." },
      { title: "Formulae, notation and working", guidance: "Use the Formulae and Tables booklet context when it is supplied. In solutions, prioritise a clear model, stated assumptions, diagram or coordinate convention where helpful, units, relevant supporting work and a conclusion that answers the question." },
      { title: "Modelling conventions", keywords: ["model", "assumption", "projectile", "force", "mechanics", "differential"], guidance: "Make physical and mathematical assumptions explicit. Do not silently switch coordinate directions, signs, units or approximations. Check whether a result is physically reasonable before presenting it. For assessed project work, provide teaching, planning and feedback rather than text or calculations for the student to submit as their own." },
    ],
  },
  biology: {
    subject: "Biology",
    sections: [
      { title: "Mandatory practical work", topics: ["scientific-method-investigation"], keywords: ["experiment", "practical", "investigation", "apparatus", "control", "error"], guidance: "Practical questions should be grounded in the prescribed practical activities: aim, apparatus, method, control variables, observations/results, precautions, sources of error and improvements. Do not invent data as if it were observed by the student." },
      { title: "Scientific explanation", guidance: "Use precise biological vocabulary and connect structure to function. Separate a definition, process, example and experimental evidence so the student can see what an exam command word requires." },
    ],
  },
  business: {
    subject: "Business",
    sections: [
      { title: "Applied Business Question and evaluation", keywords: ["abq", "case study", "evaluate", "recommend", "stakeholder"], guidance: "For applied or case-based questions, use the facts supplied in the scenario, apply the relevant business concept, then give a justified conclusion. Avoid generic essays that do not return to the business in the question." },
      { title: "Current legislation", keywords: ["law", "legislation", "consumer", "employment", "data", "company"], guidance: "Business-law details must be maintained against current examinable material. Do not state a current legal threshold, date or obligation as fact unless it is in supplied official context or the student’s current course material." },
    ],
  },
  chemistry: {
    subject: "Chemistry",
    sections: [
      { title: "Mandatory experiments", topics: ["laboratory-experiments-practical-skills"], keywords: ["experiment", "titration", "practical", "apparatus", "procedure", "error"], guidance: "For laboratory questions, teach the prescribed experiment through apparatus, ordered method, safety, observations, calculation, expected result, limitation and improvement. Keep experimental claims chemically plausible and separate observations from explanations." },
      { title: "Data and Formulae Tables", keywords: ["mole", "stoichiometry", "atomic mass", "formula", "periodic", "electrochemistry"], guidance: "Use the supplied Formulae and Tables context and any values printed on the exam paper when available. Do not make the student memorise a value that is supplied in the permitted reference material; teach how to locate and apply it." },
    ],
  },
  "computer-science": {
    subject: "Computer Science",
    sections: [
      { title: "Verified 2023 Computer Science coursework brief", year: 2023, topics: ["applied-learning-tasks"], keywords: ["2023", "2022/23", "game", "games", "simulation"], guidance: "For the Leaving Certificate 2023 cohort, the coursework brief concerned a game-based interactive computer model. The project required a model based on a selected game, including randomness, several inputs and modes; higher requirements included storing data, statistics and what-if analysis. Treat it as the 2023 brief only." },
      { title: "Verified 2024 Computer Science coursework brief", year: 2024, topics: ["applied-learning-tasks"], keywords: ["2024", "2023/24", "wellbeing", "embedded system"], guidance: "For the Leaving Certificate 2024 cohort, the coursework brief was themed around wellbeing. It involved an embedded system and computer model, with data collection or analysis appropriate to the stated project requirements. Treat it as the 2024 brief only." },
      { title: "Verified 2025 Computer Science coursework brief", year: 2025, topics: ["applied-learning-tasks"], keywords: ["2025", "2024/25", "public dataset", "interactive information system"], guidance: "For the Leaving Certificate 2025 cohort, the official coursework brief asked each student to select a reliable, publicly available dataset relevant to their interests or an important societal area, then create an interactive information system to display analytics on it. The project required Python to extract, clean and store the selected data; analytics and at least two clearly labelled visualisations showing different key aspects; and an interactive interface for exploring the information. It was a 12-week, 90-mark individual coursework project. Treat it as the 2025 brief only." },
      { title: "Verified 2026 Computer Science coursework brief", year: 2026, topics: ["applied-learning-tasks"], keywords: ["2026", "2025/26", "forest", "forests", "biodiversity", "environmental data"], guidance: "For the Leaving Certificate 2026 cohort, the coursework brief is themed around forests, climate and biodiversity. It requires a functional embedded system that collects environmental data and a computer model with predictive or what-if capability, supported by an adaptive user interface. Treat it as the 2026 brief only." },
      { title: "Coursework project", topics: ["applied-learning-tasks"], keywords: ["project", "coursework", "brief", "artefact", "prototype", "documentation", "iteration"], guidance: "The final-year project is a distinct assessed component. Use an official brief and rubric for the student’s examination year when one has been supplied. Help with requirements analysis, decomposition, design, testing, iteration, documentation and reflection; do not claim an invented brief or example solution is official." },
      { title: "Academic integrity and code", keywords: ["code", "program", "algorithm", "debug", "solution"], guidance: "Support understanding and debugging rather than producing a submission-ready project on the student’s behalf. Explain algorithms, test cases and design choices so the student can make and justify their own implementation." },
    ],
  },
  economics: {
    subject: "Economics",
    sections: [
      { title: "Verified 2025 Economics Research Study brief", year: 2025, topics: ["research-study-economic-data"], keywords: ["2025", "2024/25", "wage differentials", "wages", "wage inequality"], guidance: "For the Leaving Certificate 2025 cohort, the annual Research Study concerned wage differentials. Students investigated wage changes in an SME, sector or the Irish economy, or factors behind wage inequalities, using reliable research and the official brief. Treat it as the 2025 brief only." },
      { title: "Verified 2026 Economics Research Study brief", year: 2026, topics: ["research-study-economic-data"], keywords: ["2026", "2025/26", "economic resilience", "external shock", "resilience"], guidance: "For the Leaving Certificate 2026 cohort, the annual Research Study concerns Ireland's economic resilience under external shocks since 2020. The official options address firm and policy resilience, or household expenditure on energy, food or housing alongside fiscal sustainability. Treat it as the 2026 brief only." },
      { title: "Research Study", topics: ["research-study-economic-data"], keywords: ["research study", "brief", "project", "sources"], guidance: "The Research Study is a distinct assessed component. Use the official brief for the student's examination year, develop a focused question, distinguish evidence from assertion, use reliable sources and make the student's own analysis and references clear. Do not write the study for the student." },
      { title: "Formulae and diagrams", keywords: ["elasticity", "demand", "supply", "national income", "formula", "diagram"], guidance: "Use the Formulae and Tables context where supplied. Explain the economic relationship represented by a formula or diagram, label axes and curves accurately, and distinguish a movement along a curve from a shift when relevant." },
      { title: "Current economic evidence", keywords: ["current", "ireland", "irish", "inflation", "growth", "unemployment", "budget", "statistics"], guidance: "Contemporary examples and figures are useful but time-sensitive. Only use a figure, policy or statistic when it is sourced and dated; otherwise present it as an example to be verified rather than current examinable fact." },
    ],
  },
  english: {
    subject: "English",
    sections: [
      { title: "Prescribed material", keywords: ["comparative", "single text", "shakespeare", "poetry", "poet", "prescribed"], guidance: "English prescribed texts, comparative options, Shakespeare and poetry material are examination-cohort specific. Use the current official prescribed-material list for the student’s year. Never imply a text, poem or quotation is prescribed unless it is present in that year’s material." },
      { title: "Textual evidence and response", guidance: "Help students make a clear point, support it with accurate textual evidence, explain its effect and return to the wording of the question. Do not fabricate quotations; encourage students to verify wording against their copy of the text." },
    ],
  },
  french: {
    subject: "French",
    sections: [
      { title: "Oral, aural and written communication", keywords: ["oral", "conversation", "role play", "listening", "letter", "email"], guidance: "Support communicative competence: understandable French, register, interaction, listening strategy and clear writing formats. Practise oral answers as flexible ideas and language, not a script to memorise word for word." },
      { title: "Accuracy and exam conventions", guidance: "Correct recurring grammar and vocabulary patterns in context. When advising on an exact task format or assessment arrangement, use the current SEC guidance rather than assuming a past-year format is unchanged." },
    ],
  },
  geography: {
    subject: "Geography",
    sections: [
      { title: "Verified 2025 Geographical Investigation prescribed topics", year: 2025, topics: ["fieldwork-geographical-investigation"], keywords: ["2025", "2024/25", "population change", "waste management", "local weather", "traffic management"], guidance: "For the Leaving Certificate 2025 cohort, the prescribed investigation list included local population change, traffic management, waste management, human interaction with geomorphic processes, local weather change and transportation or deposition in a selected landform. The student must follow the official 2025 list and authentication requirements." },
      { title: "Verified 2026 Geographical Investigation prescribed topics", year: 2026, topics: ["fieldwork-geographical-investigation"], keywords: ["2026", "2025/26", "migration", "land-use change", "local pollution", "weathering", "mass movement", "erosion"], guidance: "For the Leaving Certificate 2026 cohort, the prescribed investigation list includes migration, local land-use change, weathering or mass movement, traffic management, local pollution and erosion in fluvial, glacial or coastal landforms. The student must follow the official 2026 list and acknowledge all sources, including AI assistance where required." },
      { title: "Geographical Investigation and field study", topics: ["fieldwork-geographical-investigation"], keywords: ["field study", "investigation", "report", "hypothesis", "method", "sampling"], guidance: "Guide field-study work through a focused hypothesis, suitable method and sampling, mapped or graphed evidence, interpretation, limitations, evaluation and conclusion. Do not invent field data or claim a report meets current submission rules without the year’s official guidance." },
      { title: "Case studies and spatial evidence", keywords: ["case study", "map", "osi", "aerial", "region"], guidance: "Use accurate, place-specific evidence and connect process, location and impact. Contemporary Irish or global statistics should be sourced and dated rather than guessed." },
    ],
  },
  german: {
    subject: "German",
    sections: [
      { title: "Oral, aural and written communication", keywords: ["oral", "conversation", "role play", "listening", "letter", "email"], guidance: "Support communicative competence: understandable German, register, interaction, listening strategy and clear writing formats. Practise oral answers as flexible ideas and language, not a script to memorise word for word." },
      { title: "Accuracy and exam conventions", guidance: "Correct recurring grammar and vocabulary patterns in context. When advising on an exact task format or assessment arrangement, use the current SEC guidance rather than assuming a past-year format is unchanged." },
    ],
  },
  history: {
    subject: "History",
    sections: [
      { title: "Research Study Report", topics: ["research-study-report"], keywords: ["rsr", "research study", "report", "sources", "bibliography"], guidance: "The Research Study Report is a student-selected study within the established course rather than an annual themed brief. Support a viable question within the student's taught field, source evaluation, structured evidence, historical argument, accurate referencing and reflection. Do not write the report for the student or present invented source details as real." },
      { title: "Essays and documents", keywords: ["document", "essay", "source", "bias", "reliability"], guidance: "Teach students to answer the exact question with a line of argument, relevant evidence, chronology and evaluation. For documents, distinguish provenance, purpose, perspective, useful evidence and limitations." },
    ],
  },
  irish: {
    subject: "Irish",
    sections: [
      { title: "Prescribed material and oral", keywords: ["oral", "sraith", "pictiur", "filiocht", "prose", "prescribed", "literature"], guidance: "Irish prescribed literature and oral-examination material are examination-cohort specific. Use the current official prescribed-material circular for the student’s year. Do not claim a poem, prose text, Sraith Pictiúr sequence or oral arrangement is current unless it is supplied in verified context." },
      { title: "Language accuracy", guidance: "Give supportive corrections for grammar, idiom, register and range while preserving the student’s own voice. Build flexible oral and written ideas rather than encouraging a memorised script." },
    ],
  },
  maths: {
    subject: "Mathematics",
    sections: [
      { title: "Formulae and Tables", guidance: "Use the Formulae and Tables booklet context when it is supplied, including its notation and page references. Teach the student when and how to select a relationship, not just substitute values. Keep proof, reasoning and written working explicit where marks depend on it." },
    ],
  },
  physics: {
    subject: "Physics",
    sections: [
      { title: "Mandatory practical work", topics: ["laboratory-experiments-practical-skills"], keywords: ["experiment", "practical", "apparatus", "error", "uncertainty", "graph"], guidance: "For practical questions, teach apparatus, method, safety, observations, graphs, uncertainty, sources of error and realistic improvements. Distinguish a measured observation from a physical explanation." },
      { title: "Formulae, units and reference data", keywords: ["formula", "unit", "constant", "circuit", "nuclide"], guidance: "Use the Formulae and Tables context where supplied. State units, keep significant quantities consistent and explain why a chosen equation applies before substituting values." },
    ],
  },
  spanish: {
    subject: "Spanish",
    sections: [
      { title: "Oral, aural and written communication", keywords: ["oral", "conversation", "role play", "listening", "letter", "email"], guidance: "Support communicative competence: understandable Spanish, register, interaction, listening strategy and clear writing formats. Practise oral answers as flexible ideas and language, not a script to memorise word for word." },
      { title: "Accuracy and exam conventions", guidance: "Correct recurring grammar and vocabulary patterns in context. When advising on an exact task format or assessment arrangement, use the current SEC guidance rather than assuming a past-year format is unchanged." },
    ],
  },
  technology: {
    subject: "Technology",
    sections: [
      { title: "Verified 2025 Technology project brief", year: 2025, topics: ["design-process", "project-portfolio-work"], keywords: ["2025", "2024/25", "remote work", "home working"], guidance: "For the Leaving Certificate 2025 Ordinary Level cohort, the project brief concerned remote or home working and required a working device, system or aid with an electro-mechanical element. Use the official brief for the student's level before discussing an exact brief requirement; treat this summary as 2025-only." },
      { title: "Verified 2026 Technology project brief", year: 2026, topics: ["design-process", "project-portfolio-work"], keywords: ["2026", "2025/26", "extreme weather", "energy-use management", "energy use management"], guidance: "For the Leaving Certificate 2026 project, both levels require a folio and artefact. Ordinary Level concerns an energy-use management device, system or aid for an individual or household; Higher Level concerns resilience to extreme weather events through a working model, device, structure, system, product or interactive display with an electro-mechanical element. Treat these as 2026-only requirements." },
      { title: "Annual project brief and portfolio", topics: ["design-process", "project-portfolio-work"], keywords: ["project", "brief", "portfolio", "design", "prototype", "coursework", "evaluation"], guidance: "Technology project work must be anchored to the official brief and assessment guidance for the student’s examination year. Help with investigation, specification, ideation, development, manufacture, testing, evaluation and portfolio evidence; do not claim an invented brief or model project is official." },
      { title: "Technical reference material", keywords: ["formula", "circuit", "electronics", "symbol", "mechanism"], guidance: "Use the Formulae and Tables context where supplied, especially for symbols, units and technical conventions. Keep safety, standards and material/process choices justified by the design problem." },
    ],
  },
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matches(section: AssessmentSection, topicId: string, message: string) {
  const requestedYear = message.match(/\b20\d{2}\b/)?.[0];
  if (requestedYear && section.year !== undefined) {
    return section.year === Number(requestedYear) ? 10 : -10;
  }

  if (section.topics?.includes(topicId)) return 4;
  const haystack = normalize(message);
  return (section.keywords ?? []).reduce((score, keyword) => score + (haystack.includes(normalize(keyword)) ? 1 : 0), 0);
}

/**
 * Compact, subject-specific assessment guidance layered over the local syllabus
 * and past-paper corpus. Annual briefs and prescribed material remain explicit
 * integration points: never fabricate them when the current source is absent.
 */
export function getSubjectAssessmentContext(input: { subjectId: string; topicId?: string; userMessage: string }) {
  const pack = ASSESSMENT_CONTEXT[input.subjectId];
  if (!pack) return "";

  const topicId = input.topicId ?? "general";
  const topicName = getTopic(input.subjectId, topicId).name;
  const selected = [...pack.sections]
    .map((section) => ({ section, score: matches(section, topicId, input.userMessage) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ section }) => `### ${section.title}\n${section.guidance}`);

  return [
    "[Subject-specific assessment guidance]",
    `Subject: ${pack.subject}`,
    `Topic: ${topicName}`,
    "This guidance supplements the retrieved official syllabus and past-paper material. If the student names an examination year, use only the matching annual-brief guidance. Where an annual brief, prescribed list, current statistic, law, or official exemplar is needed but absent, say so clearly and ask for or direct the student to the current official material.",
    selected.join("\n\n"),
  ].join("\n\n");
}
