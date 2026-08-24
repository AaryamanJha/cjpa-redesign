export type Locale = "en" | "es" | "zh-CN" | "zh-TW"

export const locales: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
  { code: "zh-CN", label: "简体中文", short: "简" },
  { code: "zh-TW", label: "繁體中文", short: "繁" },
]

export interface TeamMemberText {
  title: string
  bio: string
}

export interface Translations {
  nav: {
    links: { label: string; id: string }[]
    portal: string
  }
  footer: {
    tagline: string
    nav: { label: string; id?: string; href?: string }[]
    followUs: string
    rights: string
    privacy: string
    terms: string
  }
  hero: {
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    body: string
    ctaPrimary: string
    ctaSecondary: string
    scroll: string
  }
  about: {
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    body1: string
    body2: string
    quote: string
    stats: { value: string; label: string }[]
  }
  mission: {
    eyebrow: string
    statement: string
  }
  founder: {
    eyebrow: string
    heading: string
    bio1: string
    bio2: string
    bio3editorPrefix: string
    bio3bookTitle: string
    bio3suffix: string
    messageEyebrow: string
    message1: string
    message2: string
    message3: string
    signOff: string
    signatureTitle: string
    photoPendingLabel: string
    photoPendingName: string
    photoCaption: string
  }
  services: {
    eyebrow: string
    heading: string
    items: { title: string; description: string }[]
  }
  team: {
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    intro: string
    members: Record<string, TeamMemberText>
    readMore: string
    readLess: string
    advisorsHeading: string
  }
  teamFilm: {
    kicker: string
    heading: string
    comingSoon: string
    principalMessage: string
  }
  insights: {
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    recentPerspectives: string
    inThePress: string
    articles: { title: string; excerpt: string }[]
    press: { headline: string; attachmentLabel: string }[]
  }
  publications: {
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    publishedBookLabel: string
    bookDescription: string
    editorLabel: string
    yearLabel: string
    publisherLabel: string
    isbnLabel: string
    viewOnAmazon: string
    springerDetails: string
    nextPublicationLabel: string
    secondBook: string
    comingSoon: string
    comingSoonDetail: string
  }
  partners: {
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    intro: string
    tracks: { title: string; description: string }[]
    organizationsWeServe: string
    clientTypes: string[]
  }
  newsletter: {
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    body: string
    emailLabel: string
    emailPlaceholder: string
    subscribe: string
    subscribing: string
    disclaimer: string
    successTitle: string
    successBody: string
    genericError: string
    networkError: string
  }
  contact: {
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    body: string
    contactLabel: string
    offices: { city: string; address: string; role: string }[]
    generalInquiries: string
    formNameLabel: string
    formOrgLabel: string
    formEmailLabel: string
    formInquiryLabel: string
    formInquirySelectOne: string
    inquiryTypes: string[]
    formMessageLabel: string
    formMessagePlaceholder: string
    sendInquiry: string
    confidentialityNote: string
    successTitle: string
    successBody: string
  }
}

