// Website content is sourced from a curated, public-safe fact pack. Employer
// internal names, unverified metrics, and private-repo links are intentionally
// omitted or sanitized. See README/notes before publishing more detail.

export type Category = 'experience' | 'project' | 'education' | 'other'

export interface CategoryMeta {
  id: Category
  label: string
  textClass: string
  bgClass: string
  borderClass: string
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  experience: {
    id: 'experience',
    label: 'Professional Experience',
    textClass: 'text-cat-experience',
    bgClass: 'bg-cat-experience',
    borderClass: 'border-cat-experience',
  },
  project: {
    id: 'project',
    label: 'Projects',
    textClass: 'text-cat-project',
    bgClass: 'bg-cat-project',
    borderClass: 'border-cat-project',
  },
  education: {
    id: 'education',
    label: 'Education',
    textClass: 'text-cat-education',
    bgClass: 'bg-cat-education',
    borderClass: 'border-cat-education',
  },
  other: {
    id: 'other',
    label: 'Teaching',
    textClass: 'text-cat-other',
    bgClass: 'bg-cat-other',
    borderClass: 'border-cat-other',
  },
}

export interface Profile {
  name: string
  headline: string
  tagline: string
  location: string
  email: string
  links: { label: string; url: string }[]
}

export const profile: Profile = {
  name: 'Hamid R. Rezaei',
  headline: 'Full-Stack Software Engineer',
  tagline:
    'Full-stack software engineer with extensive experience designing and delivering Java/Spring services, secure APIs, data-intensive applications, CI/CD automation, and React interfaces — backed by strong analytical and problem-solving skills.',
  location: 'Toronto, Ontario, Canada',
  email: 'hamidreza74hrr@yahoo.com',
  links: [
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/hamid-reza-rezaei-17896a125/',
    },
    { label: 'GitHub', url: 'https://github.com/HamidRezaRezaeiGitHub' },
  ],
}

/** Selected technologies surfaced in the hero. */
export const heroTech: string[] = [
  'Java',
  'Spring Boot',
  'Secure APIs',
  'React',
  'TypeScript',
  'CI/CD',
  'GCP',
  'BigQuery',
  'Spring AI',
]

export interface About {
  intro: string
  themes: string[]
}

export const about: About = {
  intro:
    'Backend-focused software engineer with full-stack and DevOps breadth. I build resilient Java/Spring services, secure APIs, and data-intensive systems in regulated financial environments, with a strong interest in reusable architecture, developer productivity, and practical AI adoption.',
  themes: [
    'Backend depth with full-stack and DevOps breadth',
    'Modernizing regulated financial systems',
    'Reusable architecture and developer productivity',
    'Practical AI adoption and agent engineering',
    'Teaching, mentoring, and cross-team enablement',
    'Analytical, quantitative thinking from an engineering background',
  ],
}

export interface TimelineEntry {
  id: string
  category: Category
  title: string
  organization?: string
  location?: string
  /** Display string for the period, e.g. "Jun 2025 — Present". */
  period: string
  /** Sortable start value, newest first (year, decimals allowed for ordering). */
  startYear: number
  summary: string
  highlights?: string[]
  tags?: string[]
  link?: { label: string; url: string }
}

/** Short note shown above the professional experience timeline. */
export const employmentNote =
  'Joined HSBC as an FDM consultant in 2021 and converted to a permanent employee in September 2023 while remaining on the same team.'

