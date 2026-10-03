export type Stat = {label: string; value: string};

export type OngoingWork = {
  id: string;
  title: string;
  amount: string;
  date: string;
  reportingTime: string;
  location: string;
};

export type Payment = {id: string; title: string; amount: string; meta: string};

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled';

/** All amounts in whole rupees. Deductions are a positive number (shown as −). */
export type PaymentBreakdown = {
  gross: number;
  base: number;
  travel: number;
  food: number;
  other: number;
  bonus: number;
  overtime: number;
  deductions: number;
  net: number;
  paid: number;
  pending: number;
  route: {
    clientPayment: number;
    clientReceived: boolean;
    clientPaymentDate?: string;
    workerEarnings: number;
    narventFee: number;
    payoutStatus: PayoutStatus;
    expectedPayoutDate?: string;
    payoutMethod: string;
    payoutReference?: string;
    amountReceived?: number;
    actualPayoutDate?: string;
  };
};

export type PaymentEntry = Payment & {status?: 'paid' | 'pending' | 'cancelled'; breakdown?: PaymentBreakdown};

export type ActivityNote = {id: string; text: string; date: string};

export type DayPayout = {day: string; value: number};

export type ChatItem =
  | {id: string; kind: 'day'; text: string}
  | {id: string; kind: 'message'; from: 'bot' | 'me'; text: string}
  | {id: string; kind: 'replies'; options: string[]};

export type WorkerDetailsData = {
  payments: PaymentEntry[];
  completed: CompletedWork[];
  performance: {description: string; activity: ActivityNote[]};
  earnings: {total: string; month: string; max: number; days: DayPayout[]; activity: ActivityNote[]};
  chat: ChatItem[];
};

export type CompletedWork = {
  id: string;
  title: string;
  amount: string;
  date: string;
  location: string;
  hours: string;
  incentive: string;
  travel: string;
};

export type WorkerHomeData = {
  name: string;
  performance: {score: number; label: string};
  earnings: {monthTotal: string; bars: number[]};
  rating: {value: number; subtitle: string};
  stats: Stat[];
  ongoing: OngoingWork;
  payments: Payment[];
  completed: CompletedWork;
};

/** Mockup content — replace with API data. */
export const sampleWorkerHome: WorkerHomeData = {
  name: 'Adhil ck',
  performance: {score: 64, label: 'average'},
  earnings: {monthTotal: '₹ 7,950', bars: [86, 60, 50, 46, 100, 66, 86, 50, 16, 38, 36, 20, 10, 16, 36]},
  rating: {value: 3.5, subtitle: 'Lulu work'},
  stats: [
    {label: 'Earned', value: '₹ 7,950'},
    {label: 'Pending', value: '₹ 7,950'},
    {label: 'Works done', value: '24'},
    {label: 'Works pending', value: '2'},
  ],
  ongoing: {id: 'w1', title: 'Painting Work', amount: '₹ 700', date: 'March 15', reportingTime: '7:00 am', location: 'Thrissur'},
  payments: [
    {id: 'p1', title: 'Painting Work', amount: '₹ 700', meta: 'March 15'},
    {id: 'p2', title: 'Delivery Work', amount: '₹ 500', meta: 'Thrissur'},
  ],
  completed: {
    id: 'c1',
    title: 'Painting Work',
    amount: '₹ 700',
    date: 'March 15',
    location: 'Thrissur',
    hours: '6 hr',
    incentive: '₹50',
    travel: '₹100',
  },
};

const SCORE_TEXT =
  'A performance score is a quantifiable metric used to evaluate how effectively an individual, team, or organization completes specific tasks or meets defined goals.';
const LULU_TEXT =
  'Lulu Work score is a quantifiable metric used to evaluate how effectively an individual, team, or organization completes specific tasks or meets defined goals.';

type BreakdownInput = {
  base: number; travel?: number; food?: number; other?: number; bonus?: number; overtime?: number;
  deductions?: number; paid: number; fee: number; status: PayoutStatus;
  clientDate?: string; expected?: string; actual?: string; ref?: string; method?: string;
};

/** Derives gross / net / pending and the route amounts so sample numbers always add up. */
export function buildBreakdown(b: BreakdownInput): PaymentBreakdown {
  const [travel, food, other, bonus, overtime, deductions] = [b.travel ?? 0, b.food ?? 0, b.other ?? 0, b.bonus ?? 0, b.overtime ?? 0, b.deductions ?? 0];
  const gross = b.base + travel + food + other + bonus + overtime;
  const net = gross - deductions;
  const done = b.status === 'paid';
  return {
    gross, base: b.base, travel, food, other, bonus, overtime, deductions, net,
    paid: b.paid,
    pending: Math.max(net - b.paid, 0),
    route: {
      clientPayment: net + b.fee,
      clientReceived: !!b.clientDate,
      clientPaymentDate: b.clientDate,
      workerEarnings: net,
      narventFee: b.fee,
      payoutStatus: b.status,
      expectedPayoutDate: b.expected,
      payoutMethod: b.method ?? 'Bank Transfer',
      payoutReference: b.ref,
      amountReceived: done ? b.paid : undefined,
      actualPayoutDate: done ? b.actual : undefined,
    },
  };
}

