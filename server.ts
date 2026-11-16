import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  searchLiveJobProviders,
  fetchAtsBoardJobs,
  getJobSourcesStatus,
  getCacheStats,
} from "./server/jobProviders";
import { createSlateAIRouter } from "./server/ai/router";
import { createNotionRouter } from "./server/notion/router";
import { createClayRouter, createJobsIngestRouter } from "./server/clay/router";

dotenv.config();

// Initialize the Google GenAI client safely with the named parameter and User-Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not configured or uses placeholder value. AI features will require API Key registration.");
}

// Function to get active AI client (fails fast but gracefully)
function getAIClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please add/verify it via the Secrets panel in AI Studio.");
    }
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

const app = express();
app.use(express.json({ limit: '10mb' }));

// ======================== SLATE AI ROUTER (/api/ai/*) ========================
app.use("/api/ai", createSlateAIRouter());

// ======================== NOTION INTEGRATION ROUTER (/api/notion/*) ========================
app.use("/api/notion", createNotionRouter());

// ======================== CLAY PIPELINE & JOB INGESTION (/api/jobs/* & /api/clay/*) ========================
app.use("/api/jobs", createJobsIngestRouter());
app.use("/api/clay", createClayRouter());

// ======================== API ENDPOINTS ========================

// Google Maps Platform Config Endpoint
app.get("/api/maps-config", (req, res) => {
  const key =
    process.env.GOOGLE_MAPS_PLATFORM_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    "";
  res.json({
    apiKey: key,
    configured: Boolean(key && key.length > 5 && !key.includes("MY_KEY"))
  });
});