export const en: Translations = {
  nav: {
    links: [
      { label: "About", id: "about" },
      { label: "Services", id: "services" },
      { label: "Team", id: "team" },
      { label: "Impact", id: "impact" },
      { label: "Insights", id: "insights" },
      { label: "Publications", id: "publications" },
      { label: "Partners", id: "partners" },
      { label: "Contact", id: "contact" },
    ],
    portal: "Portal",
  },
  footer: {
    tagline: "Strategic advisory at the intersection of capital, geopolitics, and cross-border policy.",
    nav: [
      { label: "About", id: "about" },
      { label: "Services", id: "services" },
      { label: "Team", id: "team" },
      { label: "Partners", id: "partners" },
      { label: "Contact", id: "contact" },
      { label: "Client Portal", href: "/login" },
    ],
    followUs: "Follow Us",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms",
  },
  hero: {
    eyebrow: "Geopolitical Intelligence Capital & Resources",
    headlineLine1: "Connecting Global Insight,",
    headlineLine2: "People, Capital & Resources",
    body: "CJPA Global Advisors provides data-driven scenario planning, strategic advisory, geopolitical analysis, and capital access for clients navigating global markets, infrastructure opportunities, supply chain risk, and cross-border expansion.",
    ctaPrimary: "Begin a Conversation",
    ctaSecondary: "Our Practice Areas",
    scroll: "Scroll",
  },
  about: {
    eyebrow: "About",
    headlineLine1: "Data-Driven Counsel for",
    headlineLine2: "Global Market Complexity",
    body1: "CJPA Global Advisors is an international consulting and advisory company dedicated to data-driven scenario planning, strategic advisory, and geopolitical analysis for clients navigating the dynamics of globalization.",
    body2: "The firm began as a global research unit and grew into a multidisciplinary consultancy informed by global finance, policy, and research best practices. CJPA helps clients understand major geopolitical events, cultural dynamics, and supply chain disruption risks.",
    quote: "Connecting global insight, people, capital, and resources.",
    stats: [
      { value: "25+", label: "Years of founder experience\nacross finance and global affairs" },
      { value: "16+", label: "Years of senior China, Southeast Asia\nand U.S. operating experience" },
      { value: "30+", label: "Years of legal and capital markets\nexperience on the advisory bench" },
      { value: "6", label: "Core specializations across risk,\ntrade, ESG, and financial literacy" },
    ],
  },
  mission: {
    eyebrow: "Mission",
    statement: "Bridging cultures and diversity through integrity, respect, and an unwavering commitment to our clients.",
  },
  founder: {
    eyebrow: "Leadership",
    heading: "About the Founder",
    bio1: "Earl Carr is Founder and Chief Executive Officer at CJPA Global Advisors, based in New York. With 25+ years of experience, he manages a multidisciplinary team of global research analysts, software engineers, marketing specialists, geopolitical analysts, and media specialists to guide the firm's global thought leadership, global strategic client advisory practice, and cross-border business mandate. Earl is an Adjunct Instructor at NYU's Center for Global Affairs.",
    bio2: "Earl has expertise in banking, wealth management, consulting, geopolitical analysis, U.S. foreign policy, and international development. He previously served as Vice President at Morgan Stanley's Institute for Sustainable Investing (ISI), working as a strategist and thought leader. Earl is a member of the Steering Committee for the inaugural National Asian American Book Club and is a monthly columnist at Forbes.com.",
    bio3editorPrefix: "Mr. Carr is Editor of",
    bio3bookTitle: "From Trump to Biden and Beyond: Reimagining U.S.-China Relations",
    bio3suffix: ", published by Palgrave Macmillan, September 2021.",
    messageEyebrow: "Founder's Message",
    message1: "At CJPA Global Advisors, our exceptional team of research analysts, software engineers, financial advisors, marketing specialists, and geopolitical strategists strives to be a global leader in advisory services, cross-border business development, and customized research. Our firm's core specializations include global risk analysis, international supply chain analysis, trade analysis, risk management, geopolitical analysis and financial markets, environmental sustainable governance, racial justice investing, and financial literacy training. What makes CJPA truly extraordinary is our dedication to analytical rigor and access to proprietary research, people, and intelligence through a global network of subject matter experts and professionals.",
    message2: "Through a world-class Global Advisory Board, we ensure that the firm's long-term goals and systems are guided and held accountable while remaining good stewards of our financial resources. At CJPA, we are passionate about how to utilize capital, technology, and data to help solve some of the world's most pressing problems, including racial socio-economic equity, sustainability, and the transition to a lower-carbon global economy — a transition we believe is as much a historic investment opportunity as it is a risk to manage.",
    message3: "Our company is determined to help you achieve your goals — whether that means identifying geopolitical, financial, or business risk, providing insight as you explore investing in a new country, or helping to raise capital for projects around the world. We are your trusted partner.",
    signOff: "Cordially,",
    signatureTitle: "Founder and CEO, CJPA Global Advisors",
    photoPendingLabel: "Photo pending —",
    photoPendingName: "Earl Carr & Jensen Huang, CFR",
    photoCaption: "CJPA's Founder, Earl Carr, with NVIDIA's CEO, Jensen Huang, at the Council on Foreign Relations in Washington, D.C.",
  },
  services: {
    eyebrow: "Services",
    heading: "Our Services",
    items: [
      {
        title: "Research & Risk Analysis",
        description: "Customized research reports for multinational clients exploring new markets, with emphasis on trade policy, geopolitical risk, macro trends, tariffs, domestic policy impact, ESG, and values-based investing.",
      },
      {
        title: "Venture Capital & Project Finance",
        description: "Connecting high-quality infrastructure projects with venture capitalists, individual investors, family offices, RIAs, and development finance institutions.",
      },
      {
        title: "Infrastructure & Renewable Energy",
        description: "Capital and advisory support for infrastructure opportunities across renewable energy, solar, battery projects, 5G, green hydrogen, lithium iron phosphate, and construction robotics.",
      },
      {
        title: "Market Entry Strategy",
        description: "Guidance for foreign companies entering the U.S. market, including market dynamics, regulatory requirements, competitive landscapes, and integration strategy.",
      },
      {
        title: "Consulting for Multinationals & Governments",
        description: "Strategic intelligence for organizations investing in China or the Indo-Pacific, along with grant support, fundraising, board development, and ESG policy guidance.",
      },
      {
        title: "Training & Financial Literacy",
        description: "Workshops for nonprofits, government agencies, student organizations, and businesses on asset allocation, risk tolerance, retirement saving, crypto due diligence, and values-based investing.",
      },
    ],
  },
  team: {
    eyebrow: "Meet the Team",
    headlineLine1: "Advisors, Analysts,",
    headlineLine2: "and Global Specialists",
    intro: "CJPA brings together senior consultants, advisors, analysts, legal counsel, technology specialists, and regional experts across Asia, Africa, the Caribbean, Europe, and the United States.",
    readMore: "Read more",
    readLess: "Read less",
    advisorsHeading: "Advisors",
    members: {
      earlcarr: {
        title: "Founder & CEO",
        bio: "Founder and CEO of CJPA Global Advisors, managing the global research team, thought leadership, and cross-border business development mandate. Earl is also an adjunct instructor at NYU's Center for Global Affairs.",
      },
      winslowrobertson: {
        title: "Senior Consultant",
        bio: "Founder and managing member of Cowries and Rice, a China-Africa strategic consultancy focused on sustainable business practices by Chinese organizations operating in Africa.",
      },
      jacobdreyer: {
        title: "Senior Consultant",
        bio: "Writer and editor based in Shanghai whose work focuses on China's middle class, Chinese politics and economics, and China's relationship with the world.",
      },
      essayworabo: {
        title: "Partner: Technology & Innovation",
        bio: "AI advisor and technology transformation leader with 11+ years of experience in enterprise AI adoption, governance frameworks, and complex cloud modernization programs.",
      },
      davidjohnson: {
        title: "Legal Counsel",
        bio: "Partner in the New York office of PAG Law with 30+ years of experience in capital markets, corporate and venture capital transactions, and general corporate finance matters.",
      },
      christensmith: {
        title: "Senior Consultant",
        bio: "Filmmaker, creative director, consultant, and NYU Tisch instructor. Founder and director of Trellis Creative Strategies, advising ethics-based media production.",
      },
      zackkennedy: {
        title: "Associate",
        bio: "New York-based consultant focused on geopolitical and geoeconomic issues, helping companies, governments, and NGOs navigate a changing global landscape.",
      },
      lorenajames: {
        title: "Senior Analyst",
        bio: "Research and insights analyst with experience in SEO, analytics, qualitative and quantitative data aggregation, competitor analysis, and sustainable startup work.",
      },
      nigelvinson: {
        title: "Senior Consultant",
        bio: "Consultant specializing in geopolitical intelligence and client-facing strategic advisory, with particular expertise in U.S.-China relations and emerging technology trends.",
      },
      artbrown: {
        title: "Senior Advisor",
        bio: "Senior U.S. diplomat and former Ambassador to Ecuador with 30+ years across the State Department, USAID, and the Peace Corps.",
      },
      josephho: {
        title: "Advisor",
        bio: "Senior management executive with experience across private banking, wealth management, global fund management, insurance, M&A, and licensing activity.",
      },
      sundaabridgettjones: {
        title: "Advisor",
        bio: "Chief Partnership and Advocacy Officer for the Global Energy Alliance for People and Planet, focused on scaling equitable energy transitions in emerging economies.",
      },
      yuvalstav: {
        title: "Advisor",
        bio: "Entrepreneur, manager, consultant, and lecturer in sustainable economics and strategic planning. Founding partner at Value Squared.",
      },
      shirleymarteyhargis: {
        title: "Advisor",
        bio: "Consultant on China and international security with more than a decade of Asia policy experience across defense, economics, technology, consulting, intelligence, and research.",
      },
      mattharris: {
        title: "Advisor",
        bio: "Investment professional at Draper Associates and former Vice President at Blackstone, focused on growth financing for energy companies.",
      },
      amyngeno: {
        title: "Intern Analyst",
        bio: "Incoming senior at IE University, Madrid pursuing a Dual Bachelor's in Laws and International Relations. Her professional experience spans policy research, corporate responsibility, and legal compliance across Kenya, Spain, the United Kingdom, and Central Asia — including work with Aga Khan Foundation USA in collaboration with USAID and at Igeria & Ngugi Advocates in Nairobi. Her analytical work bridges corporate compliance with regional economic realities, covering trade dynamics, infrastructure corridors, and macroeconomic policy alignment.",
      },
      megan: {
        title: "Strategic Marketing Intern",
        bio: "Recent graduate of Montclair State University with a major in Animation and Visual Effects. Megan brings an artistic background to strategic marketing, with college experience in Red Hawk Studio's semester-long animation pipeline productions and social media work with Viva la Animacion, an organization celebrating Latin artists. They believe art and graphic design can bridge cultures and are looking forward to contributing to CJPA.",
      },
      aaryamanajjha: {
        title: "Intern Analyst",
        bio: "Computer science and finance student at Emory University working across finance, consulting, data science, climate visualization, and venture capital research.",
      },
    },
  },
  teamFilm: {
    kicker: "CJPA Global Advisors",
    heading: "Our Approach to Global Advisory",
    comingSoon: "Video coming soon",
    principalMessage: "Principal Message",
  },
  insights: {
    eyebrow: "Insights",
    headlineLine1: "Perspectives on",
    headlineLine2: "the Global Order",
    recentPerspectives: "Recent Perspectives",
    inThePress: "In the Press",
    articles: [
      {
        title: "Speed And Safety: What Circle's IPO Means For Stablecoins Geopolitical Risk",
        excerpt: "A Forbes article by Earl Carr and intern analyst Jonah Kim on stablecoins, Circle's IPO, and the geopolitical risk dimensions of digital finance.",
      },
    ],
    press: [
      {
        headline: "CJPA Global Advisors attends exclusive Paley Center luncheon featuring General David H. Petraeus",
        attachmentLabel: "Open release",
      },
      {
        headline: "CJPA Global Advisors attends BMO's 21st Annual Global Farm to Market | Chemicals Conference",
        attachmentLabel: "Open release",
      },
      {
        headline: "China's rising influence in the Caribbean through infrastructure and soft power",
        attachmentLabel: "Source image",
      },
      {
        headline: "Earl Carr speaks with graduate students on international relations careers",
        attachmentLabel: "Event photo",
      },
      {
        headline: "Scage partnership press release",
        attachmentLabel: "Open release",
      },
      {
        headline: "CJPA meetings with Taiwan policy leaders and American Institute in Taiwan contacts",
        attachmentLabel: "Meeting photo",
      },
    ],
  },
  publications: {
    eyebrow: "Publications",
    headlineLine1: "Books",
    headlineLine2: "and Research",
    publishedBookLabel: "Published Book",
    bookDescription: "An edited volume on the future of U.S.-China relations, with policy analysis and multidisciplinary perspectives on technology, trade, cross-Strait relations, security, climate, geopolitics, and global competition.",
    editorLabel: "Editor",
    yearLabel: "Year",
    publisherLabel: "Publisher",
    isbnLabel: "ISBN",
    viewOnAmazon: "View on Amazon",
    springerDetails: "Springer details",
    nextPublicationLabel: "Next Publication",
    secondBook: "Second Book",
    comingSoon: "Coming Soon",
    comingSoonDetail: "Details will be announced once the title, cover, and publication timeline are finalized.",
  },
  partners: {
    eyebrow: "Engagement",
    headlineLine1: "How Can We",
    headlineLine2: "Help You",
    intro: "Every engagement begins with a confidential conversation. We work exclusively with organizations where the quality of geopolitical and financial judgment is consequential — not advisory as a formality, but as a competitive necessity.",
    tracks: [
      {
        title: "USITC",
        description: "Engagements and research connected to trade, competitiveness, market intelligence, and the policy questions shaping international commerce.",
      },
      {
        title: "International Career Advancement Program",
        description: "A values-aligned network focused on representation, leadership, and widening access to international affairs careers.",
      },
      {
        title: "Augustus Global Investment",
        description: "Investment partnership context for cross-border growth, infrastructure, and capital advisory opportunities.",
      },
    ],
    organizationsWeServe: "Organizations We Serve",
    clientTypes: [
      "Sovereign Governments",
      "Multilateral Institutions",
      "Development Finance Institutions",
      "Infrastructure Sponsors",
      "Renewable Energy Developers",
      "Multinational Corporations",
      "Nonprofits & Foundations",
      "Family Offices & RIAs",
    ],
  },
  newsletter: {
    eyebrow: "Intelligence Briefing",
    headlineLine1: "Geopolitical Intelligence,",
    headlineLine2: "Delivered Quarterly",
    body: "A concise assessment of geopolitical developments, capital flow shifts, and regulatory changes that matter to international investors and institutions. No noise. No filler.",
    emailLabel: "Work Email",
    emailPlaceholder: "name@organization.com",
    subscribe: "Subscribe",
    subscribing: "Subscribing…",
    disclaimer: "Quarterly only. Unsubscribe at any time.",
    successTitle: "You're on the list.",
    successBody: "We'll be in touch with the next briefing.",
    genericError: "Something went wrong. Please try again.",
    networkError: "Network error. Please check your connection and try again.",
  },
  contact: {
    eyebrow: "Contact",
    headlineLine1: "Begin a",
    headlineLine2: "Conversation",
    body: "To help us best serve your inquiry, describe the issue you are navigating and what you want to achieve. You may also email or call to make an appointment.",
    contactLabel: "Contact",
    offices: [
      { city: "New York", address: "45 Rockefeller Plaza, New York, NY 10111", role: "Headquarters" },
      { city: "Global Network", address: "Asia-Pacific, Caribbean, Europe, Africa", role: "Subject-Matter Experts" },
    ],
    generalInquiries: "General Inquiries",
    formNameLabel: "Full Name",
    formOrgLabel: "Organization",
    formEmailLabel: "Work Email",
    formInquiryLabel: "Nature of Inquiry",
    formInquirySelectOne: "Select one",
    inquiryTypes: [
      "Venture Capital",
      "Research and Risk Analysis",
      "Infrastructure and Renewable Energy",
      "Training and Financial Literacy",
      "Consulting",
      "Market Entry Strategy",
      "Other",
    ],
    formMessageLabel: "Brief Description",
    formMessagePlaceholder: "Describe the challenge or initiative you are navigating…",
    sendInquiry: "Send Inquiry",
    confidentialityNote: "All communications are strictly confidential.",
    successTitle: "Your inquiry has been received.",
    successBody: "A member of the CJPA team will review your message and respond within one business day.",
  },
}

