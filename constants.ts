
import { HardwareItem, Post, ProblemStatement } from './types';

export const ADMIN_PASSWORD = "AJ2006";

export const LOCATIONS = {
  countries: ["India", "United States", "United Kingdom"],
  states: {
    "India": ["Tamil Nadu", "Karnataka", "Maharashtra", "Kerala", "Telangana", "Delhi"],
    "United States": ["California", "New York", "Texas"],
    "United Kingdom": ["England", "Scotland"]
  },
  cities: {
    "Tamil Nadu": ["Salem", "Chennai", "Coimbatore", "Madurai", "Trichy", "Erode"],
    "Karnataka": ["Bangalore", "Mysore", "Mangalore"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Kerala": ["Kochi", "Trivandrum", "Calicut"],
    "Telangana": ["Hyderabad", "Warangal"],
    "Delhi": ["New Delhi", "Noida", "Gurgaon"],
    "California": ["Los Angeles", "San Francisco"],
    "New York": ["New York City", "Buffalo"],
    "England": ["London", "Manchester"]
  }
};

// Mock Data for "Google Maps-like" suggestions based on city
export const STREET_SUGGESTIONS: Record<string, string[]> = {
  "Salem": [
    "Junction Main Road", "Omalur Main Road", "Sarada College Road", "Cherry Road", 
    "Five Roads", "Hasthampatti", "Fairlands", "Ammapet", "Suramangalam", "Sona Nagar"
  ],
  "Chennai": [
    "Anna Salai", "Old Mahabalipuram Road (OMR)", "East Coast Road (ECR)", 
    "T. Nagar", "Velachery Main Road", "Adyar", "Mylapore", "Nungambakkam"
  ],
  "Coimbatore": [
    "Avinashi Road", "Gandhipuram", "RS Puram", "Peelamedu", "Saravanampatti"
  ],
  "Bangalore": [
    "MG Road", "Indiranagar", "Koramangala", "Whitefield", "Marathahalli", "Electronic City"
  ],
  "Madurai": [
    "KK Nagar", "Anna Nagar", "Bye Pass Road", "Kalavasal", "Simmakkal"
  ]
};

// Fallback suggestions if city not in specific list
export const GENERIC_STREETS = [
  "Main Road", "Station Road", "Gandhi Nagar", "Nehru Street", "Market Road", "Church Street", "Temple Road"
];

export const MOCK_HARDWARE: HardwareItem[] = [
  {
    id: '1',
    name: 'Arduino Uno R3',
    description: 'Microcontroller board based on the ATmega328P. Perfect for beginners.',
    pricePerDay: 50,
    image: 'https://picsum.photos/400/300?random=1',
    available: true,
    stock: 10,
    category: 'Microcontrollers'
  },
  {
    id: '2',
    name: 'Raspberry Pi 4 (4GB)',
    description: 'A powerful quad-core computer capable of dual-display support at resolutions up to 4K.',
    pricePerDay: 150,
    image: 'https://picsum.photos/400/300?random=2',
    available: true,
    stock: 5,
    category: 'Single Board Computers'
  },
  {
    id: '3',
    name: 'Ultrasonic Sensor HC-SR04',
    description: 'Provides 2cm - 400cm non-contact measurement functionality.',
    pricePerDay: 20,
    image: 'https://picsum.photos/400/300?random=3',
    available: true,
    stock: 25,
    category: 'Sensors'
  },
  {
    id: '4',
    name: 'SG90 Micro Servo Motor',
    description: 'Tiny and lightweight with high output power. Ideal for RC projects.',
    pricePerDay: 30,
    image: 'https://picsum.photos/400/300?random=4',
    available: false,
    stock: 0,
    category: 'Motors'
  },
  {
    id: '5',
    name: 'Drone Kit (DIY)',
    description: 'Complete kit to build your own quadcopter. Flight controller included.',
    pricePerDay: 500,
    image: 'https://picsum.photos/400/300?random=5',
    available: true,
    stock: 2,
    category: 'Robotics'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: '101',
    authorId: 'admin',
    authorName: 'IC Club Official',
    title: 'Hackathon Alert',
    content: 'We are excited to announce the "Green Tech Challenge" starting next week. Teams of 4. Grand prize: Raspberry Pi 5 Kits! Who is in? 🌿🚀',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
    timestamp: new Date().toISOString(),
    likes: 142,
    replies: [
      {
        id: 'r1',
        authorId: 'u1',
        authorName: 'Rahul Kumar',
        content: 'Count me in! Looking for teammates.',
        timestamp: new Date().toISOString()
      },
      {
        id: 'r2',
        authorId: 'u4',
        authorName: 'Sneha Gupta',
        content: 'Is there a specific theme for the projects?',
        timestamp: new Date().toISOString()
      }
    ],
    reposts: 12,
    isVerified: true
  },
  {
    id: '102',
    authorId: 'u1',
    authorName: 'Rahul Kumar',
    content: 'Has anyone worked with the ESP32-CAM module? I am getting a brownout error whenever I turn on the flash. I suspect it is a power supply issue. Any tips?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 5,
    replies: [],
    reposts: 0
  },
  {
    id: '103',
    authorId: 'u2',
    authorName: 'Priya S.',
    content: 'Finally finished my automated irrigation system using the moisture sensors from the club inventory! It sends me a WhatsApp message when the plants need water. 🌿💧\n\nCheck out the setup!',
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=1000',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 89,
    replies: [
       {
        id: 'r3',
        authorId: 'u3',
        authorName: 'Arun Vijay',
        content: 'This looks amazing! Can you share the code?',
        timestamp: new Date().toISOString()
      }
    ],
    reposts: 4
  },
  {
    id: '104',
    authorId: 'u4',
    authorName: 'Sneha Gupta',
    content: 'Just returned the Drone Kit. It was an amazing experience learning flight dynamics. If anyone needs the flight controller config I used, DM me!',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    likes: 34,
    replies: [],
    reposts: 1
  }
];

export const INITIAL_PROBLEMS: ProblemStatement[] = [
  {
    id: 'p1',
    title: 'Smart Campus Energy Management',
    description: 'Develop a system to monitor and optimize electricity usage in the main block classrooms.',
    deadline: '2024-12-01'
  }
];