// Career and education chronology, newest-first.
export const timeline: TimelineEntry[] = [
  {
    id: 'hsbc-agency-lending',
    category: 'experience',
    title: 'Full-Stack Engineer — Agency Securities Lending',
    organization: 'HSBC',
    location: 'Toronto, ON',
    period: 'Jun 2025 — Present',
    startYear: 2025,
    summary:
      'Develops and maintains Java/Spring services, secure APIs, internal integrations, and data workflows supporting post-trade operations, and builds BigQuery and Looker Studio analytics in partnership with product and business users.',
    highlights: [
      'Implements authentication and authorization across endpoints and manages security behavior in lower environments.',
      'Integrates the platform with internal bank services over REST APIs and a scheduled data-export process feeding downstream scripts.',
      'Integrates legacy Perl processing into the application so the workflow runs through one platform.',
      'Led the migration from legacy release scripts to configurable Jenkins/Groovy pipelines automating builds, tests, security scans, versioning, and deployments.',
    ],
    tags: [
      'Java 17',
      'Spring Boot',
      'Spring Security',
      'Angular',
      'BigQuery',
      'Looker Studio',
      'Jenkins',
    ],
  },
  {
    id: 'hsbc-data-service-layer',
    category: 'experience',
    title: 'Full-Stack Engineer — Data Service Layer',
    organization: 'HSBC',
    location: 'Toronto, ON',
    period: 'Jun 2023 — Jun 2025',
    startYear: 2023,
    summary:
      'Owned architecture for a configuration-driven data synchronization product and contributed to an event-driven, real-time ETL platform for high-throughput trading data, alongside observability tooling and a secure file-retrieval application.',
    highlights: [
      'Primary owner and architect of a scalable Spring Batch synchronization product using modular, configuration-driven design.',
      'Contributed to a real-time ETL app (Java 21, Spring Integration, Solace, PostgreSQL) preserving lifecycle-event ordering with acknowledgments, retries, and transactional controls — designed to reduce the risk of data loss.',
      'Built reusable, parameterized Grafana dashboards and Geneos alerting scripts to improve visibility into application health.',
      'Designed and owned a secure production file-retrieval service (Spring Boot, Spring Security) with a React frontend and a daily cache for faster response.',
    ],
    tags: [
      'Java 21',
      'Spring Batch',
      'Spring Integration',
      'Solace',
      'PostgreSQL',
      'React',
      'Grafana',
    ],
  },
  {
    id: 'hsbc-trade-reporting',
    category: 'experience',
    title: 'Software Developer & DevOps Engineer — Trade Reporting Americas',
    organization: 'HSBC',
    location: 'Toronto, ON',
    period: 'Apr 2021 — Jun 2023',
    startYear: 2021,
    summary:
      'Delivered regulatory trade-reporting functionality across the Americas (CFTC, SEC, and Canadian regulators) using Java and Drools, and built automation that made large regression cycles practical.',
    highlights: [
      'Designed an automated regression-analysis platform that distributed large datasets across Jenkins pipelines and aggregated results with a multithreaded Spring Boot application — reducing analysis time from one week to three hours.',
      'Built and maintained modular Jenkins/Groovy pipelines integrating GitHub, Maven, Nexus, Jira, Ansible, and ServiceNow.',
      'Refactored legacy applications using OOP and SOLID principles and participated in L2/L3 production support.',
    ],
    tags: ['Java', 'Drools', 'Jenkins', 'Groovy', 'Maven', 'Nexus'],
  },
  {
    id: 'edu-western',
    category: 'education',
    title: 'Master of Engineering, Environmental Engineering',
    organization: 'Western University',
    location: 'London, ON',
    period: '2019',
    startYear: 2019,
    summary:
      'Applied mathematical modeling and R programming to hydrological and spatial problems — translating domain concepts into equations and automating statistical analysis.',
    tags: ['R', 'Statistical Modeling', 'Applied Mathematics'],
  },
  {
    id: 'teaching',
    category: 'other',
    title: 'Computer Science & Mathematics Teacher',
    organization: 'High School & Private Tutoring',
    period: '2013 — 2018',
    startYear: 2013.9,
    summary:
      'Taught computer science and mathematics across two high schools and private tutoring — including algorithms, flowcharts, spreadsheets, algebra, and probability.',
    tags: ['Teaching', 'Mentoring'],
  },
  {
    id: 'edu-tehran',
    category: 'education',
    title: 'Bachelor of Science, Civil Engineering',
    organization: 'University of Tehran',
    location: 'Tehran, Iran',
    period: '2013 — 2017',
    startYear: 2013.7,
    summary:
      'Foundation in engineering, mathematics, and quantitative analysis.',
    tags: ['Engineering', 'Mathematics'],
  },
]

export interface CaseStudy {
  id: string
  title: string
  context: string
  description: string
  highlights?: string[]
  tags: string[]
}