// 1. Job Analysis & Match Scoring
app.post("/api/analyze-job", async (req, res) => {
  try {
    const { jobPosting, jobTitle, companyName, userProfile } = req.body;
    if (!jobPosting) {
      return res.status(400).json({ error: "Job posting text is required." });
    }

    const aiClient = getAIClient();
    const prompt = `
      You are an expert career consultant and technical drafting recruiter.
      Analyze the target job posting provided below and match it against the user's active career profile.
      
      --- TARGET JOB ---
      Job Title: ${jobTitle || 'Unspecified'}
      Company: ${companyName || 'Unspecified'}
      Posting Content:
      ${jobPosting}
      
      --- USER PROFILE ---
      Name: ${userProfile.name}
      Summary: ${userProfile.summary}
      Skills: ${userProfile.skills.join(", ")}
      Software: ${userProfile.software.join(", ")}
      Experience: ${JSON.stringify(userProfile.experience)}
      Education: ${JSON.stringify(userProfile.education)}
      Projects: ${JSON.stringify(userProfile.projects)}
      Certifications: ${userProfile.certifications.join(", ")}
      
      CRITICAL SAFETY DIRECTIVES:
      1. Do NOT fabricate degrees, state licenses (e.g. Registered Architect), or job titles the user does not have.
      2. Do NOT exaggerate software expertise. If the posting mentions advanced Software, but the user only has basic/intermediate or none, flag it as a partial/missing match.
      3. Be highly objective and technical. Use standard industry naming conventions.
      
      Extract and respond strictly with JSON matching the response schema structure:
      - requiredSkills: The essential skills mentioned in the job posting.
      - preferredSkills: Preferred, nice-to-have skills mentioned in the job posting.
      - software: Software systems requested or mentioned in the job posting.
      - yearsOfExperience: Extracted years of experience requested (e.g. "2-3 years", "1+ year", "Entry-level").
      - location: Extracted job location or "Unspecified".
      - workSetup: Classify as "Remote", "Hybrid", "On-site", or "Unspecified".
      - keywords: Specific key phrases, AutoCAD commands, utility terms, or construction processes to integrate into the resume and cover letter (e.g. "cross-sections", "OSP layouts", "redlines", "encroachments", "permits").
      - redFlags: Potential concerns for the candidate (e.g. "requires heavy travel", "extremely high overtime", "requires PE license (which user lacks)").
      - bestResumeAngle: Strategic advice on how the user should pitch themselves (e.g. "Emphasize high volume Civil 3D underground utility permit drawings and precision trench line revisions").
      
      - matchScore:
        * strongMatches: Specific bullet points or skills from local user profile that align perfectly with the job search.
        * partialMatches: Skills or softwares requested where user has basic familiarity but might need brushing up (e.g. user knows AutoCAD but lacks microstation; knows basic Revit but job needs advanced Revit families).
        * missingItems: Key job requirements that user does not currently satisfy (no fabrication!).
        * keywordsToAdd: Core terminology from posting that user should add to their tailored materials.
        * portfolioSuggestions: Which projects or details from user's background user should emphasize showing visually (e.g. OSP fiber layout, site layouts).
        * overallScore: Integer between 0 and 100 indicating the user's match score against requirements. Make this realistic based on matching software and skills.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["requiredSkills", "preferredSkills", "software", "yearsOfExperience", "location", "workSetup", "keywords", "redFlags", "bestResumeAngle", "matchScore"],
          properties: {
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            preferredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            software: { type: Type.ARRAY, items: { type: Type.STRING } },
            yearsOfExperience: { type: Type.STRING },
            location: { type: Type.STRING },
            workSetup: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            bestResumeAngle: { type: Type.STRING },
            matchScore: {
              type: Type.OBJECT,
              required: ["strongMatches", "partialMatches", "missingItems", "keywordsToAdd", "portfolioSuggestions", "overallScore"],
              properties: {
                strongMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
                partialMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                keywordsToAdd: { type: Type.ARRAY, items: { type: Type.STRING } },
                portfolioSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                overallScore: { type: Type.INTEGER }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/analyze-job:", error);
    res.status(500).json({ error: error.message || "Failed to analyze job posting." });
  }
});

// 2. Build Tailored Resume
app.post("/api/build-resume", async (req, res) => {
  try {
    const { jobPosting, jobTitle, companyName, resumeStyle, tone, userProfile, analysisKeywords } = req.body;
    
    const aiClient = getAIClient();
    const prompt = `
      You are an elite technical CV strategist who specializes in formatting engineering, OSP drafting, and architectural drafting profiles.
      Customize the user's resume for the following job opening:
      
      Job Title: ${jobTitle || 'Target Position'}
      Company Name: ${companyName || 'Target Company'}
      Style Focus: ${resumeStyle || 'Standard CAD'}
      Tone Accent: ${tone || 'professional'}
      
      Target Job Description (for matching terms and vocabulary):
      ${jobPosting || 'Unspecified'}
      
      Use these keywords as guidance to align wording naturally where relevant:
      ${(analysisKeywords || []).join(", ")}

      --- USER SOURCE BIOGRAPHY (Use ONLY these true facts) ---
      Name: ${userProfile.name}
      Contact: ${userProfile.phone} | ${userProfile.email} | ${userProfile.location} || Portfolio: ${userProfile.portfolioUrl}
      Summary Biography: ${userProfile.summary}
      Baseline Skills: ${userProfile.skills.join(", ")}
      Baseline Software: ${userProfile.software.join(", ")}
      Baseline Experience: ${JSON.stringify(userProfile.experience)}
      Baseline Education: ${JSON.stringify(userProfile.education)}
      Baseline Projects: ${JSON.stringify(userProfile.projects)}
      Baseline Certifications: ${userProfile.certifications.join(", ")}
      
      STRICT ETHICS & PLAGIARISM CHECK:
      * NO fabricated certifications, professional licenses, training, degrees or titles.
      * Do NOT state the user is a licensed Registered Architect. Clarify student or assistant status.
      * Do NOT declare AutoCAD or Civil 3D expertise beyond the user's explicit profile unless already validated.
      * Keep it highly factual but highlight keywords requested by the job posting (such as layout modifications, sheet sets, utility redlines) dynamically in the summary and experience bullet points where there is a direct professional crossover.
      
      Adapt the presentation according to Resume Style Selection "${resumeStyle}":
      - CAD Technician or Civil CAD: Emphasize civil layout, alignments, Civil 3D underground piping layers, municipal code approvals, site plan permit files.
      - Architectural Drafter or BIM Technician: Highlight Revit, Autodesk BIM 360, building assemblies, detail sheets, grids, architectural student background, SketchUp concepts.
      - Design Assistant: Showcase project coordination, redline revisions, contractor updates, presentation modeling.
      - Remote CAD: Stress independent document preparation, central project coordination, file exchange networks, Bluebeam review workflows, speed.

      Output a tailored resume as a highly clean, structured JSON conforming to the response schema:
      - name: User's name.
      - contact: Combined formatted contact line (phone, email, location).
      - summary: A newly drafted tailored professional summary incorporating job-specific keywords.
      - skills: Tailored subset or optimized skills phrasing (strictly based on actual facts).
      - software: Software proficiency list matching the user's actual toolbox, tailored in hierarchy.
      - experience: Tailored list of company placements. Keep companies, periods, and roles authentic, but tailor the detailed bullet points (3-4 per job) to address the posting criteria cleanly and include strong action verbs (e.g., Drafted, Redlined, Revised, Cataloged).
      - education: Authentic school details with customized layout.
      - projects: Authentic project summaries with job-focused wording.
      - certifications: Real certifications list.
      - portfolioUrl: Realistic portfolio placeholder customized for the target role.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["name", "contact", "summary", "skills", "software", "experience", "education", "projects", "certifications"],
          properties: {
            name: { type: Type.STRING },
            contact: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            software: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["role", "company", "period", "bullets"],
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  period: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["degree", "school", "period"],
                properties: {
                  degree: { type: Type.STRING },
                  school: { type: Type.STRING },
                  period: { type: Type.STRING },
                  details: { type: Type.STRING }
                }
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "description", "technologies"],
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            portfolioUrl: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/build-resume:", error);
    res.status(500).json({ error: error.message || "Failed to generate resume." });
  }
});