export const es: Translations = {
  nav: {
    links: [
      { label: "Nosotros", id: "about" },
      { label: "Servicios", id: "services" },
      { label: "Equipo", id: "team" },
      { label: "Impacto", id: "impact" },
      { label: "Perspectivas", id: "insights" },
      { label: "Publicaciones", id: "publications" },
      { label: "Socios", id: "partners" },
      { label: "Contacto", id: "contact" },
    ],
    portal: "Portal",
  },
  footer: {
    tagline: "Asesoría estratégica en la intersección del capital, la geopolítica y las políticas transfronterizas.",
    nav: [
      { label: "Nosotros", id: "about" },
      { label: "Servicios", id: "services" },
      { label: "Equipo", id: "team" },
      { label: "Socios", id: "partners" },
      { label: "Contacto", id: "contact" },
      { label: "Portal de Clientes", href: "/login" },
    ],
    followUs: "Síguenos",
    rights: "Todos los derechos reservados.",
    privacy: "Política de Privacidad",
    terms: "Términos",
  },
  hero: {
    eyebrow: "Inteligencia Geopolítica, Capital y Recursos",
    headlineLine1: "Conectando Perspectiva Global,",
    headlineLine2: "Personas, Capital y Recursos",
    body: "CJPA Global Advisors ofrece planificación de escenarios basada en datos, asesoría estratégica, análisis geopolítico y acceso a capital para clientes que navegan mercados globales, oportunidades de infraestructura, riesgo en la cadena de suministro y expansión transfronteriza.",
    ctaPrimary: "Iniciar una Conversación",
    ctaSecondary: "Nuestras Áreas de Práctica",
    scroll: "Desplázate",
  },
  about: {
    eyebrow: "Nosotros",
    headlineLine1: "Asesoría Basada en Datos para",
    headlineLine2: "la Complejidad del Mercado Global",
    body1: "CJPA Global Advisors es una firma internacional de consultoría y asesoría dedicada a la planificación de escenarios basada en datos, la asesoría estratégica y el análisis geopolítico para clientes que enfrentan la dinámica de la globalización.",
    body2: "La firma comenzó como una unidad de investigación global y creció hasta convertirse en una consultoría multidisciplinaria fundamentada en las mejores prácticas de finanzas globales, políticas públicas e investigación. CJPA ayuda a sus clientes a comprender los principales eventos geopolíticos, las dinámicas culturales y los riesgos de disrupción en la cadena de suministro.",
    quote: "Conectando perspectiva global, personas, capital y recursos.",
    stats: [
      { value: "25+", label: "Años de experiencia del fundador\nen finanzas y asuntos globales" },
      { value: "16+", label: "Años de experiencia operativa senior en China,\nel Sudeste Asiático y EE. UU." },
      { value: "30+", label: "Años de experiencia legal y en\nmercados de capital en el equipo asesor" },
      { value: "6", label: "Especializaciones clave en riesgo,\ncomercio, ESG y educación financiera" },
    ],
  },
  mission: {
    eyebrow: "Misión",
    statement: "Uniendo culturas y diversidad a través de la integridad, el respeto y un compromiso inquebrantable con nuestros clientes.",
  },
  founder: {
    eyebrow: "Liderazgo",
    heading: "Sobre el Fundador",
    bio1: "Earl Carr es Fundador y Director Ejecutivo de CJPA Global Advisors, con sede en Nueva York. Con más de 25 años de experiencia, dirige un equipo multidisciplinario de analistas de investigación global, ingenieros de software, especialistas en marketing, analistas geopolíticos y especialistas en medios para guiar el liderazgo intelectual global de la firma, su práctica de asesoría estratégica a clientes y su mandato de negocios transfronterizos. Earl es Instructor Adjunto en el Centro de Asuntos Globales de la Universidad de NYU.",
    bio2: "Earl cuenta con experiencia en banca, gestión patrimonial, consultoría, análisis geopolítico, política exterior de EE. UU. y desarrollo internacional. Anteriormente se desempeñó como Vicepresidente en el Instituto de Inversión Sostenible (ISI) de Morgan Stanley, trabajando como estratega y líder de opinión. Earl es miembro del Comité Directivo del primer National Asian American Book Club y es columnista mensual en Forbes.com.",
    bio3editorPrefix: "El Sr. Carr es editor de",
    bio3bookTitle: "From Trump to Biden and Beyond: Reimagining U.S.-China Relations",
    bio3suffix: ", publicado por Palgrave Macmillan en septiembre de 2021.",
    messageEyebrow: "Mensaje del Fundador",
    message1: "En CJPA Global Advisors, nuestro excepcional equipo de analistas de investigación, ingenieros de software, asesores financieros, especialistas en marketing y estrategas geopolíticos se esfuerza por ser un líder global en servicios de asesoría, desarrollo de negocios transfronterizos e investigación personalizada. Las especializaciones principales de nuestra firma incluyen análisis de riesgo global, análisis de la cadena de suministro internacional, análisis comercial, gestión de riesgos, análisis geopolítico y de mercados financieros, gobernanza ambiental sostenible, inversión en justicia racial y capacitación en educación financiera. Lo que hace a CJPA verdaderamente excepcional es nuestra dedicación al rigor analítico y el acceso a investigación, personas e inteligencia propias a través de una red global de expertos y profesionales.",
    message2: "A través de una Junta Asesora Global de primer nivel, garantizamos que los objetivos y sistemas a largo plazo de la firma cuenten con orientación y rendición de cuentas, siendo a la vez responsables administradores de nuestros recursos financieros. En CJPA, nos apasiona utilizar el capital, la tecnología y los datos para ayudar a resolver algunos de los problemas más urgentes del mundo, incluyendo la equidad socioeconómica racial, la sostenibilidad y la transición hacia una economía global baja en carbono — una transición que consideramos tanto una oportunidad histórica de inversión como un riesgo que gestionar.",
    message3: "Nuestra empresa está decidida a ayudarle a alcanzar sus objetivos — ya sea identificando riesgos geopolíticos, financieros o comerciales, brindando orientación mientras explora inversiones en un nuevo país, o ayudando a recaudar capital para proyectos alrededor del mundo. Somos su socio de confianza.",
    signOff: "Cordialmente,",
    signatureTitle: "Fundador y Director Ejecutivo, CJPA Global Advisors",
    photoPendingLabel: "Foto pendiente —",
    photoPendingName: "Earl Carr y Jensen Huang, CFR",
    photoCaption: "El Fundador de CJPA, Earl Carr, junto al CEO de NVIDIA, Jensen Huang, en el Council on Foreign Relations en Washington, D.C.",
  },
  services: {
    eyebrow: "Servicios",
    heading: "Nuestros Servicios",
    items: [
      {
        title: "Investigación y Análisis de Riesgo",
        description: "Informes de investigación personalizados para clientes multinacionales que exploran nuevos mercados, con énfasis en política comercial, riesgo geopolítico, tendencias macroeconómicas, aranceles, impacto de políticas nacionales, ESG e inversión basada en valores.",
      },
      {
        title: "Capital de Riesgo y Financiamiento de Proyectos",
        description: "Conectando proyectos de infraestructura de alta calidad con capitalistas de riesgo, inversionistas individuales, family offices, RIAs e instituciones de financiamiento para el desarrollo.",
      },
      {
        title: "Infraestructura y Energía Renovable",
        description: "Capital y apoyo de asesoría para oportunidades de infraestructura en energía renovable, solar, proyectos de baterías, 5G, hidrógeno verde, fosfato de hierro y litio, y robótica de construcción.",
      },
      {
        title: "Estrategia de Entrada al Mercado",
        description: "Orientación para empresas extranjeras que ingresan al mercado estadounidense, incluyendo dinámicas de mercado, requisitos regulatorios, panoramas competitivos y estrategia de integración.",
      },
      {
        title: "Consultoría para Multinacionales y Gobiernos",
        description: "Inteligencia estratégica para organizaciones que invierten en China o el Indo-Pacífico, junto con apoyo en subvenciones, recaudación de fondos, desarrollo de juntas directivas y orientación en políticas ESG.",
      },
      {
        title: "Capacitación y Educación Financiera",
        description: "Talleres para organizaciones sin fines de lucro, agencias gubernamentales, organizaciones estudiantiles y empresas sobre asignación de activos, tolerancia al riesgo, ahorro para el retiro, debida diligencia en criptomonedas e inversión basada en valores.",
      },
    ],
  },
  team: {
    eyebrow: "Conoce al Equipo",
    headlineLine1: "Asesores, Analistas",
    headlineLine2: "y Especialistas Globales",
    intro: "CJPA reúne a consultores senior, asesores, analistas, asesoría legal, especialistas en tecnología y expertos regionales en Asia, África, el Caribe, Europa y Estados Unidos.",
    readMore: "Leer más",
    readLess: "Leer menos",
    advisorsHeading: "Asesores",
    members: {
      earlcarr: {
        title: "Fundador y Director Ejecutivo",
        bio: "Fundador y Director Ejecutivo de CJPA Global Advisors, a cargo del equipo de investigación global, el liderazgo intelectual y el mandato de desarrollo de negocios transfronterizos. Earl también es instructor adjunto en el Centro de Asuntos Globales de NYU.",
      },
      winslowrobertson: {
        title: "Consultor Senior",
        bio: "Fundador y socio gerente de Cowries and Rice, una consultoría estratégica sobre China-África enfocada en prácticas empresariales sostenibles de organizaciones chinas que operan en África.",
      },
      jacobdreyer: {
        title: "Consultor Senior",
        bio: "Escritor y editor radicado en Shanghái cuyo trabajo se centra en la clase media china, la política y economía chinas, y la relación de China con el mundo.",
      },
      essayworabo: {
        title: "Socio: Tecnología e Innovación",
        bio: "Asesor de IA y líder en transformación tecnológica con más de 11 años de experiencia en adopción empresarial de IA, marcos de gobernanza y programas complejos de modernización en la nube.",
      },
      davidjohnson: {
        title: "Asesor Legal",
        bio: "Socio de la oficina de Nueva York de PAG Law con más de 30 años de experiencia en mercados de capital, transacciones corporativas y de capital de riesgo, y asuntos generales de finanzas corporativas.",
      },
      christensmith: {
        title: "Consultora Senior",
        bio: "Cineasta, directora creativa, consultora e instructora en NYU Tisch. Fundadora y directora de Trellis Creative Strategies, asesorando producción mediática basada en la ética.",
      },
      zackkennedy: {
        title: "Asociado",
        bio: "Consultor con sede en Nueva York enfocado en temas geopolíticos y geoeconómicos, ayudando a empresas, gobiernos y ONGs a navegar un panorama global cambiante.",
      },
      lorenajames: {
        title: "Analista Senior",
        bio: "Analista de investigación e insights con experiencia en SEO, analítica, agregación de datos cualitativos y cuantitativos, análisis de la competencia y trabajo en startups sostenibles.",
      },
      nigelvinson: {
        title: "Consultor Senior",
        bio: "Consultor especializado en inteligencia geopolítica y asesoría estratégica a clientes, con particular experiencia en relaciones entre EE. UU. y China y tendencias tecnológicas emergentes.",
      },
      artbrown: {
        title: "Asesor Senior",
        bio: "Diplomático estadounidense senior y ex Embajador en Ecuador con más de 30 años de trayectoria en el Departamento de Estado, USAID y el Cuerpo de Paz.",
      },
      josephho: {
        title: "Asesor",
        bio: "Ejecutivo de alta dirección con experiencia en banca privada, gestión patrimonial, gestión de fondos globales, seguros, fusiones y adquisiciones, y actividades de licenciamiento.",
      },
      sundaabridgettjones: {
        title: "Asesora",
        bio: "Directora de Asociaciones y Promoción de la Global Energy Alliance for People and Planet, enfocada en escalar transiciones energéticas equitativas en economías emergentes.",
      },
      yuvalstav: {
        title: "Asesor",
        bio: "Emprendedor, gerente, consultor y profesor en economía sostenible y planificación estratégica. Socio fundador de Value Squared.",
      },
      shirleymarteyhargis: {
        title: "Asesora",
        bio: "Consultora en China y seguridad internacional con más de una década de experiencia en políticas de Asia en defensa, economía, tecnología, consultoría, inteligencia e investigación.",
      },
      mattharris: {
        title: "Asesor",
        bio: "Profesional de inversiones en Draper Associates y ex Vicepresidente en Blackstone, enfocado en financiamiento de crecimiento para empresas de energía.",
      },
      amyngeno: {
        title: "Analista en Prácticas",
        bio: "Estudiante de último año en la Universidad IE, Madrid, cursando un Doble Grado en Derecho y Relaciones Internacionales. Su experiencia profesional abarca investigación de políticas públicas, responsabilidad corporativa y cumplimiento legal en Kenia, España, el Reino Unido y Asia Central — incluyendo trabajo con la Aga Khan Foundation USA en colaboración con USAID y en Igeria & Ngugi Advocates en Nairobi. Su trabajo analítico conecta el cumplimiento corporativo con realidades económicas regionales, abarcando dinámicas comerciales, corredores de infraestructura y alineación de políticas macroeconómicas.",
      },
      megan: {
        title: "Practicante de Marketing Estratégico",
        bio: "Recién graduada de la Universidad Estatal de Montclair con especialización en Animación y Efectos Visuales. Megan aporta un trasfondo artístico al marketing estratégico, con experiencia universitaria en las producciones de animación de un semestre completo de Red Hawk Studio y trabajo en redes sociales con Viva la Animación, una organización que celebra a artistas latinos. Cree que el arte y el diseño gráfico pueden unir culturas y espera contribuir a CJPA.",
      },
      aaryamanajjha: {
        title: "Analista en Prácticas",
        bio: "Estudiante de ciencias de la computación y finanzas en la Universidad de Emory, trabajando en finanzas, consultoría, ciencia de datos, visualización climática e investigación en capital de riesgo.",
      },
    },
  },
  teamFilm: {
    kicker: "CJPA Global Advisors",
    heading: "Nuestro Enfoque de Asesoría Global",
    comingSoon: "Video próximamente",
    principalMessage: "Mensaje Principal",
  },
  insights: {
    eyebrow: "Perspectivas",
    headlineLine1: "Perspectivas sobre",
    headlineLine2: "el Orden Global",
    recentPerspectives: "Perspectivas Recientes",
    inThePress: "En la Prensa",
    articles: [
      {
        title: "Velocidad y seguridad: qué significa la OPI de Circle para el riesgo geopolítico de las stablecoins",
        excerpt: "Un artículo de Forbes por Earl Carr y el analista en prácticas Jonah Kim sobre las stablecoins, la OPI de Circle y las dimensiones de riesgo geopolítico de las finanzas digitales.",
      },
    ],
    press: [
      {
        headline: "CJPA Global Advisors asiste a un almuerzo exclusivo del Paley Center con el General David H. Petraeus",
        attachmentLabel: "Abrir comunicado",
      },
      {
        headline: "CJPA Global Advisors asiste a la 21ª Conferencia Anual Global Farm to Market | Chemicals de BMO",
        attachmentLabel: "Abrir comunicado",
      },
      {
        headline: "La creciente influencia de China en el Caribe a través de infraestructura y poder blando",
        attachmentLabel: "Imagen fuente",
      },
      {
        headline: "Earl Carr conversa con estudiantes de posgrado sobre carreras en relaciones internacionales",
        attachmentLabel: "Foto del evento",
      },
      {
        headline: "Comunicado de prensa de la asociación con Scage",
        attachmentLabel: "Abrir comunicado",
      },
      {
        headline: "Reuniones de CJPA con líderes de políticas de Taiwán y contactos del American Institute in Taiwan",
        attachmentLabel: "Foto de la reunión",
      },
    ],
  },
  publications: {
    eyebrow: "Publicaciones",
    headlineLine1: "Libros",
    headlineLine2: "e Investigación",
    publishedBookLabel: "Libro Publicado",
    bookDescription: "Un volumen editado sobre el futuro de las relaciones entre EE. UU. y China, con análisis de políticas y perspectivas multidisciplinarias sobre tecnología, comercio, relaciones a través del Estrecho, seguridad, clima, geopolítica y competencia global.",
    editorLabel: "Editor",
    yearLabel: "Año",
    publisherLabel: "Editorial",
    isbnLabel: "ISBN",
    viewOnAmazon: "Ver en Amazon",
    springerDetails: "Detalles en Springer",
    nextPublicationLabel: "Próxima Publicación",
    secondBook: "Segundo Libro",
    comingSoon: "Próximamente",
    comingSoonDetail: "Los detalles se anunciarán una vez que se finalicen el título, la portada y el cronograma de publicación.",
  },
  partners: {
    eyebrow: "Colaboración",
    headlineLine1: "¿Cómo Podemos",
    headlineLine2: "Ayudarte?",
    intro: "Toda colaboración comienza con una conversación confidencial. Trabajamos exclusivamente con organizaciones donde la calidad del juicio geopolítico y financiero es determinante — no como una formalidad de asesoría, sino como una necesidad competitiva.",
    tracks: [
      {
        title: "USITC",
        description: "Colaboraciones e investigación relacionadas con el comercio, la competitividad, la inteligencia de mercado y las cuestiones de política que moldean el comercio internacional.",
      },
      {
        title: "International Career Advancement Program",
        description: "Una red alineada con valores enfocada en la representación, el liderazgo y la ampliación del acceso a carreras en asuntos internacionales.",
      },
      {
        title: "Augustus Global Investment",
        description: "Contexto de colaboración de inversión para crecimiento transfronterizo, infraestructura y oportunidades de asesoría de capital.",
      },
    ],
    organizationsWeServe: "Organizaciones a las que Servimos",
    clientTypes: [
      "Gobiernos Soberanos",
      "Instituciones Multilaterales",
      "Instituciones de Financiamiento para el Desarrollo",
      "Patrocinadores de Infraestructura",
      "Desarrolladores de Energía Renovable",
      "Corporaciones Multinacionales",
      "Organizaciones sin Fines de Lucro y Fundaciones",
      "Family Offices y RIAs",
    ],
  },
  newsletter: {
    eyebrow: "Informe de Inteligencia",
    headlineLine1: "Inteligencia Geopolítica,",
    headlineLine2: "Entregada Trimestralmente",
    body: "Una evaluación concisa de los desarrollos geopolíticos, los cambios en los flujos de capital y las modificaciones regulatorias relevantes para inversionistas e instituciones internacionales. Sin ruido. Sin relleno.",
    emailLabel: "Correo de Trabajo",
    emailPlaceholder: "nombre@organizacion.com",
    subscribe: "Suscribirse",
    subscribing: "Suscribiendo…",
    disclaimer: "Solo trimestral. Cancele su suscripción en cualquier momento.",
    successTitle: "Ya estás en la lista.",
    successBody: "Nos pondremos en contacto con el próximo informe.",
    genericError: "Algo salió mal. Por favor, inténtalo de nuevo.",
    networkError: "Error de red. Por favor, verifica tu conexión e inténtalo de nuevo.",
  },
  contact: {
    eyebrow: "Contacto",
    headlineLine1: "Iniciar una",
    headlineLine2: "Conversación",
    body: "Para ayudarnos a atender mejor su consulta, describa el problema que está enfrentando y lo que desea lograr. También puede enviarnos un correo electrónico o llamar para concertar una cita.",
    contactLabel: "Contacto",
    offices: [
      { city: "Nueva York", address: "45 Rockefeller Plaza, New York, NY 10111", role: "Sede Central" },
      { city: "Red Global", address: "Asia-Pacífico, el Caribe, Europa, África", role: "Expertos en la Materia" },
    ],
    generalInquiries: "Consultas Generales",
    formNameLabel: "Nombre Completo",
    formOrgLabel: "Organización",
    formEmailLabel: "Correo de Trabajo",
    formInquiryLabel: "Naturaleza de la Consulta",
    formInquirySelectOne: "Selecciona una opción",
    inquiryTypes: [
      "Capital de Riesgo",
      "Investigación y Análisis de Riesgo",
      "Infraestructura y Energía Renovable",
      "Capacitación y Educación Financiera",
      "Consultoría",
      "Estrategia de Entrada al Mercado",
      "Otro",
    ],
    formMessageLabel: "Descripción Breve",
    formMessagePlaceholder: "Describa el desafío o la iniciativa que está enfrentando…",
    sendInquiry: "Enviar Consulta",
    confidentialityNote: "Todas las comunicaciones son estrictamente confidenciales.",
    successTitle: "Su consulta ha sido recibida.",
    successBody: "Un miembro del equipo de CJPA revisará su mensaje y responderá dentro de un día hábil.",
  },
}

