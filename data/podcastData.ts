interface PodcastEpisode {
  title: string
  description: string
  date: string
  duration: string
  audioUrl?: string
  spotifyUrl?: string
  appleUrl?: string
  imgSrc?: string
}

const podcastData: PodcastEpisode[] = [
  {
    title: 'Episode 1: Introduction to Cybersecurity Fundamentals',
    description: `In this inaugural episode, we dive into the core principles of cybersecurity, 
    discussing the CIA triad (Confidentiality, Integrity, Availability) and why they matter 
    in today's digital landscape.`,
    date: '2024-01-15',
    duration: '45:30',
    imgSrc: '/static/images/podcast-cover.jpg',
    spotifyUrl: 'https://spotify.com/your-podcast',
    appleUrl: 'https://podcasts.apple.com/your-podcast',
  },
  {
    title: 'Episode 2: Understanding Common Attack Vectors',
    description: `We explore the most prevalent attack methods used by threat actors today, 
    including phishing, ransomware, and social engineering tactics. Learn how to recognize 
    and defend against these threats.`,
    date: '2024-01-22',
    duration: '52:15',
    imgSrc: '/static/images/podcast-cover.jpg',
    spotifyUrl: 'https://spotify.com/your-podcast',
    appleUrl: 'https://podcasts.apple.com/your-podcast',
  },
]

export default podcastData