// Public-safe professional case studies. Internal project/vendor names are
// intentionally omitted.
export const caseStudies: CaseStudy[] = [
  {
    id: 'platform-poc',
    title: 'Scoped Multi-Service Platform PoC',
    context: 'HSBC · Co-architect',
    description:
      'Co-architected a multi-service proof of concept evaluated against an existing vendor platform, delivering a substantial working system under a limited timeline — including its React frontend, configuration-driven REST APIs, an Active Directory-backed authentication gateway, and an in-product AI assistant.',
    highlights: [
      'Achieved 100% output parity with the existing platform for one selected trade type during the defined evaluation period.',
      'Built a configuration-driven query API exposing high-dimensional datasets (100+ columns) as filterable, sortable endpoints without repetitive per-endpoint code.',
      'Components were later identified for reuse by other teams, and its data-query logic was adapted for BigQuery/Looker Studio dashboards.',
    ],
    tags: [
      'React',
      'shadcn/ui',
      'Spring Boot',
      'Spring Security',
      'Active Directory',
      'Spring AI',
    ],
  },
  {
    id: 'ai-assistant',
    title: 'Context-Aware In-Product AI Assistant',
    context: 'HSBC · Design & implementation',
    description:
      'Designed and implemented a context-aware, in-product assistant using Spring AI and React. It supplied structured live UI state — such as active filters, table metadata, and displayed results — to an enterprise language model, letting users ask product-specific questions without manually copying data between tools.',
    highlights: [
      'Backend AI service on Spring AI connected to the enterprise AI platform, supporting JSON and streamed (SSE) responses.',
      'Selected and structured context to avoid unnecessary token and context-window usage.',
      'Extracted the frontend and backend assistant components for reuse and shared them with an interested partner team.',
    ],
    tags: ['Spring AI', 'React', 'SSE Streaming', 'Enterprise LLM'],
  },
  {
    id: 'ai-enablement',
    title: 'AI-Agent Enablement & Engineering Harness',
    context: 'HSBC · AI champion',
    description:
      'Drove AI-agent adoption across multiple teams by building an enterprise engineering harness with script-backed skills integrating source control, work tracking, documentation, CI/CD, and logs — supported by hands-on training and knowledge-sharing sessions.',
    highlights: [
      'Authored shared instructions and reusable agent skills to improve consistency and results.',
      'Delivered training on prompting, models, tokens, context windows, agent skills, and MCP.',
      'Onboarded his own team and engineers from surrounding teams.',
    ],
    tags: ['MCP', 'Agent Skills', 'CI/CD', 'Developer Productivity'],
  },
  {
    id: 'regression-platform',
    title: 'Automated Regression-Analysis Platform',
    context: 'HSBC · Design & development',
    description:
      'Designed an automated regression-analysis platform that distributed large datasets across parallel Jenkins pipelines and aggregated results with a multithreaded Spring Boot application, reducing analysis time from one week to three hours.',
    tags: ['Spring Boot', 'Jenkins', 'Multithreading', 'Automation'],
  },
  {
    id: 'sync-product',
    title: 'Configuration-Driven Synchronization Product',
    context: 'HSBC · Project owner & architect',
    description:
      'Owned the architecture for a scalable, configuration-driven data-transfer and synchronization product built with Spring Batch, supporting multiple use cases without duplicating implementations, and mentored a developer onto the project.',
    tags: ['Spring Batch', 'Java', 'Modular Design', 'Architecture'],
  },
  {
    id: 'file-retrieval',
    title: 'Secure File-Retrieval Application',
    context: 'HSBC · Design & ownership',
    description:
      'Designed and owned a secure production file-retrieval service (Spring Boot, Spring MVC, Spring Security) with a React frontend, enforcing backend access controls and a daily cache to reduce repeated filesystem traversal and improve response times.',
    tags: ['Spring Boot', 'Spring Security', 'React'],
  },
  {
    id: 'event-etl',
    title: 'Event-Driven ETL & Reliability Controls',
    context: 'HSBC · Contributor',
    description:
      'Contributed to a configurable real-time ETL application (Java 21, Spring Integration, Solace, PostgreSQL) processing high-throughput trading data while preserving lifecycle-event ordering with acknowledgments, retries, and transactional controls — designed to reduce the risk of data loss.',
    tags: ['Java 21', 'Spring Integration', 'Solace', 'PostgreSQL'],
  },
]

export interface Project {
  id: string
  name: string
  role: string
  description: string
  stage?: string
  tags: string[]
  links?: { label: string; url: string }[]
}

