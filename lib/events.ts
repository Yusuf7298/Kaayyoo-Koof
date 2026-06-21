export type DisplayEvent = {
  id: number
  title: string
  description: string
  image: string
  date: Date
  time: string
  location: string
  maxAttendees: number
  currentAttendees: number
  tag: string
}

export const fallbackEvents: DisplayEvent[] = [
  {
    id: 1,
    title: 'Summer Camp 2026',
    description:
      'An immersive multi-day outdoor camp designed to build resilience, teamwork, and leadership in young community members through hands-on activities, workshops, and nature challenges.',
    image: '/comm/kayy1.jpg',
    date: new Date('2026-07-08'),
    time: '8:00 AM - 5:00 PM',
    location: 'Forest Retreat Center, Outskirts',
    maxAttendees: 80,
    currentAttendees: 62,
    tag: 'Summery Camp',
  },
  {
    id: 2,
    title: 'Mentoring Program',
    description:
      'A structured 8-week mentoring program pairing experienced professionals with young aspiring leaders. Gain guidance, build networks, and fast-track your personal and career growth.',
    image: '/comm/kayy2.jpg',
    date: new Date('2026-07-08'),
    time: '10:00 AM - 12:00 PM',
    location: 'Kaayyoo Koof Community Hall',
    maxAttendees: 50,
    currentAttendees: 27,
    tag: 'Mentoring and Traninig',
  },
  {
    id: 3,
    title: 'Live Sessions',
    description:
      'Monthly live interactive sessions featuring guest speakers, open Q&A panels, skill-building workshops, and community discussions on topics that matter most to our members.',
    image: '/comm/kayy3.jpg',
    date: new Date('2026-07-08'),
    time: '6:00 PM - 8:30 PM',
    location: 'Online & Community Center',
    maxAttendees: 150,
    currentAttendees: 89,
    tag: 'Telegram Live',
  },
]

