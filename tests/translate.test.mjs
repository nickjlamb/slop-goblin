// The translator: what the goblin eats and what he spits back out.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../src/goblin.js';

const G = globalThis.SlopGoblin;

// Real LinkedIn-shaped sentences and the plain English they must become.
const GOLDEN = [
  ['I’m thrilled to announce that after 11 incredible years, I’m embarking on a new journey.',
    'News: after 11 incredible years, I’m starting a new job.'],
  ['In today’s fast-paced digital landscape, it’s crucial to delve into the rich tapestry of AI-powered innovation.',
    'Now, you should look at a mix of AI progress.'],
  ['Our new platform is a testament to what happens when you harness the power of transformative technology.',
    'Our new platform shows what happens when you use big technology.'],
  ['We don’t have layoffs. We have a strategic rightsizing of our talent landscape.',
    'We don’t have layoffs. We have layoffs.'],
  ['Humbled to be driving meaningful impact at the intersection of innovation and purpose.',
    'Glad to be helping between progress and purpose.'],
  ['We’re leveraging AI to unlock synergies and supercharge the next generation of customer-centric solutions.',
    'We’re using AI to cooperate and improve new products.'],
  ['Let’s double-click on how we operationalise our north star across the wider ecosystem.',
    'Let’s look at how we do our goal across the wider network.'],
  ['I didn’t just change jobs. I chose growth.', 'I didn’t just change jobs. I changed jobs.'],
  ['We’re not building a product. We’re building a movement.', 'We’re not building a product. We’re building a product.'],
  ['After 17 years in corporate, I finally understood this one simple truth. Agree?',
    'After 17 years in corporate, I finally understood something. (no question was asked)'],
  ['Unpopular opinion: I don’t know who needs to hear this, but it’s a marathon, not a sprint. Read that again.',
    'Popular opinion: (nobody asked), but it takes time. (no need).'],
  ['We’re looking for a self-starter who thrives in a fast-paced environment. We’re like a family, so you’ll wear many hats.',
    'We’re looking for an independent worker who thrives in a chaotic office. We work late, so you’ll do several jobs.'],
  ['Rise and grind. No excuses. Bet on yourself.', 'Wake up. Some excuses. Quit your job.'],
  ['Our AI-first, industry-leading platform is a groundbreaking, end-to-end solution.', 'Our product is a product.'],
  ['Let’s take this offline and circle back on the low-hanging fruit.', 'Let’s talk privately and follow up on the easy wins.'],
  ['Key takeaways from my journey:', 'What I learned:'],
  ['What are your thoughts?', '(please comment)']
];

// Every single-word form on the menu. Each must be recognised and have a translation.
const WORD_FORMS = `synergy synergies synergistic synergise synergize leverage leverages leveraged leveraging disrupt disrupts
disrupted disrupting disruption disruptions disruptive disruptor disruptors bandwidth ecosystem ecosystems stakeholder stakeholders
alignment holistic holistically scalable scalability empower empowers empowered empowering empowerment innovative innovation
innovations ideate ideation ideating learnings actionable pivot pivots pivoted pivoting unlock unlocks unlocked unlocking supercharge
supercharges supercharged supercharging unleash unleashes unleashed unleashing seamless seamlessly robust journey humbled passionate
rockstar ninja ninjas hustle grindset 10x delve delves delved delving tapestry testament landscape realm elevate elevates elevated
elevating embark embarks embarked embarking curate curated curating transformative transformational impactful agile wheelhouse
omnichannel future-proof futureproofed future-proofing operationalise operationalises operationalised operationalising
operationalisation operationalize operationalized operationalizing operationalization streamline streamlines streamlined streamlining
next-generation industry-leading revolutionary groundbreaking AI-first AI-native AI-driven AI-powered customer-centric customer-obsessed
customer-first level-set level-setting unicorn unicorns self-starter self-starters storyteller storytellers storytelling multipassionate
multi-passionate purpose-driven impact-driven mission-driven best-in-class world-class cutting-edge next-gen mission-critical
win-win patient-centric hyper-personalised hyperpersonalized`.split(/\s+/);

test('golden sentences come out in plain English', () => {
  for (const [slop, plain] of GOLDEN) assert.equal(G.translate(slop), plain);
});

test('every word on the menu is recognised and has a translation', () => {
  const missing = [];
  for (const w of WORD_FORMS) {
    const bites = G.bites(w);
    if (bites.length !== 1 || bites[0].text !== w || !bites[0].plain) missing.push(w);
  }
  assert.deepEqual(missing, [], `no plain English for: ${missing.join(', ')}`);
});

test('a phrase is eaten whole, before the buzzwords inside it', () => {
  const bites = G.bites('We leverage synergies to drive meaningful impact.');
  assert.deepEqual(bites.map(b => b.text), ['leverage synergies', 'drive meaningful impact']);
  assert.deepEqual(bites.map(b => b.plain), ['work together', 'help']);
});

test('bites come back in order and never overlap', () => {
  const text = GOLDEN.map(g => g[0]).join(' ');
  const bites = G.bites(text);
  assert.ok(bites.length > 30);
  for (let i = 0; i < bites.length; i++) {
    assert.equal(text.slice(bites[i].start, bites[i].end), bites[i].text);
    if (i) assert.ok(bites[i].start >= bites[i - 1].end, `"${bites[i - 1].text}" overlaps "${bites[i].text}"`);
  }
});

test('servings: one word is 1, two words 2, three or more 3', () => {
  const serv = s => G.bites(s)[0].servings;
  assert.equal(serv('synergy'), 1);
  assert.equal(serv('leverage synergies'), 2);
  assert.equal(serv('I’m thrilled to announce that'), 3);
});

test('girth goes up the ladder with servings', () => {
  assert.equal(G.girthFor(0), 'Peckish');
  assert.equal(G.girthFor(11), 'Well-fed');
  assert.equal(G.girthFor(120), 'Visible from space');
  assert.ok(G.fatFor(10) < G.fatFor(50) && G.fatFor(1000) < 1);
});

test('capitals are kept for sentence starts and shouting, but not forced after acronyms', () => {
  assert.equal(G.translate('Synergy is key. SYNERGY IS KEY.'), 'Teamwork is key. TEAMWORK IS KEY.');
  assert.equal(G.translate('Our AI-first platform.'), 'Our product.');
  assert.equal(G.translate('an AI-powered tool'), 'an AI tool');
});

test('a/an is fixed for the word that replaces the slop', () => {
  assert.equal(G.translate('An ecosystem of partners and an innovative solution.'), 'A group of partners and a product.');
  assert.equal(G.translate('We need an agile team'), 'We need a flexible team');
  assert.equal(G.translate('a self-starter'), 'an independent worker');
});

test('ordinary text, and words that merely contain slop, are left alone', () => {
  for (const s of ['We shipped the release on Tuesday.',
    'The journeyman fixed the robustness tests in the realms of Narnia.',
    'Nothing to see here: quarterly numbers, a bug fix and a new hire.']) {
    assert.equal(G.translate(s), s);
    assert.deepEqual(G.bites(s), []);
  }
});

test('the menu has at least 200 phrases and 80 words', () => {
  assert.ok(G.phraseCount >= 200, `only ${G.phraseCount} phrases`);
  assert.ok(G.menuSize >= 80, `only ${G.menuSize} words`);
});