// 3. Build Cover Letter
app.post("/api/build-cover-letter", async (req, res) => {
  try {
    const { jobPosting, jobTitle, companyName, jobLocation, tone, userProfile } = req.body;
    
    const aiClient = getAIClient();
    const prompt = `
      You are an expert resume writer. Generate a highly polished, targeted cover letter for the following position:
      
      Job Title: ${jobTitle || 'Drafting Position'}
      Company: ${companyName || 'Target Company'}
      Location: ${jobLocation || 'Site Board'}
      Tone Preference: ${tone || 'professional'}
      
      Target Job Description:
      ${jobPosting || 'Unspecified'}

      --- CANDIDATE DETAILS ---
      Name: ${userProfile.name}
      Background: ${userProfile.summary}
      Matching Software: ${userProfile.software.join(", ")}
      Matching Skills: ${userProfile.skills.join(", ")}
      Educations/Projects: Architecture student, OSP layouts, permit drafting.
      
      TONE REQUIREMENTS:
      - professional: Traditional, polished, highly respectful.
      - confident: Bold, values-focused, highlighting immediate productivity in utility/drafting templates.
      - simple: Clear, direct, no jargon verbosity, concise sentences.
      - creative: Narrative/story-focused opening emphasizing the design-to-build bridge or structural precision.

      CRITICAL SAFETY DIRECTIVES:
      * DO NOT fabricate any degrees, architects licenses, or employment periods of the candidate.
      * Mention bilingual/Spanish capability ONLY if relevant or in natural construct drafting.
      * Keep the cover letter extremely persuasive, explaining exactly WHY the candidate's OSP wiring, underground conduit mapping, AutoCAD detailing, and BIM software familiarity makes them an immediate-value asset.
      
      Output the structured cover letter as JSON conforming to the response schema:
      - date: Format like "June 3, 2026" or current date placeholder.
      - companyName: Company name.
      - jobTitle: Job title applied for.
      - recipientName: Appropriate hiring manager placeholder (e.g. "Hiring Committee", "Lead Engineering Recruiter").
      - bodyParagraphs: An array of exactly 3-4 paragraphs (1: Strong targeted opening hook mentioning the position; 2: Experience deep-dive demonstrating AutoCAD/Civil3D, OSP trench layout, permit detailing alignment; 3: BIM/Revit aspirations, work ethic, architectural eye, and collaboration).
      - closing: Call to action for an interview or review of CAD layouts.
      - signoff: Standard greeting (e.g., "Sincerely,", "Best Regards,").
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["date", "companyName", "jobTitle", "recipientName", "bodyParagraphs", "closing", "signoff"],
          properties: {
            date: { type: Type.STRING },
            companyName: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            recipientName: { type: Type.STRING },
            bodyParagraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
            closing: { type: Type.STRING },
            signoff: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/build-cover-letter:", error);
    res.status(500).json({ error: error.message || "Failed to generate cover letter." });
  }
});

// 4. Build Custom Checklist Guidelines
app.post("/api/build-steps", async (req, res) => {
  try {
    const { jobPosting, jobTitle, companyName } = req.body;
    
    const aiClient = getAIClient();
    const prompt = `
      Create a step-by-step customized job application checklist for:
      Job Title: ${jobTitle || 'CAD Technician'}
      Company: ${companyName || 'Target Company'}
      
      Job Details:
      ${jobPosting || 'Standard application submission.'}
      
      The list MUST correspond to the 10 core checklist steps:
      1. Review job posting (explain specific software and core priorities extracted from this posting)
      2. Match resume keywords (recommend 3 key terms from this posting to double-check)
      3. Update resume (tell user what style they selected and how to verify their OSP/Civil 3D experience stands out)
      4. Write cover letter (identify any company values or culture traits mentioned to check in writing)
      5. Check portfolio samples (recommend specific drawings to highlight, e.g. cross-sections, OSP fiber aligns, or BIM floor plans)
      6. Prepare references (include technical supervisor reminders)
      7. Apply on company site (site link placeholder or instructions)
      8. Save confirmation (records and receipt logging hints)
      9. Follow up after 3–5 business days (customized friendly template or email advice)
      10. Track status (reminders to update logs)

      Return a JSON array of 10 items representing these steps, where each item has:
      - title: The name of the checklist step.
      - description: A tailored, action-oriented, 2-sentence description detailing exactly how to complete it for THIS specific job.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["title", "description"],
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        }
      }
    });

    const stepsRaw = JSON.parse(response.text || "[]");
    
    // Format into ChecklistItem schema
    const formattedSteps = stepsRaw.map((step: any, index: number) => ({
      id: `step-${index + 1}`,
      title: step.title,
      description: step.description,
      completed: false
    }));

    res.json(formattedSteps);
  } catch (error: any) {
    console.error("Error in /api/build-steps:", error);
    res.status(500).json({ error: error.message || "Failed to generate application checklist." });
  }
});

