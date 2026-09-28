/* The Slop Goblin — eats buzzwords, gets fat.
   Self-contained, no innerHTML, no external loads, styles set via CSSOM only,
   so it survives strict CSP / Trusted Types pages when run as a bookmarklet. */
(function () {
  'use strict';
  var W = window, D = document;
  if (!W.SlopGoblin) W.SlopGoblin = factory();
  if (!W.__SLOP_GOBLIN_NO_AUTOSTART) {
    if (W.__slopGoblin && W.__slopGoblin.alive) W.__slopGoblin.poke();
    else W.__slopGoblin = W.SlopGoblin({});
  }

  function factory() {
    var NS = 'http://www.w3.org/2000/svg';
    var TAG = 'data-slop-goblin';
    var Z = 2147483646;
    var FOOD = [
      'synerg(?:y|ies|istic|ise|ize)', 'leverag(?:e|es|ed|ing)', 'disrupt(?:ion|ions|ive|ing|ed|ors?|s)?',
      'thought[- ]leaders?(?:hip)?', 'circl(?:e|ing) back', 'move the needle', 'low[- ]hanging fruit',
      'paradigm[- ]shifts?', 'game[- ]?chang(?:ers?|ing)', 'deep[- ]dives?', 'value[- ]add(?:ed|s)?',
      'best[- ]in[- ]class', 'world[- ]class', 'cutting[- ]edge', 'next[- ]gen', 'mission[- ]critical',
      'bandwidth', 'ecosystems?', 'stakeholders?', 'alignment', 'holistic(?:ally)?', 'scalab(?:le|ility)',
      'empower(?:s|ed|ing|ment)?', 'innovat(?:ive|ion|ions)', 'ideat(?:e|ion|ing)', 'learnings',
      'actionable', 'touch(?:ing)? base', 'double down', 'pivot(?:s|ed|ing)?', 'north star',
      'unlock(?:s|ed|ing)?', 'supercharg(?:e|es|ed|ing)', 'unleash(?:es|ed|ing)?', 'seamless(?:ly)?',
      'robust', 'journey', 'humbled', '(?:thrilled|excited) to (?:announce|share)', 'passionate',
      'rock ?stars?', 'ninjas?', 'hustle', 'grindset', '10x', 'delv(?:e|es|ed|ing)', 'tapestry',
      'testament', 'landscape', 'realm', 'elevat(?:e|es|ed|ing)', 'embark(?:s|ed|ing)?',
      'curat(?:e|ed|ing)', 'transformati(?:ve|onal)', 'impactful', 'growth mindset', 'agile',
      'key takeaways?', 'wheelhouse', 'boil the ocean', 'let that sink in', 'patient[- ]centric',
      'omnichannel', 'AI[- ]powered', 'hyper[- ]?personali[sz]ed', 'best practices?', 'win[- ]win',
      'future[- ]?proof(?:ed|ing)?', 'operationali[sz](?:e|es|ed|ing|ation)', 'streamlin(?:e|es|ed|ing)', 'next-generation',
      'industry[- ]leading', 'revolutionary', 'groundbreaking', 'AI[- ](?:first|native|driven)', 'customer[- ](?:centric|obsessed|first)',
      'level[- ]set(?:ting)?', 'unicorns?', 'self[- ]starters?', 'storytell(?:er|ers|ing)', 'multi[- ]?passionate', '(?:purpose|impact|mission)[- ]driven'
    ];
    var RE_SRC = '\\b(?:' + FOOD.join('|') + ')\\b|\\bagree\\?';
    /* Plain English, keyed by the matched word with spaces and hyphens removed. */
    var PLAIN = {
      synergy: 'teamwork', synergies: 'overlaps', synergistic: 'useful together', synergise: 'work together', synergize: 'work together',
      leverage: 'use', leverages: 'uses', leveraged: 'used', leveraging: 'using',
      disrupt: 'shake up', disrupts: 'shakes up', disrupted: 'shook up', disrupting: 'shaking up', disruption: 'change',
      disruptions: 'changes', disruptive: 'new', disruptor: 'rival', disruptors: 'rivals',
      thoughtleader: 'person with opinions', thoughtleaders: 'people with opinions', thoughtleadership: 'opinions',
      circleback: 'follow up', circlingback: 'following up', movetheneedle: 'make a difference', lowhangingfruit: 'easy wins',
      paradigmshift: 'big change', paradigmshifts: 'big changes', gamechanger: 'fix', gamechangers: 'fixes', gamechanging: 'useful',
      deepdive: 'close look', deepdives: 'close looks', valueadd: 'bonus', valueadds: 'bonuses', valueadded: 'useful',
      bestinclass: 'decent', worldclass: 'decent', cuttingedge: 'new', nextgen: 'newer', missioncritical: 'important',
      bandwidth: 'time', ecosystem: 'network', ecosystems: 'networks', stakeholder: 'person involved', stakeholders: 'people involved',
      alignment: 'agreement', holistic: 'overall', holistically: 'overall', scalable: 'able to grow', scalability: 'room to grow',
      empower: 'let', empowers: 'lets', empowered: 'let', empowering: 'letting', empowerment: 'freedom',
      innovative: 'new', innovation: 'new ideas', innovations: 'new ideas', ideate: 'plan', ideation: 'planning', ideating: 'planning',
      learnings: 'lessons', actionable: 'useful', touchbase: 'talk', touchingbase: 'talking', doubledown: 'try harder',
      pivot: 'change plan', pivots: 'changes plan', pivoted: 'changed plan', pivoting: 'changing plan', northstar: 'goal',
      unlock: 'get', unlocks: 'gets', unlocked: 'got', unlocking: 'getting',
      supercharge: 'improve', supercharges: 'improves', supercharged: 'improved', supercharging: 'improving',
      unleash: 'release', unleashes: 'releases', unleashed: 'released', unleashing: 'releasing',
      seamless: 'smooth', seamlessly: 'smoothly', robust: 'solid', journey: 'career', humbled: 'proud',
      thrilledtoannounce: 'announcing', thrilledtoshare: 'sharing', excitedtoannounce: 'announcing', excitedtoshare: 'sharing',
      passionate: 'keen', rockstar: 'good worker', rockstars: 'good workers', ninja: 'expert', ninjas: 'experts',
      hustle: 'work', grindset: 'overwork', '10x': 'slightly',
      delve: 'look', delves: 'looks', delved: 'looked', delving: 'looking', tapestry: 'mix', testament: 'sign',
      landscape: 'market', realm: 'area', elevate: 'improve', elevates: 'improves', elevated: 'improved', elevating: 'improving',
      embark: 'start', embarks: 'starts', embarked: 'started', embarking: 'starting',
      curate: 'pick', curated: 'picked', curating: 'picking', transformative: 'big', transformational: 'big', impactful: 'useful',
      growthmindset: 'optimism', agile: 'flexible', keytakeaway: 'point', keytakeaways: 'points', wheelhouse: 'area',
      boiltheocean: 'overdo it', letthatsinkin: 'that is all', patientcentric: 'caring', omnichannel: 'everywhere',
      aipowered: 'AI', hyperpersonalised: 'tailored', hyperpersonalized: 'tailored', bestpractice: 'habit', bestpractices: 'habits',
      winwin: 'good deal', 'agree?': '(no question was asked)',
      futureproof: 'durable', futureproofed: 'durable', futureproofing: 'preparing',
      operationalise: 'do', operationalises: 'does', operationalised: 'done', operationalising: 'doing', operationalisation: 'doing it',
      operationalize: 'do', operationalizes: 'does', operationalized: 'done', operationalizing: 'doing', operationalization: 'doing it',
      streamline: 'simplify', streamlines: 'simplifies', streamlined: 'simplified', streamlining: 'simplifying',
      nextgeneration: 'newer', industryleading: 'decent', revolutionary: 'new', groundbreaking: 'new',
      aifirst: 'AI', ainative: 'AI', aidriven: 'AI', customercentric: 'polite', customerobsessed: 'clingy', customerfirst: 'polite',
      levelset: 'agree', levelsetting: 'agreeing', unicorn: 'perfect hire', unicorns: 'perfect hires',
      selfstarter: 'independent worker', selfstarters: 'independent workers', storyteller: 'writer', storytellers: 'writers', storytelling: 'writing',
      multipassionate: 'busy', purposedriven: 'well-meaning', impactdriven: 'busy', missiondriven: 'well-meaning'
    };

    /* Whole phrases, eaten in one bite. Checked before single words; earlier entries win.
       Replacements may use $1 for a captured word, which is then itself de-slopped. */
    var Q = '[\'’]', ADJ = '(?:[\\w-]+ ){0,2}';
    var PRODUCT_ADJ = '(?:transformative|innovative|cutting[- ]edge|next[- ]gen(?:eration)?|end[- ]to[- ]end|scalable|holistic|world[- ]class|' +
      'best[- ]in[- ]class|industry[- ]leading|revolutionary|groundbreaking|ai[- ](?:powered|first|native|driven)|' +
      'customer[- ](?:centric|obsessed|first)|seamless|robust|disruptive)';
    var PHRASES = [
      ['(?:i' + Q + 'm|i am|we' + Q + 're|we are) (?:so |super |really |incredibly |beyond )?(?:thrilled|excited|delighted|honou?red|humbled|proud)(?: and (?:humbled|honou?red|proud|excited|grateful))? to (?:announce|share)(?: that)?', 'News:'],
      ['(?:so |super |really )?(?:thrilled|excited|delighted|honou?red|humbled|proud) to (?:announce|share)(?: that)?', 'News:'],
      ['humbled and (?:honou?red|grateful|proud)', 'proud'],
      ['(?:truly |so |deeply )?humbled by', 'grateful for'],
      ['in today' + Q + 's (?:fast[- ]paced |ever[- ]changing |ever[- ]evolving |rapidly evolving |competitive )?(?:digital |modern |business )?(?:world|landscape|environment|economy|market|age|era)', 'now'],
      ['in the (?:ever[- ]evolving|ever[- ]changing|rapidly evolving|fast[- ]paced) (?:world|landscape|realm) of', 'in'],
      ['(?:the|an?) (?:ever[- ]evolving|ever[- ]changing|rapidly evolving|fast[- ]paced) (?:world|landscape|realm) of', 'the field of'],
      ['at the end of the day', 'ultimately'],
      ['it' + Q + 's (?:crucial|essential|critical|vital|important|imperative) to', 'you should'],
      ['delving (?:deep(?:er)? )?into', 'looking at'], ['delved (?:deep(?:er)? )?into', 'looked at'],
      ['delves (?:deep(?:er)? )?into', 'looks at'], ['delve (?:deep(?:er)? )?into', 'look at'],
      ['(?:a|the) (?:rich|vibrant|diverse) tapestry of', 'a mix of'],
      ['(?:is|was|stands as) a (?:true |real |powerful |living )?testament to', 'shows'],
      ['(?:harnessing|leveraging) the (?:full )?power of', 'using'],
      ['(?:harnesses|leverages) the (?:full )?power of', 'uses'],
      ['(?:harness|leverage) the (?:full )?power of', 'use'],
      ['unlocking (?:the )?(?:full |true )?potential of', 'using'],
      ['unlock (?:the )?(?:full |true )?potential of', 'use'],
      ['unlock (?:your|their|our) (?:full |true )?potential', 'do better'],
      ['unlocking new (?:opportunities|possibilities|value|growth)', 'growing'],
      ['unlock(?:s)? new (?:opportunities|possibilities|value|growth)', 'grow'],
      ['navigating the complexit(?:y|ies) of', 'dealing with'],
      ['navigate the complexit(?:y|ies) of', 'deal with'],
      ['(?:at|in) the intersection of', 'between'],
      ['driving (?:meaningful |real |tangible |measurable |lasting )?(?:impact|value|growth|outcomes|results|change)', 'helping'],
      ['drives (?:meaningful |real |tangible |measurable |lasting )?(?:impact|value|growth|outcomes|results|change)', 'helps'],
      ['drive (?:meaningful |real |tangible |measurable |lasting )?(?:impact|value|growth|outcomes|results|change)', 'help'],
      ['taking ((?:it|things|this)|(?:your|our|their|my) (?:[\\w-]+ )?[\\w-]+) to the next level', 'improving $1'],
      ['takes ((?:it|things|this)|(?:your|our|their|my) (?:[\\w-]+ )?[\\w-]+) to the next level', 'improves $1'],
      ['take ((?:it|things|this)|(?:your|our|their|my) (?:[\\w-]+ )?[\\w-]+) to the next level', 'improve $1'],
      ['move the needle', 'help'],
      ['low[- ]hanging fruit', 'easy wins'],
      ['boil(?:ing)? the ocean', 'overdo it'],
      ['let that sink in', '(pause for effect)'],
      ['key takeaways? from (?:my|our|this) ' + ADJ + 'journey', 'what I learned'],
      ['embarking on (?:an? |my |our |this )' + ADJ + 'journey', 'starting a new job'],
      ['embarked on (?:an? |my |our |this )' + ADJ + 'journey', 'started a new job'],
      ['embark on (?:an? |my |our |this )' + ADJ + 'journey', 'start a new job'],
      ['(?:it|this) (?:has been|was|is) (?:an? )?(?:incredible|amazing|humbling|wild|wonderful) (?:journey|ride|experience)', 'it was fine'],
      ['let' + Q + 's circle back (?:in the comments|below)', 'comment below'],
      ['let' + Q + 's circle back(?: on (?:this|that|it))?', 'let’s talk later'],
      ['align(?:ing)? (?:cross[- ]functional |key |all )?stakeholders (?:around|on)', 'get everyone to agree on'],
      ['(?:stakeholder|cross[- ]functional|strategic) alignment', 'agreement'],
      ['empowering (\\w+) to', 'letting $1'],
      ['empowers (\\w+) to', 'lets $1'],
      ['empower(?:ed)? (\\w+) to', 'let $1'],
      ['(?:we' + Q + 're|we are|i' + Q + 'm|i am) (?:just |only )?(?:getting started|scratching the surface)', 'there’s more'],
      ['the realm of (?:possibility|what' + Q + 's possible)', 'what’s possible'],
      ['bringing (?:your|their|our|my) whole sel(?:f|ves) to work', 'turning up'],
      ['brings (?:your|their|our|my) whole sel(?:f|ves) to work', 'turns up'],
      ['bring (?:your|their|our|my) whole sel(?:f|ves) to work', 'turn up'],
      ['(?:a )?strategic rightsizing(?: of (?:our|the) (?:talent|workforce|team|people)(?: landscape)?)?', 'layoffs'],
      ['(?:a|the) (?:true |real |total )?game[- ]?changer', 'a big help'],
      ['(?:a|the) paradigm[- ]shift', 'a big change'],
      ['(?:an|our|the) (?:thriving |vibrant |dynamic )?ecosystem of', 'a group of'],
      ['passionate about', 'into'],
      ['double(?:d)? down on', 'focus on'],
      ['touch(?:ing)? base (?:on|about)', 'talk about'],
      ['(?:excited|thrilled|can' + Q + 't wait) (?:for|to see) what' + Q + 's (?:next|to come|ahead)', 'curious'],
      /* --- corporate classics --- */
      ['leveraging (?:our |the |these |new )?synergies', 'working together'],
      ['leverage (?:our |the |these |new )?synergies', 'work together'],
      ['unlocking synergies', 'cooperating'], ['unlock synergies', 'cooperate'],
      ['taking (?:this|that|it) offline', 'talking privately'], ['take (?:this|that|it) offline', 'talk privately'],
      ['(?:do|take) a deep[- ]dive (?:into|on)', 'look closely at'], ['deep[- ]dive into', 'close look at'],
      ['drilling down (?:into|on)', 'looking closer at'], ['drill down (?:into|on)', 'look closer at'], ['drill down', 'look closer'],
      ['pushing the envelope', 'trying new things'], ['pushes the envelope', 'tries new things'], ['push the envelope', 'try new things'],
      ['thinking outside (?:of )?the box', 'thinking'], ['think outside (?:of )?the box', 'think'],
      /* --- strategy soup --- */
      ['core competenc(?:ies|es)', 'skills'], ['core competency', 'skill'],
      ['(?:unique )?value propositions?', 'pitch'],
      ['competitive (?:advantage|edge)', 'edge'],
      ['holistic approach', 'plan'],
      ['ecosystem thinking', 'thinking'],
      ['unlocking (?:real |more |significant )?value', 'making money'], ['unlock(?:s)? (?:real |more |significant )?value', 'make money'],
      /* --- execution waffle --- */
      ['hitting the ground running', 'starting quickly'], ['hit the ground running', 'start quickly'],
      ['move fast and break things', 'rush'],
      ['building the plane while (?:we' + Q + 're |we are )?flying it', 'improvising'],
      ['build(?:s)? the plane while (?:we' + Q + 're |we are )?flying it', 'improvise'],
      ['getting (?:our|your|my|their|all (?:our|your|the)) ducks in a row', 'getting organised'],
      ['(?:get|got) (?:our|your|my|their|all (?:our|your|the)) ducks in a row', 'get organised'],
      ['running (?:it|this|that|something) up the flagpole', 'suggesting it'], ['run (?:it|this|that|something) up the flagpole', 'suggest it'],
      ['closing the loop', 'following up'], ['close the loop', 'follow up'],
      ['sociali[sz]ing (?:the|this|that|an|our) (?:idea|plan|proposal|concept)', 'mentioning it'],
      ['sociali[sz]e (?:the|this|that|an|our) (?:idea|plan|proposal|concept)', 'mention it'],
      /* --- announcements --- */
      ['some (?:big |exciting )?personal news', 'news'],
      ['(?:excited|thrilled|ready) for (?:my|the|our) next chapter', 'moving on'],
      ['(?:my|the|our|a) next chapter', 'a new job'],
      ['what a (?:[\\w-]+ )?(?:journey|ride) (?:it' + Q + 's been|it has been|this has been)', 'that happened'],
      ['(?:beyond|eternally) grateful', 'grateful'],
      ['pinch[- ]me moment', 'nice day'],
      ['((?:i' + Q + 'm|i am|we' + Q + 're|we are)) (?:so |incredibly |immensely |beyond |truly )proud', '$1 pleased'],
      ['(?:so |truly )?(?:humbled|honou?red|proud|thrilled|excited|delighted) to be', 'glad to be'],
      /* --- hustle gospel --- */
      ['rise and grind', 'wake up'], ['no excuses', 'some excuses'],
      ['executing relentlessly', 'working'], ['execute relentlessly', 'work'],
      ['outworking (?:the|your|our) competition', 'working late'], ['outwork (?:the|your|our) competition', 'work late'],
      ['betting on yourself', 'quitting your job'], ['bet on yourself', 'quit your job'],
      ['getting comfortable (?:with )?being uncomfortable', 'coping'], ['get comfortable (?:with )?being uncomfortable', 'cope'],
      ['your network is your net ?worth', 'people matter'], ['success leaves clues', 'copy others'],
      ['mindset is everything', 'attitude helps'],
      ['showing up every (?:single )?day', 'coming to work'], ['show up every (?:single )?day', 'come to work'],
      /* --- leadership theatre --- */
      ['servant leadership', 'management'], ['authentic leadership', 'management'],
      ['leading with empathy', 'being kind'], ['lead with empathy', 'be kind'],
      ['radical candou?r', 'honesty'],
      ['cultivating a growth mindset', 'staying positive'], ['cultivate a growth mindset', 'stay positive'],
      ['empowering (your|our|their) (people|teams?|employees|staff)', 'trusting $1 $2'],
      ['empower (your|our|their) (people|teams?|employees|staff)', 'trust $1 $2'],
      ['leaning into (?:the )?(?:vulnerability|discomfort)', 'admitting mistakes'], ['lean into (?:the )?(?:vulnerability|discomfort)', 'admit mistakes'],
      ['leading from the front', 'managing'], ['lead from the front', 'manage'],
      /* --- innovation bingo, sales fog, AI seasoning --- */
      ['disruptive innovations', 'new products'], ['disruptive innovation', 'new product'],
      ['(?:' + PRODUCT_ADJ + ',? (?:and )?)+(?:solutions|platforms)', 'products'],
      ['(?:' + PRODUCT_ADJ + ',? (?:and )?)+(?:solution|platform)', 'product'],
      ['the next[- ]generation of', 'new'],
      ['(?:the |an )agentic (?:future|era|revolution|world)', 'more chatbots'],
      ['unlocking the (?:full )?power of', 'using'], ['unlock the (?:full )?power of', 'use'],
      ['democrati[sz]ing (?:access to )?([\\w-]+)', 'selling $1'], ['democrati[sz]es (?:access to )?([\\w-]+)', 'sells $1'],
      ['democrati[sz]e (?:access to )?([\\w-]+)', 'sell $1'],
      ['responsible (?:ai )?innovation', 'caution'],
      ['(?:a )?human[- ]in[- ]the[- ]loop', 'someone checking'],
      ['supercharging (?:your |our |team )?productivity', 'working faster'], ['supercharge (?:your |our |team )?productivity', 'work faster'],
      ['the future is (?:already )?here', 'things have changed'],
      ['(?:frictionless|seamless|delightful) (?:customer |user )?experience', 'working app'],
      ['seamlessly integrated', 'integrated'], ['seamlessly integrates', 'integrates'], ['seamless integration', 'integration'],
      ['(a|the|one) single source of truth', '$1 spreadsheet'], ['single source of truth', 'spreadsheet'],
      ['unlocking (?:exponential |sustainable |real )?growth', 'growing'], ['unlock(?:s)? (?:exponential |sustainable |real )?growth', 'grow'],
      ['delivering (?:real |meaningful |measurable |tangible )?(?:impact|value|results|outcomes)', 'doing the job'],
      ['delivers (?:real |meaningful |measurable |tangible )?(?:impact|value|results|outcomes)', 'does the job'],
      ['deliver (?:real |meaningful |measurable |tangible )?(?:impact|value|results|outcomes)', 'do the job'],
      /* --- teamwork pudding --- */
      ['breaking down (?:the |our |organi[sz]ational )?silos', 'talking to each other'],
      ['break down (?:the |our |organi[sz]ational )?silos', 'talk to each other'],
      ['cross[- ]functional collaboration', 'teamwork'], ['collaborative culture', 'teamwork'],
      ['all hands on deck', 'everyone'], ['one team,? one dream', 'a team'], ['stronger together', 'a team'],
      ['aligning (?:the |all |key )?stakeholders', 'agreeing'], ['align (?:the |all |key )?stakeholders', 'agree'],
      ['(?:creating|getting|building) buy[- ]in', 'persuading people'], ['(?:create|get|build) buy[- ]in', 'persuade people'],
      ['bringing (?:everyone|people|the team|them) (?:along )?(?:on|with us on) (?:the|this) journey', 'telling everyone'],
      ['bring (?:everyone|people|the team|them) (?:along )?(?:on|with us on) (?:the|this) journey', 'tell everyone'],
      /* --- personal-brand protein --- */
      ['building in public', 'posting'], ['build in public', 'post'],
      ['in founder mode', 'while micromanaging'], ['founder mode', 'micromanaging'], ['serial entrepreneurs?', 'repeat founder'],
      ['visionary leaders?', 'boss'], ['change agents', 'employees'], ['change agent', 'employee'],
      /* --- engagement bait --- */
      ['read (?:that|it|this) again', '(no need)'],
      ['louder for the (?:people|folks) (?:in|at) the back', '(repeating myself)'],
      ['(?:unpopular opinion|hot take)', 'popular opinion'],
      ['hard truths', 'opinions'], ['hard truth', 'opinion'],
      ['here' + Q + 's what (?:nobody|no one) (?:tells you|talks about)', 'here' + '’s something'],
      ['most people won' + Q + 't (?:like|agree with) this', 'most people agree'],
      ['i don' + Q + 't know who needs to hear this', '(nobody asked)'],
      /* --- manufactured profundity --- */
      ['this changes everything', 'this changes something'],
      ['the old playbook is dead', 'things changed'],
      ['the pace of change has never been (?:this|so|more) (?:fast|rapid)', 'things are changing'],
      ['(?:we' + Q + 're|we are) at an? (?:critical |pivotal )?inflection point', 'things are changing'],
      ['(?:an? )?(?:critical |pivotal )?inflection point', 'a change'],
      ['the future belongs to', 'things will go well for'],
      ['it' + Q + 's a marathon,? not a sprint', 'it takes time'],
      ['your why is your superpower', 'motivation helps'],
      ['progress over perfection', 'good enough'],
      ['be the change(?: you want to see(?: in the world)?)?', 'help'],
      ['let' + Q + 's unpack (?:that|this|it)', 'let’s discuss'],
      ['(this )?one simple (?:truth|trick|lesson|thing)', 'something'],
      ['(building|build|started|starting|start) a movement', '$1 a product'],
      ['i chose growth', 'I changed jobs'],
      ['here are (?:\\w+ )?(?:things|lessons) (?:it|this|that) taught me about ([\\w-]+)', 'here is a list about $1'],
      /* --- meeting-room leftovers --- */
      ['(?:capacity|resource) constraints', 'no time'],
      ['a quick (?:sync|catch[- ]up)', 'a chat'], ['quick (?:sync|catch[- ]up)', 'chat'],
      ['double[- ]clicking (?:on|into)', 'looking at'], ['double[- ]click (?:on|into)', 'look at'],
      ['action (?:that|this|it)', 'do that'],
      ['putting a pin in (?:it|that|this)', 'postponing it'], ['put a pin in (?:it|that|this)', 'postpone it'],
      ['(?:put|add|park) (?:it|that|this) (?:in|on) the parking lot', 'postpone it'],
      ['taking a helicopter view', 'stepping back'], ['take a helicopter view', 'step back'], ['helicopter view', 'overview'],
      ['pencil (\\w+) in', 'schedule $1'],
      /* --- recruitment garnish --- */
      ['a fast[- ]paced environment', 'a chaotic office'], ['fast[- ]paced environment', 'chaotic office'],
      ['(?:we' + Q + 're|we are) (?:just )?like a family', 'we work late'],
      ['wearing (?:many|multiple|a lot of) hats', 'doing several jobs'], ['wears (?:many|multiple|a lot of) hats', 'does several jobs'],
      ['wear (?:many|multiple|a lot of) hats', 'do several jobs'],
      ['going above and beyond', 'working extra'], ['goes above and beyond', 'works extra'],
      ['went above and beyond', 'worked extra'], ['go above and beyond', 'work extra'],
      ['work hard,? play hard', 'long hours'],
      ['(?:an )?entrepreneurial (?:mindset|spirit)', 'initiative'],
      ['what are your thoughts\\?', '(please comment)'], ['thoughts\\?', '(please comment)']
    ];
    var PHR_SRC = '\\b(?:' + PHRASES.map(function (p) { return p[0]; }).join('|') + ')(?![\\w])';
    var PHRASE_FULL = PHRASES.map(function (p) { return { re: new RegExp('^(?:' + p[0] + ')$', 'i'), out: p[1] }; });
    var PHR_G = new RegExp(PHR_SRC, 'gi'), WORD_G = new RegExp(RE_SRC, 'gi');

    function hasSlop(v) {
      PHR_G.lastIndex = 0; WORD_G.lastIndex = 0;
      return PHR_G.test(v) || WORD_G.test(v);
    }
    /* Non-overlapping slop in a string, phrases first, then any lone words outside them: [start, end, text]. */
    function findSlop(txt) {
      var out = [], m;
      PHR_G.lastIndex = 0;
      while ((m = PHR_G.exec(txt))) { out.push([m.index, m.index + m[0].length, m[0]]); if (!m[0].length) PHR_G.lastIndex++; }
      WORD_G.lastIndex = 0;
      while ((m = WORD_G.exec(txt))) {
        var s = m.index, e = s + m[0].length;
        if (!out.some(function (q) { return s < q[1] && e > q[0]; })) out.push([s, e, m[0]]);
      }
      return out.sort(function (a, b) { return a[0] - b[0]; });
    }
    function matchCase(src, out) {
      if (src.length > 1 && src === src.toUpperCase() && src !== src.toLowerCase()) return out.toUpperCase();
      if (/^[A-Z]{2}/.test(src)) return out; // starts with an acronym like "AI-first", not a new sentence
      if (src[0] !== src[0].toLowerCase()) return out.charAt(0).toUpperCase() + out.slice(1);
      return out;
    }
    function plainWord(w) {
      var out = PLAIN[w.toLowerCase().replace(/[\s-]+/g, '')];
      return out ? matchCase(w, out) : '';
    }
    function plainFor(text) {
      for (var i = 0; i < PHRASE_FULL.length; i++) {
        if (PHRASE_FULL[i].re.test(text)) {
          var out = text.replace(PHRASE_FULL[i].re, PHRASE_FULL[i].out);
          out = out.replace(new RegExp(RE_SRC, 'gi'), function (w) { return plainWord(w) || w; });
          return matchCase(text, out);
        }
      }
      return plainWord(text);
    }
    function translateText(txt) {
      var parts = findSlop(txt), res = '', at = 0;
      parts.forEach(function (p) { res += txt.slice(at, p[0]) + (plainFor(p[2]) || ''); at = p[1]; });
      return res + txt.slice(at);
    }


    /* ---------- video mode: blur people, hide the side panels, bigger goblin ---------- */
    var PEOPLE_LINKS = 'a[href*="/in/"],a[href*="/company/"],a[href*="/showcase/"],a[href*="/school/"],a[href*="/groups/"]';
    var BLUR_SEL = PEOPLE_LINKS + ',[data-slop-blur]';
    var VIDEO_CSS = [
      'img, video, picture, image { filter: blur(14px) !important; }',
      BLUR_SEL + ' { filter: blur(7px) !important; }',
      // LinkedIn's side columns and the messaging bar (current and older layouts)
      'aside[aria-label="Sidebar"], aside[aria-label="Aside"], #interop-outlet, #msg-overlay, .msg-overlay-container,' +
      ' .scaffold-layout__aside, .scaffold-layout__sidebar { display: none !important; }'
    ].join('\n');
    // "Amanda Smith likes this", "Claude reposted this", "Sam Jones and 64 others": names that aren't links
    var SOCIAL_RE = /\b(?:likes?|loves?|celebrates?|supports?|reposted|commented on|finds?|appreciates?|replied to)\b[^.]{0,40}\bthis\b|\band \d[\d,]* others?\b/i;
    var videoSheet = null, videoTimer = 0;
    function blurSocial() {
      var els = D.querySelectorAll('p, span');
      for (var i = 0; i < els.length; i++) {
        var e = els[i];
        if (e.hasAttribute('data-slop-blur') || e.closest('[' + TAG + ']')) continue;
        var t = e.textContent;
        if (t.length > 160 || !SOCIAL_RE.test(t)) continue;
        (e.closest('p') || e).setAttribute('data-slop-blur', '');
      }
      // An author's name link often sits beside their headline rather than around it, so blur the small
      // column that holds name, headline and time. Inline @mentions in post text are left to the link blur.
      var links = D.querySelectorAll(PEOPLE_LINKS);
      for (var j = 0; j < links.length; j++) {
        var a = links[j];
        if (!a.querySelector('div, figure, img') || a.closest('[data-slop-blur]') || a.closest('[' + TAG + ']')) continue;
        var best = null, up = a.parentElement;
        for (var k = 0; up && up !== D.body && k < 4; k++, up = up.parentElement) {
          if (up.getBoundingClientRect().height > 110 || up.textContent.length > 300) break;
          best = up;
        }
        if (best) best.setAttribute('data-slop-blur', '');
      }
    }
    function setVideoMode(on) {
      if (on && !videoSheet) {
        try {
          videoSheet = new CSSStyleSheet(); videoSheet.replaceSync(VIDEO_CSS);
          D.adoptedStyleSheets = D.adoptedStyleSheets.concat([videoSheet]);
        } catch (err) {
          videoSheet = D.createElement('style'); videoSheet.setAttribute(TAG, ''); videoSheet.textContent = VIDEO_CSS; D.head.appendChild(videoSheet);
        }
        blurSocial(); videoTimer = setInterval(blurSocial, 700);
      } else if (!on && videoSheet) {
        if (videoSheet.nodeType) videoSheet.remove();
        else D.adoptedStyleSheets = D.adoptedStyleSheets.filter(function (x) { return x !== videoSheet; });
        videoSheet = null; clearInterval(videoTimer);
        var marked = D.querySelectorAll('[data-slop-blur]');
        for (var i = 0; i < marked.length; i++) marked[i].removeAttribute('data-slop-blur');
      }
    }
    function startVideoMode() {
      setVideoMode(true);
      var box = el('div', { position: 'fixed', left: '50%', top: '42%', transform: 'translate(-50%,-50%)', zIndex: String(Z + 1),
        font: '900 120px/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', color: '#f6d84a', pointerEvents: 'none',
        textShadow: '0 0 2px #1c2317, 3px 3px 0 #1c2317, -3px 3px 0 #1c2317, 3px -3px 0 #1c2317, -3px -3px 0 #1c2317, 6px 9px 0 #1c2317',
        margin: '0', padding: '0', background: 'transparent', letterSpacing: 'normal' }, D.body);
      var n = 3; box.textContent = String(n);
      var tick = setInterval(function () {
        n--;
        if (n > 0) { box.textContent = String(n); return; }
        clearInterval(tick); box.remove();
        W.__slopGoblin = SlopGoblin({ scale: 1.5, video: true, hud: false });
      }, 800);
    }

    /* ---------- the receipt: one canvas, shown on screen and saved as the PNG ---------- */
    var SITE = 'slopgoblin.pharmatools.ai';
    function drawHead(ctx, cx, cy, s, f) {
      ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = '#34501f'; ctx.lineWidth = 3;
      ['M-13 -8 L-38 -27 L-10 7 Z', 'M13 -8 L38 -27 L10 7 Z'].forEach(function (d) {
        var p = new Path2D(d); ctx.fillStyle = '#86ad5e'; ctx.fill(p); ctx.stroke(p);
      });
      ctx.beginPath(); ctx.arc(0, 0, 19, 0, Math.PI * 2); ctx.fillStyle = '#86ad5e'; ctx.fill(); ctx.stroke();
      ctx.globalAlpha = Math.min(1, f * 1.6) * 0.6; ctx.fillStyle = '#e98c8c';
      [-12, 12].forEach(function (x) { ctx.beginPath(); ctx.arc(x, 6, 4, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1; ctx.lineWidth = 2;
      [-7.8, 7.8].forEach(function (x) { ctx.beginPath(); ctx.arc(x, -3, 6.4, 0, Math.PI * 2); ctx.fillStyle = '#f6d84a'; ctx.fill(); ctx.stroke(); });
      ctx.fillStyle = '#1a1a12';
      [-6.4, 9.2].forEach(function (x) { ctx.beginPath(); ctx.arc(x, -2.4, 2.9, 0, Math.PI * 2); ctx.fill(); });
      ctx.lineWidth = 2.6; ctx.stroke(new Path2D('M-14.5 -14.5 L-4.5 -11.5 M14.5 -14.5 L4.5 -11.5'));
      ctx.lineWidth = 2.8; ctx.stroke(new Path2D('M-11.5 7 Q0 15.5 11.5 7'));
      var fang = new Path2D('M-7.4 9.6 L-4.1 10.6 L-5.8 14.6 Z M7.4 9.6 L4.1 10.6 L5.8 14.6 Z');
      ctx.lineWidth = 1; ctx.fillStyle = '#fffbe8'; ctx.fill(fang); ctx.stroke(fang);
      ctx.restore();
    }
    /* d: { items:[{bite,n,serv}], best:{bite,out}|null, eaten, servings, opened, girth, f, when, where } */
    function drawReceipt(d) {
      var S = 2, W0 = 400, pad = 26, inner = W0 - pad * 2;
      var MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      var INK = '#1f231b', MUTED = '#6b7166', PAPER = '#fffdf6';
      var cv = D.createElement('canvas'), ctx = cv.getContext('2d');
      var ops = [], y = 16;
      function font(size, weight) { return (weight || 400) + ' ' + size + 'px ' + MONO; }
      function fit(text, max) {
        if (ctx.measureText(text).width <= max) return text;
        while (text.length > 1 && ctx.measureText(text + '…').width > max) text = text.slice(0, -1);
        return text + '…';
      }
      function wrapText(text, max) {
        var lines = [], cur = '';
        text.split(' ').forEach(function (w) {
          var t = cur ? cur + ' ' + w : w;
          if (ctx.measureText(t).width > max && cur) { lines.push(cur); cur = w; } else cur = t;
        });
        if (cur) lines.push(cur);
        return lines;
      }
      function centre(text, size, weight, color, h) {
        var at = y; ops.push(function () { ctx.font = font(size, weight); ctx.fillStyle = color || INK; ctx.textAlign = 'center'; ctx.fillText(text, W0 / 2, at + size); });
        y += h || size + 8;
      }
      function row(left, right, size, weight, h) {
        size = size || 13; ctx.font = font(size, weight);
        var r = String(right), rw = ctx.measureText(r).width, l = fit(left, inner - rw - 14), at = y;
        ops.push(function () {
          ctx.font = font(size, weight); ctx.fillStyle = INK;
          ctx.textAlign = 'left'; ctx.fillText(l, pad, at + size);
          ctx.textAlign = 'right'; ctx.fillText(r, W0 - pad, at + size);
        });
        y += h || size + 9;
      }
      function rule() {
        var at = y + 6; ops.push(function () {
          ctx.strokeStyle = MUTED; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(pad, at); ctx.lineTo(W0 - pad, at); ctx.stroke(); ctx.setLineDash([]);
        });
        y += 14;
      }
      var headAt = y; ops.push(function () { drawHead(ctx, W0 / 2, headAt + 40, 1.15, d.f); });
      y += 78;
      centre('THE SLOP GOBLIN', 20, 800, INK, 28);
      centre('Buzzword eatery · plain English to go', 11, 400, MUTED, 20);
      rule();
      row('Date', d.when, 12); row('Table', d.where, 12);
      rule();
      row('ITEM', 'SERVINGS', 11, 700, 18);
      d.items.slice(0, 7).forEach(function (it) { row((it.n > 1 ? it.n + '× ' : '') + it.bite, it.serv); });
      if (d.items.length > 7) {
        var extra = d.items.slice(7).reduce(function (s, it) { return s + it.serv; }, 0);
        row('+ ' + (d.items.length - 7) + ' more dishes', extra, 12);
      }
      rule();
      row('Buzzwords eaten', d.eaten); row('Servings', d.servings);
      if (d.opened) row('Posts opened', d.opened);
      row('Substance', '0g');
      row('GIRTH', d.girth.toUpperCase(), 15, 800, 26);
      if (d.best) {
        rule();
        ctx.font = font(11, 700); var lblAt = y;
        ops.push(function () { ctx.font = font(11, 700); ctx.fillStyle = MUTED; ctx.textAlign = 'left'; ctx.fillText('CHEF’S TRANSLATION', pad, lblAt + 11); });
        y += 20;
        ctx.font = font(13, 400);
        var lines = wrapText('“' + d.best.bite + '”', inner).concat(wrapText('→ “' + d.best.out + '”', inner));
        lines.forEach(function (ln, i) {
          var at = y, bold = ln.charAt(0) === '→';
          ops.push(function () { ctx.font = font(13, bold ? 700 : 400); ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.fillText(ln, pad, at + 13); });
          y += 19;
        });
      }
      rule();
      centre('Service charge not included', 11, 400, MUTED, 17);
      centre('Thank you for your custom', 11, 400, MUTED, 22);
      var barAt = y; ops.push(function () {
        var seed = (d.eaten * 9973 + d.servings * 31 + 7) >>> 0, x = W0 / 2 - 110;
        ctx.fillStyle = INK;
        while (x < W0 / 2 + 110) {
          seed = (seed * 1103515245 + 12345) >>> 0;
          var bw = 1 + (seed >>> 16) % 3; ctx.fillRect(x, barAt, bw, 40); x += bw + 1 + (seed >>> 20) % 3;
        }
      });
      y += 52;
      centre(SITE, 15, 800, INK, 24);
      centre('Feed yours. Nothing leaves your browser.', 11, 400, MUTED, 20);
      y += 14;
      var H = Math.ceil(y);
      cv.width = W0 * S; cv.height = H * S;
      ctx.scale(S, S);
      // paper with zig-zag top and bottom edges
      var tooth = 10, depth = 6, p = new Path2D();
      p.moveTo(0, depth);
      for (var x = 0; x < W0; x += tooth) { p.lineTo(x + tooth / 2, 0); p.lineTo(Math.min(W0, x + tooth), depth); }
      p.lineTo(W0, H - depth);
      for (var x2 = W0; x2 > 0; x2 -= tooth) { p.lineTo(x2 - tooth / 2, H); p.lineTo(Math.max(0, x2 - tooth), H - depth); }
      p.closePath();
      ctx.fillStyle = PAPER; ctx.fill(p);
      ops.forEach(function (op) { op(); });
      return cv;
    }
    var SKIP = 'script,style,noscript,textarea,input,select,option,code,pre,title,svg,' +
      '[contenteditable=""],[contenteditable="true"],[data-goblin-ignore],[' + TAG + '],[data-slop-eaten]';
    /* Girth is measured in servings: a lone word is 1, a two-word phrase 2, three or more words 3. */
    var GIRTH = [[0, 'Peckish'], [5, 'Snacking'], [11, 'Well-fed'], [19, 'Rotund'], [32, 'Gelatinous'],
      [50, 'Structurally concerning'], [80, 'Load-bearing'], [120, 'Visible from space']];
    function servingsFor(bite) { return Math.min(3, bite.trim().split(/\s+/).length); }
    var C = { skin: '#86ad5e', line: '#34501f', belly: '#b8d38e', tie: '#c8423a', eye: '#f6d84a',
      pupil: '#1a1a12', mouth: '#3a1418', tongue: '#d9677a', tooth: '#fffbe8', cheek: '#e98c8c' };
    var BASE = 86; // px width of a peckish goblin
    var ADMIRE_MS = 3000; // how long a fresh translation stays on screen before he scrolls on

    function css(e, o) { for (var k in o) e.style[k] = o[k]; return e; }
    function el(tag, o, parent) {
      var e = D.createElement(tag); e.setAttribute(TAG, '');
      if (o) css(e, o); if (parent) parent.appendChild(e); return e;
    }
    function sv(tag, attrs, parent) {
      var e = D.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e); return e;
    }
    function set(e, attrs) { for (var k in attrs) e.setAttribute(k, attrs[k]); }
    function fatFor(n) { return n / (n + 22); }
    function girthFor(n) { var g = GIRTH[0][1]; for (var i = 0; i < GIRTH.length; i++) if (n >= GIRTH[i][0]) g = GIRTH[i][1]; return g; }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function r1(n) { return Math.round(n * 10) / 10; }

    /* ---------- the creature ---------- */
    function buildArt() {
      var svg = sv('svg', { viewBox: '-20 0 140 120', width: '100%', height: '100%', 'aria-hidden': 'true', focusable: 'false' });
      svg.style.overflow = 'visible'; svg.style.display = 'block';
      var legs = [sv('g', {}, svg), sv('g', {}, svg)];
      legs.forEach(function (g, i) {
        sv('rect', { x: -3.5, y: 0, width: 7, height: 17, rx: 3.5, fill: C.skin, stroke: C.line, 'stroke-width': 2 }, g);
        sv('ellipse', { cx: i ? 2.5 : -2.5, cy: 17, rx: 6.5, ry: 3.2, fill: C.skin, stroke: C.line, 'stroke-width': 2 }, g);
      });
      var arms = [0, 1].map(function () {
        return [sv('path', { fill: 'none', stroke: C.line, 'stroke-width': 7.5, 'stroke-linecap': 'round' }, svg),
                sv('path', { fill: 'none', stroke: C.skin, 'stroke-width': 3.8, 'stroke-linecap': 'round' }, svg)];
      });
      var body = sv('ellipse', { fill: C.skin, stroke: C.line, 'stroke-width': 2.2 }, svg);
      var belly = sv('ellipse', { fill: C.belly }, svg);
      var navel = sv('path', { fill: 'none', stroke: C.line, 'stroke-width': 1.4, 'stroke-linecap': 'round' }, svg);
      var tie = sv('g', {}, svg);
      sv('path', { d: 'M-2 4 L2 4 L4 15 L0 19 L-4 15 Z', fill: C.tie, stroke: C.line, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, tie);
      sv('path', { d: 'M-3 0 L3 0 L2 4.5 L-2 4.5 Z', fill: C.tie, stroke: C.line, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, tie);
      var head = sv('g', {}, svg);
      [-1, 1].forEach(function (s) {
        sv('path', { d: 'M' + 14 * s + ' -6 L' + 37 * s + ' -21 L' + 12 * s + ' 5 Z', fill: C.skin, stroke: C.line, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, head);
        sv('path', { d: 'M' + 16 * s + ' -3 L' + 30 * s + ' -15 L' + 15 * s + ' 1 Z', fill: C.cheek, opacity: 0.7 }, head);
      });
      sv('circle', { cx: 0, cy: 0, r: 17, fill: C.skin, stroke: C.line, 'stroke-width': 2.2 }, head);
      var cheeks = [-1, 1].map(function (s) { return sv('circle', { cx: 11 * s, cy: 6, r: 3.6, fill: C.cheek, opacity: 0 }, head); });
      var eyes = [-1, 1].map(function (s) { return sv('ellipse', { cx: 7 * s, cy: -4, rx: 4.8, ry: 4.8, fill: C.eye, stroke: C.line, 'stroke-width': 1.4 }, head); });
      var pupils = [-1, 1].map(function () { return sv('circle', { r: 2.1, fill: C.pupil }, head); });
      [-1, 1].forEach(function (s) {
        sv('path', { d: 'M' + 12.5 * s + ' -11.5 L' + 3 * s + ' -8.5', stroke: C.line, 'stroke-width': 2.4, 'stroke-linecap': 'round', fill: 'none' }, head);
        sv('circle', { cx: 1.6 * s, cy: 2.6, r: 0.9, fill: C.line }, head);
      });
      var shut = sv('g', {}, head);
      sv('path', { d: 'M-11 7.5 Q0 14 11 7.5', fill: 'none', stroke: C.line, 'stroke-width': 2, 'stroke-linecap': 'round' }, shut);
      [-1, 1].forEach(function (s) {
        sv('path', { d: 'M' + 7 * s + ' 9.8 L' + 4.4 * s + ' 10.4 L' + 5.9 * s + ' 13.4 Z', fill: C.tooth, stroke: C.line, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, shut);
      });
      var open = sv('g', {}, head);
      sv('ellipse', { cx: 0, cy: 10, rx: 10.5, ry: 7.5, fill: C.mouth, stroke: C.line, 'stroke-width': 1.8 }, open);
      sv('ellipse', { cx: 0, cy: 14.2, rx: 6, ry: 2.8, fill: C.tongue }, open);
      [-6, -2, 2, 6].forEach(function (x) { sv('path', { d: 'M' + (x - 1.8) + ' 3.2 L' + (x + 1.8) + ' 3.2 L' + x + ' 7 Z', fill: C.tooth }, open); });
      [-4, 4].forEach(function (x) { sv('path', { d: 'M' + (x - 1.6) + ' 17 L' + (x + 1.6) + ' 17 L' + x + ' 13.8 Z', fill: C.tooth }, open); });

      function headY(f) { return 46 + 4 * f; }
      function headS(f) { return 1 + 0.12 * f; }

      function update(s) {
        var f = s.f;
        var rx = (16 + 30 * f) * (1 + s.wob * 0.12), ry = (17 + 9 * f) * (1 - s.wob * 0.08);
        var by = 80 - 2 * f;
        set(body, { cx: 50, cy: r1(by), rx: r1(rx), ry: r1(ry) });
        set(belly, { cx: 50, cy: r1(by + 4 + 1.5 * f), rx: r1(rx * 0.66), ry: r1(ry * 0.62) });
        set(navel, { d: 'M48.4 ' + r1(by + 8 + 4 * f) + ' q1.6 1.7 3.2 0', opacity: f > 0.15 ? 1 : 0 });
        var walk = s.walk, ang = walk == null ? 0 : Math.sin(walk) * 24;
        var spread = 6 + 10 * f;
        set(legs[0], { transform: 'translate(' + r1(50 - spread) + ' 99) rotate(' + r1(ang) + ')' });
        set(legs[1], { transform: 'translate(' + r1(50 + spread) + ' 99) rotate(' + r1(-ang) + ')' });
        var swing = walk == null ? 0 : Math.sin(walk) * 2.5;
        [-1, 1].forEach(function (sd, i) {
          var sx = 50 + sd * rx * 0.93, sy = by - ry * 0.15;
          var ex = sx + sd * (9 - 2 * s.arm), ey = sy + 11 - 23 * s.arm + swing * sd;
          var d = 'M' + r1(sx) + ' ' + r1(sy) + ' L' + r1(ex) + ' ' + r1(ey);
          arms[i][0].setAttribute('d', d); arms[i][1].setAttribute('d', d);
        });
        var hy = headY(f), hs = headS(f);
        set(tie, { transform: 'translate(50 ' + r1(hy + 17 * hs - 1.5) + ') rotate(' + r1(8 + swing * 2) + ')' });
        set(head, { transform: 'translate(50 ' + r1(hy) + ') scale(' + r1(hs * 100) / 100 + ')' });
        cheeks.forEach(function (c) { c.setAttribute('opacity', r1(Math.min(1, f * 1.6) * 0.6)); });
        var lx = s.look ? s.look.x : 0, ly = s.look ? s.look.y : 0;
        eyes.forEach(function (e) { e.setAttribute('ry', r1(4.8 * (1 - s.blink * 0.9))); });
        pupils.forEach(function (p, i) {
          set(p, { cx: r1((i ? 7 : -7) + lx * 1.8), cy: r1(-4 + ly * 1.6), opacity: s.blink > 0.5 ? 0 : 1 });
        });
        var k = s.mouth;
        if (k < 0.06) { open.setAttribute('display', 'none'); shut.removeAttribute('display'); }
        else {
          shut.setAttribute('display', 'none'); open.removeAttribute('display');
          open.setAttribute('transform', 'translate(0 2.5) scale(1 ' + r1(k * 100) / 100 + ') translate(0 -2.5)');
        }
      }
      return {
        svg: svg, update: update,
        mouthY: function (f) { return headY(f) + 10 * headS(f); },
        headTop: function (f) { return headY(f) - 22 * headS(f); }
      };
    }

    /* ---------- the behaviour ---------- */
    function SlopGoblin(opts) {
      opts = opts || {};
      var root = opts.root || D.body;
      var RE = new RegExp(RE_SRC, 'gi');
      var reduce = !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches);
      var K = opts.scale || 1; // draws the goblin, his bubble and the bill bigger (used for recording video)
      function px(n) { return (n * K) + 'px'; }
      var art = buildArt();
      var api = { alive: true };
      var flying = [];

      var wrap = el('div', { position: 'fixed', left: '0', top: '0', zIndex: String(Z), cursor: 'pointer',
        willChange: 'transform', margin: '0', padding: '0', border: '0', background: 'transparent' }, D.body);
      wrap.title = 'Slop Goblin: click to poke, Esc to send home';
      wrap.appendChild(art.svg);

      var bubble = el('div', { position: 'fixed', left: '0', top: '0', zIndex: String(Z), pointerEvents: 'none',
        background: '#fffef6', color: '#1c2317', border: px(2) + ' solid #1c2317', borderRadius: px(12),
        padding: px(5) + ' ' + px(10), font: '600 ' + px(13) + '/1.25 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        whiteSpace: 'normal', maxWidth: 'min(' + px(300) + ', calc(100vw - 16px))', boxShadow: px(3) + ' ' + px(3) + ' 0 #1c2317', opacity: '0', transition: 'opacity .18s',
        margin: '0', textAlign: 'center', letterSpacing: 'normal', textTransform: 'none' }, D.body);
      var bubbleText = el('div', { display: 'none' }, bubble);
      var wordRow = el('div', { display: 'none', alignItems: 'baseline', justifyContent: 'center', gap: px(6) }, bubble);
      var wordLabel = el('span', { font: '700 ' + px(10) + '/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        letterSpacing: '.1em', textTransform: 'uppercase', color: '#56614e' }, wordRow);
      var wordChip = el('span', { background: '#f6d84a', color: '#1c2317', borderRadius: px(6), padding: px(2) + ' ' + px(7),
        font: '800 ' + px(15) + '/1.2 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }, wordRow);
      el('div', { position: 'absolute', left: '50%', bottom: px(-7), width: px(10), height: px(10),
        background: '#fffef6', borderRight: '2px solid #1c2317', borderBottom: '2px solid #1c2317',
        transform: 'translateX(-50%) rotate(45deg)' }, bubble);

      /* HUD */
      var hud = el('div', { position: 'fixed', left: '16px', bottom: '16px', zIndex: String(Z - 1),
        background: '#1c2317', color: '#eef3e4', borderRadius: '14px', padding: '12px 14px',
        font: '12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', boxShadow: '0 8px 30px rgba(0,0,0,.3)',
        minWidth: '210px', maxWidth: '300px', userSelect: 'none', textAlign: 'left', letterSpacing: 'normal' }, D.body);
      if (W.innerWidth < 600) css(hud, { left: '8px', bottom: '8px', minWidth: '0', maxWidth: 'calc(100vw - 16px)', padding: '9px 11px', fontSize: '11px' });
      var row1 = el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }, hud);
      el('span', { fontWeight: '700', letterSpacing: '.12em', color: '#a6c77e', fontSize: '11px' }, row1).textContent = 'SLOP GOBLIN';
      var btns = el('span', { display: 'flex', gap: '6px' }, row1);
      function mkBtn(label, fn) {
        var b = el('button', { background: 'transparent', color: '#eef3e4', border: '1px solid rgba(238,243,228,.35)',
          borderRadius: '7px', padding: '3px 8px', font: 'inherit', fontSize: '11px', cursor: 'pointer', lineHeight: '1.2' }, btns);
        b.type = 'button'; b.textContent = label; b.addEventListener('click', function (e) { e.stopPropagation(); fn(); });
        return b;
      }
      var pauseBtn = mkBtn('Pause', function () { togglePause(); });
      mkBtn('Receipt', function () { showReceipt(); });
      mkBtn('✕', function () { dismiss(); }).setAttribute('aria-label', 'Send the goblin home');
      var row2 = el('div', { display: 'flex', alignItems: 'baseline', gap: '8px' }, hud);
      var hudCount = el('span', { font: '800 30px/1 system-ui, -apple-system, "Segoe UI", sans-serif', fontVariantNumeric: 'tabular-nums' }, row2);
      el('span', { color: 'rgba(238,243,228,.7)' }, row2).textContent = 'buzzwords eaten';
      var row3 = el('div', { marginTop: '6px' }, hud);
      el('span', { color: 'rgba(238,243,228,.6)' }, row3).textContent = 'Girth ';
      var hudGirth = el('span', { fontWeight: '700' }, row3);
      var row4 = el('div', {}, hud);
      el('span', { color: 'rgba(238,243,228,.6)' }, row4).textContent = 'Last bite ';
      var hudLast = el('span', { color: '#f6d84a', fontWeight: '700' }, row4);
      var row5 = el('div', {}, hud);
      el('span', { color: 'rgba(238,243,228,.6)' }, row5).textContent = 'Posts opened ';
      var hudOpened = el('span', { fontWeight: '700' }, row5);
      hudOpened.textContent = '0';
      var row6 = el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
        marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(238,243,228,.15)' }, hud);
      el('span', { color: 'rgba(238,243,228,.6)' }, row6).textContent = 'Translator';
      var trBtn = el('button', { border: '1px solid rgba(238,243,228,.35)', borderRadius: '7px', padding: '3px 10px',
        font: 'inherit', fontSize: '11px', fontWeight: '700', cursor: 'pointer', lineHeight: '1.2' }, row6);
      trBtn.type = 'button';
      function setTranslate(on) {
        st.translate = on; trBtn.textContent = on ? 'On' : 'Off'; trBtn.setAttribute('aria-pressed', String(on));
        css(trBtn, { background: on ? '#86ad5e' : 'transparent', color: on ? '#1c2317' : '#eef3e4' });
      }
      trBtn.addEventListener('click', function (e) {
        e.stopPropagation(); setTranslate(!st.translate);
        say(st.translate ? 'Translator on. Plain English incoming.' : 'Translator off. Just eating.', 1600);
      });
      hudCount.textContent = '0'; hudGirth.textContent = girthFor(0) + ' · 0 servings'; hudLast.textContent = '—';
      if (opts.hud === false) hud.style.display = 'none';

      var vh0 = W.innerHeight;
      var st = { x: -50, y: vh0 * 0.62, eaten: 0, servings: 0, opened: 0, f: 0, fShown: 0, mode: 'enter', target: null,
        mouth: 0, arm: 0, wob: 0, phase: 0, blink: 0, blinkT: 0, nextBlink: 2.5, look: { x: 1, y: 0 },
        paused: false, since: 0, emptyScrolls: 0, busyUntil: 0, bubbleUntil: 0, chompUntil: 0, moving: false, log: [] };
      var bubbleW = 0, bubbleH = 0, bubbleKey = '', phrase = '', scroller = null;
      var skipSel = opts.video ? SKIP + ',' + BLUR_SEL : SKIP; // in video mode, never eat (and so reveal) blurred text
      setTranslate(opts.translate !== false);

      /* Phrases (greetings, burps, reactions) sit on the top line of the bubble;
         the word being hunted or eaten sits underneath in a yellow chip. */
      function say(text, ms) { phrase = text; st.bubbleUntil = performance.now() + (ms || 1800); }
      function syncBubble(now) {
        var p = now < st.bubbleUntil ? phrase : '';
        var t = st.target, spitting = st.mode === 'spit';
        var showWord = !!t && (st.mode === 'walk' || st.mode === 'eat' || st.mode === 'poke' || spitting);
        var chip = spitting ? st.spitText : !t ? '' : t.type === 'more' ? '…more' : t.word;
        var key = p + '\u0000' + (showWord ? st.mode + ':' + chip : '');
        if (key === bubbleKey) return;
        bubbleKey = key;
        bubbleText.textContent = p; bubbleText.style.display = p ? 'block' : 'none';
        if (showWord) {
          wordLabel.textContent = spitting ? 'means' : t.type === 'more' ? 'opening' : st.mode === 'eat' ? 'eating' : 'spotted';
          wordChip.textContent = chip;
          wordRow.style.display = 'flex'; wordRow.style.marginTop = p ? '5px' : '0';
        } else wordRow.style.display = 'none';
        var on = !!(p || showWord);
        bubble.style.opacity = on ? '1' : '0';
        if (on) { bubbleW = bubble.offsetWidth; bubbleH = bubble.offsetHeight; }
      }
      function sizePx(f) { return BASE * K * (1 + 1.25 * f); }
      function speed() { return K * Math.max(90, 250 / (1 + 1.4 * st.fShown)); }

      function moveTo(tx, ty, dt) {
        var dx = tx - st.x, dy = ty - st.y, d = Math.hypot(dx, dy), step = speed() * dt;
        if (d <= Math.max(step, 1.5)) { st.x = tx; st.y = ty; st.moving = false; return true; }
        st.x += dx / d * step; st.y += dy / d * step; st.phase += step / 7; st.moving = true;
        st.look = { x: dx / d, y: dy / d };
        return false;
      }

      function hit(x, y) {
        var list = D.elementsFromPoint(x, y);
        for (var i = 0; i < list.length; i++) if (!list[i].closest('[' + TAG + ']')) return list[i];
        return null;
      }
      function accept(n) {
        var v = n.nodeValue;
        if (!v || v.length < 3) return NodeFilter.FILTER_REJECT;
        if (!hasSlop(v)) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p || p.closest(skipSel) || p.isContentEditable) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
      function findTarget() {
        var vw = W.innerWidth, vh = W.innerHeight, best = null, bestScore = Infinity, seen = 0, cache = new Map();
        var walker = D.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: accept });
        var rg = D.createRange(), n;
        outer: while ((n = walker.nextNode())) {
          var bites = findSlop(n.nodeValue);
          for (var k = 0; k < bites.length; k++) {
            var b = bites[k];
            rg.setStart(n, b[0]); rg.setEnd(n, b[1]);
            var r = rg.getClientRects()[0], rb = rg.getBoundingClientRect();
            if (!r || r.width < 2 || r.height < 4) continue;
            if (rb.top < 10 || rb.bottom > vh - 110 * K || rb.left < 4 || rb.right > vw - 4) continue;
            var cx = r.left + r.width / 2, cy = r.top + r.height / 2, p = n.parentElement, h = hit(cx, cy);
            if (!h || !(h === p || p.contains(h) || h.contains(p))) continue;
            if (clipped(rb, p, cache)) continue;
            var score = Math.hypot(cx - st.x, cy - st.y) + cy * 0.6;
            if (score < bestScore) { bestScore = score; best = { type: 'word', node: n, start: b[0], word: b[2] }; }
            if (++seen > 60) break outer;
          }
        }
        return best;
      }
      /* Text cut off by a "…more" clamp still has a layout box; it is just clipped by an ancestor. */
      function clipped(r, p, cache) {
        for (var e = p; e && e !== D.body && e !== D.documentElement; e = e.parentElement) {
          var cr = cache.get(e);
          if (cr === undefined) {
            var cs = getComputedStyle(e);
            cr = (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') ? e.getBoundingClientRect() : null;
            cache.set(e, cr);
          }
          if (cr && (r.top < cr.top - 1 || r.bottom > cr.bottom + 1 || r.left < cr.left - 1 || r.right > cr.right + 1)) return true;
        }
        return false;
      }

      /* "…more" buttons: open a truncated post when slop is hiding in it,
         or when the goblin has already eaten something from that post. */
      var MORE_RE = /^(?:(?:…|\.\.\.)\s*(?:see |show |read )?more|(?:see|show|read) more)$/i;
      var opened = new WeakSet();
      function isMoreBtn(b) {
        if (opened.has(b)) return false;
        if (b.getAttribute('aria-expanded') === 'true' || b.hasAttribute('aria-haspopup')) return false;
        if (b.closest('a[href], [' + TAG + '], [data-goblin-ignore]')) return false;
        if (b.type === 'submit' && b.form) return false;
        var txt = (b.textContent || '').replace(/\s+/g, ' ').trim();
        return (txt.length < 24 && MORE_RE.test(txt)) || /^see more\b/i.test(b.getAttribute('aria-label') || '');
      }
      function worthOpening(b) {
        var e = b.parentElement;
        for (var i = 0; e && e !== D.body && i < 4; i++, e = e.parentElement) {
          if (e.querySelector('[data-slop-eaten]')) return true;
          if (D.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: accept }).nextNode()) return true;
        }
        return false;
      }
      function findMore() {
        var vw = W.innerWidth, vh = W.innerHeight, best = null, bestScore = Infinity;
        var list = root.querySelectorAll('button, [role="button"]');
        for (var i = 0; i < list.length; i++) {
          var b = list[i];
          if (!isMoreBtn(b)) continue;
          var r = b.getBoundingClientRect();
          if (r.width < 4 || r.height < 4 || r.top < 10 || r.bottom > vh - 110 * K || r.left < 4 || r.right > vw - 4) continue;
          var cx = r.left + r.width / 2, cy = r.top + r.height / 2, h = hit(cx, cy);
          if (!h || !(h === b || b.contains(h))) continue;
          if (!worthOpening(b)) continue;
          var score = Math.hypot(cx - st.x, cy - st.y) + cy * 0.6;
          if (score < bestScore) { bestScore = score; best = b; }
        }
        return best ? { type: 'more', btn: best } : null;
      }
      function nextJob() { return findTarget() || findMore(); }
      function targetRect(t) {
        if (!t) return null;
        if (t.type === 'more') {
          if (!t.btn.isConnected || opened.has(t.btn)) return null;
          var r = t.btn.getBoundingClientRect();
          return r.width > 0 ? r : null;
        }
        return valid(t) ? rectOf(t) : null;
      }
      function startPoke(t) {
        st.mode = 'poke';
        say(pick(['Ooh, there’s more.', '…more? Don’t mind if I do.', 'What are you hiding?', 'Show me the rest.']), 1500);
        setTimeout(function () {
          if (!api.alive) return;
          opened.add(t.btn);
          if (t.btn.animate) t.btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.88)' }, { transform: 'scale(1)' }], { duration: 220 });
          // LinkedIn moves focus onto the expanded text, which draws a focus ring; hand focus back afterwards.
          var box = t.btn;
          for (var i = 0; i < 4 && box.parentElement && box.parentElement !== D.body; i++) box = box.parentElement;
          try { t.btn.click(); } catch (err) { /* page said no */ }
          setTimeout(function () {
            var a = D.activeElement;
            if (a && a !== D.body && box.contains(a) && a.blur) a.blur();
          }, 150);
          st.opened++; hudOpened.textContent = String(st.opened); st.wob = 0.6;
          setTimeout(function () { if (api.alive) { st.mode = 'hunt'; st.busyUntil = 0; } }, 450);
        }, 380);
      }
      function valid(t) { return t && t.node.isConnected && t.node.nodeValue.substr(t.start, t.word.length) === t.word; }
      function rectOf(t) {
        var rg = D.createRange(); rg.setStart(t.node, t.start); rg.setEnd(t.node, t.start + t.word.length);
        return rg.getClientRects()[0] || null;
      }
      function dest(r) {
        var vw = W.innerWidth, w = sizePx(st.fShown), gap = (24 / 140) * w + 6;
        var mid = (r.left + r.right) / 2, roomR = r.right + gap + w * 0.5 < vw, roomL = r.left - gap - w * 0.5 > 0;
        var right = st.x >= mid ? (roomR || !roomL) : !(roomL || !roomR);
        return { x: right ? r.right + gap : r.left - gap, y: (r.top + r.bottom) / 2 };
      }

      function pos(t) { return t === W ? (W.scrollY || D.documentElement.scrollTop || 0) : t.scrollTop; }
      function findScroller() {
        var e = hit(W.innerWidth / 2, W.innerHeight / 2);
        while (e && e !== D.body && e !== D.documentElement) {
          var cs = getComputedStyle(e);
          if (/(auto|scroll|overlay)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 40) return e;
          e = e.parentElement;
        }
        return null;
      }
      function scrollDown(cb) {
        var tgt = scroller || W, before = pos(tgt);
        tgt.scrollBy({ top: Math.round(W.innerHeight * 0.55), behavior: reduce ? 'auto' : 'smooth' });
        setTimeout(function () {
          if (pos(tgt) - before > 4) return cb(true);
          if (!scroller) { scroller = findScroller(); if (scroller) return scrollDown(cb); }
          cb(false);
        }, 600);
      }

      function hunt(now) {
        var t = nextJob();
        if (t) { st.target = t; st.mode = 'walk'; st.since = now; st.emptyScrolls = 0; return; }
        // Admire the last translation for a moment before scrolling it out of view.
        var ls = st.lastSpan, lr = ls && ls.isConnected && ls.getBoundingClientRect();
        if (lr && now < st.lastReveal + ADMIRE_MS && lr.bottom > 0 && lr.top < W.innerHeight) {
          if (st.admired !== st.lastReveal) {
            st.admired = st.lastReveal;
            if (Math.random() < 0.7) say(pick(['Much better.', 'Ahh. Readable.', 'Plain English. You’re welcome.', 'Now it says something.', 'Translated. Next!']), 1600);
          }
          var ax = lr.left + lr.width / 2 - st.x, ay = lr.top + lr.height / 2 - st.y, ad = Math.hypot(ax, ay) || 1;
          st.look = { x: ax / ad, y: ay / ad };
          st.busyUntil = st.lastReveal + ADMIRE_MS;
          return;
        }
        if (opts.autoScroll === false) return rest(now);
        st.mode = 'scroll';
        if (st.emptyScrolls === 0) say(pick(['*sniff sniff*', 'I smell more below…', 'Scrolling for slop…']));
        else if (st.emptyScrolls % 4 === 0) say('No slop here!', 1600);
        scrollDown(function (moved) {
          if (!api.alive) return;
          if (moved && st.emptyScrolls < 30) { st.emptyScrolls++; st.mode = 'hunt'; st.busyUntil = performance.now() + 250; }
          else rest(performance.now());
        });
      }
      function rest(now) {
        st.mode = 'rest'; st.busyUntil = now + 2500; st.wob = 0.5;
        say(st.eaten ? 'Nothing left but substance.' : 'No slop here. Suspicious.', 3200);
        if (opts.onEmpty) opts.onEmpty(st.eaten);
      }

      function startEat(t) {
        st.mode = 'eat';
        var mid = t.node.splitText(t.start);
        mid.splitText(t.word.length);
        var span = D.createElement('span');
        span.setAttribute('data-slop-eaten', '');
        mid.parentNode.replaceChild(span, mid); span.appendChild(mid);
        var cs = getComputedStyle(span);
        var font = { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
          fontStyle: cs.fontStyle, letterSpacing: cs.letterSpacing, color: cs.color };
        var chars = [], rg = D.createRange();
        for (var i = 0; i < t.word.length; i++) {
          if (t.word[i] === ' ') continue;
          rg.setStart(mid, i); rg.setEnd(mid, i + 1);
          var cr = rg.getClientRects()[0]; if (cr) chars.push({ ch: t.word[i], r: cr });
        }
        css(span, { color: 'transparent', webkitTextFillColor: 'transparent', textShadow: 'none',
          textDecoration: 'underline dotted', textDecorationColor: 'rgba(128,128,128,.55)', userSelect: 'none' });
        var mx = st.x, my = st.y, n = chars.length, done = 0;
        var stagger = Math.max(22, Math.min(55, 420 / Math.max(1, n)));
        if (!n) return finishEat(t.word, span, font);
        chars.forEach(function (c, i) {
          var L = el('span', { position: 'fixed', left: c.r.left + 'px', top: c.r.top + 'px', height: c.r.height + 'px',
            lineHeight: c.r.height + 'px', zIndex: String(Z), pointerEvents: 'none', whiteSpace: 'pre', margin: '0', padding: '0',
            fontFamily: font.fontFamily, fontSize: font.fontSize, fontWeight: font.fontWeight, fontStyle: font.fontStyle,
            letterSpacing: font.letterSpacing, color: font.color, background: 'transparent' }, D.body);
          L.textContent = c.ch; flying.push(L);
          var dx = mx - (c.r.left + c.r.width / 2), dy = my - (c.r.top + c.r.height / 2);
          var rot = reduce ? 0 : (Math.random() * 2 - 1) * 220;
          var a = L.animate([
            { transform: 'translate(0px,0px) rotate(0deg) scale(1)', opacity: 1 },
            { transform: 'translate(' + dx * 0.45 + 'px,' + (dy * 0.45 - 20) + 'px) rotate(' + rot * 0.5 + 'deg) scale(.9)', opacity: 1, offset: 0.55 },
            { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg) scale(.12)', opacity: 0.35 }
          ], { duration: 430, delay: 90 + i * stagger, easing: 'ease-in', fill: 'forwards' });
          a.onfinish = function () {
            L.remove(); st.wob = Math.min(0.4, st.wob + 0.08);
            if (++done === n) finishEat(t.word, span, font);
          };
        });
      }
      function line(w) {
        var lw = w.toLowerCase();
        if (lw === 'agree?') return 'Agree.';
        if (lw === '10x') return '10x crunchier';
        if (w.length > 16) return pick(['tastes like a keynote', 'so hollow. so good.', 'that was mostly air', 'a whole sentence of nothing',
          'hint of ring light', 'crunchy', 'chewed that one for ages']);
        return pick(['mmm, ' + lw, lw + ': 0% substance', '*burp* …' + lw, 'tastes like a keynote',
          'artisanal ' + lw, 'crunchy', 'so hollow. so good.', 'one more ' + lw, 'hint of ring light']);
      }
      function finishEat(word, span, font) {
        var prev = girthFor(st.servings), serv = servingsFor(word);
        st.eaten++; st.servings += serv; st.f = fatFor(st.servings);
        st.chompUntil = performance.now() + 420; st.wob = 0.55 + 0.15 * serv;
        var g = girthFor(st.servings), out = st.translate ? plainFor(word) : '';
        hudCount.textContent = String(st.eaten);
        hudGirth.textContent = g + ' · ' + st.servings + (st.servings === 1 ? ' serving' : ' servings');
        hudLast.textContent = out ? word + ' → ' + out : word;
        st.log.push({ bite: word, out: out || plainFor(word), serv: serv });
        if (serv > 1) floatServings(serv);
        if (g !== prev) {
          say('*BURP* → ' + g.toLowerCase(), 2000);
          if (hudGirth.animate) hudGirth.animate([{ color: '#f6d84a' }, { color: '#eef3e4' }], { duration: 1200 });
        } else if (serv === 3 && Math.random() < 0.5) {
          say(pick(['a three-course meal', '*loosens tie*', 'that one had a crust', 'a full meal of nothing', 'I may need a lie-down']));
        } else if (st.eaten <= 2 || Math.random() < 0.4) say(line(word));
        if (opts.onEat) opts.onEat(st.eaten, word, g);
        function next() { if (api.alive) { st.mode = 'hunt'; st.busyUntil = 0; } }
        setTimeout(function () {
          if (!api.alive) return;
          if (out && span && span.isConnected && span.firstChild) spit(span, word, out, font, next); else next();
        }, out ? 400 : 520);
      }
      /* A "+3" that floats up beside his head when a phrase counts for extra servings. */
      function floatServings(n) {
        var f = st.fShown, w = sizePx(f);
        var top = st.y - 6, left = st.x + w * 0.42;
        var tag = el('div', { position: 'fixed', left: left + 'px', top: top + 'px', zIndex: String(Z), pointerEvents: 'none',
          font: '900 ' + px(20) + '/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', color: '#f6d84a', letterSpacing: 'normal',
          textShadow: '0 0 1px #1c2317, 1px 1px 0 #1c2317, -1px 1px 0 #1c2317, 1px -1px 0 #1c2317, -1px -1px 0 #1c2317, 2px 3px 0 #1c2317',
          margin: '0', padding: '0', background: 'transparent', whiteSpace: 'nowrap' }, D.body);
        tag.textContent = '+' + n; flying.push(tag);
        var a = tag.animate([
          { transform: 'translateY(' + px(6) + ') scale(.6)', opacity: 0 },
          { transform: 'translateY(' + px(-6) + ') scale(1.15)', opacity: 1, offset: 0.2 },
          { transform: 'translateY(' + px(-44) + ') scale(1)', opacity: 0 }
        ], { duration: 1300, easing: 'ease-out', fill: 'forwards' });
        a.onfinish = function () { tag.remove(); };
      }

      /* Translator mode: spit the plain-English version back into the sentence. */
      function fixArticle(prevNode, out) {
        if (!prevNode || prevNode.nodeType !== 3) return;
        var v = prevNode.nodeValue, m = /(^|\s)(an?|An?)\s$/.exec(v);
        if (!m) return;
        var art = m[2], an = /^[aeiou]/i.test(out) && !/^(one|use|uni|eu)/i.test(out);
        var want = (art[0] === 'A' ? 'A' : 'a') + (an ? 'n' : '');
        if (want !== art) prevNode.nodeValue = v.slice(0, v.length - art.length - 1) + want + ' ';
      }
      function spit(span, orig, out, font, done) {
        st.mode = 'spit'; st.spitText = out;
        var tn = span.firstChild;
        tn.nodeValue = out;
        fixArticle(span.previousSibling, out);
        span.style.textDecoration = 'none';
        var reveal = function () {
          css(span, { color: '', webkitTextFillColor: '', background: 'rgba(134,173,94,.3)', borderRadius: '3px',
            boxDecorationBreak: 'clone', webkitBoxDecorationBreak: 'clone', padding: '0 2px', userSelect: '' });
          span.title = 'Slop Goblin translation of “' + orig + '”';
          if (span.animate) span.animate([{ background: 'rgba(246,216,74,.95)' }, { background: 'rgba(246,216,74,.95)', offset: 0.35 },
            { background: 'rgba(134,173,94,.3)' }], { duration: 1800, easing: 'ease-out' });
          st.lastReveal = performance.now(); st.lastSpan = span;
          st.pendingReveal = null;
        };
        st.pendingReveal = reveal;
        var rg = D.createRange(), chars = [];
        for (var i = 0; i < out.length; i++) {
          if (out[i] === ' ') continue;
          rg.setStart(tn, i); rg.setEnd(tn, i + 1);
          var r = rg.getClientRects()[0]; if (r) chars.push({ ch: out[i], r: r });
        }
        var n = chars.length, landed = 0;
        if (!n) { reveal(); return done(); }
        var stagger = Math.max(18, Math.min(45, 360 / n)), mx = st.x, my = st.y;
        chars.forEach(function (c, i) {
          var L = el('span', { position: 'fixed', left: c.r.left + 'px', top: c.r.top + 'px', height: c.r.height + 'px',
            lineHeight: c.r.height + 'px', zIndex: String(Z), pointerEvents: 'none', whiteSpace: 'pre', margin: '0', padding: '0',
            fontFamily: font.fontFamily, fontSize: font.fontSize, fontWeight: font.fontWeight, fontStyle: font.fontStyle,
            letterSpacing: font.letterSpacing, color: font.color, background: 'transparent' }, D.body);
          L.textContent = c.ch; flying.push(L);
          var dx = mx - (c.r.left + c.r.width / 2), dy = my - (c.r.top + c.r.height / 2);
          var rot = reduce ? 0 : (Math.random() * 2 - 1) * 160;
          var a = L.animate([
            { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg) scale(.15)', opacity: 0 },
            { transform: 'translate(' + dx * 0.9 + 'px,' + dy * 0.9 + 'px) rotate(' + rot * 0.9 + 'deg) scale(.3)', opacity: 1, offset: 0.1 },
            { transform: 'translate(' + dx * 0.45 + 'px,' + (dy * 0.45 - 24) + 'px) rotate(' + rot * 0.4 + 'deg) scale(.85)', opacity: 1, offset: 0.5 },
            { transform: 'translate(0px,0px) rotate(0deg) scale(1)', opacity: 1 }
          ], { duration: 400, delay: 40 + i * stagger, easing: 'ease-out', fill: 'both' });
          a.onfinish = function () {
            L.remove();
            if (++landed === n) { reveal(); done(); }
          };
        });
      }

      function tick(dt, now) {
        var vw = W.innerWidth, vh = W.innerHeight;
        st.fShown += (st.f - st.fShown) * Math.min(1, dt * 4);
        st.wob *= Math.pow(0.03, dt);
        st.nextBlink -= dt;
        if (st.nextBlink <= 0) { st.blinkT = 0.14; st.nextBlink = 2 + Math.random() * 4; }
        st.blinkT -= dt; st.blink = st.blinkT > 0 ? 1 : 0;
        if (st.mode !== 'walk' && st.mode !== 'enter') st.moving = false;
        switch (st.mode) {
          case 'enter':
            if (moveTo(Math.min(vw * 0.28, 220), vh * 0.62, dt)) {
              var host = (location.hostname || '').toLowerCase();
              say(opts.greeting || (host.indexOf('linkedin') > -1 ? 'Ooh. LinkedIn.' : 'Ooh. Snacks.'), 1600);
              st.mode = 'hunt'; st.busyUntil = now + 900;
            }
            break;
          case 'hunt': if (now >= st.busyUntil) hunt(now); break;
          case 'walk':
            var t = st.target, r = targetRect(t);
            if (!r || r.bottom < 0 || r.top > vh) { st.mode = 'hunt'; break; }
            var d = dest(r);
            if (moveTo(d.x, d.y, dt)) {
              st.look = { x: r.left > st.x ? 1 : -1, y: 0 };
              if (t.type === 'more') startPoke(t); else startEat(t);
            }
            else if (now - st.since > 9000) st.mode = 'hunt';
            break;
          case 'rest':
            if (now >= st.busyUntil) {
              st.busyUntil = now + 2500;
              var nt = nextJob();
              if (nt) { st.target = nt; st.mode = 'walk'; st.since = now; say('Oh! More.'); }
              else st.wob = 0.45;
            }
            break;
        }
      }

      function render(dt, now) {
        var f = st.fShown;
        if (now < st.chompUntil) st.mouth = Math.abs(Math.sin((st.chompUntil - now) / 420 * Math.PI * 3));
        else st.mouth += ((st.mode === 'eat' || st.mode === 'spit' ? 1 : 0) - st.mouth) * Math.min(1, dt * 14);
        st.arm += ((st.mode === 'eat' || st.mode === 'poke' || st.mode === 'spit' ? 1 : 0) - st.arm) * Math.min(1, dt * 10);
        var wob = st.wob * Math.sin(now / 1000 * 38) + (reduce ? 0 : Math.sin(now / 1000 * 2.2) * 0.12);
        art.update({ f: f, walk: st.moving ? st.phase : null, mouth: st.mouth, arm: st.arm, look: st.look, blink: st.blink, wob: wob });
        var w = sizePx(f), h = w * 120 / 140, my = art.mouthY(f) / 120 * h;
        var hop = st.moving && !reduce ? -Math.abs(Math.sin(st.phase)) * 5 * (1 - 0.5 * f) : 0;
        wrap.style.width = w + 'px'; wrap.style.height = h + 'px';
        wrap.style.transform = 'translate(' + (st.x - w / 2) + 'px,' + (st.y - my + hop) + 'px)';
        syncBubble(now);
        var bx = Math.max(bubbleW / 2 + 8, Math.min(W.innerWidth - bubbleW / 2 - 8, st.x));
        var by = Math.max(bubbleH + 12, st.y - my + art.headTop(f) / 120 * h - 10 + hop);
        bubble.style.transform = 'translate(' + bx + 'px,' + by + 'px) translate(-50%,-100%)';
      }

      var last = performance.now(), raf = 0;
      function frame(now) {
        if (!api.alive) return;
        var dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
        if (!st.paused) tick(dt, now);
        render(dt, now);
        raf = requestAnimationFrame(frame);
      }

      function togglePause() {
        st.paused = !st.paused; pauseBtn.textContent = st.paused ? 'Resume' : 'Pause';
        if (st.paused) say('On a break. Oat latte.', 1500);
      }
      function poke() {
        st.wob = 0.9;
        say(pick(['I’m working here.', 'Busy. Digesting synergy.', 'No refunds.', 'Per my last burp…', 'Let’s take this offline.']));
      }
      function onKey(e) {
        if (receiptEl) return;
        if (e.key === 'Escape') { dismiss(); return; }
        // Hidden shortcut: V switches to video mode (blurred names and faces) for screen recording.
        if ((e.key === 'v' || e.key === 'V') && !opts.video && !e.metaKey && !e.ctrlKey && !e.altKey) {
          var t = e.target;
          if (t && t.closest && (t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]') || t.isContentEditable)) return;
          dismiss(true); startVideoMode();
        }
      }
      function dismiss(silent) {
        if (!api.alive) return;
        api.alive = false; cancelAnimationFrame(raf);
        if (st.pendingReveal) st.pendingReveal();
        [wrap, bubble, hud].concat(flying).forEach(function (e) { if (e.isConnected) e.remove(); });
        W.removeEventListener('keydown', onKey, true);
        if (W.__slopGoblin === api) W.__slopGoblin = null;
        if (opts.onDismiss) opts.onDismiss(st.eaten);
        if (!receiptEl && opts.receipt !== false && silent !== true) showReceipt();
        if (opts.video && !receiptEl) setVideoMode(false);
      }

      /* ---------- the bill ---------- */
      var receiptEl = null, receiptKey = null, pausedBefore = false;
      function receiptData() {
        var tally = {}, best = null;
        st.log.forEach(function (e) {
          var k = e.bite.toLowerCase(), t = tally[k] || (tally[k] = { bite: e.bite, n: 0, serv: 0 });
          t.n++; t.serv += e.serv;
          if (e.out && (!best || e.serv > best.serv || (e.serv === best.serv && e.bite.length > best.bite.length))) best = e;
        });
        var items = Object.keys(tally).map(function (k) { return tally[k]; })
          .sort(function (a, b) { return b.serv - a.serv || b.n - a.n; });
        var when = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        return { items: items, best: best, eaten: st.eaten, servings: st.servings, opened: st.opened, girth: girthFor(st.servings),
          f: st.f, when: when, where: opts.siteLabel || (location.hostname || 'this page').replace(/^www\./, '') };
      }
      function showReceipt() {
        if (receiptEl || !st.eaten) { if (!st.eaten) say('Nothing on the bill yet.', 1400); return; }
        pausedBefore = st.paused; st.paused = true;
        var cv = drawReceipt(receiptData());
        receiptEl = el('div', { position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', zIndex: String(Z + 1),
          background: 'rgba(18,22,14,.62)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', boxSizing: 'border-box', margin: '0' }, D.body);
        receiptEl.setAttribute('role', 'dialog'); receiptEl.setAttribute('aria-label', 'Slop Goblin receipt');
        var col = el('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', maxHeight: '100%' }, receiptEl);
        cv.setAttribute(TAG, '');
        cv.setAttribute('role', 'img');
        cv.setAttribute('aria-label', 'Receipt: ' + st.eaten + ' buzzwords, ' + st.servings + ' servings, girth ' + girthFor(st.servings));
        css(cv, { width: 'auto', height: 'auto', maxWidth: 'min(' + px(400) + ', 92vw)', maxHeight: 'calc(100vh - ' + px(110) + ')', display: 'block',
          filter: 'drop-shadow(0 12px 28px rgba(0,0,0,.4))' });
        col.appendChild(cv);
        var bar = el('div', { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }, col);
        function btn(label, primary, fn) {
          var b = el('button', { font: '700 ' + px(13) + '/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', padding: px(10) + ' ' + px(15),
            borderRadius: '999px', cursor: 'pointer', border: '2px solid #1c2317', letterSpacing: 'normal',
            background: primary ? '#f6d84a' : '#fffdf6', color: '#1c2317', boxShadow: '2px 2px 0 #1c2317' }, bar);
          b.type = 'button'; b.textContent = label;
          b.addEventListener('click', function (e) { e.stopPropagation(); fn(b); });
          return b;
        }
        btn('Save image', true, function (b) {
          cv.toBlob(function (blob) {
            if (!blob) { b.textContent = 'Couldn’t save'; return; }
            var u = URL.createObjectURL(blob), a = D.createElement('a');
            a.href = u; a.download = 'slop-goblin-receipt.png'; a.setAttribute(TAG, ''); a.style.display = 'none';
            D.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(u); }, 5000);
            b.textContent = 'Saved';
          }, 'image/png');
        });
        btn('Copy image', false, function (b) {
          try {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': new Promise(function (res) { cv.toBlob(res, 'image/png'); }) })])
              .then(function () { b.textContent = 'Copied'; }, function () { b.textContent = 'Copy blocked: use Save'; });
          } catch (err) { b.textContent = 'Copy blocked: use Save'; }
        });
        btn(api.alive ? 'Back to eating' : 'Close', false, closeReceipt);
        receiptEl.addEventListener('click', function (e) { if (e.target === receiptEl) closeReceipt(); });
        receiptKey = function (e) { if (e.key === 'Escape') { e.stopPropagation(); closeReceipt(); } };
        W.addEventListener('keydown', receiptKey, true);
      }
      function closeReceipt() {
        if (!receiptEl) return;
        receiptEl.remove(); receiptEl = null;
        W.removeEventListener('keydown', receiptKey, true);
        st.paused = pausedBefore;
        if (opts.video && !api.alive) setVideoMode(false);
      }
      wrap.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); poke(); });
      W.addEventListener('keydown', onKey, true);

      api.poke = poke; api.dismiss = dismiss; api.pause = togglePause; api.receipt = showReceipt;
      api.eaten = function () { return st.eaten; };
      raf = requestAnimationFrame(frame);
      return api;
    }

    SlopGoblin.portrait = function (f) {
      var a = buildArt();
      a.update({ f: f, walk: null, mouth: 0, arm: 0, look: { x: 0.35, y: 0.25 }, blink: 0, wob: 0 });
      return a.svg;
    };
    SlopGoblin.fatFor = fatFor;
    SlopGoblin.menuSize = FOOD.length + 1;
    SlopGoblin.phraseCount = PHRASES.length;
    SlopGoblin.translate = translateText;
    SlopGoblin.site = SITE;
    SlopGoblin.drawReceipt = drawReceipt;
    SlopGoblin.video = startVideoMode;
    return SlopGoblin;
  }
})();