// Personal and open-source work (kept distinct from employment).
export const projects: Project[] = [
  {
    id: 'man-agent-ment',
    name: 'man-agent-ment',
    role: 'Creator · Open source',
    description:
      'An open-source operating framework for AI coding agents that standardizes requirement planning, project knowledge, validation, review, debugging, and cross-session handoffs across tools such as Codex, Claude Code, Copilot, and Gemini.',
    tags: ['AI Agents', 'MCP', 'Developer Experience', 'Automation'],
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/HamidRezaRezaeiGitHub/man-agent-ment',
      },
    ],
  },
  {
    id: 'buy-or-rent',
    name: 'BuyOrRent',
    role: 'Backend engineer',
    description:
      'A TypeScript/Hono financial-calculation service on Cloudflare Workers, exposing shared domain logic through documented HTTP APIs and MCP tools across DEV, UAT, and production. The broader buy-versus-rent comparison is in active development.',
    stage: 'DEV · UAT · Production',
    tags: ['TypeScript', 'Hono', 'Cloudflare Workers', 'Zod', 'OpenAPI', 'MCP'],
    links: [
      { label: 'API Docs', url: 'https://api.buyorrent.app/api/v1/docs' },
      {
        label: 'GitHub',
        url: 'https://github.com/HamidRezaRezaeiGitHub/buy-or-rent-backend',
      },
    ],
  },
  {
    id: 'buildean',
    name: 'Buildean',
    role: 'Co-founder · Backend engineer',
    description:
      'Co-founded and built the Java/Spring backend and GCP infrastructure for a construction-management product in beta — including its API architecture, PostgreSQL data model, Firebase security, automated delivery workflows, and DEV/UAT environments.',
    stage: 'Beta',
    tags: [
      'Java 25',
      'Spring Boot 4',
      'GCP Cloud Run',
      'PostgreSQL',
      'Firebase',
      'Docker',
    ],
  },
]

export interface SkillGroup {
  title: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Backend & Languages',
    skills: [
      'Java',
      'Spring Boot',
      'Spring MVC',
      'Spring Data JPA',
      'Hibernate',
      'Spring Security',
      'Spring Batch',
      'Spring Integration',
      'Spring AI',
      'REST APIs',
      'Groovy',
      'SQL',
      'Bash',
    ],
  },
  {
    title: 'Frontend',
    skills: [
      'React',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS',
      'shadcn/ui',
      'Angular',
    ],
  },
  {
    title: 'Architecture & Engineering',
    skills: [
      'Microservices',
      'Event-Driven Architecture',
      'Data-Intensive Systems',
      'Concurrent & Multithreaded Processing',
      'API Gateway Design',
      'AuthN / AuthZ',
      'LDAP / Active Directory',
      'JWT',
      'Configuration-Driven Design',
      'OOP & SOLID',
      'Design Patterns',
    ],
  },
  {
    title: 'Data & Messaging',
    skills: [
      'PostgreSQL',
      'BigQuery',
      'Looker Studio',
      'Solace',
      'GCP Cloud SQL',
      'MongoDB',
      'Cloudflare R2',
      'Firebase Storage',
    ],
  },
  {
    title: 'DevOps & Delivery',
    skills: [
      'Git & GitHub',
      'Maven',
      'Jenkins',
      'Groovy Pipelines',
      'GitHub Actions',
      'Nexus / Nexus IQ',
      'Checkmarx',
      'Docker',
      'GCP (Cloud Run, Artifact Registry, IAM, Secret Manager)',
      'Jira & Confluence',
      'ServiceNow',
      'Ansible',
      'Cloudflare Workers / Wrangler',
    ],
  },
  {
    title: 'Observability',
    skills: [
      'Grafana',
      'Geneos',
      'Spring Boot Actuator',
      'Scheduled Metric Collection',
      'Alerting Scripts',
    ],
  },
  {
    title: 'AI Engineering',
    skills: [
      'Spring AI',
      'Enterprise LLM Integration',
      'Streaming Responses',
      'Context-Aware Assistants',
      'Prompt & System Design',
      'MCP',
      'Agent Skills',
      'GitHub Copilot / Claude Code / Codex',
    ],
  },
]