export const zhCN: Translations = {
  nav: {
    links: [
      { label: "关于我们", id: "about" },
      { label: "服务", id: "services" },
      { label: "团队", id: "team" },
      { label: "影响力", id: "impact" },
      { label: "洞察", id: "insights" },
      { label: "出版物", id: "publications" },
      { label: "合作伙伴", id: "partners" },
      { label: "联系我们", id: "contact" },
    ],
    portal: "客户门户",
  },
  footer: {
    tagline: "在资本、地缘政治与跨境政策交汇处提供战略咨询。",
    nav: [
      { label: "关于我们", id: "about" },
      { label: "服务", id: "services" },
      { label: "团队", id: "team" },
      { label: "合作伙伴", id: "partners" },
      { label: "联系我们", id: "contact" },
      { label: "客户门户", href: "/login" },
    ],
    followUs: "关注我们",
    rights: "版权所有。",
    privacy: "隐私政策",
    terms: "条款",
  },
  hero: {
    eyebrow: "地缘政治情报、资本与资源",
    headlineLine1: "连接全球洞察、",
    headlineLine2: "人才、资本与资源",
    body: "CJPA Global Advisors 为在全球市场、基础设施机遇、供应链风险与跨境扩张中前行的客户,提供数据驱动的情景规划、战略咨询、地缘政治分析与资本对接服务。",
    ctaPrimary: "开启对话",
    ctaSecondary: "我们的业务领域",
    scroll: "向下滚动",
  },
  about: {
    eyebrow: "关于我们",
    headlineLine1: "以数据驱动的洞见",
    headlineLine2: "应对全球市场的复杂性",
    body1: "CJPA Global Advisors 是一家国际咨询与顾问公司,致力于为应对全球化动态的客户提供数据驱动的情景规划、战略咨询与地缘政治分析。",
    body2: "公司最初是一家全球研究机构,后来发展成为一家融合全球金融、政策与研究最佳实践的多学科咨询公司。CJPA 帮助客户理解重大地缘政治事件、文化动态以及供应链中断风险。",
    quote: "连接全球洞察、人才、资本与资源。",
    stats: [
      { value: "25+", label: "创始人在金融与全球事务\n领域的从业年限" },
      { value: "16+", label: "在中国、东南亚及美国的\n高级运营经验年限" },
      { value: "30+", label: "顾问团队在法律与资本\n市场领域的从业年限" },
      { value: "6", label: "涵盖风险、贸易、ESG\n与金融知识普及的核心专长" },
    ],
  },
  mission: {
    eyebrow: "使命",
    statement: "以诚信、尊重与对客户始终如一的承诺,连接不同文化与多元背景。",
  },
  founder: {
    eyebrow: "领导团队",
    heading: "关于创始人",
    bio1: "Earl Carr 是 CJPA Global Advisors 的创始人兼首席执行官,常驻纽约。凭借超过 25 年的从业经验,他领导着一支由全球研究分析师、软件工程师、市场营销专家、地缘政治分析师和媒体专家组成的多学科团队,引领公司在全球思想领导力、战略客户咨询业务以及跨境业务拓展方面的发展。Earl 同时担任纽约大学全球事务中心兼职讲师。",
    bio2: "Earl 在银行业、财富管理、咨询、地缘政治分析、美国外交政策及国际发展等领域具有深厚专长。他此前曾在摩根士丹利可持续投资研究院(ISI)担任副总裁,担任战略专家与思想领袖。Earl 是首届全美亚裔美国人读书会指导委员会成员,并担任 Forbes.com 的月度专栏作家。",
    bio3editorPrefix: "Carr 先生担任",
    bio3bookTitle: "《From Trump to Biden and Beyond: Reimagining U.S.-China Relations》",
    bio3suffix: "一书的主编,该书由 Palgrave Macmillan 于 2021 年 9 月出版。",
    messageEyebrow: "创始人寄语",
    message1: "在 CJPA Global Advisors,我们由研究分析师、软件工程师、财务顾问、市场营销专家和地缘政治战略家组成的杰出团队,致力于成为咨询服务、跨境业务发展与定制化研究领域的全球领导者。公司的核心专长涵盖全球风险分析、国际供应链分析、贸易分析、风险管理、地缘政治与金融市场分析、环境可持续治理、种族正义投资以及金融知识普及培训。CJPA 之所以与众不同,在于我们对分析严谨性的执着追求,以及通过全球专家与专业人士网络所获得的独有研究、人脉与情报资源。",
    message2: "通过世界一流的全球顾问委员会,我们确保公司的长期目标与制度体系得到有效指导与问责,同时审慎管理财务资源。在 CJPA,我们热衷于运用资本、技术与数据,帮助解决世界面临的一些最紧迫问题,包括种族社会经济公平、可持续发展,以及向低碳全球经济的转型——我们相信,这一转型既是需要管理的风险,更是一次具有历史意义的投资机遇。",
    message3: "无论是识别地缘政治、财务或商业风险,为您探索海外投资提供洞见,还是协助您为全球项目筹集资金,我们都将竭力助您实现目标。我们是您值得信赖的合作伙伴。",
    signOff: "谨致问候,",
    signatureTitle: "CJPA Global Advisors 创始人兼首席执行官",
    photoPendingLabel: "照片待补充 —",
    photoPendingName: "Earl Carr 与 Jensen Huang,外交关系委员会",
    photoCaption: "CJPA 创始人 Earl Carr 与英伟达(NVIDIA)首席执行官黄仁勋(Jensen Huang)在华盛顿特区外交关系委员会(CFR)合影。",
  },
  services: {
    eyebrow: "服务",
    heading: "我们的服务",
    items: [
      {
        title: "研究与风险分析",
        description: "为探索新市场的跨国客户提供定制化研究报告,重点关注贸易政策、地缘政治风险、宏观趋势、关税、国内政策影响、ESG 及价值导向型投资。",
      },
      {
        title: "风险投资与项目融资",
        description: "将高质量基础设施项目与风险投资人、个人投资者、家族办公室、注册投资顾问(RIA)及开发性金融机构对接。",
      },
      {
        title: "基础设施与可再生能源",
        description: "为可再生能源、太阳能、电池项目、5G、绿色氢能、磷酸铁锂及建筑机器人等领域的基础设施机遇提供资本与咨询支持。",
      },
      {
        title: "市场进入战略",
        description: "为进入美国市场的外国企业提供指导,涵盖市场动态、监管要求、竞争格局与整合战略。",
      },
      {
        title: "面向跨国企业与政府的咨询",
        description: "为在中国或印太地区投资的组织提供战略情报,并提供资助支持、筹款、董事会建设及 ESG 政策指导。",
      },
      {
        title: "培训与金融知识普及",
        description: "为非营利组织、政府机构、学生组织及企业提供关于资产配置、风险承受能力、退休储蓄、加密货币尽职调查及价值导向型投资的培训课程。",
      },
    ],
  },
  team: {
    eyebrow: "团队介绍",
    headlineLine1: "顾问、分析师",
    headlineLine2: "与全球专家",
    intro: "CJPA 汇聚了高级顾问、咨询专家、分析师、法律顾问、技术专家以及遍布亚洲、非洲、加勒比地区、欧洲和美国的区域专家。",
    readMore: "阅读更多",
    readLess: "收起",
    advisorsHeading: "顾问团队",
    members: {
      earlcarr: {
        title: "创始人兼首席执行官",
        bio: "CJPA Global Advisors 创始人兼首席执行官,负责领导全球研究团队、思想领导力建设及跨境业务拓展工作。Earl 同时担任纽约大学全球事务中心兼职讲师。",
      },
      winslowrobertson: {
        title: "高级顾问",
        bio: "Cowries and Rice 创始人兼执行合伙人,该机构是一家专注于中国企业在非洲开展可持续商业实践的中非战略咨询公司。",
      },
      jacobdreyer: {
        title: "高级顾问",
        bio: "常驻上海的作家兼编辑,专注于中国中产阶级、中国政治经济以及中国与世界关系等议题的研究与写作。",
      },
      essayworabo: {
        title: "合伙人:技术与创新",
        bio: "人工智能顾问兼技术转型领导者,拥有超过 11 年企业级人工智能应用、治理框架构建及复杂云端现代化项目经验。",
      },
      davidjohnson: {
        title: "法律顾问",
        bio: "PAG Law 纽约办公室合伙人,在资本市场、企业与风险投资交易及一般企业融资事务方面拥有超过 30 年经验。",
      },
      christensmith: {
        title: "高级顾问",
        bio: "电影制作人、创意总监、顾问,同时担任纽约大学 Tisch 艺术学院讲师。Trellis Creative Strategies 创始人兼总监,专注于符合伦理规范的媒体制作咨询。",
      },
      zackkennedy: {
        title: "助理顾问",
        bio: "常驻纽约的顾问,专注于地缘政治与地缘经济议题,协助企业、政府及非政府组织应对不断变化的全球格局。",
      },
      lorenajames: {
        title: "高级分析师",
        bio: "研究与洞察分析师,拥有搜索引擎优化(SEO)、数据分析、定性与定量数据整合、竞争对手分析及可持续创业公司工作经验。",
      },
      nigelvinson: {
        title: "高级顾问",
        bio: "专注于地缘政治情报与面向客户的战略咨询的顾问,尤其擅长中美关系及新兴科技趋势领域。",
      },
      artbrown: {
        title: "高级顾问",
        bio: "美国资深外交官,曾任美国驻厄瓜多尔大使,拥有超过 30 年在美国国务院、美国国际开发署及和平队的从业经历。",
      },
      josephho: {
        title: "顾问",
        bio: "资深管理高管,拥有私人银行、财富管理、全球基金管理、保险、并购及牌照业务方面的丰富经验。",
      },
      sundaabridgettjones: {
        title: "顾问",
        bio: "全球能源与人类联盟(Global Energy Alliance for People and Planet)首席合作与倡导官,专注于在新兴经济体中扩大公平能源转型的规模。",
      },
      yuvalstav: {
        title: "顾问",
        bio: "企业家、管理者、顾问,同时担任可持续经济学与战略规划领域讲师。Value Squared 创始合伙人。",
      },
      shirleymarteyhargis: {
        title: "顾问",
        bio: "专注于中国与国际安全事务的顾问,在国防、经济、科技、咨询、情报与研究领域拥有逾十年的亚洲政策从业经验。",
      },
      mattharris: {
        title: "顾问",
        bio: "Draper Associates 投资专业人士,曾任黑石集团(Blackstone)副总裁,专注于能源企业的成长期融资。",
      },
      amyngeno: {
        title: "实习分析师",
        bio: "马德里 IE 大学即将升入大四的学生,主修法律与国际关系双学位。其专业经验涵盖政策研究、企业社会责任及法律合规工作,足迹遍及肯尼亚、西班牙、英国及中亚地区——包括与美国阿迦汗基金会(与美国国际开发署合作)以及内罗毕 Igeria & Ngugi Advocates 律师事务所的合作经历。她的分析工作将企业合规与区域经济现实相结合,涵盖贸易动态、基础设施走廊及宏观经济政策协调等领域。",
      },
      megan: {
        title: "战略市场营销实习生",
        bio: "蒙特克莱尔州立大学动画与视觉特效专业应届毕业生。Megan 将艺术背景融入战略营销工作,大学期间曾参与 Red Hawk Studio 为期一学期的动画制作项目,并为庆祝拉丁裔艺术家的组织 Viva la Animacion 从事社交媒体工作。她相信艺术与平面设计能够连接不同文化,并期待为 CJPA 的发展贡献力量。",
      },
      aaryamanajjha: {
        title: "实习分析师",
        bio: "埃默里大学计算机科学与金融专业学生,涉猎金融、咨询、数据科学、气候可视化及风险投资研究等多个领域。",
      },
    },
  },
  teamFilm: {
    kicker: "CJPA Global Advisors",
    heading: "我们的全球咨询方法",
    comingSoon: "视频即将上线",
    principalMessage: "创始人寄语",
  },
  insights: {
    eyebrow: "洞察",
    headlineLine1: "关于全球秩序",
    headlineLine2: "的观察与思考",
    recentPerspectives: "近期观点",
    inThePress: "媒体报道",
    articles: [
      {
        title: "速度与安全:Circle 首次公开募股(IPO)对稳定币地缘政治风险意味着什么",
        excerpt: "Earl Carr 与实习分析师 Jonah Kim 在《福布斯》联合撰写的文章,探讨稳定币、Circle 的 IPO 及数字金融的地缘政治风险维度。",
      },
    ],
    press: [
      {
        headline: "CJPA Global Advisors 出席 Paley Center 特邀午宴,大卫·彼得雷乌斯(David H. Petraeus)将军出席",
        attachmentLabel: "查看新闻稿",
      },
      {
        headline: "CJPA Global Advisors 出席蒙特利尔银行(BMO)第 21 届全球农产品到市场化工年度大会",
        attachmentLabel: "查看新闻稿",
      },
      {
        headline: "中国通过基础设施建设与软实力在加勒比地区不断提升影响力",
        attachmentLabel: "来源图片",
      },
      {
        headline: "Earl Carr 与研究生分享国际关系领域的职业发展经验",
        attachmentLabel: "活动照片",
      },
      {
        headline: "Scage 合作新闻稿",
        attachmentLabel: "查看新闻稿",
      },
      {
        headline: "CJPA 与台湾政策界领袖及美国在台协会联系人举行会晤",
        attachmentLabel: "会议照片",
      },
    ],
  },
  publications: {
    eyebrow: "出版物",
    headlineLine1: "图书与",
    headlineLine2: "研究成果",
    publishedBookLabel: "已出版图书",
    bookDescription: "一部关于美中关系未来走向的编著作品,汇集了在科技、贸易、两岸关系、安全、气候、地缘政治及全球竞争等领域的政策分析与多学科视角。",
    editorLabel: "主编",
    yearLabel: "出版年份",
    publisherLabel: "出版社",
    isbnLabel: "ISBN",
    viewOnAmazon: "在亚马逊查看",
    springerDetails: "施普林格(Springer)详情",
    nextPublicationLabel: "下一部出版物",
    secondBook: "第二部著作",
    comingSoon: "敬请期待",
    comingSoonDetail: "书名、封面及出版时间表确定后将另行公布。",
  },
  partners: {
    eyebrow: "合作",
    headlineLine1: "我们能为您",
    headlineLine2: "提供哪些帮助",
    intro: "每一次合作都始于一次保密的沟通。我们只与那些高度重视地缘政治与财务判断质量的组织合作——对我们而言,咨询并非形式,而是关乎竞争力的必要之举。",
    tracks: [
      {
        title: "美国国际贸易委员会(USITC)",
        description: "与贸易、竞争力、市场情报及塑造国际商业格局的政策议题相关的合作与研究。",
      },
      {
        title: "国际职业发展计划(ICAP)",
        description: "一个以价值观为导向的网络,致力于推动代表性、领导力建设,并拓宽国际事务职业发展的准入渠道。",
      },
      {
        title: "Augustus Global Investment",
        description: "面向跨境增长、基础设施建设及资本咨询机遇的投资合作背景支持。",
      },
    ],
    organizationsWeServe: "我们服务的机构类型",
    clientTypes: [
      "主权政府",
      "多边机构",
      "开发性金融机构",
      "基础设施投资方",
      "可再生能源开发商",
      "跨国企业",
      "非营利组织与基金会",
      "家族办公室与注册投资顾问(RIA)",
    ],
  },
  newsletter: {
    eyebrow: "情报简报",
    headlineLine1: "地缘政治情报,",
    headlineLine2: "每季度为您送达",
    body: "简明扼要地评估地缘政治动态、资本流动变化及监管政策调整,聚焦国际投资者与机构真正关心的内容。没有杂音,没有冗余。",
    emailLabel: "工作邮箱",
    emailPlaceholder: "name@organization.com",
    subscribe: "订阅",
    subscribing: "订阅中…",
    disclaimer: "仅每季度发送一次,可随时取消订阅。",
    successTitle: "您已成功加入订阅名单。",
    successBody: "我们将在下一期简报发布时与您联系。",
    genericError: "出现问题,请重试。",
    networkError: "网络错误,请检查您的网络连接后重试。",
  },
  contact: {
    eyebrow: "联系我们",
    headlineLine1: "开启一次",
    headlineLine2: "对话",
    body: "为了更好地为您服务,请描述您正在面对的问题以及希望达成的目标。您也可以通过电子邮件或电话与我们预约会面。",
    contactLabel: "联系方式",
    offices: [
      { city: "纽约", address: "45 Rockefeller Plaza, New York, NY 10111", role: "总部" },
      { city: "全球网络", address: "亚太地区、加勒比地区、欧洲、非洲", role: "专业领域专家" },
    ],
    generalInquiries: "一般咨询",
    formNameLabel: "姓名",
    formOrgLabel: "所属机构",
    formEmailLabel: "工作邮箱",
    formInquiryLabel: "咨询类型",
    formInquirySelectOne: "请选择",
    inquiryTypes: [
      "风险投资",
      "研究与风险分析",
      "基础设施与可再生能源",
      "培训与金融知识普及",
      "咨询服务",
      "市场进入战略",
      "其他",
    ],
    formMessageLabel: "简要说明",
    formMessagePlaceholder: "请描述您正在面对的挑战或计划开展的项目……",
    sendInquiry: "提交咨询",
    confidentialityNote: "我们对所有沟通内容严格保密。",
    successTitle: "您的咨询已收到。",
    successBody: "CJPA 团队成员将审阅您的留言,并在一个工作日内回复。",
  },
}

