export type DisplayEvent = {
  id: number
  title: string
  description: string
  image: string
  date: Date | string
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
    date: new Date('2026-07-06'),
    time: '8:00 AM – 5:00 PM',
    location: 'Kaayyoo Koof Training Center (Abosto, Bekera R-429)',
    maxAttendees: 80,
    currentAttendees: 62,
    tag: 'Summer Camp',
  },
  {
    id: 2,
    title: 'Wada Cup',
    description:
      'A structured Wada Cup program pairing experienced professionals with young, aspiring leaders. Gain guidance, build networks, and fast-track your personal and career growth.',
    image: '/comm/kayy2.jpg',
    date: 'Ongoing',
    time: '10:00 AM – 12:00 PM',
    location: 'Sport Field',
    maxAttendees: 50,
    currentAttendees: 27,
    tag: 'Networking',
  },
  {
    id: 3,
    title: 'Live Sessions',
    description:
      'Weekly live interactive sessions featuring guest speakers, open Q&A panels, skill-building workshops, and community discussions on topics that matter most to our members.',
    image: '/comm/kayy3.jpg',
    date: 'Weekly Sunday Night',
    time: '9:00 PM – 11:00 PM',
    location: 'Online & Community Center',
    maxAttendees: 150,
    currentAttendees: 89,
    tag: 'Telegram Live',
  },
  {
    id: 4,
    title: 'Hiking',
    description:
      'Quarterly outdoor excursions for members to connect with nature, admire scenic landscapes, and bond through challenging yet rewarding trail walks.',
    image: '/comm/kayy4.jpg',
    date: 'Coming Soon',
    time: '8:00 AM – 6:00 PM',
    location: 'Tour Place',
    maxAttendees: 150,
    currentAttendees: 0,
    tag: 'Adventure',
  },
  {
    id: 5,
    title: 'Itikaf Programs',
    description:
      'A dedicated spiritual retreat providing members a quiet space for reflection, prayer, community bonding, and spiritual growth.',
    image: '/comm/kayy5.jpg',
    date: 'Coming Soon',
    time: '8:00 AM – 6:00 PM',
    location: 'Community Mosque / Center',
    maxAttendees: 150,
    currentAttendees: 0,
    tag: 'Spiritual',
  },
  {
    id: 6,
    title: 'Book Review',
    description:
      'An engaging group discussion focused on exploring impactful literature, sharing perspectives, and fostering a culture of continuous learning and intellectual curiosity.',
    image: '/comm/kayy6.jpg',
    date: 'Coming Soon',
    time: '8:00 AM – 6:00 PM',
    location: 'Kaayyoo Koof Training Center (Abosto, Bekera R-429)',
    maxAttendees: 150,
    currentAttendees: 0,
    tag: 'Education',
  },
]
