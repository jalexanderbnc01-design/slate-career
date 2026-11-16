import { UserProfile } from "./types";

export const defaultProfile: UserProfile = {
  name: "Alex Mercer",
  email: "alex.mercer.drafting@gmail.com",
  phone: "(555) 019-2834",
  location: "Austin, TX (Open to Remote)",
  portfolioUrl: "portfolio.design/alexmercer",
  summary: "Technical Drafter and CAD Technician with 3+ years of experience specializing in high-precision engineering and structural production drawings. Extensive expertise in AutoCAD and Civil 3D, civil drafting, underground utilities, and telecom/OSP (Outside Plant) distribution designs. Combines a rigorous architecture student background with active Revit/BIM modeling experience to deliver permit-ready site layouts, structural schematics, and accurate redline plan revisions. Passionate about design-to-build workflows and seeking to transition into architectural design and advanced BIM technical roles.",
  skills: [
    "Underground utility drafting",
    "Telecom OSP (Outside Plant) design",
    "Plan revisions and redlines",
    "Site layout and permit drawings",
    "Civil drafting standards",
    "Construction documents (CDs)",
    "Borders, scales, and sheet sets",
    "Project coordination",
    "Bilingual (English/Spanish) architectural terms"
  ],
  software: [
    "AutoCAD (Advanced)",
    "Civil 3D (Intermediate)",
    "Revit / Autodesk BIM 360",
    "Bluebeam Revu",
    "SketchUp",
    "Adobe Creative Suite (Photoshop, InDesign)",
    "GIS mapping basics"
  ],
  experience: [
    {
      role: "Lead CAD Draftsman & Technical Technician",
      company: "Apex Telecom & Utility Solutions",
      period: "2024 - Present",
      bullets: [
        "Produce detailed Outside Plant (OSP) telecom engineering layouts and underground utility maps using AutoCAD and Civil 3D, preparing 120+ successful permit submittals.",
        "Perform comprehensive redline additions, structural revisions, and engineering markups for site layout plan sets, improving engineering review approval speed by 25%.",
        "Coordinate directly with utility engineers and municipal inspectors to ensure site designs comply with Austin and regional utility placement ordinances.",
        "Maintain central sheet set catalogs, CAD templates, and utility layering blocks, saving teams 10+ operational hours per week."
      ]
    },
    {
      role: "CAD Draftsman & Design Assistant",
      company: "Vanguard Civil & Site Drafting",
      period: "2023 - 2024",
      bullets: [
        "Created detailed utility alignment drawings, horizontal boring profiles, and utility crossing details for municipal water and broadband expansion schemes.",
        "Created initial site layout plans, grading schemas, and permit drawings based on surveyor GIS coordinates and project designer specifications.",
        "Assisted in compiling complete project submittal binders, drafting technical sheets, and running quality control reviews across CAD redlines."
      ]
    },
    {
      role: "Architectural Drafter & BIM Intern",
      company: "ArchForm Studios & Design",
      period: "Summer 2022",
      bullets: [
        "Utilized Revit to set up architectural grids, floor plan layouts, and basic BIM shell properties for local residential project plans.",
        "Collaborated with project designers to model 3D structural features and coordinate design layouts in SketchUp for client presentations.",
        "Reviewed redline corrections and applied standard dimension corrections to architectural sets across schematics and construction docs."
      ]
    }
  ],
  education: [
    {
      degree: "Associate of Science in Architectural Technology / Student of Architecture",
      school: "Texas Technical Institute & Design Academy",
      period: "Graduated 2023",
      details: "Focus on BIM processes, construction materials, civil drafting layouts, Revit schedules, and standard building code guidelines."
    }
  ],
  projects: [
    {
      name: "OSP fiber layout design integration",
      description: "Drafted 15 miles of commercial telecom fiber deployment pathing, executing complex trench layouts, crossing corridors, and conduit detailing via Civil 3D.",
      technologies: ["AutoCAD", "Civil 3D", "GIS Layering"]
    },
    {
      name: "Mixed-Use Site Permit Packets",
      description: "Coordinated structural revisions, zoning checks, parking space planning, and utility connection details for three Austin-area light commercial complexes.",
      technologies: ["AutoCAD", "SketchUp", "Austin Permit Code"]
    }
  ],
  certifications: [
    "Autodesk Certified Professional: AutoCAD for Design and Drafting",
    "Autodesk Certificate of Training: Revit Structural & Architectural BIM Guides"
  ]
};