export const zhTW: Translations = {
  nav: {
    links: [
      { label: "關於我們", id: "about" },
      { label: "服務", id: "services" },
      { label: "團隊", id: "team" },
      { label: "影響力", id: "impact" },
      { label: "洞察", id: "insights" },
      { label: "出版品", id: "publications" },
      { label: "合作夥伴", id: "partners" },
      { label: "聯絡我們", id: "contact" },
    ],
    portal: "客戶入口",
  },
  footer: {
    tagline: "在資本、地緣政治與跨境政策交會處提供策略諮詢。",
    nav: [
      { label: "關於我們", id: "about" },
      { label: "服務", id: "services" },
      { label: "團隊", id: "team" },
      { label: "合作夥伴", id: "partners" },
      { label: "聯絡我們", id: "contact" },
      { label: "客戶入口", href: "/login" },
    ],
    followUs: "追蹤我們",
    rights: "版權所有。",
    privacy: "隱私政策",
    terms: "條款",
  },
  hero: {
    eyebrow: "地緣政治情報、資本與資源",
    headlineLine1: "連結全球洞察、",
    headlineLine2: "人才、資本與資源",
    body: "CJPA Global Advisors 為在全球市場、基礎建設機會、供應鏈風險與跨境擴張中前行的客戶,提供數據驅動的情境規劃、策略諮詢、地緣政治分析與資本對接服務。",
    ctaPrimary: "展開對話",
    ctaSecondary: "我們的業務領域",
    scroll: "向下滑動",
  },
  about: {
    eyebrow: "關於我們",
    headlineLine1: "以數據驅動的洞見",
    headlineLine2: "因應全球市場的複雜性",
    body1: "CJPA Global Advisors 是一家國際諮詢與顧問公司,致力於為因應全球化動態的客戶提供數據驅動的情境規劃、策略諮詢與地緣政治分析。",
    body2: "公司最初是一家全球研究機構,後來發展成為一家融合全球金融、政策與研究最佳實務的多學科諮詢公司。CJPA 協助客戶理解重大地緣政治事件、文化動態以及供應鏈中斷風險。",
    quote: "連結全球洞察、人才、資本與資源。",
    stats: [
      { value: "25+", label: "創辦人在金融與全球事務\n領域的從業年資" },
      { value: "16+", label: "在中國、東南亞及美國的\n高階營運經驗年資" },
      { value: "30+", label: "顧問團隊在法律與資本\n市場領域的從業年資" },
      { value: "6", label: "涵蓋風險、貿易、ESG\n與金融知識普及的核心專長" },
    ],
  },
  mission: {
    eyebrow: "使命",
    statement: "以誠信、尊重與對客戶始終如一的承諾,連結不同文化與多元背景。",
  },
  founder: {
    eyebrow: "領導團隊",
    heading: "關於創辦人",
    bio1: "Earl Carr 是 CJPA Global Advisors 的創辦人兼執行長,常駐紐約。憑藉超過 25 年的從業經驗,他領導一支由全球研究分析師、軟體工程師、行銷專家、地緣政治分析師和媒體專家組成的多學科團隊,引領公司在全球思想領導力、策略客戶諮詢業務以及跨境業務拓展方面的發展。Earl 同時擔任紐約大學全球事務中心兼任講師。",
    bio2: "Earl 在銀行業、財富管理、諮詢、地緣政治分析、美國外交政策及國際發展等領域具有深厚專長。他先前曾在摩根士丹利永續投資研究院(ISI)擔任副總裁,擔任策略專家與意見領袖。Earl 是首屆全美亞裔美國人讀書會指導委員會成員,並擔任 Forbes.com 的每月專欄作家。",
    bio3editorPrefix: "Carr 先生擔任",
    bio3bookTitle: "《From Trump to Biden and Beyond: Reimagining U.S.-China Relations》",
    bio3suffix: "一書的主編,該書由 Palgrave Macmillan 於 2021 年 9 月出版。",
    messageEyebrow: "創辦人的話",
    message1: "在 CJPA Global Advisors,我們由研究分析師、軟體工程師、財務顧問、行銷專家和地緣政治策略家組成的傑出團隊,致力於成為諮詢服務、跨境業務發展與客製化研究領域的全球領導者。公司的核心專長涵蓋全球風險分析、國際供應鏈分析、貿易分析、風險管理、地緣政治與金融市場分析、環境永續治理、種族正義投資以及金融知識普及培訓。CJPA 之所以與眾不同,在於我們對分析嚴謹性的堅持,以及透過全球專家與專業人士網絡所獲得的獨有研究、人脈與情報資源。",
    message2: "透過世界一流的全球顧問委員會,我們確保公司的長期目標與制度體系得到有效指導與問責,同時審慎管理財務資源。在 CJPA,我們熱衷於運用資本、技術與數據,協助解決世界面臨的一些最迫切問題,包括種族社會經濟公平、永續發展,以及邁向低碳全球經濟的轉型——我們相信,這項轉型既是需要管理的風險,更是一次具有歷史意義的投資機會。",
    message3: "無論是辨識地緣政治、財務或商業風險,為您探索海外投資提供洞見,還是協助您為全球專案籌集資金,我們都將竭力協助您達成目標。我們是您值得信賴的合作夥伴。",
    signOff: "謹致問候,",
    signatureTitle: "CJPA Global Advisors 創辦人兼執行長",
    photoPendingLabel: "照片待補充 —",
    photoPendingName: "Earl Carr 與 Jensen Huang,外交關係委員會",
    photoCaption: "CJPA 創辦人 Earl Carr 與輝達(NVIDIA)執行長黃仁勳(Jensen Huang)在華盛頓特區外交關係委員會(CFR)合影。",
  },
  services: {
    eyebrow: "服務",
    heading: "我們的服務",
    items: [
      {
        title: "研究與風險分析",
        description: "為探索新市場的跨國客戶提供客製化研究報告,重點關注貿易政策、地緣政治風險、宏觀趨勢、關稅、國內政策影響、ESG 及價值導向型投資。",
      },
      {
        title: "創業投資與專案融資",
        description: "將高品質基礎建設專案與創業投資人、個人投資者、家族辦公室、註冊投資顧問(RIA)及開發性金融機構對接。",
      },
      {
        title: "基礎建設與再生能源",
        description: "為再生能源、太陽能、電池專案、5G、綠色氫能、磷酸鋰鐵及營建機器人等領域的基礎建設機會提供資本與諮詢支持。",
      },
      {
        title: "市場進入策略",
        description: "為進入美國市場的外國企業提供指導,涵蓋市場動態、法規要求、競爭格局與整合策略。",
      },
      {
        title: "面向跨國企業與政府的諮詢",
        description: "為在中國或印太地區投資的組織提供策略情報,並提供資助支持、募款、董事會建設及 ESG 政策指導。",
      },
      {
        title: "培訓與金融知識普及",
        description: "為非營利組織、政府機構、學生組織及企業提供關於資產配置、風險承受能力、退休儲蓄、加密貨幣盡職調查及價值導向型投資的培訓課程。",
      },
    ],
  },
  team: {
    eyebrow: "團隊介紹",
    headlineLine1: "顧問、分析師",
    headlineLine2: "與全球專家",
    intro: "CJPA 匯聚了高階顧問、諮詢專家、分析師、法律顧問、技術專家以及遍布亞洲、非洲、加勒比地區、歐洲和美國的區域專家。",
    readMore: "閱讀更多",
    readLess: "收合",
    advisorsHeading: "顧問團隊",
    members: {
      earlcarr: {
        title: "創辦人兼執行長",
        bio: "CJPA Global Advisors 創辦人兼執行長,負責領導全球研究團隊、思想領導力建設及跨境業務拓展工作。Earl 同時擔任紐約大學全球事務中心兼任講師。",
      },
      winslowrobertson: {
        title: "資深顧問",
        bio: "Cowries and Rice 創辦人兼執行合夥人,該機構是一家專注於中國企業在非洲開展永續商業實務的中非策略諮詢公司。",
      },
      jacobdreyer: {
        title: "資深顧問",
        bio: "常駐上海的作家兼編輯,專注於中國中產階級、中國政治經濟以及中國與世界關係等議題的研究與寫作。",
      },
      essayworabo: {
        title: "合夥人:科技與創新",
        bio: "人工智慧顧問兼技術轉型領導者,擁有超過 11 年企業級人工智慧應用、治理框架建構及複雜雲端現代化專案經驗。",
      },
      davidjohnson: {
        title: "法律顧問",
        bio: "PAG Law 紐約辦公室合夥人,在資本市場、企業與創業投資交易及一般企業融資事務方面擁有超過 30 年經驗。",
      },
      christensmith: {
        title: "資深顧問",
        bio: "電影製作人、創意總監、顧問,同時擔任紐約大學 Tisch 藝術學院講師。Trellis Creative Strategies 創辦人兼總監,專注於符合倫理規範的媒體製作諮詢。",
      },
      zackkennedy: {
        title: "助理顧問",
        bio: "常駐紐約的顧問,專注於地緣政治與地緣經濟議題,協助企業、政府及非政府組織因應不斷變化的全球格局。",
      },
      lorenajames: {
        title: "資深分析師",
        bio: "研究與洞察分析師,擁有搜尋引擎優化(SEO)、數據分析、定性與定量數據整合、競爭對手分析及永續新創公司工作經驗。",
      },
      nigelvinson: {
        title: "資深顧問",
        bio: "專注於地緣政治情報與面向客戶的策略諮詢的顧問,尤其擅長中美關係及新興科技趨勢領域。",
      },
      artbrown: {
        title: "資深顧問",
        bio: "美國資深外交官,曾任美國駐厄瓜多大使,擁有超過 30 年在美國國務院、美國國際開發總署及和平工作團的從業經歷。",
      },
      josephho: {
        title: "顧問",
        bio: "資深管理高階主管,擁有私人銀行、財富管理、全球基金管理、保險、併購及牌照業務方面的豐富經驗。",
      },
      sundaabridgettjones: {
        title: "顧問",
        bio: "全球能源與人類聯盟(Global Energy Alliance for People and Planet)首席合作與倡議官,專注於在新興經濟體中擴大公平能源轉型的規模。",
      },
      yuvalstav: {
        title: "顧問",
        bio: "企業家、管理者、顧問,同時擔任永續經濟學與策略規劃領域講師。Value Squared 創始合夥人。",
      },
      shirleymarteyhargis: {
        title: "顧問",
        bio: "專注於中國與國際安全事務的顧問,在國防、經濟、科技、諮詢、情報與研究領域擁有逾十年的亞洲政策從業經驗。",
      },
      mattharris: {
        title: "顧問",
        bio: "Draper Associates 投資專業人士,曾任黑石集團(Blackstone)副總裁,專注於能源企業的成長期融資。",
      },
      amyngeno: {
        title: "實習分析師",
        bio: "馬德里 IE 大學即將升上大四的學生,主修法律與國際關係雙學位。其專業經驗涵蓋政策研究、企業社會責任及法律遵循工作,足跡遍及肯亞、西班牙、英國及中亞地區——包括與美國阿迦汗基金會(與美國國際開發總署合作)以及奈洛比 Igeria & Ngugi Advocates 律師事務所的合作經歷。她的分析工作將企業遵循與區域經濟現實相結合,涵蓋貿易動態、基礎建設走廊及總體經濟政策協調等領域。",
      },
      megan: {
        title: "策略行銷實習生",
        bio: "蒙特克萊爾州立大學動畫與視覺特效專業應屆畢業生。Megan 將藝術背景融入策略行銷工作,大學期間曾參與 Red Hawk Studio 為期一學期的動畫製作專案,並為慶祝拉丁裔藝術家的組織 Viva la Animacion 從事社群媒體工作。她相信藝術與平面設計能夠連結不同文化,並期待為 CJPA 的發展貢獻心力。",
      },
      aaryamanajjha: {
        title: "實習分析師",
        bio: "艾默里大學電腦科學與財務專業學生,涉獵金融、諮詢、資料科學、氣候視覺化及創業投資研究等多個領域。",
      },
    },
  },
  teamFilm: {
    kicker: "CJPA Global Advisors",
    heading: "我們的全球諮詢方法",
    comingSoon: "影片即將推出",
    principalMessage: "創辦人的話",
  },
  insights: {
    eyebrow: "洞察",
    headlineLine1: "關於全球秩序",
    headlineLine2: "的觀察與思考",
    recentPerspectives: "近期觀點",
    inThePress: "媒體報導",
    articles: [
      {
        title: "速度與安全:Circle 首次公開發行(IPO)對穩定幣地緣政治風險意味著什麼",
        excerpt: "Earl Carr 與實習分析師 Jonah Kim 在《富比士》聯合撰寫的文章,探討穩定幣、Circle 的 IPO 及數位金融的地緣政治風險面向。",
      },
    ],
    press: [
      {
        headline: "CJPA Global Advisors 出席 Paley Center 特邀午宴,大衛·彼得雷烏斯(David H. Petraeus)將軍出席",
        attachmentLabel: "查看新聞稿",
      },
      {
        headline: "CJPA Global Advisors 出席蒙特婁銀行(BMO)第 21 屆全球農產品到市場化學品年度大會",
        attachmentLabel: "查看新聞稿",
      },
      {
        headline: "中國透過基礎建設與軟實力在加勒比地區不斷提升影響力",
        attachmentLabel: "來源圖片",
      },
      {
        headline: "Earl Carr 與研究生分享國際關係領域的職涯發展經驗",
        attachmentLabel: "活動照片",
      },
      {
        headline: "Scage 合作新聞稿",
        attachmentLabel: "查看新聞稿",
      },
      {
        headline: "CJPA 與台灣政策界領袖及美國在台協會聯繫人舉行會晤",
        attachmentLabel: "會議照片",
      },
    ],
  },
  publications: {
    eyebrow: "出版品",
    headlineLine1: "書籍與",
    headlineLine2: "研究成果",
    publishedBookLabel: "已出版書籍",
    bookDescription: "一部關於美中關係未來走向的編著作品,匯集了在科技、貿易、兩岸關係、安全、氣候、地緣政治及全球競爭等領域的政策分析與多學科觀點。",
    editorLabel: "主編",
    yearLabel: "出版年份",
    publisherLabel: "出版社",
    isbnLabel: "ISBN",
    viewOnAmazon: "於 Amazon 查看",
    springerDetails: "Springer 詳情",
    nextPublicationLabel: "下一部出版品",
    secondBook: "第二部著作",
    comingSoon: "敬請期待",
    comingSoonDetail: "書名、封面及出版時間表確定後將另行公布。",
  },
  partners: {
    eyebrow: "合作",
    headlineLine1: "我們能為您",
    headlineLine2: "提供哪些協助",
    intro: "每一次合作都始於一次保密的溝通。我們僅與那些高度重視地緣政治與財務判斷品質的組織合作——對我們而言,諮詢並非形式,而是關乎競爭力的必要之舉。",
    tracks: [
      {
        title: "美國國際貿易委員會(USITC)",
        description: "與貿易、競爭力、市場情報及形塑國際商業格局的政策議題相關的合作與研究。",
      },
      {
        title: "國際職涯發展計畫(ICAP)",
        description: "一個以價值觀為導向的網絡,致力於推動代表性、領導力建設,並拓寬國際事務職涯發展的準入管道。",
      },
      {
        title: "Augustus Global Investment",
        description: "面向跨境成長、基礎建設及資本諮詢機會的投資合作背景支持。",
      },
    ],
    organizationsWeServe: "我們服務的機構類型",
    clientTypes: [
      "主權政府",
      "多邊機構",
      "開發性金融機構",
      "基礎建設投資方",
      "再生能源開發商",
      "跨國企業",
      "非營利組織與基金會",
      "家族辦公室與註冊投資顧問(RIA)",
    ],
  },
  newsletter: {
    eyebrow: "情報簡報",
    headlineLine1: "地緣政治情報,",
    headlineLine2: "每季為您送達",
    body: "簡明扼要地評估地緣政治動態、資本流動變化及監管政策調整,聚焦國際投資者與機構真正關心的內容。沒有雜訊,沒有冗餘。",
    emailLabel: "工作信箱",
    emailPlaceholder: "name@organization.com",
    subscribe: "訂閱",
    subscribing: "訂閱中…",
    disclaimer: "僅每季發送一次,可隨時取消訂閱。",
    successTitle: "您已成功加入訂閱名單。",
    successBody: "我們將在下一期簡報發布時與您聯繫。",
    genericError: "發生問題,請重試。",
    networkError: "網路錯誤,請檢查您的網路連線後重試。",
  },
  contact: {
    eyebrow: "聯絡我們",
    headlineLine1: "展開一場",
    headlineLine2: "對話",
    body: "為了更妥善地為您服務,請描述您正在面對的問題以及希望達成的目標。您也可以透過電子郵件或電話與我們預約會面。",
    contactLabel: "聯絡方式",
    offices: [
      { city: "紐約", address: "45 Rockefeller Plaza, New York, NY 10111", role: "總部" },
      { city: "全球網絡", address: "亞太地區、加勒比地區、歐洲、非洲", role: "專業領域專家" },
    ],
    generalInquiries: "一般諮詢",
    formNameLabel: "姓名",
    formOrgLabel: "所屬機構",
    formEmailLabel: "工作信箱",
    formInquiryLabel: "諮詢類型",
    formInquirySelectOne: "請選擇",
    inquiryTypes: [
      "創業投資",
      "研究與風險分析",
      "基礎建設與再生能源",
      "培訓與金融知識普及",
      "諮詢服務",
      "市場進入策略",
      "其他",
    ],
    formMessageLabel: "簡要說明",
    formMessagePlaceholder: "請描述您正在面對的挑戰或計畫推動的專案……",
    sendInquiry: "送出諮詢",
    confidentialityNote: "我們對所有溝通內容嚴格保密。",
    successTitle: "您的諮詢已收到。",
    successBody: "CJPA 團隊成員將審閱您的留言,並在一個工作天內回覆。",
  },
}

export const translations: Record<Locale, Translations> = {
  en,
  es,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
}
