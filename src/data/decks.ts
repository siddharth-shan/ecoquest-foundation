import type { Slide } from '@/components/shared/SlideDeck'

// Slide content for the online seminar series, keyed by seminar slug.
//
// Guidance for whoever presents these: every factual claim below is either a
// definition, a named public data source, or a method. Where a live number
// would help the audience, the speaker notes say "look this up before the
// session" rather than baking in a figure that will be stale or wrong. Do not
// add statistics you have not personally checked against a cited source.

export const decks: Record<string, Slide[]> = {
  'wildfire-data': [
    {
      eyebrow: 'EcoQuest Online Seminar Series',
      title: 'Reading Real Wildfire Data',
      callout:
        'Wildfire data is public and free. Almost nobody knows how to read it. In 40 minutes, you will.',
      notes:
        'Welcome people as they join. Say who you are, that EcoQuest is a student-led nonprofit, and that this session is recorded. Ask in chat: has anyone here ever checked a fire map during an actual fire near them? Use the answers to set the tone — this is practical, not abstract.',
    },
    {
      eyebrow: 'Why this matters',
      title: 'The information exists. The literacy does not.',
      bullets: [
        'During a fire, most people get information from social media reshares — often hours old and stripped of context.',
        'The official data is published continuously, for free, by agencies you already pay for.',
        'Misreading it causes two failures: panicking when you are safe, and relaxing when you are not.',
      ],
      notes:
        'Keep this slide short. The point is motivation, not doom. Avoid naming specific recent fires unless you have checked the details — getting a detail wrong here costs you credibility for the whole session.',
    },
    {
      eyebrow: 'The sources',
      title: 'Where the data actually comes from',
      bullets: [
        'CAL FIRE incident pages — official California incident reports: acreage, containment, evacuation orders.',
        'InciWeb — the interagency incident information system, used across federal fires.',
        'NASA FIRMS — satellite thermal hotspot detections from the VIIRS and MODIS instruments.',
        'AirNow (EPA) — official air quality index readings from regulatory monitors.',
        'PurpleAir — dense network of low-cost citizen sensors; more coverage, less calibration.',
      ],
      notes:
        'Have all five open in tabs before the session starts. Do not try to find them live. Mention that FIRMS is the one most people have never heard of and it is the most interesting — you can see the fire from orbit.',
    },
    {
      eyebrow: 'The most misread number',
      title: 'Containment is not extinguishment',
      callout:
        '"50% contained" means a control line is established around half the fire\'s perimeter. It does not mean half the fire is out.',
      bullets: [
        'A control line is a barrier — cleared ground, a road, a river — that the fire is not expected to cross.',
        'A fire can be 90% contained and still burning intensely inside the line.',
        'Containment can go down as well as up, when a line fails.',
        'Acreage tells you size. Containment tells you control. They are independent.',
      ],
      notes:
        'This is the single highest-value slide in the deck. Spend real time here. Ask the audience what they thought it meant before you explain it — most people say "half put out." That moment of surprise is what makes the session memorable.',
    },
    {
      eyebrow: 'Satellite data',
      title: 'What a hotspot pixel really is',
      bullets: [
        'FIRMS shows thermal anomalies — places where a satellite sensor detected unusual heat.',
        'Each detection covers a wide area on the ground, so one dot is not one campfire.',
        'Satellites pass overhead a few times a day, so the map has gaps in time, not a live feed.',
        'False positives happen: gas flares, industrial heat, and hot bare ground all register.',
      ],
      notes:
        'The key idea is resolution and revisit time. Analogy that works well: it is like getting four photographs a day from very far away, not a video. Ask students why that matters for deciding whether to evacuate.',
    },
    {
      eyebrow: 'Air quality',
      title: 'AQI, and why two apps disagree',
      bullets: [
        'AQI is an index, not a raw measurement — it converts pollutant concentration into a 0-500 scale.',
        'For wildfire smoke, the pollutant that matters is PM2.5: particles small enough to reach deep into the lungs.',
        'Regulatory monitors are accurate but sparse. Citizen sensors are dense but need correction.',
        'When two apps disagree, check whether they are using the same sensor network and the same averaging window.',
      ],
      notes:
        'People find the disagreement between apps genuinely confusing and slightly conspiratorial. Explaining averaging windows — one hour vs. 24 hours — usually resolves it for them on the spot.',
    },
    {
      eyebrow: 'Live walkthrough',
      title: 'Wildfire Watch',
      callout: 'The app EcoQuest students built, and what we learned building it.',
      bullets: [
        'Where we pull data from, and how often it refreshes.',
        'The design decisions: what to show, and more importantly what to leave out.',
        'What we got wrong in the first version.',
      ],
      notes:
        'Screen-share the app here and actually click through it. Be honest about limitations — saying "this part is not good yet" builds more trust than a polished pitch, and it models real engineering thinking for the students watching.',
    },
    {
      eyebrow: 'Do this at home',
      title: 'Check the conditions where you live',
      bullets: [
        'Find your nearest AirNow monitor and note how far away it actually is.',
        'Look up whether your address is in a designated fire hazard severity zone.',
        'Find your county\'s official emergency alert signup — most people have never enrolled.',
        'Bookmark one incident page and one air quality page. Two tabs, that is the whole system.',
      ],
      notes:
        'Give people two full minutes to actually do the alert signup during the session. Doing it live is the difference between a talk and a thing that changed someone\'s preparedness.',
    },
    {
      eyebrow: 'Wrap up',
      title: 'What to take away',
      bullets: [
        'Containment measures control of the perimeter, not how much fire is left.',
        'Satellite hotspots are periodic snapshots at coarse resolution, not a live feed.',
        'AQI depends on which sensors and which time window — check before you trust a number.',
        'Every source in this session is free and public.',
      ],
      notes:
        'Then: questions. Leave at least eight minutes. Mention the next session date and the Eventbrite link, and ask people to bring one friend.',
    },
    {
      eyebrow: 'Thank you',
      title: 'Keep going',
      callout: 'ecoquestfoundation.org',
      bullets: [
        'Next session in two weeks — see the Events page for the date and topic.',
        'This recording and these slides stay up permanently.',
        'We run beach and park cleanups too, if you want to do something with your hands.',
      ],
      notes:
        'Record the attendance count before you end the meeting. Save the chat log. Both go into the session recap.',
    },
  ],

  'beach-cleanup-data': [
    {
      eyebrow: 'EcoQuest Online Seminar Series',
      title: 'What a Beach Cleanup Actually Tells Us',
      callout:
        'A cleanup is not just picking up trash. Done properly, it is a data collection exercise that reaches researchers and lawmakers.',
      notes:
        'Open by asking who has been to a cleanup before. Then ask whether anyone filled out a data card. Usually most have done the first and none the second — that gap is the entire premise of this session.',
    },
    {
      eyebrow: 'The premise',
      title: 'Two cleanups, very different value',
      bullets: [
        'Cleanup A: twenty people fill forty bags. The beach looks better for a week.',
        'Cleanup B: the same twenty people fill the same forty bags — and record what was in them.',
        'Cleanup A produces a clean beach. Cleanup B produces a clean beach and evidence.',
        'The extra effort is roughly one index card per volunteer.',
      ],
      notes:
        'This framing does a lot of work. It reframes data collection as nearly free rather than as extra bureaucracy, which is how most volunteers experience it.',
    },
    {
      eyebrow: 'How it works',
      title: 'The data card',
      bullets: [
        'Volunteers tally items by category as they collect: cigarette butts, food wrappers, bottle caps, straws, fragments.',
        'Categories are standardized so that cleanups in different places produce comparable numbers.',
        'Weight and volume alone are nearly useless — a full bag of foam and a full bag of glass mean very different things.',
        'Location, date, and number of volunteers turn raw counts into a rate.',
      ],
      notes:
        'Show a real data card if you have one from a Save Our Beach event. A physical artifact on camera lands far better than a description.',
    },
    {
      eyebrow: 'Where it goes',
      title: 'From index card to policy',
      bullets: [
        'Ocean Conservancy\'s International Coastal Cleanup aggregates volunteer counts worldwide.',
        'The Clean Swell app lets volunteers submit counts directly from a phone.',
        'NOAA\'s Marine Debris Tracker feeds an open research dataset.',
        'Aggregated item counts are cited in debates over straws, foam containers, and bag ordinances.',
      ],
      notes:
        'Be careful and precise here: volunteer data informs policy debate; it is not the sole cause of any particular law. Overstating this is exactly the kind of claim that gets picked apart. Say "cited in" not "responsible for."',
    },
    {
      eyebrow: 'What we find',
      title: 'Our own Seal Beach cleanups',
      bullets: [
        'Small fragments dominate by count, while large items dominate the impression you get walking the beach.',
        'The jetty and the tideline collect very different debris from the dry sand.',
        'Most of what we pull out was never used at the beach — it arrived through storm drains.',
      ],
      notes:
        'Use your own photos here — IMG_1601, IMG_1602, IMG_1605 are on the Events page. Speak only to what you personally observed at your cleanups. Do not generalize into statistics you have not counted.',
    },
    {
      eyebrow: 'The counterintuitive part',
      title: 'The beach is not where the litter starts',
      callout:
        'Most coastal debris is inland litter that found a storm drain.',
      bullets: [
        'Storm drains generally carry water straight to the ocean, untreated.',
        'A wrapper dropped in a parking lot miles inland can end up on the sand after one rain.',
        'This is why an inland park cleanup is also a beach cleanup.',
      ],
      notes:
        'This connects your park cleanups to your beach cleanups as one program rather than two unrelated activities. It is also the fact people most often say they had never thought about.',
    },
    {
      eyebrow: 'Practical',
      title: 'Running a cleanup that produces good data',
      bullets: [
        'Brief volunteers on the categories before they start, not after.',
        'One data card per pair works better than one per person — people talk it through.',
        'Weigh the total haul and count your volunteers and your hours.',
        'Submit the same day, while the numbers are still legible and remembered.',
      ],
      notes:
        'Emphasize the same-day submission point. Cards that go home in a backpack do not come back.',
    },
    {
      eyebrow: 'For students',
      title: 'This counts, and it is checkable',
      bullets: [
        'Logged hours backed by a registration list and a submitted data card are verifiable service.',
        'Verifiable service is worth considerably more than a self-reported number.',
        'The dataset you help build is public, which means your contribution is too.',
      ],
      notes:
        'Relevant to anyone pursuing the Congressional Award, service-hour requirements, or Scouting rank advancement. Note honestly that hours generally count once, for one program — pick where they go and log them properly.',
    },
    {
      eyebrow: 'Wrap up',
      title: 'What to take away',
      bullets: [
        'Counts by category beat weight and volume.',
        'Standardized categories are what make your afternoon comparable to someone else\'s.',
        'Most beach debris is inland litter — cleanups upstream matter.',
        'Submitting the data is what turns an afternoon into evidence.',
      ],
      notes:
        'Invite people to the next in-person cleanup. Give the next seminar date. Leave eight minutes for questions.',
    },
    {
      eyebrow: 'Thank you',
      title: 'Come to a cleanup',
      callout: 'ecoquestfoundation.org/events/',
      bullets: [
        'Next session in two weeks.',
        'Slides and recording stay up permanently.',
      ],
      notes: 'Capture attendance count and save the chat log before ending the meeting.',
    },
  ],

  'home-footprint': [
    {
      eyebrow: 'EcoQuest Online Seminar Series',
      title: "Your Home's Water and Energy Footprint",
      callout:
        'Most household conservation advice is guesswork. Your utility bill is actual data about your actual house.',
      notes:
        'Ask people to have a recent utility bill open if they can — say this in the Eventbrite description and the reminder email too, so some of them actually do. Working from their own numbers is what makes this session stick.',
    },
    {
      eyebrow: 'The problem',
      title: 'Advice without measurement',
      bullets: [
        'Unplug your phone charger. Take shorter showers. Turn off lights.',
        'None of this is wrong. All of it is unranked.',
        'Without knowing what dominates your usage, you optimize the small things and miss the large ones.',
        'Your bill already ranks them for you, if you know how to read it.',
      ],
      notes:
        'The phone charger example is useful because nearly everyone has been told it matters and almost nobody has checked how much. Do not mock the advice — just point out it is unranked.',
    },
    {
      eyebrow: 'Reading the bill',
      title: 'The units, decoded',
      bullets: [
        'Electricity is billed in kilowatt-hours (kWh): one thousand watts drawn for one hour.',
        'Natural gas is billed in therms: a unit of heat energy.',
        'Water is often billed in HCF or CCF: hundred cubic feet, which is about 748 gallons.',
        'Nearly every bill shows the same month last year. That comparison is the most useful number on the page.',
      ],
      notes:
        'The HCF-to-gallons conversion surprises people every time — one unit on the bill is a lot of water. Write 748 on the screen and let it sit.',
    },
    {
      eyebrow: 'Ranking',
      title: 'What actually dominates a typical home',
      bullets: [
        'Heating and cooling is usually the largest single share of home energy use.',
        'Water heating is typically next.',
        'Everything you plug in — lights, electronics, chargers — together makes up a smaller share than most people assume.',
        'For water in Southern California, outdoor irrigation frequently exceeds all indoor use combined.',
      ],
      notes:
        'Before the session, look up current shares from the EIA Residential Energy Consumption Survey and your local water district, and cite them live. Give ranges rather than precise percentages — the mix varies enormously by house, climate, and age.',
    },
    {
      eyebrow: 'The method',
      title: 'Measure, change one thing, measure again',
      bullets: [
        'Record a baseline: two or three past bills, noting weather and occupancy.',
        'Change exactly one thing — a thermostat setpoint, an irrigation schedule.',
        'Wait a full billing cycle.',
        'Compare against the same month last year, not against last month. Seasons move more than habits do.',
      ],
      notes:
        'This is the actual scientific content of the session: controlling for the confound. Same-month-last-year comparison is the whole trick. Students recognize it as the experimental design they learn in science class, applied to something real.',
    },
    {
      eyebrow: 'Where to look first',
      title: 'The highest-leverage checks',
      bullets: [
        'Thermostat schedule — is the system conditioning an empty house?',
        'Irrigation controller — is it still running the summer schedule in November?',
        'Water heater setpoint, and whether long pipe runs are insulated.',
        'A leak check: read the water meter, use nothing for two hours, read it again.',
      ],
      notes:
        'The meter leak check is the crowd favorite because it is a real diagnostic anyone can run tonight for free, and a running toilet is genuinely common and genuinely expensive.',
    },
    {
      eyebrow: 'Tools',
      title: 'Free and independent',
      bullets: [
        'ENERGY STAR — appliance efficiency ratings and a home energy assessment tool.',
        'EPA WaterSense — fixture standards and a water use calculator.',
        'Your own utility — most offer free rebates and sometimes a free home audit.',
        'Your local water district — irrigation schedules tuned to your actual climate.',
      ],
      notes:
        'Rebates are the underused one. Have your local utility rebate page open and show it — people are often surprised what is already available to them.',
    },
    {
      eyebrow: 'The challenge',
      title: 'Two weeks, one change',
      bullets: [
        'Pick one thing from today. Just one.',
        'Write down your baseline before you change it.',
        'Track for two weeks and bring the result to a future session.',
        'A change you measured beats five you guessed at.',
      ],
      notes:
        'This ties into the EcoChallenge program on the site. Give the link and encourage people to report back — the reports become content for later sessions and evidence of an ongoing program.',
    },
    {
      eyebrow: 'Wrap up',
      title: 'What to take away',
      bullets: [
        'Your bill is a measurement instrument you already own.',
        'Heating, cooling, and water heating dominate energy; outdoor irrigation dominates water here.',
        'Change one variable at a time and compare year over year.',
        'Check for leaks before you optimize anything else.',
      ],
      notes: 'Next session date, Eventbrite link, then questions. Leave eight minutes.',
    },
    {
      eyebrow: 'Thank you',
      title: 'Take the challenge',
      callout: 'ecoquestfoundation.org/programs/',
      bullets: [
        'Next session in two weeks.',
        'Slides and recording stay up permanently.',
      ],
      notes: 'Capture attendance count and save the chat log before ending the meeting.',
    },
  ],
}