/** Mockup content for the detail screens — replace with API data. */
export const sampleWorkerDetails: WorkerDetailsData = {
  payments: [
    {id: 'p1', title: 'Painting Work', amount: '₹ 700', meta: 'March 15', status: 'paid',
      breakdown: buildBreakdown({base: 500, travel: 100, food: 50, bonus: 50, paid: 700, fee: 30, status: 'paid', clientDate: '15 Mar 2026', expected: '18 Mar 2026', actual: '18 Mar 2026', ref: 'NRT-3C71D'})},
    {id: 'p2', title: 'Delivery Work', amount: '₹ 500', meta: 'Thrissur', status: 'paid',
      breakdown: buildBreakdown({base: 400, travel: 80, food: 40, deductions: 20, paid: 500, fee: 25, status: 'paid', clientDate: '20 Mar 2026', expected: '23 Mar 2026', actual: '22 Mar 2026', ref: 'NRT-5A02E', method: 'UPI'})},
    {id: 'p3', title: 'Electrical Maintenance', amount: '₹ 1,550', meta: 'April 2', status: 'pending',
      breakdown: buildBreakdown({base: 1100, travel: 150, food: 100, other: 50, bonus: 100, overtime: 100, deductions: 50, paid: 0, fee: 50, status: 'processing', clientDate: '26 Sep 2026', expected: '29 Sep 2026', ref: 'NRT-8F29A'})},
    {id: 'p4', title: 'Installation Work', amount: '₹ 2,600', meta: 'Kochi', status: 'pending',
      breakdown: buildBreakdown({base: 2000, travel: 300, food: 150, other: 100, bonus: 200, overtime: 250, deductions: 400, paid: 2100, fee: 120, status: 'processing', clientDate: '24 Sep 2026', expected: '30 Sep 2026', ref: 'NRT-9B14C'})},
    {id: 'p5', title: 'Carpentry', amount: '₹ 1,100', meta: 'April 10', status: 'pending',
      breakdown: buildBreakdown({base: 900, travel: 100, food: 50, bonus: 50, paid: 0, fee: 60, status: 'pending', expected: '4 Oct 2026'})},
    {id: 'p6', title: 'Furniture Assembly', amount: '₹ 800', meta: 'Calicut', status: 'cancelled',
      breakdown: buildBreakdown({base: 700, travel: 100, paid: 0, fee: 40, status: 'cancelled'})},
  ],
  completed: [
    {id: 'c1', title: 'Painting Work', amount: '₹ 700', date: 'March 15', location: 'Thrissur', hours: '6 hr', incentive: '₹50', travel: '₹100'},
    {id: 'c2', title: 'Electrical Maintenance', amount: '₹ 850', date: 'March 16', location: 'Ernakulam', hours: '7 hr', incentive: '₹75', travel: '₹150'},
    {id: 'c3', title: 'Carpentry Work', amount: '₹ 650', date: 'March 17', location: 'Kochi', hours: '5 hr', incentive: '₹60', travel: '₹80'},
  ],
  performance: {
    description: SCORE_TEXT,
    activity: [
      {id: 'a1', text: LULU_TEXT, date: '12/10/26'},
      {id: 'a2', text: LULU_TEXT, date: '12/10/26'},
      {id: 'a3', text: LULU_TEXT, date: '12/10/26'},
    ],
  },
  earnings: {
    total: '₹7950',
    month: 'December',
    max: 1000,
    days: [86, 60, 50, 46, 100, 66, 86, 50, 16, 38, 36, 20, 10, 16, 36].map((v, i) => ({day: String(10 + i), value: v * 10})),
    activity: [
      {id: 'e1', text: 'Lulu Work', date: '12/10/26'},
      {id: 'e2', text: 'Painting workp', date: '12/10/26'},
    ],
  },
  chat: [
    {id: 'd1', kind: 'day', text: 'Thursday'},
    {id: 'm1', kind: 'message', from: 'bot', text: 'Hi, I am here to assist you'},
    {id: 'r1', kind: 'replies', options: ['contact us', 'how to provide proof']},
    {id: 'm2', kind: 'message', from: 'me', text: 'What about my previous work payment?'},
    {id: 'm3', kind: 'message', from: 'bot', text: 'We will connect you to Narvent help center'},
    {id: 'd2', kind: 'day', text: 'Thursday'},
  ],
};
