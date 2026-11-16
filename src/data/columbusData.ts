import { JobFixture, TrackerRow, WeeklyTask } from "../types";

export const initialColumbusFixtures: JobFixture[] = [
  {
    id: "col-1",
    title: "Print Production Artist",
    company: "Buckeye Print & Sign Shop",
    location: "Clintonville, Columbus, OH",
    salary: "$21.00 - $25.50 / hour",
    experienceLevel: "1+ year",
    skills: ["Photoshop", "Illustrator", "Large Format Print", "Vector Prep"],
    summary: "Set up print-ready artwork, screen printing files, and handle production orders for apparel and retail signs in Franklin County.",
    lane: "Lane B — Creative production",
    scores: { money: 4, creative: 5, thcRisk: 4, stress: 4, skill: 4, future: 5 },
    latitude: 40.0384,
    longitude: -83.0182,
    remoteType: "onsite",
    description: `Job Description:
Buckeye Print & Sign Shop is seeking a Print Production Artist to join our local Clintonville workshop. This position handles translating customer assets into high-quality physical products.

Key Responsibilities:
- Review customer vector graphics and raster files in Adobe Illustrator and Photoshop.
- Prepare files for large-format solvent printers, digital presses, and flatbed UV plotters.
- Design creative poster templates, flyers, local signage, and brand layouts.
- Trim, mount, and weed vinyl graphic assemblies with high precision.

Qualifications:
- Solid skill with Adobe Creative Cloud (especially Illustrator and Photoshop).
- Experience setting up bleeds, trim marks, and color-separated apparel films.
- Hands-on attitude and excitement to work directly with physical print media.`
  },
  {
    id: "col-2",
    title: "Sign Shop Graphic Designer",
    company: "FastSigns Arena District",
    location: "Arena District, Columbus, OH",
    salary: "$22.50 - $26.50 / hour",
    experienceLevel: "2+ years",
    skills: ["AutoCAD", "Illustrator", "Vinyl Plotters", "Vector Graphics"],
    summary: "Design structural sign layouts, vinyl graphics, and custom architectural displays near Columbus Arena District.",
    lane: "Lane B — Creative production",
    scores: { money: 4, creative: 4, thcRisk: 4, stress: 3, skill: 5, future: 4 },
    latitude: 39.9680,
    longitude: -83.0030,
    remoteType: "onsite",
    description: `Job Description:
FastSigns in the Columbus Arena District is hiring a Graphic Designer with a background in structural drafting. This teammate bridges creative customer mockups with exact CAD blueprint specs for custom business signage.

Key Responsibilities:
- Lay out dimensioned drawings for corporate building logos and storefront signage.
- Prep architectural permit diagrams to submit to Columbus city zoning reviewers.
- Operate vinyl cutters and plotters to build custom vinyl graphics.
- Communicate with installation crews to make sure layouts meet physical spatial constraints.

Qualifications:
- General AutoCAD background or high proficiency with Adobe Illustrator.
- Able to interpret architectural blueprint sketches.
- Reliable teammate looking for low-drama, highly objective graphic fabrication work.`
  },
  {
    id: "col-3",
    title: "Apparel Graphic Designer & Mockup Specialist",
    company: "Rogue Apparel Printing",
    location: "Grandview Heights, OH",
    salary: "$52,000 - $62,000 / year",
    experienceLevel: "1-3 years",
    skills: ["Illustrator", "Mockups", "Screen Printing Prep", "Color Separation"],
    summary: "Draft clothing line mockups, coordinate digital direct-to-garment runs, and prepare high-contrast vector apparel mockups.",
    lane: "Lane B — Creative production",
    scores: { money: 3, creative: 5, thcRisk: 5, stress: 4, skill: 4, future: 5 },
    latitude: 39.9734,
    longitude: -83.0312,
    remoteType: "hybrid",
    description: `Job Description:
Rogue Apparel Printing is looking for a hybrid Production Designer. This role supports local Columbus streetwear brands and corporate merchandise programs by designing clothing collections, generating mockups, and prepping film positives.

Key Responsibilities:
- Generate 2D vector layouts and 3D mockups of streetwear blanks, tees, hoodies, and custom caps.
- Perform high-fidelity color registrations and separation films for screen exposure.
- Manage and index digital catalogs using cloud assets.
- Interface with screen printers to coordinate material stocks and ink specifications.

Qualifications:
- Mastery of Adobe Illustrator vector drawing.
- Deep passion for apparel design and graphics.
- Self-sufficient work style with excellent file organizational habits.`
  },
  {
    id: "col-4",
    title: "Digital Print & Press Operator",
    company: "Central Ohio Copy & Document Centre",
    location: "Downtown, Columbus, OH",
    salary: "$18.50 - $23.00 / hour",
    experienceLevel: "Entry-level Welcome",
    skills: ["InDesign", "Press Operations", "Paper Stocking", "Finishing Work"],
    summary: "Operate high-speed digital printing presses, bindery equipment, and assist local clients with document and brochure layouts.",
    lane: "Lane B — Creative production",
    scores: { money: 3, creative: 3, thcRisk: 4, stress: 4, skill: 3, future: 3 },
    latitude: 39.9612,
    longitude: -82.9988,
    remoteType: "onsite",
    description: `Job Description:
Central Ohio Copy & Document Centre is looking for a full-time Digital Print & Press Operator. This is a solid, clean, structured workspace serving local business blocks with short-run flyers, custom folders, and promotional booklets.

Key Responsibilities:
- Receive print queues and inspect for bleed alignment in Adobe Acrobat or InDesign.
- Operate production-grade digital presses (Xerox, Canon) and monitor color consistency.
- Perform post-print custom trimming, spiral bindery, and packaging.
- Greet clients and solve easy graphics layout problems in a calm office space.

Qualifications:
- Basic computer proficiency (Adobe CC is a nice advantage).
- Highly detailed focus on document measurements and paper weight specs.
- Low-drama personality who values reliable, regular work hours.`
  },
  {
    id: "col-5",
    title: "Screen Printing Assistant",
    company: "Scioto Valley Screenworks",
    location: "Hilliard, OH",
    salary: "$17.50 - $21.50 / hour",
    experienceLevel: "No Experience Required",
    skills: ["Screen Prep", "Ink Mixing", "Manual Press", "Garment Packing"],
    summary: "Assist with screen wash exposures, custom apparel ink matching, manual press runs, and sorting completed custom apparel sets.",
    lane: "Lane B — Creative production",
    scores: { money: 3, creative: 4, thcRisk: 5, stress: 4, skill: 2, future: 4 },
    latitude: 40.0334,
    longitude: -83.1594,
    remoteType: "onsite",
    description: `Job Description:
Scioto Valley Screenworks is Columbus's preferred custom apparel prints partner. We need a Screen Printing Assistant to support our screen preparation area and assist lead press operators in our modern Hilliard shop.

Key Responsibilities:
- Wash, coat, and expose screen frames with custom vectorized films.
- Mix custom Plastisol and water-based ink colors to match design specs.
- Help set up automated and manual print carousels.
- Stage and pack finalized garments with accurate catalog stamps.

Qualifications:
- Diligent work attitude with physical stamina.
- Eager to learn the physical logistics of apparel and garment manufacturing.
- Reliable teammate; drug testing for marijuana is NOT part of our hiring criteria.`
  },
  {
    id: "col-6",
    title: "Dispensary Retail Associate",
    company: "Green Releaf Dispensary",
    location: "Short North, Columbus, OH",
    salary: "$19.00 - $23.00 / hour",
    experienceLevel: "Entry-level",
    skills: ["Customer Service", "POS Cashier", "Inventory Tracking", "Cannabis Products"],
    summary: "Excellent low drug-test risk, low-stress survival role assisting recreational consumers, managing POS systems, and cataloging product packs.",
    lane: "Lane A — Fast money / lower THC-risk",
    scores: { money: 3, creative: 2, thcRisk: 5, stress: 4, skill: 2, future: 3 },
    latitude: 39.9785,
    longitude: -83.0028,
    remoteType: "onsite",
    description: `Job Description:
Green Releaf Dispensary is seeking a Retail Associate to join our clean, safe, modern dispensary store in the vibrant Short North art district. This is a high-grade customer care position within a fully licensed and growing industry.

Key Responsibilities:
- Greet visitors, verify ID credentials, and provide compassionate advice on strain types, edibles, and topical items.
- Process inventory tracking updates on digital POS systems.
- Assist with scanning incoming freight boxes, security labels, and organizing storage cases.
- Maintain a highly organized, stress-free, welcoming showroom.

Qualifications:
- Must be 21+ with clean customer communication habits.
- Friendly, humble, and reliable presence.
- Natural alignment with cannabis wellness pathways (fully friendly atmosphere for cannabis users).`
  },
  {
    id: "col-7",
    title: "Remote Customer Support Specialist",
    company: "CoverMyMeds Ohio Care",
    location: "Remote (Ohio)",
    salary: "$20.00 - $24.00 / hour",
    experienceLevel: "1+ year",
    skills: ["Customer Support", "Data Entry", "Soft Skills", "Slack/GSuite"],
    summary: "Solid, high-paying remote customer assistance in the pharmacy benefits domain. Completely friendly to creative schedules and low testing worries.",
    lane: "Lane A — Fast money / lower THC-risk",
    scores: { money: 4, creative: 1, thcRisk: 5, stress: 4, skill: 2, future: 2 },
    latitude: 39.9612,
    longitude: -82.9988,
    remoteType: "remote",
    description: `Job Description:
CoverMyMeds Ohio Care is seeking remote support representatives based in Ohio. This role handles clarifying pharmacy system requests and entering medical insurance inquiries with no technical engineering stress.

Key Responsibilities:
- Respond to incoming digital chat and phone inquiries from pharmacy technician groups.
- Walk clients through filling out internet claim documents.
- Keep detailed, accurate tracking logs inside company database systems.
- Sync with a remote support squad via Slack and Zoom channels.

Qualifications:
- Stable internet connection and comfortable workspace.
- Clear, empathetic phone tone and accurate typing inputs.
- Safe, non-safety-sensitive office position with zero random THC screening.`
  },
  {
    id: "col-8",
    title: "3D Product Visualization Artist",
    company: "Osiris Digital Merch",
    location: "Remote",
    salary: "$26.00 - $36.00 / hour",
    experienceLevel: "2+ years",
    skills: ["Blender", "3D Modeling", "Texturing", "Clothing Mockups"],
    summary: "Develop immaculate 3D product renders, garment textures, clothing mockups, and virtual retail world building assets in Blender.",
    lane: "Lane C — Creative tech / 3D / AI",
    scores: { money: 4, creative: 5, thcRisk: 5, stress: 4, skill: 5, future: 5 },
    latitude: 39.9612,
    longitude: -82.9988,
    remoteType: "remote",
    description: `Job Description:
Osiris Digital Merch operates a remote modeling boutique. We need a 3D Product Visualization Artist to translate streetwear physical patterns and custom graphic ideas into beautiful digital clothing simulations and photorealistic advertising mockups.

Key Responsibilities:
- Build 3D mesh assets representing garments (hoodies, tees, caps, outerwear).
- Apply high-resolution textures, seams, screen print materials, and fabric wrinkles.
- Configure lighting scenarios, scene backdrops, and camera rig angles in Blender.
- Generate rapid variations for marketing layout reviews.

Qualifications:
- Deep Blender mastery with a portfolio showcasing photorealistic product models.
- Comfortable working with virtual streetwear formats and graphic assets.
- Excellent time management and communication habits.`
  },
  {
    id: "col-9",
    title: "Retail Store Layout Designer (CAD)",
    company: "Alliance Retail Planning",
    location: "Dublin, OH",
    salary: "$58,000 - $72,000 / year",
    experienceLevel: "2+ years",
    skills: ["AutoCAD", "SketchUp", "Fixture Layout", "Space Planning"],
    summary: "Plan floor layouts, custom layout pathways, and display kiosks for Midwest shopping chains without utility engineering stress.",
    lane: "Lane D — CAD-adjacent but not engineering-heavy",
    scores: { money: 4, creative: 4, thcRisk: 4, stress: 3, skill: 5, future: 4 },
    latitude: 40.0980,
    longitude: -83.1140,
    remoteType: "hybrid",
    description: `Job Description:
Alliance Retail Planning designs custom shopping floor layouts, boutique counter setups, and graphic fixture elevations. We are seeking an AutoCAD Designer to draft 2D plans and build 3D SketchUp concepts for our office in Dublin, OH.

Key Responsibilities:
- Draft detailed spatial layout blueprints including counter heights, path dimensions, and fixture locations.
- Translate conceptual sketches from creative directors into accurate plan files.
- Coordinate custom millwork details and shelving specs with local manufacturers.
- Keep drawing files organized and updated with revision logs.

Qualifications:
- 2+ years of AutoCAD experience, ideally with retail layouts or architectural details.
- Basic SketchUp modeling skills.
- Ready to move away from civil/utility drafting into more design-centric spatial concepts.`
  },
  {
    id: "col-10",
    title: "Exhibit & Stage Drafter",
    company: "Mid-Ohio Expo Exhibits",
    location: "German Village, OH",
    salary: "$23.00 - $29.00 / hour",
    experienceLevel: "1-3 years",
    skills: ["AutoCAD", "3D CAD", "Millwork details", "Detail Sheets"],
    summary: "Produce stage CAD files, custom wood exhibition components, and physical build plans for high-end Columbus convention booths.",
    lane: "Lane D — CAD-adjacent but not engineering-heavy",
    scores: { money: 4, creative: 4, thcRisk: 4, stress: 4, skill: 5, future: 4 },
    latitude: 39.9450,
    longitude: -82.9904,
    remoteType: "hybrid",
    description: `Job Description:
Mid-Ohio Expo Exhibits designs and builds custom modules and displays for events, trade shows, and museum spaces. We seek a CAD Drafter to build layout sheets, fabrication dimensions, and 3D mockups.

Key Responsibilities:
- Create 2D layout sheets, manufacturing schedules, and joinery details from concept drafts.
- Set up coordinate sheets and drawing sets for CNC fabrication routers.
- Review design specs with fabricators to optimize material selections.
- Adjust models dynamically to incorporate last-minute client revisions.

Qualifications:
- 1+ year AutoCAD drafting background.
- Hands-on woodworking or retail fabrication knowledge is a plus.
- Enjoys drafting physical, creative assemblies with clear outcomes.`
  },
  {
    id: "col-11",
    title: "Vehicle Graphic Layout Specialist",
    company: "Columbus Custom Fleet Wraps",
    location: "West Westerville, OH",
    salary: "$22.00 - $26.00 / hour",
    experienceLevel: "2+ years",
    skills: ["Illustrator", "Large Format Print", "Vehicle Templates", "Vinyl Prep"],
    summary: "Layout custom vinyl templates and commercial brand wraps on precise vehicle blueprint grids using Illustrator.",
    lane: "Lane B — Creative production",
    scores: { money: 4, creative: 5, thcRisk: 5, stress: 4, skill: 4, future: 4 },
    latitude: 40.1215,
    longitude: -82.9461,
    remoteType: "onsite",
    description: `Job Description:
Columbus Custom Fleet Wraps is seeking an experienced Vehicle Graphic Layout Specialist. This position bridges computer vector designs with three-dimensional complex car surfaces, outputting accurate vinyl layouts that are ready for printing and application.

Key Responsibilities:
- Lay out customer branding assets onto make-and-model-specific vehicle CAD templates.
- Calibrate overlaps, print panels, and contours to avoid warping texts or logos on fender curves.
- Export clean, scale-accurate vector layouts to HP Latex and Roland printers.
- Conduct final material quality tests on Cast wrap films.

Qualifications:
- High level of vector drafting in Adobe Illustrator.
- Extremely detail-oriented regarding physical measurements and alignment.
- Experience with fleet branding and vehicle wrap plotting is preferred.`
  },
  {
    id: "col-12",
    title: "Creative Space Planner & Blueprint Tech",
    company: "Scioto Expo Group",
    location: "University District, Columbus, OH",
    salary: "$24.00 - $30.05 / hour",
    experienceLevel: "1+ year",
    skills: ["AutoCAD", "Space Planning", "Detail Sheets", "Blueprints"],
    summary: "Draft and coordinate spatial plans, vendor booths, electrical drop locations, and path safety plans in central Columbus venues.",
    lane: "Lane D — CAD-adjacent but not engineering-heavy",
    scores: { money: 4, creative: 4, thcRisk: 4, stress: 3, skill: 5, future: 4 },
    latitude: 40.0012,
    longitude: -83.0125,
    remoteType: "hybrid",
    description: `Job Description:
Scioto Expo Group manages trade exhibitions, job fairs, and large entertainment expos across Central Ohio. We need a Creative Space Planner & Blueprint Drafter to coordinate spatial floorboards and design display kiosks.

Key Responsibilities:
- Sketch and layout high-fidelity 2D event layout grids and occupancy maps in AutoCAD.
- Mark architectural columns, safety clearances, and mechanical hookups.
- Edit client blueprints dynamically during event load-ins and set-ups.
- Output clean PDF detail sheets to build-out and logistics teams.

Qualifications:
- Solid AutoCAD foundation with a focus on interior design, trade show layouts, or retail elevations.
- Self-sufficient, low-stress worker who enjoys immediate physical project outcomes.
- No heavy infrastructure or civil engineering background required.`
  },
  {
    id: "col-13",
    title: "Boutique Wellness Consultant",
    company: "The Botanical Co.",
    location: "German Village, Columbus, OH",
    salary: "$19.50 - $23.50 / hour",
    experienceLevel: "Entry-level Welcome",
    skills: ["Customer Service", "Herbology Basics", "POS Systems", "Wellness Consults"],
    summary: "Guide local clienteles with holistic apothecary products, plant remedies, and specialized organic teas in a peaceful botanical environment.",
    lane: "Lane A — Fast money / lower THC-risk",
    scores: { money: 3, creative: 3, thcRisk: 5, stress: 5, skill: 2, future: 4 },
    latitude: 39.9482,
    longitude: -82.9961,
    remoteType: "onsite",
    description: `Job Description:
The Botanical Co. is looking for a Wellness Consultant for our peaceful, organic boutique shop in historic German Village. This position focuses on providing excellent, low-stress retail support and holistic wellness advice.

Key Responsibilities:
- Welcome customers and discuss plant remedies, local organic tea profiles, and eco-friendly products.
- Maintain beautiful visual merchandise displays and organize inventory shelves.
- Process retail transactions on our modern POS system.
- Ensure a calm, clean, therapeutic store vibe for every customer.

Qualifications:
- Warm customer-service orientation and basic interest in holistic herbs or botanicals.
- Punctual and reliable teammate.
- Extremely friendly, low-stress workplace with absolute tolerance for natural lifestyle choices (THC screening is not a part of our policy).`
  },
  {
    id: "col-14",
    title: "Data Center Spatial Planner & CAD Analyst",
    company: "Google",
    location: "New Albany, OH",
    salary: "$35.00 - $48.50 / hour",
    experienceLevel: "1+ year",
    skills: ["AutoCAD", "Space Planning", "Detail Sheets", "Facilities Layout"],
    summary: "Coordinate server rack arrangements, power delivery schematics, and space utilization layouts for Google's New Albany Data Center.",
    lane: "Lane D — CAD-adjacent but not engineering-heavy",
    scores: { money: 5, creative: 4, thcRisk: 4, stress: 3, skill: 4, future: 5 },
    latitude: 40.0812,
    longitude: -82.8089,
    remoteType: "hybrid",
    description: `Job Description:
Google is seeking a Data Center Spatial Planner & CAD Analyst to join our expanding Infrastructure & Operations team in New Albany, OH. This hybrid role manages the 2D layout planning and spatial allocation charts of server environments, avoiding hazardous civil engineering design stressors.

Key Responsibilities:
- Edit and organize clean, to-scale 2D system floor plans and space blueprints in AutoCAD.
- Position incoming mechanical cabinets, hardware racks, and cable routing trays based on modular standards.
- Prepare daily detail sheets, space-occupancy metrics, and mechanical clearance plans for onsite builders.
- Collaborate with hardware technicians to verify physical structural clearances in the server halls.

Qualifications:
- 1+ year building practical layouts in AutoCAD or spatial modeling tools.
- Comfortable managing layered files and producing schematic layout packets.
- Analytical mindset with an interest in physical space logistics rather than theoretical stress formulas.`
  },
  {
    id: "col-15",
    title: "Creative Production & Slide Suite Designer",
    company: "Google",
    location: "Remote (Ohio)",
    salary: "$28.00 - $38.00 / hour",
    experienceLevel: "1-3 years",
    skills: ["Illustrator", "InDesign", "Mockups", "Google Slides"],
    summary: "Format gorgeous visual slide decks, brand catalogs, and vector mockups for Google Cloud and partner marketing workshops.",
    lane: "Lane B — Creative production",
    scores: { money: 4, creative: 5, thcRisk: 5, stress: 3, skill: 4, future: 5 },
    latitude: 39.9612,
    longitude: -82.9988,
    remoteType: "remote",
    description: `Job Description:
Google's Developer Relations team is looking for a Creative Production & Slide Suite Designer to support our marketing collaterals on a remote contractual basis. Create highly reusable visual frameworks, high-contrast mockup assets, and pixel-perfect slides that clarify technical ideas.

Key Responsibilities:
- Translate rough text outlines and brand boards into high-end, responsive presentation decks.
- Draw clean vector icons, product schematics, and custom diagrams in Adobe Illustrator.
- Standardize layout files, typography sizes, and custom-designed visual blocks.
- Build interactive mockup templates that local teams can utilize for partner engagements.

Qualifications:
- Experience structuring visual materials in Adobe CC or online slide suites.
- Exceptional attention to hierarchy, margins, white space, and visual pacing.
- Collaborative, self-sufficient professional who thrives on producing rapid creative drafts.`
  },
  {
    id: "col-16",
    title: "Google Earth 3D Spatial Modeler",
    company: "Google",
    location: "Remote",
    salary: "$32.00 - $45.00 / hour",
    experienceLevel: "2+ years",
    skills: ["Blender", "3D Modeling", "Texturing", "Spatial Planning"],
    summary: "Synthesize high-fidelity 3D modeling meshes, urban terrain textures, and photorealistic structures in Blender for Google Earth simulations.",
    lane: "Lane C — Creative tech / 3D / AI",
    scores: { money: 5, creative: 5, thcRisk: 5, stress: 3, skill: 5, future: 5 },
    latitude: 39.9612,
    longitude: -82.9988,
    remoteType: "remote",
    description: `Job Description:
Google is seeking an autonomous 3D Spatial Modeler to help refine building simulations, landmark duplicates, and photorealistic mesh geometries for Google Earth and immersive map views. This is an incredible opportunity to apply high-fidelity Blender techniques to large-scale virtual world building.

Key Responsibilities:
- Model accurate 3D mesh geometries representing physical urban structures and environments from aerial scans.
- Optimize polygon counts and design clear level-of-detail (LOD) hierarchies.
- Apply realistic textures, baked occlusion maps, and atmospheric materials in Blender.
- Verify dimensional accuracies against spatial blueprint datasets.

Qualifications:
- Solid background constructing environment assets in Blender or equivalent 3D suites.
- Strong understanding of texturing coordinates, lighting channels, and performance optimization.
- Enjoys working at the intersection of creative digital design and mapping innovations.`
  },
  {
    id: "col-17",
    title: "Cannabis Inventory & Compliance Specialist",
    company: "Terrasana Cannabis Co.",
    location: "Grandview Heights, Columbus, OH",
    salary: "$21.50 - $25.00 / hour",
    experienceLevel: "Entry-level Welcome",
    skills: ["Inventory Management", "Regulatory Compliance", "METRC Tracking", "Detail Oriented"],
    summary: "Manage clinical stock registers, receive safe organic product catalog items, and lead POS tracking inside Grandview dispensary.",
    lane: "Lane A — Fast money / lower THC-risk",
    scores: { money: 3, creative: 2, thcRisk: 5, stress: 5, skill: 3, future: 4 },
    latitude: 39.9734,
    longitude: -83.0312,
    remoteType: "onsite",
    description: `Job Description:
Terrasana Cannabis Co. is seeking a full-time, reliable Cannabis Inventory & Compliance Specialist to join our highly compliant cannabis retail dispensary operations in Grandview Heights. This role manages digital check-ins, stock auditing, and shelf rotation, with absolutely no THC screenings.

Key Responsibilities:
- Audit physical stock arrivals against state registry tracking databases (such as METRC).
- Package and organize merchandise bins, labeling therapeutic accessories and organic flower sets cleanly.
- Reconcile weekly register receipts and digital inventory tables.
- Educate new dispensary agents on product safety specifications and catalog layouts.

Qualifications:
- Extremely methodical mindset focusing on product barcodes, SKU logs, and regulatory rules.
- Comfortable with general computer systems, POS systems, or database entries.
- Passionate about holistic customer-centered operations in a professional, safe workspace.`
  },
  {
    id: "col-18",
    title: "Bilingual Client Solutions Advocate",
    company: "Upstart Financial",
    location: "Remote (Ohio)",
    salary: "$22.00 - $27.50 / hour",
    experienceLevel: "1+ year",
    skills: ["Customer Support", "Spanish Fluency", "CRM Software", "Inbound Call Support"],
    summary: "Respond to incoming customer accounts and troubleshoot general client platform logins on a remote billing queue.",
    lane: "Lane A — Fast money / lower THC-risk",
    scores: { money: 4, creative: 1, thcRisk: 5, stress: 4, skill: 3, future: 4 },
    latitude: 39.9612,
    longitude: -82.9988,
    remoteType: "remote",
    description: `Job Description:
Upstart Financial is looking for an autonomous, conversational Bilingual Client Solutions Advocate to support credit platform customers. This remote, low-risk placement is open to Ohio residents and operates over secure chat, email, and incoming voice queues.

Key Responsibilities:
- Guide bilingual Spanish and English callers through online account recovery and balance logs.
- Document support requests inside Salesforce CRM databases.
- Troubleshoot billing dates and explain platform interest options in clear, humble terms.
- Follow system scripts to protect consumer financial privacy.

Qualifications:
- Flawless verbal and written communications in both Spanish and English.
- Positive service approach with a quiet home workspace and stable high-speed internet.
- Zero lifestyle or drug testing stress — we support a modern, remote workforce.`
  },
  {
    id: "col-19",
    title: "Screen Print & Vector Production Artist",
    company: "High Street Graphics Collective",
    location: "Short North, Columbus, OH",
    salary: "$20.00 - $24.50 / hour",
    experienceLevel: "1+ year",
    skills: ["Illustrator", "Screen Printing", "Color Separation", "Vector Scaling"],
    summary: "Deconstruct customer artwork, scale vectors, and prepare multi-color separations for screen exposures in Short North.",
    lane: "Lane B — Creative production",
    scores: { money: 3, creative: 5, thcRisk: 4, stress: 4, skill: 4, future: 5 },
    latitude: 39.9815,
    longitude: -83.0042,
    remoteType: "onsite",
    description: `Job Description:
High Street Graphics Collective is hiring a Screen Print & Vector Production Artist. This position bridges high-contrast apparel illustrations with physical screen separation films for custom streetwear lines and community events.

Key Responsibilities:
- Inspect complex design layouts for correct color channels and resolution limits.
- Convert client sketches into clean vector paths and anchor points in Adobe Illustrator.
- Run negative exposure tables to burn emulsion frames for manual and automatic textile presses.
- Manage custom ink-mixing logs to match Pantone system requirements.

Qualifications:
- Solid background navigating Adobe CC vector tools.
- Experience with separation processes for screen printing is highly prized.
- Eager contributor who loves seeing graphic alignments come to life on physical apparel products.`
  },
  {
    id: "col-20",
    title: "Custom Sign Board & Decal Designer",
    company: "Columbus Signage Co.",
    location: "Franklinton, Columbus, OH",
    salary: "$22.50 - $27.00 / hour",
    experienceLevel: "1-2 years",
    skills: ["Illustrator", "Vinyl Crafting", "Mockup Setup", "Large Format Plotters"],
    summary: "Format corporate billboard layouts, dimension print banners, and plot exterior commercial signage inside our Franklinton plant.",
    lane: "Lane B — Creative production",
    scores: { money: 4, creative: 4, thcRisk: 4, stress: 3, skill: 4, future: 4 },
    latitude: 39.9575,
    longitude: -83.0112,
    remoteType: "onsite",
    description: `Job Description:
Columbus Signage Co. builds premium commercial displays, window lettering, and vehicle branding panels. We are seeking a Custom Layout Designer to translate branding blueprints into high-resolution large-format plot sheets.

Key Responsibilities:
- Position corporate assets onto dimensioned storefront blueprints in Adobe Illustrator.
- Configure alignment margins and resolution tolerances for wide-format Roland digital printers and cutting plotters.
- Supervise color calibrators and prepare visual preview renderings for client approvals.
- Assemble small scale acrylic signs and weed vinyl sheets.

Qualifications:
- 1+ year using vector graphics softwares (Illustrator, Corel, or equivalent).
- Basic math skills to compute scaling ratios, margins, and physical sign dimensions correctly.
- Clean and dependable worker who values physical graphics craft.`
  },
  {
    id: "col-21",
    title: "3D Product & Packaging Modeler",
    company: "Bath & Body Works (Lbrands)",
    location: "Reynoldsburg, OH",
    salary: "$65,000 - $78,000 / year",
    experienceLevel: "2+ years",
    skills: ["Blender", "Mesh Sculpting", "UV Mapping", "PBR Texturing"],
    summary: "Model premium container mockups, cosmetic bottle lines, and retail shelves inside Blender for e-commerce catalog renders.",
    lane: "Lane C — Creative tech / 3D / AI",
    scores: { money: 5, creative: 5, thcRisk: 5, stress: 3, skill: 5, future: 5 },
    latitude: 39.9613,
    longitude: -82.8130,
    remoteType: "hybrid",
    description: `Job Description:
Bath & Body Works (Lbrands) is seeking a creative 3D Product & Packaging Modeler to join our digital visual team in Reynoldsburg, OH on a hybrid schedule. This roles involves sculpting, texturing, and cataloging photorealistic product meshes in Blender for our international online store buffers.

Key Responsibilities:
- Build detailed, clean quad topological models of glass bottles, decorative packaging, and cosmetic sets.
- Create photorealistic tileable PBR texture materials including glass gloss, plastics, and metallic foils in Blender.
- Set up ambient Studio lighting grids and camera view rigs to output high-resolution e-commerce previews.
- Deliver optimized, standardized asset formats for interactive spatial rendering pipelines.

Qualifications:
- Exceptional portfolio showcasing high-fidelity 3D modeling, mesh layout structures, and precise UV unwrap grids.
- Intermediate or advanced command of Blender modeling tools.
- Team player excited to innovate retail visualization without corporate engineering stress.`
  },
  {
    id: "col-22",
    title: "Game Asset Modeler & World Builder",
    company: "Zonkey Interactive",
    location: "Remote",
    salary: "$30.00 - $40.00 / hour",
    experienceLevel: "1+ year",
    skills: ["Blender", "3D Texturing", "Unity Assets", "Low-Poly Modeling"],
    summary: "Form lightweight 3D interior props, character outfits, and low-poly props in Blender for custom virtual simulator packages.",
    lane: "Lane C — Creative tech / 3D / AI",
    scores: { money: 4, creative: 5, thcRisk: 5, stress: 3, skill: 4, future: 5 },
    latitude: 39.9612,
    longitude: -82.9988,
    remoteType: "remote",
    description: `Job Description:
Zonkey Interactive is a boutique studio designing educational games and industrial interactive simulators. We are seeking a design-loving Game Asset Modeler to join our remote crew, developing immersive environment props and modular assets.

Key Responsibilities:
- Model and optimize low-poly props, furniture elements, and interior layouts inside Blender.
- Unrolls UV guides and apply stylized painted texture sets.
- Assemble ready-to-test assets inside Unity project scenes, linking animations and collider limits.
- Respond to performance budgets with smart poly-count reduction plans.

Qualifications:
- Fluent Blender operator who loves creative environment building and props.
- Familiarity with Unity asset imports or viewport management is preferred.
- Highly self-motivated professional who thrives in a relaxed, remote virtual studio.`
  },
  {
    id: "col-23",
    title: "Architectural Drafter & Permit Coordinator",
    company: "Edge Design Studio",
    location: "Powell, OH",
    salary: "$25.00 - $31.50 / hour",
    experienceLevel: "1+ year",
    skills: ["AutoCAD", "Site Plans", "Permit Sheets", "Zoning Guidelines"],
    summary: "Draft architectural layouts, elevation detail sets, and organize municipal permit packages in Powell.",
    lane: "Lane D — CAD-adjacent but not engineering-heavy",
    scores: { money: 4, creative: 4, thcRisk: 4, stress: 3, skill: 5, future: 4 },
    latitude: 40.1578,
    longitude: -83.0754,
    remoteType: "onsite",
    description: `Job Description:
Edge Design Studio is a specialized local drafting office focusing on luxury home additions and retail build-outs. We are seeking an AutoCAD-proficient Drafter & Permit Coordinator to develop clean build packages.

Key Responsibilities:
- Convert rough sketch blueprints from lead designers into accurate 2D building plans in AutoCAD.
- Setup sheet layouts with annotations, elevation angles, and window/door detail schedules.
- Organizes regulatory review files to submit to Powell and Columbus zoning reviewers.
- Conduct easy site dimensions verification checks directly on build properties.

Qualifications:
- 1+ year using AutoCAD layout spaces and sheet builders.
- Comfortable organizing structured project files and reading mechanical plans.
- Safe, friendly draft office focus with minimal civil engineering weight.`
  },
  {
    id: "col-24",
    title: "Exhibition Floor Space Blueprint Designer",
    company: "Ohio Expo Center",
    location: "Linden, Columbus, OH",
    salary: "$23.00 - $28.50 / hour",
    experienceLevel: "1+ year",
    skills: ["AutoCAD", "Space Layout", "Detail Sheets", "Facilities Management"],
    summary: "Plan custom trade booth boundaries, map out electrical routing paths, and update interactive venue floor plans at the State Fairgrounds.",
    lane: "Lane D — CAD-adjacent but not engineering-heavy",
    scores: { money: 4, creative: 3, thcRisk: 4, stress: 3, skill: 4, future: 4 },
    latitude: 40.0035,
    longitude: -82.9840,
    remoteType: "onsite",
    description: `Job Description:
The Ohio Expo Center and State Fairgrounds is Columbus's premiere civic event venue, welcoming millions of guests annually across dozens of diverse conventions and livestock events. We seek a structured Blueprint Drafter to coordinate exhibit areas and booth layouts.

Key Responsibilities:
- Update 2D architectural site maps in AutoCAD to match specialized show layouts.
- Plot booth grids, pathway clearances, safety exit plans, and utility drops.
- Collaborate with event directors and vendor teams to verify safety and layout parameters.
- Provide clear print layout specs to field load-in technicians.

Qualifications:
- Solid skill with AutoCAD space layout drawing.
- Capable of working under clean deadlines during seasonal show setups.
- Enjoys contributing to physical Columbus events in a practical, physical role.`
  }
];