// 5. Generate Full Packet Together
app.post("/api/build-full-packet", async (req, res) => {
  try {
    const { jobPosting, jobTitle, companyName, jobLocation, resumeStyle, tone, userProfile } = req.body;
    if (!jobPosting) {
      return res.status(400).json({ error: "Job posting is required to generate full packet." });
    }

    const aiClient = getAIClient();
    
    // We execute a single comprehensive request to generate all materials at once.
    // This is robust, provides cohesive messaging across Resume, letter and checklist, and prevents token fragmentation.
    const prompt = `
      You are an elite AI career officer in the construction, utility, and telecommunication design sectors.
      Help preparing a comprehensive, fully coordinated application packet for:
      
      Job Position: ${jobTitle || 'CAD Technical Draftsman'}
      Company Name: ${companyName || 'Target Firm'}
      Location Details: ${jobLocation || 'On-site'}
      Resume Writing Style: ${resumeStyle}
      Tone Direction: ${tone}
      
      --- TARGET JOB POSTING ---
      ${jobPosting}
      
      --- APPLICANT BACKGROUND PROFILE ---
      Name: ${userProfile.name}
      Email: ${userProfile.email}
      Phone: ${userProfile.phone}
      Location: ${userProfile.location}
      Portfolio: ${userProfile.portfolioUrl}
      Summary Biography: ${userProfile.summary}
      Skills Available: ${userProfile.skills.join(", ")}
      Softwares: ${userProfile.software.join(", ")}
      Raw Work History: ${JSON.stringify(userProfile.experience)}
      Schooling background: ${JSON.stringify(userProfile.education)}
      Key Projects: ${JSON.stringify(userProfile.projects)}
      Certificates: ${userProfile.certifications.join(", ")}

      CRITICAL INSTRUCTIONS:
      You must produce four complete documents concurrently:
      1. Job Analysis (Skills identified, remote status, keywords, red flags, score, plus match indicators).
      2. Tailored Resume (Styled as "${resumeStyle}", facts matching biography strictly, customized summaries).
      3. Tailored Cover Letter (In tone "${tone}", exactly 3-4 body paragraphs).
      4. Checklist (10 sequential stages with detailed job-specific guide sentences).

      Do NOT fabricate any degree user hasn't gotten, licenses they don't hold (no licensed architect statements), or softwares they don't know. 

      Output a single unified, valid JSON schema object matching:
      - analysis:
        * requiredSkills: string array
        * preferredSkills: string array
        * software: string array
        * yearsOfExperience: string
        * location: string
        * workSetup: string
        * keywords: string array
        * redFlags: string array
        * bestResumeAngle: string
        * matchScore:
          - strongMatches: string array
          - partialMatches: string array
          - missingItems: string array
          - keywordsToAdd: string array
          - portfolioSuggestions: string array
          - overallScore: integer 0 to 100
      - resume:
        * name: string
        * contact: string
        * summary: string
        * skills: string array
        * software: string array
        * experience: array of (role, company, period, bullets)
        * education: array of (degree, school, period, details)
        * projects: array of (name, description, technologies)
        * certifications: string array
        * portfolioUrl: string
      - coverLetter:
        * date: string
        * companyName: string
        * jobTitle: string
        * recipientName: string
        * bodyParagraphs: string array
        * closing: string
        * signoff: string
      - steps: array of (title, description)
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["analysis", "resume", "coverLetter", "steps"],
          properties: {
            analysis: {
              type: Type.OBJECT,
              required: ["requiredSkills", "preferredSkills", "software", "yearsOfExperience", "location", "workSetup", "keywords", "redFlags", "bestResumeAngle", "matchScore"],
              properties: {
                requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                preferredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                software: { type: Type.ARRAY, items: { type: Type.STRING } },
                yearsOfExperience: { type: Type.STRING },
                location: { type: Type.STRING },
                workSetup: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                bestResumeAngle: { type: Type.STRING },
                matchScore: {
                  type: Type.OBJECT,
                  required: ["strongMatches", "partialMatches", "missingItems", "keywordsToAdd", "portfolioSuggestions", "overallScore"],
                  properties: {
                    strongMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
                    partialMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
                    missingItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keywordsToAdd: { type: Type.ARRAY, items: { type: Type.STRING } },
                    portfolioSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    overallScore: { type: Type.INTEGER }
                  }
                }
              }
            },
            resume: {
              type: Type.OBJECT,
              required: ["name", "contact", "summary", "skills", "software", "experience", "education", "projects", "certifications"],
              properties: {
                name: { type: Type.STRING },
                contact: { type: Type.STRING },
                summary: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                software: { type: Type.ARRAY, items: { type: Type.STRING } },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["role", "company", "period", "bullets"],
                    properties: {
                      role: { type: Type.STRING },
                      company: { type: Type.STRING },
                      period: { type: Type.STRING },
                      bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["degree", "school", "period"],
                    properties: {
                      degree: { type: Type.STRING },
                      school: { type: Type.STRING },
                      period: { type: Type.STRING },
                      details: { type: Type.STRING }
                    }
                  }
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "description", "technologies"],
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                portfolioUrl: { type: Type.STRING }
              }
            },
            coverLetter: {
              type: Type.OBJECT,
              required: ["date", "companyName", "jobTitle", "recipientName", "bodyParagraphs", "closing", "signoff"],
              properties: {
                date: { type: Type.STRING },
                companyName: { type: Type.STRING },
                jobTitle: { type: Type.STRING },
                recipientName: { type: Type.STRING },
                bodyParagraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
                closing: { type: Type.STRING },
                signoff: { type: Type.STRING }
              }
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "description"],
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const fullResult = JSON.parse(response.text || "{}");
    
    // Format steps properly
    if (fullResult.steps && Array.isArray(fullResult.steps)) {
      fullResult.steps = fullResult.steps.map((step: any, index: number) => ({
        id: `step-${index + 1}`,
        title: step.title,
        description: step.description,
        completed: false
      }));
    }

    res.json(fullResult);
  } catch (error: any) {
    console.error("Error in /api/build-full-packet:", error);
    res.status(500).json({ error: error.message || "Failed to generate complete application packet." });
  }
});

// 6A. Available Job API Sources & Cache Status
app.get("/api/job-sources", (req, res) => {
  res.json({
    sources: getJobSourcesStatus(),
    cache: getCacheStats(),
  });
});

// 6B. ATS Public Career Board Lookup (Greenhouse, Lever, Ashby)
app.post("/api/ats-jobs", async (req, res) => {
  try {
    const { provider, boardSlug, query } = req.body;
    if (!provider || !boardSlug) {
      return res.status(400).json({ error: "Both ATS provider and company board slug are required." });
    }
    if (!["greenhouse", "lever", "ashby"].includes(provider)) {
      return res.status(400).json({ error: "Unsupported ATS provider. Use greenhouse, lever, or ashby." });
    }

    const jobs = await fetchAtsBoardJobs(provider, boardSlug, query);
    res.json({
      jobs,
      meta: {
        providersUsed: [`${provider}:${boardSlug}`],
        cached: false,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/ats-jobs:", error);
    res.status(500).json({ error: error.message || "Failed to fetch ATS company job board." });
  }
});

// 6C. Live Columbus & Remote Job Aggregator Search (JSearch, Adzuna, Jooble, USAJOBS, Remotive, The Muse, Arbeitnow + AI Fallback)
app.post("/api/search-jobs", async (req, res) => {
  try {
    const { query, location = "Columbus, OH", source = "auto", remoteOnly = false } = req.body;
    const cleanQuery = (query || "creative production, print shop, CAD design, remote support").trim();

    if (source !== "ai_scan") {
      const liveResult = await searchLiveJobProviders({
        query: cleanQuery,
        location,
        source,
        remoteOnly,
      });

      if (liveResult.jobs.length > 0) {
        return res.json({
          jobs: liveResult.jobs,
          meta: {
            providersUsed: liveResult.providersUsed,
            cached: liveResult.cached,
            errors: liveResult.errors,
            fallbackUsed: false,
          },
        });
      }

      // If a specific keyed/niche provider was explicitly requested and returned nothing, report clearly instead of faking
      if (source !== "auto") {
        return res.json({
          jobs: [],
          meta: {
            providersUsed: liveResult.providersUsed,
            cached: liveResult.cached,
            errors: liveResult.errors,
            fallbackUsed: false,
          },
        });
      }
    }

    // AI Market Scan (explicit ai_scan or auto fallback when external HTTP feeds return 0 matches)
    const aiClient = getAIClient();

    const prompt = `
      You are an expert Ohio recruiter scanning the Central Ohio job market (Franklin County, Columbus and surrounding metros) for Jaime.
      Produce a list of exactly 5 highly-realistic, professional job opportunities matching the user query: "${cleanQuery}"
      ALL results must be explicitly set in ${location} or remote for Ohio residents.
      
      Align candidates with four specific lanes:
      1. Lane A: Fast money / lower THC-risk (Retail, Restaurant, Dispensary Agent, Remote Customer Support/Call Center, Front Desk receptionist, low drug-test risk, low stress)
      2. Lane B: Creative production (Print Shop designer, Sign Shop layout artist, Custom Apparel Graphics, Screen Printing assistant, Content Designer, Social Media helper)
      3. Lane C: Creative Tech / 3D / AI (Blender product modeling, clothing mockup artist, AI visual designer, 3D worldbuilding/rendering)
      4. Lane D: CAD-adjacent but not engineering-heavy (Retail store space designer, exhibit/booth draft assistant, furniture detailer, interior design CAD technician)

      Avoid safety-sensitive positions (CDL, heavy manufacturing, construction field work).
      For each job, generate a detailed description (at least 150 words) with clear responsibilities, qualifications, and tools involved.

      Return a JSON array of objects matching:
      - id: unique string starting with "col-g-"
      - title: job title
      - company: realistic company name
      - location: must be in Columbus, OH or Remote
      - salary: estimated salary
      - experienceLevel: text
      - skills: array of 4-6 technical or soft skills
      - summary: 1-sentence quick snapshot summary
      - description: complete highly detailed job posting text
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["id", "title", "company", "location", "salary", "experienceLevel", "skills", "summary", "description"],
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              salary: { type: Type.STRING },
              experienceLevel: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]").map((j: any) => ({
      ...j,
      source: "AI Market Scan",
    }));
    res.json({
      jobs: results,
      meta: {
        providersUsed: ["AI Market Scan"],
        cached: false,
        errors: [],
        fallbackUsed: source !== "ai_scan",
      },
    });
  } catch (error: any) {
    console.error("Error in /api/search-jobs:", error);
    res.status(500).json({ error: error.message || "Failed to search Columbus Ohio jobs." });
  }
});

