import {
  FaUndo,
  FaCommentDots,
  FaStar,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaUserPlus,
  FaTruck,
  FaChartLine,
  FaSyncAlt,
} from "react-icons/fa";
import type { IconType } from "react-icons";

export interface Stat {
  value: string; // the figure, e.g. a percentage or dollar range
  label: string; // what it measures, in plain language
  source: string; // publication + year, shown on the page
  sourceUrl: string; // required — no stat without a source
}

export interface WorkflowCard {
  slug: string;
  label: string;
  icon: IconType;
  cardSummary: string;
  hasDemo: boolean;
}

export interface FeatureRow {
  eyebrow?: string;
  title: string;
  body: string;
  snippet: string; // key into the workflow's showcase module
  flip?: boolean; // place the visual on the left instead of the right
}

export interface Showcase {
  heroSnippet: string; // key for the hero product-shot
  rows: FeatureRow[]; // 2–3 curated feature rows
}

export interface WorkflowContent {
  hero: { headline: string; subhead: string };
  stats: Stat[]; // empty ⇒ section omitted
  painPoints: string[];
  mechanism: { title: string; description: string }[];
  faq: { q: string; a: string }[];
  showcase?: Showcase; // present ⇒ page renders the Phase-2 redesign
}

/**
 * `published: true` requires the page content to exist. An unpublished
 * workflow cannot carry half-written copy, and a published one cannot be
 * missing it.
 */
export type PublishedWorkflow = WorkflowCard &
  WorkflowContent & { published: true };

export type Workflow = (WorkflowCard & { published: false }) | PublishedWorkflow;