export const defaultTrackerRows: TrackerRow[] = [
  {
    id: "track-1",
    companyName: "Buckeye Print & Sign Shop",
    jobTitle: "Print Production Artist",
    lane: "Lane B — Creative Production",
    pay: "$19–$23/hr",
    thcRisk: "Low/Medium",
    score: 26,
    applied: true,
    appliedDate: "2026-05-20", // 15 days ago (Stale / Pruney)
    status: "Applied",
    followUpDate: "Action: Ready",
    notes: "High match! Fits clothing brand vector skills perfectly. No reply received yet.",
    portfolioPiece: "jaime_apparel_vector_kit.pdf",
    resumeVersion: "Creative Production Resume"
  },
  {
    id: "track-2",
    companyName: "Osiris Digital Merch",
    jobTitle: "3D Product Artist",
    lane: "Lane C — Creative Tech / 3D / AI",
    pay: "$25–$35/hr",
    thcRisk: "Low",
    score: 28,
    applied: false,
    status: "Draft",
    followUpDate: "—",
    notes: "Requires portfolio folder update with Blender renders.",
    portfolioPiece: "osiris_garment_simulation_3d.zip",
    resumeVersion: "3D Visualization Resume"
  },
  {
    id: "track-3",
    companyName: "Rogue Apparel Printing",
    jobTitle: "Apparel Graphic Designer & Mockup Specialist",
    lane: "Lane B — Creative Production",
    pay: "$24.00/hr",
    thcRisk: "Low",
    score: 27,
    applied: true,
    appliedDate: "2026-06-02", // 2 days ago (Freshly applied!)
    status: "Phone screen",
    followUpDate: "Friday Check-in",
    notes: "Emailed vector apparel deck directly. Recruiter matches creative interest.",
    portfolioPiece: "jaime_apparel_vector_kit.pdf",
    resumeVersion: "Creative Production Resume"
  },
  {
    id: "track-4",
    companyName: "Green Releaf Dispensary",
    jobTitle: "Dispensary Retail Associate",
    lane: "Lane A — Fast Money / Retail",
    pay: "$20.00/hr",
    thcRisk: "Low",
    score: 24,
    applied: true,
    appliedDate: "2026-05-24", // 11 days ago (Stale applied!)
    status: "Phone screen", // Converting to interview!
    followUpDate: "Phone Screening scheduled",
    notes: "Assisting general inventory POS, low testing stress.",
    portfolioPiece: "jaime_customer_experience_manifesto.pdf",
    resumeVersion: "Customer Operations Resume"
  }
];