// 7. Resume Parser & Job Discovery
app.post("/api/parse-resume", async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required to scan." });
    }

    const aiClient = getAIClient();

    const prompt = `
      You are an expert resume parser and Ohio job matching specialist.
      We have two tasks:
      1. Parse the provided raw resume text below into a structured UserProfile JSON format.
      2. Analyze the parsed qualifications and generate EXACTLY 5 highly matching, real-world target vacancies in the Columbus, Ohio area (or remote options for Ohio residents).
      
      --- APPLICANT RAW RESUME TEXT ---
      ${resumeText}

      --- TASK 1: USER PROFILE EXTRACTION RULES ---
      - Extract all personal and contact details exactly. If email, phone, address, or portfolio link is present, extract them.
      - Summarize their professional bio into a cohesive, targeted paragraph matching their primary discipline.
      - Extract professional skills (e.g. OSP layouts, permit preparation, technical drawings, etc.) and software applications (AutoCAD, Civil 3D, Revit, etc.) as detailed arrays.
      - Format experience, education, projects, and certifications precisely. If no explicit projects exist, create 2-3 logical projects from their work experience descriptions (e.g. "Underground Conduit Engineering", "Zoning Permit Packages Preparation"), keeping all details 100% factual. Do NOT fabricate degrees, states licenses (such as Registered Architect), or credentials they do not hold.
      
      --- TASK 2: OHIO JOB DISCOVERY RULES ---
      Based on their extracted profile (e.g. AutoCAD drafting, print design, space planning or similar background), find exactly 5 targeted, high-compatibility jobs in Columbus, Ohio or remote.
      We must align candidates with the "JAIME JOB FINDER SYSTEM" focusing on four specific lanes:
      1. Lane A: Fast money / lower THC-risk (Retail, Dispensary Agent, Customer Support/Call Center, Front Desk receptionist, low drug-test risk, low stress)
      2. Lane B: Creative production (Print Shop designer, Sign Shop layout artist, Custom Apparel Graphics, Screen Printing assistant)
      3. Lane C: Creative Tech / 3D / AI (Blender product modeling, clothing mockup artist, AI visual designer, 3D worldbuilding/rendering)
      4. Lane D: CAD-adjacent but not engineering-heavy (Retail store space designer, exhibit/booth draft assistant, furniture detailer, interior design CAD technician)

      For each generated job recommendation, assign it to one of these 4 lanes. Provide a fully structured job recommendation including:
      - title
      - company
      - location (Must be Columbus, OH area or Remote)
      - salary (e.g. "$19.00 - $24.00 / hour" or "$55,000 / year")
      - experienceLevel
      - skills (4-6 matching keywords)
      - summary (1-sentence quick snapshot)
      - description (Detailed description with role details and qualifications)
      - lane (The exact lane string, e.g. "Lane B — Creative production")
      - scores (Values 1 to 5 for money, creative, thcRisk, stress, skill, future)

      Output a single unified, valid JSON schema object matching:
      - profile: User's parsed profile JSON matching UserProfile type.
      - recommendedJobs: Array of exactly 5 job objects matching the job finder schema.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["profile", "recommendedJobs"],
          properties: {
            profile: {
              type: Type.OBJECT,
              required: ["name", "email", "phone", "location", "portfolioUrl", "summary", "skills", "software", "experience", "education", "projects", "certifications"],
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                portfolioUrl: { type: Type.STRING },
                summary: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                software: { type: Type.ARRAY, items: { type: Type.STRING } },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["role", "company", "period", "bullets"],
                    properties: {
                      role: { type: Type.STRING },
                      company: { type: Type.STRING },
                      period: { type: Type.STRING },
                      bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["degree", "school", "period"],
                    properties: {
                      degree: { type: Type.STRING },
                      school: { type: Type.STRING },
                      period: { type: Type.STRING },
                      details: { type: Type.STRING }
                    }
                  }
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "description", "technologies"],
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            recommendedJobs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "title", "company", "location", "salary", "experienceLevel", "skills", "summary", "description", "lane", "scores"],
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  salary: { type: Type.STRING },
                  experienceLevel: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  summary: { type: Type.STRING },
                  description: { type: Type.STRING },
                  lane: { type: Type.STRING },
                  scores: {
                    type: Type.OBJECT,
                    required: ["money", "creative", "thcRisk", "stress", "skill", "future"],
                    properties: {
                      money: { type: Type.INTEGER },
                      creative: { type: Type.INTEGER },
                      thcRisk: { type: Type.INTEGER },
                      stress: { type: Type.INTEGER },
                      skill: { type: Type.INTEGER },
                      future: { type: Type.INTEGER }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Error in /api/parse-resume:", error);
    res.status(500).json({ error: error.message || "Failed to scan and parse resume." });
  }
});

// 8. AI Pitch Enhancer
app.post("/api/enhance-pitch", async (req, res) => {
  try {
    const { jobPosting, jobTitle, companyName, userProfile } = req.body;
    if (!userProfile) {
      return res.status(400).json({ error: "Candidate profile is required." });
    }
    const aiClient = getAIClient();

    const prompt = `
      You are an expert career coach. Help Jaime Hernandez draft a highly personalized, compelling, and professional elevator pitch narrative (one strong, cohesive paragraph) specifically tailored for the following vacancy:
      
      Job Title: ${jobTitle || 'Unspecified'}
      Company: ${companyName || 'Unspecified'}
      Job Description:
      ${jobPosting || 'Unspecified'}
      
      Candidate Profile:
      Name: ${userProfile.name}
      Summary: ${userProfile.summary}
      Skills: ${userProfile.skills?.join(", ") || ""}
      Software: ${userProfile.software?.join(", ") || ""}
      Experience: ${JSON.stringify(userProfile.experience || [])}
      Certifications: ${userProfile.certifications?.join(", ") || ""}

      CRITICAL DIRECTIONS:
      1. Tailor the pitch to highlight Jaime's relevant skills (like CAD/Civil 3D layouts, pre-press setups, vector separate layers, or retail/budtender cash compliance, depending on what the job asks for).
      2. Keep it elegant, factual, and strictly professional. Do NOT fabricate any qualifications or licenses (no licensed Registered Architect statement!).
      3. Explain why Jaime's unique mix of technical accuracy and low-drama, on-schedule production flow is a high-value, quick-onboarding fit for this employer.
      4. Avoid marketing slop, buzzwords, or overly dramatic claims. Keep the length under 180 words.

      Return a JSON response matching:
      - enhancedPitch: The complete, tailored paragraph.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["enhancedPitch"],
          properties: {
            enhancedPitch: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/enhance-pitch:", error);
    res.status(500).json({ error: error.message || "Failed to enhance elevator pitch." });
  }
});

