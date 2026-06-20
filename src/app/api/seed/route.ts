import { NextResponse } from "next/server";
import { initDB, sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const demoUsers = [
  { email: "adewale@insurecrm.com", password: "admin123", name: "Adewale Coker", role: "super_admin", team: "AI Operations" },
  { email: "chioma@insurecrm.com", password: "demo123", name: "Chioma Ibe", role: "admin", team: "Claims Processing" },
  { email: "tunde@insurecrm.com", password: "demo123", name: "Tunde Akande", role: "manager", team: "Underwriting" },
  { email: "folake@insurecrm.com", password: "demo123", name: "Folake Adesanya", role: "manager", team: "Customer Success" },
  { email: "emeka@insurecrm.com", password: "demo123", name: "Emeka Nnamdi", role: "agent", team: "Claims Processing" },
  { email: "ngozi@insurecrm.com", password: "demo123", name: "Ngozi Obiora", role: "agent", team: "Underwriting" },
  { email: "adebola@insurecrm.com", password: "demo123", name: "Adebola Olatunde", role: "agent", team: "AI Operations" },
  { email: "bola@insurecrm.com", password: "demo123", name: "Bola Shonubi", role: "agent", team: "Customer Success" },
  { email: "kemi@insurecrm.com", password: "demo123", name: "Kemi Adebanjo", role: "agent", team: "Claims Processing" },
  { email: "dayo@insurecrm.com", password: "demo123", name: "Dayo Salami", role: "viewer", team: null },
];

const demoCustomers = [
  { email: "support@leadway.com", name: "Leadway Assurance", company: "Leadway", segment: "enterprise", plan: "enterprise", ltv: 85000000, csat: 4.8, total_tickets: 28 },
  { email: "help@aiico.com", name: "AIICO Insurance", company: "AIICO", segment: "enterprise", plan: "enterprise", ltv: 62000000, csat: 4.6, total_tickets: 20 },
  { email: "team@custodian.com", name: "Custodian Insurance", company: "Custodian", segment: "business", plan: "business", ltv: 38000000, csat: 4.5, total_tickets: 14 },
  { email: "support@axamansard.com", name: "AXA Mansard", company: "AXA Mansard", segment: "pro", plan: "pro", ltv: 29000000, csat: 4.7, total_tickets: 12 },
  { email: "ops@oldmutual.com", name: "Old Mutual Nigeria", company: "Old Mutual", segment: "enterprise", plan: "enterprise", ltv: 54000000, csat: 4.9, total_tickets: 25 },
  { email: "help@stanbicibtc.com", name: "Stanbic IBTC Insurance", company: "Stanbic IBTC", segment: "business", plan: "business", ltv: 42000000, csat: 4.4, total_tickets: 17 },
  { email: "support@coronation.com", name: "Coronation Insurance", company: "Coronation", segment: "pro", plan: "pro", ltv: 18000000, csat: 4.3, total_tickets: 8 },
  { email: "team@multichoice.com", name: "Mulholland Assurance", company: "Mulholland", segment: "starter", plan: "starter", ltv: 6000000, csat: 4.2, total_tickets: 5 },
  { email: "ops@benefit.com", name: "Benefit Insurance", company: "Benefit Insurance", segment: "business", plan: "business", ltv: 25000000, csat: 4.6, total_tickets: 11 },
  { email: "support@arm.com", name: "ARM Insurance", company: "ARM Insurance", segment: "starter", plan: "starter", ltv: 4200000, csat: 4.5, total_tickets: 3 },
];

const demoKnowledgeArticles = [
  { title: "How to File an Insurance Claim", content: "Filing an insurance claim starts by logging into your InsureCRM portal and navigating to the Claims section. Select the type of claim you wish to file, fill in the required details including policy number, incident date, and a description of the event. Upload supporting documents such as photos, police reports, or medical records to strengthen your claim. Once submitted, your claim will be assigned to a claims adjuster who will review it within 48 hours.", collection: "Claims Management", status: "published", views: 3421, ai_used: 234, helpful: 92, tags: ["claims", "filing", "how-to", "policy"] },
  { title: "Understanding Motor Insurance Coverage", content: "Motor insurance in Nigeria is categorized into Third-Party Only (TPO), Third-Party Fire and Theft (TPFT), and Comprehensive policies. TPO covers damage you cause to other vehicles and property, while comprehensive covers your own vehicle as well. Key factors affecting premiums include vehicle value, driver age, claims history, and coverage limits. NAICOM mandates minimum coverage levels for all registered vehicles.", collection: "Claims Management", status: "published", views: 2876, ai_used: 198, helpful: 89, tags: ["motor", "insurance", "coverage", "vehicle"] },
  { title: "Processing Life Insurance Claims", content: "Life insurance claims require submission of a death certificate, policy document, and beneficiary identification. Claims are processed within 14 business days after verification of all documents. The claims team performs a due diligence check to confirm the policy was active at the time of death. Beneficiaries receive payment via bank transfer after all approvals are obtained.", collection: "Claims Management", status: "published", views: 2109, ai_used: 167, helpful: 91, tags: ["life", "claims", "death", "beneficiary"] },
  { title: "Configuring NAICOM Compliance Rules", content: "NAICOM compliance requires insurers to maintain minimum capital adequacy ratios, submit quarterly returns, and adhere to the NAICOM corporate governance framework. In InsureCRM, configure compliance rules under Settings > Compliance > NAICOM. Set automated alerts for filing deadlines, capital ratio thresholds, and mandatory disclosure requirements. The system generates pre-formatted reports aligned with NAICOM templates.", collection: "Policy Administration", status: "published", views: 1876, ai_used: 134, helpful: 90, tags: ["naicom", "compliance", "regulation", "governance"] },
  { title: "How to Calculate Premium Estimates", content: "Premium estimation in InsureCRM uses actuarial models that factor in risk profile, coverage amount, deductible, claims history, and industry classification. Navigate to the Premium Calculator tool and input the relevant parameters. The AI engine will generate an estimated premium range based on current market data and NAICOM guidelines. You can adjust variables to see how changes affect the final premium.", collection: "Underwriting", status: "published", views: 1567, ai_used: 112, helpful: 88, tags: ["premium", "calculation", "actuarial", "estimate"] },
  { title: "Setting Up Policy Renewal Reminders", content: "Automate policy renewal reminders by configuring the Renewal Automation module in Settings > Automation > Renewals. Set reminder intervals at 90, 60, 30, and 7 days before expiration. Reminders are sent via the customer's preferred channel (email, SMS, or WhatsApp). The system tracks renewal status and escalates unresponsive policies to account managers for follow-up.", collection: "Policy Administration", status: "published", views: 1234, ai_used: 89, helpful: 86, tags: ["renewal", "reminders", "automation", "policy"] },
  { title: "Understanding Health Insurance Benefits", content: "Health insurance policies cover hospitalization, outpatient treatment, maternity care, dental, and optical services depending on the plan tier. InsureCRM categorizes health plans into Basic, Standard, and Premium tiers. Each tier has different sub-limits, co-payment percentages, and network hospital requirements. Policyholders can view their benefits breakdown in the customer portal.", collection: "Policy Administration", status: "published", views: 1987, ai_used: 143, helpful: 87, tags: ["health", "benefits", "hospitalization", "coverage"] },
  { title: "Processing Fire and Property Claims", content: "Fire and property claims require a fire brigade report, property valuation, and photographic evidence of damage. An adjuster will be dispatched to assess the loss within 72 hours of claim submission. Settlement is based on the property's insured value minus depreciation and deductible. For total loss claims, the full sum insured is payable after verification.", collection: "Claims Management", status: "published", views: 1654, ai_used: 121, helpful: 85, tags: ["fire", "property", "claims", "adjuster"] },
  { title: "Managing Agent Commission Structures", content: "Agent commissions in InsureCRM are configured under Settings > Commissions > Structure. Define commission rates by product type, policy tenure, and agent tier. First-year commissions typically range from 15-30% of premium, with renewal commissions at 5-10%. The system auto-calculates commissions upon policy issuance and generates commission statements for agents.", collection: "Policy Administration", status: "published", views: 987, ai_used: 76, helpful: 84, tags: ["agent", "commission", "structure", "payment"] },
  { title: "How to Issue a Policy Document", content: "Policy documents are generated in InsureCRM by navigating to Policy Management > Create Policy. Select the product type, input customer details, coverage parameters, and premium amount. The system auto-populates standard clauses and endorsements based on NAICOM requirements. Preview the document before issuing, then digitally sign and send to the policyholder via email or the customer portal.", collection: "Policy Administration", status: "published", views: 1876, ai_used: 134, helpful: 90, tags: ["policy", "document", "issuance", "digital"] },
  { title: "Configuring WhatsApp for Claims Updates", content: "Connect WhatsApp Business API via Settings > Channels > WhatsApp. Register your business account and verify your phone number with Meta. Once connected, configure automated claim status update templates for policyholders. The system sends proactive notifications when claim status changes, documents are requested, or settlement is processed. Two-way messaging allows customers to reply with additional information.", collection: "Integrations", status: "published", views: 3210, ai_used: 245, helpful: 91, tags: ["whatsapp", "claims", "updates", "integration"] },
  { title: "Email Integration for Policy Correspondence", content: "Set up email integration under Settings > Channels > Email. Configure IMAP for receiving policyholder inquiries and SMTP for sending official correspondence. Enable auto-classification to route incoming emails to the appropriate department based on content analysis. Attach policy documents directly from the system when responding to customer queries.", collection: "Integrations", status: "published", views: 2876, ai_used: 198, helpful: 88, tags: ["email", "policy", "correspondence", "integration"] },
  { title: "Building an Insurance Knowledge Base", content: "Create a comprehensive knowledge base by organizing articles into collections such as Claims, Underwriting, Policy Admin, and Compliance. Use the article editor to add rich text, images, and embedded videos. Tag articles with relevant keywords for AI-powered search. Set up approval workflows to ensure content accuracy before publishing to the customer portal or agent dashboard.", collection: "Getting Started", status: "published", views: 2345, ai_used: 178, helpful: 89, tags: ["knowledge-base", "articles", "content", "organization"] },
  { title: "Understanding AI Claims Assessment", content: "InsureCRM's AI claims assessment uses computer vision and NLP to evaluate claim validity. Upload claim documents and the AI extracts key data points, cross-references with policy terms, and flags anomalies. The system assigns a risk score to each claim, prioritizing high-confidence auto-approvals and routing suspicious claims to human adjusters. AI assessment reduces claim processing time by up to 60%.", collection: "Claims Management", status: "published", views: 4521, ai_used: 312, helpful: 95, tags: ["ai", "claims", "assessment", "automation"] },
  { title: "Setting Up Multi-Channel Claim Intake", content: "Configure multi-channel claim intake to accept claims via web portal, mobile app, WhatsApp, email, and phone. Each channel feeds into a centralized claims queue with automatic deduplication. Set up channel-specific intake forms to capture the required information for each claim type. The system routes claims to the appropriate team based on claim type, value, and complexity.", collection: "Getting Started", status: "published", views: 1876, ai_used: 134, helpful: 90, tags: ["multi-channel", "claim", "intake", "omnichannel"] },
  { title: "Managing Reinsurance Partnerships", content: "InsureCRM supports treaty and facultative reinsurance arrangements. Configure reinsurance treaties under Settings > Reinsurance > Treaties. Define treaty types (quota share, excess of loss, surplus), retention limits, and cession percentages. The system automatically calculates ceded amounts when policies are issued and generates bordereau reports for reinsurers on a monthly basis.", collection: "Underwriting", status: "published", views: 1432, ai_used: 109, helpful: 87, tags: ["reinsurance", "treaty", "partnership", "cession"] },
  { title: "Understanding Actuarial Risk Scoring", content: "Actuarial risk scoring evaluates policyholder risk using statistical models that consider age, health history, occupation, lifestyle, and claims history. InsureCRM's risk engine generates a score from 1-100 for each applicant. Scores below 30 are low risk, 31-60 are moderate, and above 60 require additional underwriting review. Risk scores directly influence premium pricing and coverage eligibility.", collection: "Underwriting", status: "published", views: 1654, ai_used: 123, helpful: 88, tags: ["actuarial", "risk", "scoring", "underwriting"] },
  { title: "Configuring Automated Claim Routing", content: "Set up automated claim routing rules under Settings > Automation > Routing. Define rules based on claim type, value, region, and complexity. For example, motor claims under 500,000 can be auto-assigned to junior adjusters, while claims above 5 million go to senior teams. The routing engine considers agent workload, expertise, and availability to optimize claim distribution.", collection: "Claims Management", status: "published", views: 2109, ai_used: 167, helpful: 91, tags: ["routing", "automation", "claims", "assignment"] },
  { title: "How to Handle Claim Denials", content: "When a claim is denied, InsureCRM generates a formal denial letter citing the specific policy exclusion or reason. Navigate to Claims > Denial Management to review and customize the denial. The system tracks denial reasons to identify patterns and potential policy improvements. Denied claims can be appealed through the disputes module, where they are reviewed by a senior claims officer.", collection: "Claims Management", status: "published", views: 1234, ai_used: 89, helpful: 85, tags: ["denial", "claims", "appeal", "dispute"] },
  { title: "Setting Up Policy Document Digitalization", content: "Enable document scanning in Settings > Document Management > Digitalization. Upload physical policy documents and the system uses OCR to extract key data fields including policy number, coverage details, and effective dates. Digitalized documents are stored in the policyholder's profile and linked to the policy record for easy retrieval during claims processing.", collection: "Policy Administration", status: "published", views: 987, ai_used: 76, helpful: 84, tags: ["digitalization", "document", "scanning", "ocr"] },
  { title: "Managing Third-Party Administrators", content: "Configure TPA relationships under Settings > Partners > TPAs. Assign TPAs to specific policyholder groups or regions. The system tracks TPA performance metrics including claim processing time, settlement accuracy, and customer satisfaction. Generate TPA performance reports monthly to evaluate contract compliance and negotiate fees.", collection: "Policy Administration", status: "published", views: 876, ai_used: 67, helpful: 83, tags: ["tpa", "third-party", "administrator", "partnership"] },
  { title: "Understanding Insurance Fraud Detection", content: "InsureCRM uses AI-powered fraud detection that analyzes claim patterns, cross-references with industry databases, and identifies suspicious behaviors. The system flags claims with indicators such as repeated claims, inconsistent documentation, or unusual claim timing. Flagged claims are routed to the Special Investigations Unit (SIU) for manual review. The fraud detection model is trained on millions of historical claims.", collection: "Claims Management", status: "published", views: 1876, ai_used: 134, helpful: 90, tags: ["fraud", "detection", "ai", "investigation"] },
  { title: "Configuring SLA for Claim Processing", content: "Set claim processing SLAs under Settings > SLA > Claims. Define target resolution times by claim type and complexity: motor (7 days), health (5 days), life (14 days), property (10 days). Configure escalation triggers at 50%, 75%, and 100% of SLA time. SLA compliance is tracked in real-time and displayed on the claims dashboard. Breached SLAs automatically notify the claims manager.", collection: "Claims Management", status: "published", views: 1543, ai_used: 112, helpful: 88, tags: ["sla", "claim", "processing", "escalation"] },
  { title: "Data Privacy and NDPR for Insurance", content: "InsureCRM complies with Nigeria Data Protection Regulation (NDPR) requirements. Customer data is encrypted at rest and in transit. Configure data retention policies under Settings > Privacy > Retention. Policyholder consent is captured during onboarding and stored in the consent management module. Data subject access requests (DSAR) are processed within 72 hours through the privacy portal.", collection: "Technical Docs", status: "published", views: 1234, ai_used: 89, helpful: 91, tags: ["ndpr", "privacy", "data-protection", "compliance"] },
  { title: "Troubleshooting Claim System Errors", content: "Common claim system errors include timeout during document upload, duplicate claim detection failures, and premium calculation mismatches. Check the system status page at status.insurecrm.com for ongoing incidents. Review the audit log under Settings > Logs for detailed error traces. For persistent issues, contact support with the claim number and error code from the notification.", collection: "Troubleshooting", status: "published", views: 1987, ai_used: 156, helpful: 86, tags: ["errors", "troubleshooting", "claims", "system"] },
  { title: "Mobile App for Insurance Agents", content: "The InsureCRM mobile app allows agents to manage policies, process claims, and communicate with policyholders on the go. Download from the App Store or Google Play. Key features include on-the-go policy issuance, photo capture for claims, digital signature collection, and real-time notifications. Enable biometric login for secure access in the field.", collection: "Getting Started", status: "published", views: 1654, ai_used: 123, helpful: 89, tags: ["mobile", "app", "agents", "features"] },
  { title: "How to Generate Claims Reports", content: "Generate claims reports from the Analytics dashboard by selecting the Claims tab. Choose from pre-built templates: claims volume, settlement turnaround, denial rates, and loss ratios. Customize date ranges, claim types, and regions. Export reports in PDF, Excel, or CSV format. Schedule automated reports to be emailed to stakeholders weekly or monthly.", collection: "Claims Management", status: "published", views: 2345, ai_used: 178, helpful: 92, tags: ["reports", "analytics", "claims", "export"] },
  { title: "Understanding Motor Third-Party Liability", content: "Motor third-party liability covers bodily injury and property damage you cause to others in an accident. In Nigeria, minimum coverage is required by law under the Motor Vehicles (Third Party Insurance) Act. InsureCRM calculates liability limits based on vehicle type, usage, and coverage tier. Claims are processed through the Motor Insurance Association of Nigeria (MIAN) framework.", collection: "Claims Management", status: "published", views: 1432, ai_used: 109, helpful: 87, tags: ["motor", "third-party", "liability", "coverage"] },
  { title: "Setting Up Customer Portal for Self-Service", content: "Enable the customer portal under Settings > Portal > Configuration. Customize the portal with your company branding, logo, and colors. Policyholders can view policies, download documents, file claims, and track claim status through the portal. Configure self-service options to reduce call center volume and improve customer satisfaction.", collection: "Getting Started", status: "published", views: 1876, ai_used: 134, helpful: 90, tags: ["portal", "self-service", "customer", "configuration"] },
  { title: "API Integration for Policy Management", content: "InsureCRM provides REST APIs for policy management integration. Base URL: https://api.insurecrm.com/v1/policies. Endpoints support policy creation, renewal, endorsement, and cancellation. Authentication uses OAuth 2.0 bearer tokens. Rate limits are 500 requests per minute. Full API documentation is available at docs.insurecrm.com/api with interactive examples.", collection: "API Reference", status: "published", views: 2109, ai_used: 167, helpful: 89, tags: ["api", "policy", "integration", "rest"] },
];

const demoTickets = [
  { subject: "Motor accident claim pending for 3 weeks", message: "My motor claim has been pending for three weeks. Policy number INS-MTR-2024-0891. The vehicle is still at the workshop and I need it for daily commuting. Please expedite.", status: "open", priority: "high", channel: "whatsapp", sentiment: "frustrated", sentiment_score: -0.4, ai_confidence: 85, tags: ["motor", "claims", "delay"] },
  { subject: "How to renew expired life insurance policy", message: "My life insurance policy expired last month. I want to renew it but the portal shows the policy is inactive. Can someone guide me through the renewal process?", status: "open", priority: "medium", channel: "email", sentiment: "neutral", sentiment_score: 0.0, ai_confidence: 92, tags: ["life", "renewal", "policy"] },
  { subject: "Customer dispute on claim settlement amount", message: "The settlement amount offered for my property claim is far below the repair estimate. I have a certified valuation report showing the damage is worth 4.5 million but you offered 2.1 million.", status: "escalated", priority: "high", channel: "web", sentiment: "angry", sentiment_score: -0.7, ai_confidence: 72, tags: ["settlement", "dispute", "property"] },
  { subject: "Need to update policyholder contact details", message: "I changed my phone number and email address. Please update my contact details on policy INS-HLT-2024-1234 so I can receive renewal reminders.", status: "open", priority: "low", channel: "messenger", sentiment: "neutral", sentiment_score: 0.1, ai_confidence: 96, tags: ["update", "contact", "policy"] },
  { subject: "NAICOM compliance audit documentation request", message: "We have an upcoming NAICOM compliance audit. Please generate the following reports: claims settlement ratio, premium collection summary, and reserve adequacy statement for Q4 2025.", status: "open", priority: "medium", channel: "email", sentiment: "neutral", sentiment_score: 0.0, ai_confidence: 88, tags: ["naicom", "compliance", "audit"] },
  { subject: "Processing bulk policy renewals for fleet", message: "We need to renew 45 fleet vehicle policies that expire next month. Please provide a consolidated renewal quote and process them as a batch to avoid individual renewals.", status: "pending", priority: "medium", channel: "email", sentiment: "neutral", sentiment_score: -0.1, ai_confidence: 91, tags: ["bulk", "renewal", "fleet", "motor"] },
  { subject: "Health insurance claim rejected - customer angry", message: "My health insurance claim for surgery was rejected saying it is a pre-existing condition. This is not true and I have medical records to prove it. I need this resolved immediately.", status: "escalated", priority: "urgent", channel: "whatsapp", sentiment: "angry", sentiment_score: -0.8, ai_confidence: 78, tags: ["health", "rejection", "dispute", "urgent"] },
  { subject: "How to calculate premium for new commercial building", message: "We are insuring a new 10-story commercial building in Lagos. Need guidance on how to calculate the appropriate premium for fire and property coverage.", status: "open", priority: "low", channel: "web", sentiment: "neutral", sentiment_score: 0.1, ai_confidence: 94, tags: ["premium", "property", "commercial", "fire"] },
  { subject: "Agent commission not matching policy sales", message: "My commission statement for March shows 12 policies but I issued 18 policies. There seems to be a discrepancy in the calculation. Please review and correct.", status: "open", priority: "medium", channel: "sms", sentiment: "negative", sentiment_score: -0.2, ai_confidence: 87, tags: ["commission", "agent", "discrepancy"] },
  { subject: "Fire damage claim - urgent priority", message: "Our warehouse suffered fire damage yesterday. All inventory is destroyed. Policy number INS-FIR-2024-0567. Need immediate claim processing and adjuster dispatch.", status: "open", priority: "urgent", channel: "whatsapp", sentiment: "angry", sentiment_score: -0.9, ai_confidence: 82, tags: ["fire", "urgent", "property", "claims"] },
];

export async function POST() {
  try {
    await initDB();

    for (const user of demoUsers) {
      const hash = await hashPassword(user.password);
      await sql`
        INSERT INTO users (email, password_hash, name, role, team)
        VALUES (${user.email}, ${hash}, ${user.name}, ${user.role}, ${user.team})
        ON CONFLICT (email) DO NOTHING
      `;
    }

    const customerIds: string[] = [];
    for (const c of demoCustomers) {
      const result = await sql`
        INSERT INTO customers (email, name, company, segment, plan, ltv, csat, total_tickets)
        VALUES (${c.email}, ${c.name}, ${c.company}, ${c.segment}, ${c.plan}, ${c.ltv}, ${c.csat}, ${c.total_tickets})
        ON CONFLICT (email) DO UPDATE SET name = ${c.name}
        RETURNING id
      `;
      customerIds.push(result[0].id);
    }

    const users = await sql`SELECT id, email FROM users`;
    const userIdMap: Record<string, string> = {};
    for (const u of users) userIdMap[u.email] = u.id;

    for (let i = 0; i < demoTickets.length; i++) {
      const t = demoTickets[i];
      const customerId = customerIds[i % customerIds.length];
      const assigneeId = userIdMap["emeka@insurecrm.com"];
      const ticketNumber = `INS-${1234 - i}`;
      const slaDue = new Date(Date.now() + (t.priority === "urgent" ? 3600000 : t.priority === "high" ? 7200000 : 14400000));

      await sql`
        INSERT INTO tickets (ticket_number, subject, message, status, priority, channel, customer_id, assignee_id, sentiment, sentiment_score, ai_confidence, sla_status, sla_due, tags)
        VALUES (${ticketNumber}, ${t.subject}, ${t.message}, ${t.status}, ${t.priority}, ${t.channel}, ${customerId}, ${assigneeId}, ${t.sentiment}, ${t.sentiment_score}, ${t.ai_confidence}, 'ok', ${slaDue.toISOString()}, ${t.tags})
        ON CONFLICT (ticket_number) DO NOTHING
      `;
    }

    const adminUserId = userIdMap["adewale@insurecrm.com"];
    await sql`DELETE FROM knowledge_articles`;
    for (const article of demoKnowledgeArticles) {
      await sql`
        INSERT INTO knowledge_articles (title, content, collection, status, views, ai_used, helpful, tags, created_by)
        VALUES (${article.title}, ${article.content}, ${article.collection}, ${article.status}, ${article.views}, ${article.ai_used}, ${article.helpful}, ${article.tags}, ${adminUserId})
      `;
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      logins: {
        admin: "adewale@insurecrm.com / admin123",
        manager: "folake@insurecrm.com / demo123",
        agent: "emeka@insurecrm.com / demo123",
        viewer: "dayo@insurecrm.com / demo123",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