export const workflows: Workflow[] = [
  {
    slug: "win-back-campaigns",
    label: "Win-Back Campaigns",
    icon: FaUndo,
    cardSummary: "Re-engage past customers automatically",
    hasDemo: true,
    published: true,
    hero: {
      headline: "Past customers drift off quietly — you notice when the calendar gets thin",
      subhead:
        "You know some of the people in your records are due for work again. You also know that mailing the whole list a discount is a good way to get ignored, or unsubscribed from. This picks out the customers who are actually due, gives each one a reason that fits their last job, and contacts only them.",
    },
    stats: [],
    painPoints: [
      "You have years of customers in your invoicing software and no way to tell which of them are due for work again.",
      "The last promo you sent went to the whole list, and the replies weren't worth the opt-outs.",
      "You're buying ads to reach strangers while the people who already paid you go somewhere else.",
      "You find out a good customer is gone when you notice you haven't seen their name in a while.",
    ],
    mechanism: [
      {
        title: "Your list comes out of the software you already use",
        description:
          "Names, last job, when you last saw them — pulled from your invoicing or job software rather than rebuilt by hand. Whatever's already in there is the starting point.",
      },
      {
        title: "Most of the list gets thrown out",
        description:
          "This is the step that matters. Contacting everyone doesn't bring work back, and the wrong message at the wrong moment is a good way to lose someone. So it drops the people you served recently, the ones who opted out, and the ones with no working phone or email — and keeps the customers with a real reason to hear from you.",
      },
      {
        title: "Each group gets a reason that fits them",
        description:
          "Someone overdue for routine service doesn't need the same message as someone who had a big job done and never booked the follow-up. The copy is drafted per group, in your voice, with one clear next step and an easy way out.",
      },
      {
        title: "It goes out to the shortlist, not the list",
        description:
          "Text first, email as a fallback, sent under your name with a working opt-out that gets honoured. It goes out over a window rather than all at once, so the replies don't all land while you're on a roof.",
      },
      {
        title: "Replies turn into jobs on the calendar",
        description:
          "When someone answers, the thread handles the back-and-forth and books against your real availability. Anything it can't handle cleanly comes to you with the whole conversation attached.",
      },
      {
        title: "You see what it actually recovered",
        description:
          "Who got contacted, who replied, who booked, and what work came out of it — all logged, so you can judge the campaign on what it brought back instead of on how it felt.",
      },
    ],
    faq: [
      {
        q: "Won't this annoy people? Isn't it just spam?",
        a: "It is spam if you send it to everyone — which is exactly what this doesn't do. The segmenting step exists to throw most of your list away: anyone you've served recently, anyone who opted out, anyone you can't reach cleanly. What's left are customers with an actual reason to hear from you, and every message carries a real opt-out that we honour. If your gut says your customers would resent this, take that seriously and say so on the call — we'd look at your list before building anything.",
      },
      {
        q: "Does a campaign like this actually bring work back?",
        a: "Sometimes, and it depends far more on your list and your timing than on the software. Sending an offer to people who aren't due for anything doesn't produce bookings — it produces opt-outs, and it can cost you customers you'd otherwise have kept. That's why the build starts with your data and what \"due\" means for your business, not with a clever message.",
      },
      {
        q: "My customer list is a mess. Half of it lives in spreadsheets.",
        a: "That's normal, and it's workable. Whether it's in QuickBooks, Jobber, Housecall Pro, or a folder of spreadsheets, it can be imported — dealing with the mess is part of what the segmenting does. What can't be fixed is contact details you never collected; those records just get dropped rather than guessed at.",
      },
      {
        q: "I don't want to discount my work.",
        a: "Then don't. The reason doesn't have to be money off — for some businesses it's a seasonal check, a slot that's normally hard to get, or simply a heads-up that they're due. The point is a reason that's worth acting on. If a discount is the only reason you can think of, that usually means the timing is wrong, not that the discount needs to be bigger.",
      },
      {
        q: "How long does it take to build?",
        a: "Longer than the missed-call one. Most of the time goes into your list rather than the automation — getting the export right, agreeing what counts as overdue, and settling on what's worth offering. Typically a few weeks from the discovery call to the first campaign going out.",
      },
    ],
  },
  {
    slug: "missed-call-text-back",
    label: "Missed-Call Text-Back",
    icon: FaCommentDots,
    cardSummary: "Instant reply so leads don't call a competitor",
    hasDemo: true,
    published: true,
    hero: {
      headline: "A missed call doesn't wait for you to call back",
      subhead:
        "When your phone rings and nobody picks up, some callers leave a voicemail. Others just dial the next company on the list. This texts them back in seconds, answers their questions, and books the job while you're still up a ladder.",
    },
    stats: [],
    painPoints: [
      "You're on a job, the phone rings, and there's nobody in the office to answer it.",
      "Voicemails pile up until the evening — by then the caller has booked someone else.",
      "You call back the next morning and hear \"we already went with another company.\"",
      "You have no idea how many calls you missed last week, or what they were worth.",
    ],
    mechanism: [
      {
        title: "The call comes in — and goes unanswered",
        description:
          "The automation watches your business line. Nobody has to remember to do anything; the missed call itself is the trigger.",
      },
      {
        title: "A text goes out in seconds",
        description:
          "The caller gets a real reply while your business is still the one they're thinking about — not a voicemail greeting promising you'll call back.",
      },
      {
        title: "The conversation qualifies itself",
        description:
          "An AI-assisted text thread asks what they need, where they are, and how urgent it is — in your voice, using your service area and your pricing rules.",
      },
      {
        title: "The job gets booked",
        description:
          "Qualified leads land on the calendar against your real availability. You get the details, not the back-and-forth.",
      },
      {
        title: "You get pinged, not pestered",
        description:
          "A single alert lands with the caller's number, what they wanted, and what got booked. No live back-and-forth to sit through — you see the outcome, and you can step in if you want to.",
      },
      {
        title: "You see what it caught",
        description:
          "Every missed call, reply, and booking is logged, so you can see what the automation recovered instead of guessing.",
      },
    ],
    faq: [
      {
        q: "Will customers know they're texting a robot?",
        a: "The thread is written in your voice, and it never pretends to be a person sitting in your office. Most callers just want a fast, accurate answer — that's what they get. Anything it can't handle cleanly gets handed to you with the whole conversation attached.",
      },
      {
        q: "Does this replace my answering service?",
        a: "It doesn't have to. Plenty of businesses run both: the text-back catches the callers who'd never leave a voicemail, and the answering service handles the ones who want a person. If you'd rather it replace one, we can scope that.",
      },
      {
        q: "What if I'd rather call people back myself?",
        a: "Then it texts them to say you'll call right back, and alerts you with the number and whatever it already knows about the job. The point is that the caller hears from you in seconds — not that a machine has to handle it.",
      },
      {
        q: "Do I need to change my phone system?",
        a: "Almost never. It works with the number you already publish and sits alongside your existing setup rather than replacing it.",
      },
      {
        q: "How long does it take to build?",
        a: "This is usually the fastest one to stand up — typically a couple of weeks from the discovery call to live, depending on how much qualification logic you want in the thread.",
      },
    ],
  },
  {
    slug: "review-generation",
    label: "Review Generation",
    icon: FaStar,
    cardSummary: "A steady stream of 5-star reviews, hands-off",
    hasDemo: true,
    published: true,
    hero: {
      headline:
        "Your best work is invisible to the person deciding whether to call you",
      subhead:
        "Plenty of happy customers just get on with their day, and the review never gets written. The unhappy ones are often motivated enough to post without being asked. This asks everyone how it went, points the happy ones at Google, and routes the unhappy ones to you — while there's still a problem you can fix.",
    },
    stats: [
      {
        value: "97%",
        label: "of US consumers read online reviews for local businesses",
        source: "BrightLocal, 2026",
        sourceUrl:
          "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
      {
        value: "74%",
        label:
          "of US consumers look for reviews written in the last three months",
        source: "BrightLocal, 2026",
        sourceUrl:
          "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
    ],
    painPoints: [
      "You know the job went well — the customer said so at the door — and the review never appeared.",
      "You mean to ask while you're standing there, and you've forgotten by the time you're back in the van.",
      "Your Google page is thin and stale, and the newest thing on it is a complaint.",
      "You find out a customer was unhappy by reading about it on Google, long after you could have put it right.",
    ],
    mechanism: [
      {
        title: "The job wraps up",
        description:
          "The automation watches however you already mark work complete. Nobody has to remember to kick anything off; finishing the job is the trigger.",
      },
      {
        title: "They get asked while it's fresh",
        description:
          "A short text asks how the visit went — a real question in your voice, not a link demanding stars. It goes out once the customer has had a chance to look at the work, and it goes to everyone.",
      },
      {
        title: "The reply gets read, not counted",
        description:
          "An AI-assisted step reads what they actually wrote — the tone, and the specifics they mention. What happens next depends on what they said, not on a box they ticked.",
      },
      {
        title: "Happy customers get a shortcut, not a script",
        description:
          "If they're genuinely pleased, they get a link straight to your Google review box with a draft built from what they just told you, in their own words. It's theirs to edit, replace, or ignore — the point is to remove the blank-box friction that stops a happy customer who meant to post.",
      },
      {
        title: "Unhappy customers get you, not a form",
        description:
          "A lukewarm or negative reply doesn't get handed a review link — it gets you. An alert lands with who said it and what went wrong, while there's still time to make it right. Nothing stops them posting publicly if they still want to; they just hear from you first.",
      },
      {
        title: "You see what it actually did",
        description:
          "Requests sent, replies, reviews posted, and problems caught are all logged — so you can see what the automation moved and what it flagged, instead of guessing.",
      },
    ],
    faq: [
      {
        q: "Isn't this filtering out the bad reviews? Doesn't Google ban that?",
        a: "Google's rule is about selective solicitation — asking only the customers you expect to be happy, or discouraging the unhappy ones from posting. This does neither. Everyone who has a job done gets asked how it went, and nobody is blocked from Google: the review link is public, and an unhappy customer can post whatever they like, whenever they like. What changes is that they hear from you before they've decided what to write. If you'd rather the review link go to everyone regardless of the reply, say so on the call and that's how we'll build it — it's your call, not a hidden default.",
      },
      {
        q: "Are you writing fake reviews for me?",
        a: "No. The draft is assembled from what the customer actually told you, in their own words, and it lands in their hands before anything is posted. They can edit it, bin it and write their own, or write nothing at all. If they didn't say it, it doesn't go in the draft.",
      },
      {
        q: "Won't my customers find being asked annoying?",
        a: "It's a short text after the job, and it stops there — no chasing them afterwards. It reads as a question about the work rather than a demand for stars, and the ones who don't want to answer simply don't.",
      },
      {
        q: "What if my scheduling software already does review requests?",
        a: "A lot of them will blast a link at everyone who's had a job done. If that's working for you, keep it. The difference here is the reading step — noticing that a customer isn't happy and getting you involved instead of handing them a review form. If your existing tool does that, you don't need me to build it.",
      },
      {
        q: "How does it know the job is finished?",
        a: "It hooks into whatever you already use to close a job out — your scheduling tool, your invoicing, or something as simple as a text you send yourself. We find the trigger that fits how you already work rather than making you change how you work.",
      },
    ],
  },
  {
    slug: "automated-quoting",
    label: "Automated Quoting",
    icon: FaFileInvoiceDollar,
    cardSummary: "From intake to a ready-to-send quote",
    hasDemo: true,
    published: true,
    hero: {
      headline: "The quote can't go out until you've had a spare evening",
      subhead:
        "A request comes in during the day, and the pricing gets done after dinner — if it gets done. By the time it's typed up and sent, the customer has had time to go cold or call someone else. This reads the request, builds an itemized quote from your own pricing, and puts it in front of you to approve before it goes anywhere.",
    },
    stats: [],
    painPoints: [
      "You're still hand-figuring an estimate at the kitchen table, because the day was full of actual work.",
      "A quote request sits in the inbox for days — not because you don't want the job, but because there's no time to price it.",
      "You eyeball the materials and the crew hours, then find out on site what you missed.",
      "Your quotes look different every time, and you'd struggle to say what you sent out last month or how much of it turned into work.",
    ],
    mechanism: [
      {
        title: "The request lands, whatever form it takes",
        description:
          "A website form, an email, or a text with barely any detail in it. The automation picks it up the moment it arrives — nobody has to notice it, forward it, or write it on the back of something.",
      },
      {
        title: "It reads what the customer actually wrote",
        description:
          "People describe jobs in their own words, not in tidy fields. The automation pulls out the scope — the size of the job, the access, the awkward items — and marks what still needs confirming on site.",
      },
      {
        title: "The quote gets built from your prices, not a guess",
        description:
          "Every line comes off your own rate card: crew and hours, travel, and the surcharges this particular job actually needs. It comes out itemized, so the customer sees what they're paying for instead of a bare total.",
      },
      {
        title: "It stops and waits for you",
        description:
          "Nothing reaches the customer until you've seen it. The draft lands with the scope and every line priced — you approve it, change a line first, or bin it. The automation writes the quote; you're still the one who signs off on the price.",
      },
      {
        title: "It goes out while the job is still fresh in their mind",
        description:
          "Once you approve, the quote sends itself and the reply comes back to the same place. When the customer accepts, the job and the agreed price are on record rather than buried in a text thread you'll be scrolling for later.",
      },
      {
        title: "You see what it actually did",
        description:
          "Requests in, quotes out, what got accepted, and what it was worth. You can look back at a month of quoting and read it, instead of trying to remember it.",
      },
    ],
    faq: [
      {
        q: "Every job is different — how can software price mine?",
        a: "It doesn't invent prices, and it isn't guessing at your trade. It works from the pricing rules you already use — your rate card, your travel bands, your surcharges — applies them to the job in front of it, and hands you the draft before anything goes out. Where it earns its keep is the routine work you could price in your sleep and just don't have the evening to type up. A genuinely unusual job will still need you, and honestly it should — there, the automation's job is to get the scope on paper and stay out of your way.",
      },
      {
        q: "What if it gets a price wrong and sends it to my customer?",
        a: "It can't send anything you haven't approved — that's what the review step is for. A wrong price is almost always a wrong rule, so when one shows up we fix the rule rather than telling you to check more carefully.",
      },
      {
        q: "My pricing isn't really written down anywhere. Does that kill this?",
        a: "No, and it's more common than not. Plenty of owners keep their pricing in their head and in a spreadsheet that's mostly right. Getting it out and agreeing on the rules is a real part of the build — and owners tend to find that part useful on its own, whatever they do with the automation afterwards.",
      },
      {
        q: "Will customers be able to tell a machine wrote it?",
        a: "The quote looks like your quote — your line items, your terms, your name on it, and a price you approved. What changes is when it arrives, not who it's from.",
      },
      {
        q: "How long does it take to build?",
        a: "That depends less on the software than on your pricing. If the rules are already clear, it moves quickly; if they need untangling first, that's the longer part of the job. We work it out on the discovery call rather than guess at it here, and the scope we agree up front is the scope you get.",
      },
    ],
  },
  {
    slug: "invoice-reminders",
    label: "Invoice & Payment Reminders",
    icon: FaMoneyBillWave,
    cardSummary: "Get paid without chasing",
    hasDemo: true,
    published: true,
    hero: {
      headline: "The work is finished. The money is still sitting with the customer.",
      subhead:
        "Once the invoice goes out, remembering it becomes your job. So you either spend an evening working out who still owes you and writing texts you'd rather not send, or you let it ride and hope. This follows up on its own schedule, in a tone you'd be happy to put your name to, and stops the moment they pay.",
    },
    stats: [
      {
        value: "39%",
        label:
          "of all US small businesses say customers being slow to pay is a payments challenge — second only to payment processing fees",
        source: "Federal Reserve Banks Small Business Credit Survey, 2024",
        sourceUrl:
          "https://www.fedsmallbusiness.org/-/media/project/clevelandfedtenant/fsbsite/reports/2024/2024-report-on-payments_sbcs.pdf",
      },
      {
        value: "64%",
        label:
          "of US small businesses that invoice after delivery say the same",
        source: "Federal Reserve Banks Small Business Credit Survey, 2024",
        sourceUrl:
          "https://www.fedsmallbusiness.org/-/media/project/clevelandfedtenant/fsbsite/reports/2024/2024-report-on-payments_sbcs.pdf",
      },
    ],
    painPoints: [
      "You start typing the \"just checking in\" text, delete it, and decide to leave it for now — this is a customer you'll be back out to see next season.",
      "You couldn't say who still owes you without opening the accounting software and reading down the list.",
      "Payroll is due Friday. The work is done, the invoice went out, and the cash is still on someone else's kitchen counter.",
      "You finally call, and they tell you they never got the invoice — so it goes out again and the waiting starts over.",
    ],
    mechanism: [
      {
        title: "The due date passes without a payment",
        description:
          "The automation watches your invoices. Nobody has to notice it went past due or add it to a list — the invoice slipping is the trigger.",
      },
      {
        title: "A follow-up gets planned, not blasted",
        description:
          "It reads the invoice and what you know about that customer, then sets out the follow-up: a heads-up before the due date, a nudge after it, a firmer reminder later, and the point where it stops and hands the invoice to you.",
      },
      {
        title: "The reminders get written in your voice",
        description:
          "Each message is written in the tone that stage calls for — warm early on, clear and professional later, direct without being rude. Every one carries a pay link, so settling up takes a tap instead of a phone call.",
      },
      {
        title: "They go out on time, and get firmer — not louder",
        description:
          "Escalating means each reminder is a little more direct than the last. It doesn't threaten anyone, doesn't mention collections, and doesn't pester. When an invoice reaches the point where a real conversation is warranted, the automation stops messaging and hands it to you for a personal call — and you decide where that line sits.",
      },
      {
        title: "They pay, and the chasing stops",
        description:
          "The payment lands and the sequence ends there. No stray reminder going out to someone who already paid you last night — which is the thing that makes follow-up look automated and makes good customers wince.",
      },
      {
        title: "You see what it actually recovered",
        description:
          "Every invoice, reminder, and payment is logged. You can see what came in on its own, what needed a call from you, and which customers keep needing one — instead of guessing.",
      },
    ],
    faq: [
      {
        q: "Won't automated chasing annoy good customers I want to keep?",
        a: "It can, if it's set up badly — that's a real risk, so it's worth being straight about. The tone and the timing are yours to set, and the early messages are deliberately warm — a customer who's late isn't necessarily a customer who won't pay, and the follow-up shouldn't treat them like one. It stops the second they pay, and you can exclude any customer entirely. The honest limit is that an automation can't read a room: if you know a customer is going through something, pull them out and handle it yourself. That's a decision you keep.",
      },
      {
        q: "Does this send people to collections?",
        a: "No. It's follow-up, not debt collection, and it doesn't hand anything to a third party or threaten to. It's built to stop where a human conversation should start — the last step is a personal call from you, not a harder letter.",
      },
      {
        q: "What if a customer replies to say the bill is wrong?",
        a: "The sequence stops and the reply comes to you with the invoice attached. A dispute is a conversation, and it's not one an automation should be having on your behalf.",
      },
      {
        q: "Do I have to change my accounting or invoicing software?",
        a: "Usually not. It reads the invoices where they already live — QuickBooks, Xero, Jobber, ServiceTitan and the like — and sits alongside your setup rather than replacing it. If your tool doesn't expose what we need, we'll tell you that on the call rather than after you've paid for a build.",
      },
      {
        q: "How long does it take to build?",
        a: "It depends on how many stages of follow-up you want and what your invoicing tool lets us read. We scope it on the discovery call and agree it up front — real, robust engineering, and no surprise bills.",
      },
    ],
  },
  {
    slug: "new-customer-onboarding",
    label: "New-Customer Onboarding",
    icon: FaUserPlus,
    cardSummary: "Welcome, docs, and scheduling handled",
    hasDemo: true,
    published: true,
    hero: {
      headline: "A new customer signs up, and then hears nothing until you turn up",
      subhead:
        "The welcome you meant to send, the agreement you meant to chase, the gate code nobody thought to ask for — it all lands on you at the end of a long day, or it doesn't land at all. This sends the welcome the moment they book, collects the paperwork and the access details in one message, and gets the first visit on the calendar before you've read the notification.",
    },
    stats: [],
    painPoints: [
      "You meant to send a proper welcome the night they signed up. It's Wednesday and it's still sitting in your drafts.",
      "Your tech is standing at the property and the service agreement still hasn't been signed.",
      "You show up for the first visit and nobody's home, because the customer was never sure which day you were coming.",
      "You're texting a new customer from the driveway asking for a gate code you should have had before you left the shop.",
    ],
    mechanism: [
      {
        title: "The booking itself starts it",
        description:
          "The automation watches your booking form and your scheduler. Nobody has to remember to kick anything off — the signup is the trigger, whether it comes in on a Tuesday morning or a Saturday night.",
      },
      {
        title: "The welcome gets written in your voice",
        description:
          "It reads what they actually booked — the service, the property, how they'd like to be visited — and writes a welcome that names it back to them, along with who's coming and what happens on the visit. Not a template with their name pasted at the top.",
      },
      {
        title: "Everything they need gets gathered in one place",
        description:
          "It works out what a new customer of yours needs before the first visit, fills in what the booking already told it, and flags the rest — the agreement to sign, the gate code, anything only the customer can give you.",
      },
      {
        title: "It goes out while they're still thinking about you",
        description:
          "Text and email, sent the moment they book, with the agreement as a one-tap sign and the access question in the same message. They're not hunting through a portal to find it.",
      },
      {
        title: "The first visit lands on the calendar",
        description:
          "It offers a slot against your real availability and the right route, books it when they confirm, and reminds them the day before. You didn't touch the calendar.",
      },
      {
        title: "You see what it actually did",
        description:
          "Which customers were welcomed, which agreements came back signed, which packets are still waiting on something. Chasing becomes a decision you make rather than a thing you remembered.",
      },
    ],
    faq: [
      {
        q: "Won't an automated welcome feel impersonal? The personal touch is the whole point for a small business.",
        a: "That's a fair worry, and we won't pretend otherwise — a message assembled by software isn't the same as you picking up the phone, and it shouldn't claim to be. What it does is take the parts that are identical from one customer to the next off your plate: the packet, the agreement, the scheduling link, the access question. Nobody feels warmth from those; they only notice when they're missing. The personal touch stays yours to give, and you'll have more room to give it because you're not rewriting the same welcome from scratch at the end of a long day.",
      },
      {
        q: "Can I read the welcome before it goes out?",
        a: "If you want to. Some owners have it hold new welcomes for a quick look until they trust the voice, then let it send on its own. Others want it out the moment someone books and would rather review after the fact. Either way, you can see exactly what went out.",
      },
      {
        q: "What if a customer ignores the agreement or never sends the gate code?",
        a: "The packet stays open and it follows up on a schedule you set, instead of the item quietly falling off your list. If it still hasn't come back before the visit, it tells you — so your tech isn't the one who finds out at the property.",
      },
      {
        q: "Do I have to move my booking form or my scheduler?",
        a: "Usually not. It sits on top of the tools you already use — your booking form, your calendar, whatever holds your customer records — and reads from them rather than replacing them. If something you rely on genuinely can't be connected, we'll tell you on the call rather than after.",
      },
      {
        q: "My customers aren't all alike — a commercial account needs different paperwork than a homeowner.",
        a: "Then it branches. The packet is built from rules you give us, so a commercial account can pull a different agreement, a different set of contacts, and a different first-visit window than a residential one. Getting those rules right is a good part of what the discovery conversation is for.",
      },
    ],
  },
  {
    slug: "job-dispatch",
    label: "Job Scheduling & Dispatch",
    icon: FaTruck,
    cardSummary: "Right job, right person, customer notified",
    hasDemo: true,
    published: true,
    hero: {
      headline:
        "The schedule you rebuild by hand costs you drive time and the customer's patience",
      subhead:
        "Calls land overnight, an emergency comes in before you've finished your coffee, and the board gets rearranged until it roughly works. Your techs drive further than they need to, and the customer gets an arrival window wide enough to swallow their morning. This sorts the pile against skills, zones, and the windows you've already promised, routes each van, and tells the customer when to expect someone.",
    },
    stats: [],
    painPoints: [
      "You start the morning rearranging the whiteboard, because the calls that landed overnight don't fit the day you'd already worked out.",
      "Your vans cross paths on the highway, each heading for a job the other one just drove past.",
      "The customer rings the office to ask where the van is, and nobody can answer without phoning the tech to find out.",
      "A burst pipe comes in early and the rest of the day gets rebuilt around it by hand, while the phone keeps ringing.",
    ],
    mechanism: [
      {
        title: "Before anyone gets in a van",
        description:
          "Overnight calls, carry-overs, and the emergency that just landed all show up in the same place — each with the skill it needs, where it is, and the window the customer was promised.",
      },
      {
        title: "Each job finds the right tech",
        description:
          "The automation reads the pile against your crew's specialties, zones, and workload — the heater installs go to your heater person, the drain work goes east, the emergency gets bumped to the front. It shows you the reasoning behind each assignment rather than just handing you a grid.",
      },
      {
        title: "The driving gets planned, not guessed",
        description:
          "Each tech's stops get put in an order that cuts drive time — nearby jobs batched together, fixed windows honoured — so a van isn't crossing town for a job a colleague already drove past.",
      },
      {
        title: "The day lands on the crew's phones",
        description:
          "Their stops, in order, with the job details attached, on the phone they already carry. No group text, no dispatcher reading addresses down the line.",
      },
      {
        title: "The customer hears it from you first",
        description:
          "The customer hears who's coming and when, then again when the van is close. A tighter, accurate window is a morning they can work around; a vague one is a morning they lose — and that difference turns up in how they rate the job afterwards. It's also the step that quietly gets skipped when the dispatcher is busy.",
      },
      {
        title: "You see what it actually did",
        description:
          "Every assignment, route, and customer message is logged — what got placed, what the vans drove, which windows were hit. Tomorrow's plan gets built on what happened, not on what the whiteboard said.",
      },
    ],
    faq: [
      {
        q: "My scheduling is judgement — I know which tech to send. Why would I hand that to software?",
        a: "You wouldn't, and this doesn't ask you to. It applies the rules you give it — who's certified for what, who owns which zone, which customers want a particular tech — and it hands you the plan before anything goes out. You can override any assignment, and the override sticks. What comes off your plate is the routine reshuffling: the ordering, the batching, the redoing it when another call comes in. The judgement calls stay yours.",
      },
      {
        q: "What happens when an emergency blows up the plan?",
        a: "That's the case it's built for. The emergency goes to whoever's certified and closest, and the rest of the day reflows around it — the customers whose windows moved get told, rather than finding out when nobody shows up. You still decide what counts as an emergency. It works out what that means for the other stops.",
      },
      {
        q: "Won't it route someone somewhere stupid?",
        a: "Sometimes — a road it doesn't know is shut, a site where the access is round the back. Your techs can reorder their own stops, and the rule that caused it gets fixed. It's a plan you can argue with, not one you're stuck following.",
      },
      {
        q: "Do my techs have to learn new software?",
        a: "They get their stops on the phone they already carry. If you're running a field-service app, this works alongside it rather than replacing it. If you're not, the crew's side is a list and a confirm button.",
      },
      {
        q: "How long does it take to build?",
        a: "Longer than a text-back, because the work is in getting your rules right — zones, skills, what counts as urgent, who gets told what. Discovery first, then a build against your real schedule, then we run it beside your current process before anything depends on it.",
      },
    ],
  },
  {
    slug: "weekly-owner-reports",
    label: "Weekly Owner Reports",
    icon: FaChartLine,
    cardSummary: "The numbers that matter, in your inbox",
    hasDemo: true,
    published: true,
    hero: {
      headline: "You find out about a bad month once it's already over",
      subhead:
        "The numbers exist — they're just scattered across your job software, your invoicing, and your calendar, and pulling them together is a job nobody has time for. This gathers them every week and puts a short, readable summary in your inbox. What you do about it is still your call.",
    },
    stats: [],
    painPoints: [
      "Your jobs live in one system, your invoices in another, and your calendar somewhere else — none of them talk to each other.",
      "You've been meaning to build a spreadsheet that pulls it all together since last year.",
      "You had a feeling last month was slow, but you couldn't say whether it actually was.",
      "By the time you look at the numbers, the week you'd want to ask about is long gone.",
    ],
    mechanism: [
      {
        title: "It collects the week's numbers for you",
        description:
          "The automation pulls from the tools you already use — jobs booked, work completed, invoices sent and paid, quotes still open. Nobody has to export anything or remember to run a report.",
      },
      {
        title: "It reads what moved",
        description:
          "An AI pass compares this week against the weeks before it, surfaces what changed, and flags anything that looks off — an unpaid invoice sitting too long, a quote nobody chased. It doesn't know your business the way you do, and it can miss context a person wouldn't. It tells you what moved; you decide what it means.",
      },
      {
        title: "It writes it in plain English",
        description:
          "Not a dashboard, not a wall of charts. A few short paragraphs you can read on your phone in the truck, with the underlying numbers there if you want to dig in.",
      },
      {
        title: "It lands in your inbox on a schedule",
        description:
          "Same day, same time, every week — Monday morning, Friday afternoon, whatever fits how you work. It shows up whether the week was good or bad.",
      },
      {
        title: "You can act straight from the email",
        description:
          "If something needs chasing, the report gives you a button for it — send the invoice reminder, follow up on the quote. You don't have to go find the right tool and log in.",
      },
      {
        title: "You see what it actually did",
        description:
          "Everything the report pulled, flagged, and sent is logged, so you can check its work against the source numbers rather than taking it on faith.",
      },
    ],
    faq: [
      {
        q: "I already know how my business is doing. Why do I need an email?",
        a: "You might well have a good read on the shape of things — the report isn't there to tell you something you don't know. It's there so the numbers are in front of you without you assembling them, and so the weeks you were only half-sure about become weeks you can check. If you read it and it says what you expected, that's a fine outcome.",
      },
      {
        q: "How do I know the AI's summary is right?",
        a: "It reports what your tools recorded. If a job was closed out wrong or an invoice never got entered, the summary will be wrong in the same way — it can't see what isn't there. That's why every figure links back to the underlying record, so you can check anything that looks strange. It's a reading of your data, not an audit of it.",
      },
      {
        q: "What if my numbers are a mess to begin with?",
        a: "Then the report will show you that, which is usually the useful part. We look at what your tools actually hold during the discovery call and tell you straight if the data isn't there yet. Sometimes the honest answer is to fix how work gets logged first.",
      },
      {
        q: "Does this work with the software I already have?",
        a: "Usually. Job-management, invoicing, and calendar tools generally have a way to read data out of them, and this is real, robust engineering rather than brittle no-code that breaks when a vendor changes something. If one of your tools genuinely can't be read, we'll tell you before you commit to anything.",
      },
      {
        q: "Can I change what's in it?",
        a: "Yes. The first version is a starting point — once you've read a few, you'll want something added or something dropped. Adjusting what it tracks is expected, not an extra project.",
      },
    ],
  },
  {
    slug: "tool-sync",
    label: "Tool-to-Tool Sync",
    icon: FaSyncAlt,
    cardSummary: "Stop retyping the same data twice",
    hasDemo: true,
    published: true,
    hero: {
      headline: "Your tools disagree about the same customer",
      subhead:
        "The job details get typed into the scheduler, then typed again into the invoice, then again into the books. Somewhere along the way a digit changes, a record gets created that already existed, and the tools stop agreeing about what happened. This moves the information between them, so it gets entered in one place and lands wherever it's needed.",
    },
    stats: [],
    painPoints: [
      "You type the customer's address into the scheduler, then type the same address into the invoice — and one of them ends up with a typo.",
      "You search for a customer and find duplicate records with different phone numbers on them, and no way to tell which one is current.",
      "The job is marked done in the field app but still shows as open in the office, so someone calls the customer about work that's already finished.",
      "A job gets completed and invoiced but never makes it into accounting — you find out when the books don't balance.",
    ],
    mechanism: [
      {
        title: "The job gets entered in one place",
        description:
          "Wherever you already work — the booking form, the scheduler, a phone call written up afterwards — that entry is the trigger. Nobody has to remember to copy it anywhere else.",
      },
      {
        title: "It gets reshaped for each tool",
        description:
          "Your scheduler wants a service address. Accounting wants a billing contact. The field app wants a job type. The same information gets turned into what each tool actually expects, instead of being force-fed a format it quietly rejects.",
      },
      {
        title: "Duplicates get caught before anything is written",
        description:
          "This is where naive sync does damage — creating a duplicate record for a customer you already have, or overwriting a good phone number with a stale one. Before it writes, it checks whether the customer or job already exists, matching on the things that actually identify people: phone, address, name variants. A confident match updates the record you have. An uncertain match — close name, different street — doesn't get guessed at. It stops and asks you.",
      },
      {
        title: "The write happens, and it gets checked",
        description:
          "Each tool gets its update, and the automation confirms it landed. If a tool is down or rejects the write, it retries and tells you — rather than dropping the record and leaving you to discover the gap later. That's the difference between real engineering and brittle sync that fails quietly.",
      },
      {
        title: "You see what moved, and what didn't",
        description:
          "Every record it created, updated, or held back is logged with what changed. Anything it wasn't sure about is waiting for you with the reason attached, so you're reviewing the exceptions instead of auditing your own software.",
      },
    ],
    faq: [
      {
        q: "What happens when it syncs the wrong thing, or creates a duplicate?",
        a: "That's the failure people have usually already been burned by, so it's the part we build against first. The rule is that it doesn't guess: a confident match updates the existing record, and an uncertain one stops and waits for you instead of writing. Every change is logged with what the record looked like before, so a bad write can be traced and reversed rather than becoming a mystery. It can still get something wrong — if you genuinely have customers sharing a surname and a street, no system reads minds. But it gets it wrong out loud, in a queue you can see, instead of silently.",
      },
      {
        q: "What if I change tools later?",
        a: "Then that side of the integration has to change with it. This gets built against the tools you actually run, so swapping one out means rebuilding the connection to it — that's real work and we won't pretend otherwise. It's a known, scoped piece of work rather than a hidden cost, and the rest of the setup keeps running while it's done.",
      },
      {
        q: "Doesn't my software already do this?",
        a: "Sometimes it does, and if it does you should use it — we'll tell you that on the call rather than build something you don't need. What we build is for the gaps: tools with no connection between them at all, or a built-in one that only carries part of what you need and leaves you retyping the rest.",
      },
      {
        q: "Which way does the information flow?",
        a: "Whichever way you decide. For each piece of information we agree which tool you trust for it — maybe the field app is right about what work was done, and accounting is right about the billing address — and it flows out from there. That decision is yours, made up front, not something the automation makes on your behalf.",
      },
      {
        q: "Isn't this just a no-code connector?",
        a: "No-code connectors are fine until your data comes in a shape they didn't expect or a tool times out mid-write. Then they tend to fail without saying so, and you find out long after the damage is done. What we build checks its own writes, retries what's worth retrying, and escalates what it can't handle. It's more work up front than clicking apps together, and it holds up.",
      },
    ],
  },
];

export const workflowPath = (slug: string): string =>
  `/services/automated-workflows/${slug}`;

export const workflowDemoPath = (slug: string): string =>
  `${workflowPath(slug)}/demo`;

export const getWorkflow = (slug: string): Workflow | undefined =>
  workflows.find((workflow) => workflow.slug === slug);