// 9. AI Message Optimizer
app.post("/api/enhance-message", async (req, res) => {
  try {
    const { messageType, jobTitle, companyName, contactName, portfolioPiece, userProfile } = req.body;
    if (!userProfile) {
      return res.status(400).json({ error: "Candidate profile is required." });
    }
    const aiClient = getAIClient();

    const prompt = `
      You are an expert career transition copywriter. Tailor and polish the following user-to-recruiter outreach email to make it exceptionally professional, precise, and persuasive for this specific job:
      
      Job Title: ${jobTitle}
      Company: ${companyName}
      Contact Name: ${contactName || 'Hiring Coordinator'}
      Portfolio Piece: ${portfolioPiece}
      Message Type: ${messageType} (Draft an outreach, follow-up, or safe screening policy inquiry)

      Candidate Details:
      Name: ${userProfile.name}
      Background summary: ${userProfile.summary}
      Skills: ${userProfile.skills?.join(", ") || ""}
      Software: ${userProfile.software?.join(", ") || ""}

      CRITICAL COPYWRITING DIRECTIVES:
      1. Write in a clear, humble, yet confident tone that emphasizes immediate productivity, accuracy, and professional responsibility.
      2. Keep it short and highly scannable — no fluff.
      3. If it is a "thc_policy" check, draft a highly discreet, standard operational inquiry asking if the role excludes off-work personal cannabis wellness or involves federal drug-testing mandates, preserving professional etiquette and high reliability.
      4. Do NOT fabricate degrees, licenses, or skills. Include Jaime's true contact info.

      Return a JSON response matching:
      - subject: Email subject line.
      - body: The drafted message body with standard spacing.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["subject", "body"],
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/enhance-message:", error);
    res.status(500).json({ error: error.message || "Failed to optimize outreach message." });
  }
});

// 10. AI Career Coach Interview Practice Partner
app.post("/api/interview-practice", async (req, res) => {
  try {
    const { question, userAnswer, jobTitle, companyName, userProfile } = req.body;
    if (!userProfile) {
      return res.status(400).json({ error: "Candidate profile is required." });
    }
    const aiClient = getAIClient();

    const prompt = `
      You are an expert technical recruiter or team leader based in Columbus, Ohio.
      Evaluate the user's mock interview answer for the following position:
      
      Job Title: ${jobTitle || 'Creative Production / Drafting Associate'}
      Company: ${companyName || 'Target Employer'}
      
      Question:
      "${question}"
      
      User's Practice Response:
      "${userAnswer}"

      Candidate Active Profile context:
      Name: ${userProfile.name}
      Summary: ${userProfile.summary}
      Skills: ${userProfile.skills?.join(", ") || ""}
      Software: ${userProfile.software?.join(", ") || ""}

      Analyze their answer and provide comprehensive professional feedback:
      1. Highlight what they did well (e.g., matching experience level, clear transition, showing technical initiative).
      2. Suggest concrete improvements (e.g., adding specific terminology, structuring using the STAR format situation-task-action-result, or avoiding red flags).
      3. Suggest 3 key terms, metrics, or CAD/print-mesh/compliance swatches they should integrate to show high expertise.
      4. Write an improved version of the answer that Jaime can practice saying. Keep it natural, conversational, technical, and low-drama.
      5. Provide an overall confidence score (integer between 0 and 100) reflecting how a real-world recruiter would rate their answer.

      Return a JSON response matching:
      - strongPoints: Array of what they did well.
      - improvementNotes: Array of constructive improvement points.
      - keywordSuggestions: Array of 3 key swatches/keywords to add.
      - sampleBestResponse: Refined response text for practice.
      - ratingScore: Integer between 0 and 100.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["strongPoints", "improvementNotes", "keywordSuggestions", "sampleBestResponse", "ratingScore"],
          properties: {
            strongPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywordSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            sampleBestResponse: { type: Type.STRING },
            ratingScore: { type: Type.INTEGER }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/interview-practice:", error);
    res.status(500).json({ error: error.message || "Failed to simulate interview response." });
  }
});

// 11. AI Career Workflow Planner
app.post("/api/tailor-workflow", async (req, res) => {
  try {
    const { workflowStyle, jobTitle, companyName, jobDescription, userProfile } = req.body;
    if (!userProfile) {
      return res.status(400).json({ error: "Candidate profile is required." });
    }
    const aiClient = getAIClient();

    const prompt = `
      You are an expert career operational coordinator specializing in Columbus, Ohio job markets.
      Create a highly customized, hyper-targeted step-by-step landing workflow blueprint for Jaime Hernandez for this specific position:
      
      Position: ${jobTitle || 'Unspecified'}
      Company: ${companyName || 'Unspecified'}
      Job Specifications:
      ${jobDescription || 'Unspecified'}
      
      Chosen Operational Workflow Style:
      "${workflowStyle}" (e.g., Physical In-Person, ATS Optimization, Safe Drug Screening, Agency Handoff)

      User active context:
      Name: ${userProfile.name}
      Summary: ${userProfile.summary}
      Skills: ${userProfile.skills?.join(", ") || ""}
      Software: ${userProfile.software?.join(", ") || ""}

      Develop a customized workflow containing exactly 4 coherent sequential stages (e.g. Stage 1: Preparation & Calibration, Stage 2: Initial Touchpoint, Stage 3: Direct Handoff, Stage 4: Followup).
      For each stage:
      - Design exactly 3 realistic, specific, highly actionable sub-tasks. Ensure they mention specific details relating to Columbus, CAD/print files, certifications, or particular aspects of the job.
      - Draft a custom talking script or outreach note ("customScript") crafted for that stage's specific objective, utilizing Jaime's true technical facts (no licensed architect fabrications!).

      Return a JSON response matching:
      - workflowName: A customized professional campaign title.
      - strategyDescription: A 2-sentence summary explaining why this specific style fits this target job.
      - recommendedTimeline: A suggested overall timeline (e.g., "7-Day Sprint", "14-Day Cycle").
      - stages: Array of exactly 4 stages matching the schema:
        * stageName: string (e.g. "Stage 1: Pre-flight Audit")
        * description: string (summary of goal)
        * tasks: array of objects containing:
          - id: unique string
          - label: string (clear actionable task)
          - details: string (supporting micro-steps)
          - completed: false
          - estimatedMinutes: integer (minutes required)
        * customScript: string (optional, tailored outreach or talking script)
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["workflowName", "strategyDescription", "recommendedTimeline", "stages"],
          properties: {
            workflowName: { type: Type.STRING },
            strategyDescription: { type: Type.STRING },
            recommendedTimeline: { type: Type.STRING },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["stageName", "description", "tasks"],
                properties: {
                  stageName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["id", "label", "details", "completed", "estimatedMinutes"],
                      properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        details: { type: Type.STRING },
                        completed: { type: Type.BOOLEAN },
                        estimatedMinutes: { type: Type.INTEGER }
                      }
                    }
                  },
                  customScript: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/tailor-workflow:", error);
    res.status(500).json({ error: error.message || "Failed to design custom career workflow." });
  }
});

// ======================== VITE & STATIC SERVING ========================

async function startServer() {
  const PORT = 3000;

  // Serve static files and handle assets based on environments
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Career Engine running at http://localhost:${PORT}`);
  });
}

startServer();