export const initialWeeklyTasks: WeeklyTask[] = [
  { id: "wk-mon", day: "Monday", title: "Find 25 Jobs", details: "Target: 8 Fast Money, 8 Creative Production, 5 Creative Tech, 4 CAD-adjacent", completed: false },
  { id: "wk-tue", day: "Tuesday", title: "Score Jobs", details: "Apply the scoring model. Reject everything under 18 score.", completed: false },
  { id: "wk-wed", day: "Wednesday", title: "10 Serious Applications", details: "Submit tailored package. Goal: 10 strong + 5 quick apps.", completed: false },
  { id: "wk-thu", day: "Thursday", title: "Create Portfolio Proof", details: "Design 1 shirt mockup, 3D render, or sticker layout today.", completed: false },
  { id: "wk-fri", day: "Friday", title: "Follow-up Emails", details: "Send friendly letter to every contact. 'Hello, my name is Jaime Hernandez...'", completed: false },
  { id: "wk-sat", day: "Saturday", title: "Upgrade 1 Skill", details: "Practice Photoshop mockup files or screen separation films.", completed: false },
  { id: "wk-sun", day: "Sunday", title: "Clean job table", details: "Reset tracker, purge stale files, and prepare next week.", completed: false }
];

export const initialWalkInStops = [
  {
    id: "route-dublin",
    company: "Dublin Vector Lab & Custom Signs",
    address: "6200 Perimeter Dr, Dublin, OH 43017",
    hours: "Tues - Thurs, 10:00 AM – 2:00 PM (Avoid lunch hours)",
    target: "Pre-press Division Manager & Carousel Supervisor",
    spec: "jaime_apparel_vector_kit.pdf (Screen-Print Separately Deck)",
    script: "Hi! My name is Jaime. I do high-registration vector pre-press layouts, automatic spot separations, and custom trapping grids so massive screen-carousels roll under tight deadlines without shift. Who manages the layout files queue here? I wanted to yield a quick copy of my local calibration setup sheets!",
    advice: "Park in the front and ask the receptionist for the prepress lead directly. Avoid Monday mornings when order backlogs are heavy.",
    latitude: 40.0992,
    longitude: -83.1141
  },
  {
    id: "route-franklinton",
    company: "Franklinton CAD Exhibition Center",
    address: "350 W Rich St, Columbus, OH 43215",
    hours: "Tuesday / Wednesday, 9:30 AM – 1:00 PM",
    target: "Exhibition Floorplan Drafting Supervisor",
    spec: "columbus_spatial_render_v4.dwg (3D CAD Exhibit Layouts)",
    script: "Hi! I'm Jaime. I do precise, zero-drift AutoCAD alignments, structural zoning blueprints, and scalable 3D exhibit mockups. I noticed your team designs high-foot-traffic displays here on Rich Street. Who oversees your exhibit floor planning layout? I dropped by to leave my drafting indexbinder!",
    advice: "Fabulous creative hub inside Franklinton. Walk straight into the foyer—usually a casual, open layout with high collaboration.",
    latitude: 39.9575,
    longitude: -83.0078
  },
  {
    id: "route-north",
    company: "High Street Spot Separation Lab",
    address: "1210 N High St, Columbus, OH 43201",
    hours: "Thursday Afternoon, 12:00 PM – 4:00 PM",
    target: "Silk Screen Print Supervisor & Scheduler",
    spec: "osiris_garment_simulation_3d.zip (Multi-color mesh simulation)",
    script: "Hi there! I'm Jaime. I design vector film spot chokes, mesh emulsion traps, and high-frequency separations. I set up artwork files so printers run green without ink bleed on automated carousels. I wanted to drop off a custom physical proof kit for the printing manager!",
    advice: "Bring a USB flash drive with sample separations printed beautifully onto clean paper envelopes.",
    latitude: 39.9868,
    longitude: -83.0062
  },
  {
    id: "route-westerville",
    company: "Westerville Commercial Dispensary",
    address: "750 Westerville Rd, Columbus, OH 43231",
    hours: "Monday - Friday, 9:00 AM – 3:00 PM",
    target: "Inventory Manager or General Store Manager",
    spec: "jaime_customer_experience_manifesto.pdf (Compliant POS booklet)",
    script: "Hi there! My name is Jaime. I'm a compliant retail associate with massive cash-handling speed, clean POS balancing history, and strict inventory compliance audits. I dropped by to physically submit my customer experience booklet directly to the inventory lead!",
    advice: "Make sure you bring a copy of your Columbus physical ID. Westerville managers prioritize low-drama cashiers immediately.",
    latitude: 40.1255,
    longitude: -82.9298
  }
];

