// Sample data for the app
// In a real application, this would come from a database

export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  description?: string
  imageUrl?: string
  flights?: Flight[]
  accommodations?: Accommodation[]
  activities?: Activity[]
}

export interface Flight {
  id: string
  airline: string
  flightNumber: string
  departureCity: string
  departureAirport: string
  departureTime: string
  arrivalCity: string
  arrivalAirport: string
  arrivalTime: string
}

export interface Accommodation {
  id: string
  name: string
  type: string
  location: string
  address: string
  checkIn: string
  checkOut: string
  price?: string
  notes?: string
}

export interface Activity {
  id: string
  name: string
  date: string
  time: string
  duration?: string
  location?: string
  cost?: string
  notes?: string
}

// Sample trip data
export const trips: Trip[] = [
  {
    id: "trip-1",
    name: "Paris Getaway",
    destination: "Paris, France",
    startDate: "2025-06-15",
    endDate: "2025-06-22",
    description: "A week-long adventure in the City of Lights",
    flights: [
      {
        id: "flight-1",
        airline: "Air France",
        flightNumber: "AF123",
        departureCity: "New York",
        departureAirport: "JFK",
        departureTime: "2025-06-15T08:00:00",
        arrivalCity: "Paris",
        arrivalAirport: "CDG",
        arrivalTime: "2025-06-15T20:00:00",
      },
      {
        id: "flight-2",
        airline: "Air France",
        flightNumber: "AF456",
        departureCity: "Paris",
        departureAirport: "CDG",
        departureTime: "2025-06-22T10:00:00",
        arrivalCity: "New York",
        arrivalAirport: "JFK",
        arrivalTime: "2025-06-22T14:00:00",
      },
    ],
    accommodations: [
      {
        id: "accom-1",
        name: "Le Grand Hotel",
        type: "Hotel",
        location: "Paris, France",
        address: "123 Champs-Élysées, Paris, 75008",
        checkIn: "2025-06-15",
        checkOut: "2025-06-22",
        price: "$200/night",
        notes: "Breakfast included. Close to the Eiffel Tower.",
      },
    ],
    activities: [
      {
        id: "activity-1",
        name: "Eiffel Tower Visit",
        date: "2025-06-16",
        time: "10:00",
        duration: "3 hours",
        location: "Eiffel Tower, Paris",
        cost: "€30 per person",
        notes: "Book tickets in advance to skip the line",
      },
      {
        id: "activity-2",
        name: "Louvre Museum",
        date: "2025-06-17",
        time: "13:00",
        duration: "4 hours",
        location: "Rue de Rivoli, 75001 Paris",
        cost: "€17 per person",
        notes: "Closed on Tuesdays. Don't miss the Mona Lisa!",
      },
      {
        id: "activity-3",
        name: "Seine River Cruise",
        date: "2025-06-18",
        time: "18:00",
        duration: "1 hour",
        location: "Port de la Conférence, Paris",
        cost: "€15 per person",
        notes: "Sunset cruise with champagne option available",
      },
    ],
  },
  {
    id: "trip-2",
    name: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    startDate: "2025-09-10",
    endDate: "2025-09-20",
    description: "Exploring the vibrant culture and cuisine of Tokyo",
    flights: [
      {
        id: "flight-3",
        airline: "ANA",
        flightNumber: "NH101",
        departureCity: "Los Angeles",
        departureAirport: "LAX",
        departureTime: "2025-09-10T11:00:00",
        arrivalCity: "Tokyo",
        arrivalAirport: "HND",
        arrivalTime: "2025-09-11T15:00:00",
      },
      {
        id: "flight-4",
        airline: "ANA",
        flightNumber: "NH102",
        departureCity: "Tokyo",
        departureAirport: "HND",
        departureTime: "2025-09-20T17:00:00",
        arrivalCity: "Los Angeles",
        arrivalAirport: "LAX",
        arrivalTime: "2025-09-20T11:00:00",
      },
    ],
    accommodations: [
      {
        id: "accom-2",
        name: "Shinjuku Granbell Hotel",
        type: "Hotel",
        location: "Tokyo, Japan",
        address: "2-14-5 Kabukicho, Shinjuku-ku, Tokyo",
        checkIn: "2025-09-11",
        checkOut: "2025-09-20",
        price: "$180/night",
        notes: "Modern hotel in the heart of Shinjuku",
      },
    ],
    activities: [
      {
        id: "activity-4",
        name: "Tsukiji Outer Market",
        date: "2025-09-12",
        time: "07:00",
        duration: "2 hours",
        location: "4 Chome-16-2 Tsukiji, Chuo, Tokyo",
        notes: "Best to go early for the freshest sushi breakfast",
      },
      {
        id: "activity-5",
        name: "Meiji Shrine",
        date: "2025-09-13",
        time: "10:00",
        duration: "3 hours",
        location: "1-1 Yoyogikamizonocho, Shibuya, Tokyo",
        notes: "Peaceful forest shrine in the middle of Tokyo",
      },
    ],
  },
  {
    id: "trip-3",
    name: "Italian Holiday",
    destination: "Rome & Florence, Italy",
    startDate: "2025-03-15",
    endDate: "2025-03-25",
    description: "A 10-day journey through the heart of Italy",
    flights: [],
    accommodations: [
      {
        id: "accom-3",
        name: "Hotel Artemide",
        type: "Hotel",
        location: "Rome, Italy",
        address: "Via Nazionale, 22, 00184 Roma RM",
        checkIn: "2025-03-15",
        checkOut: "2025-03-20",
        price: "$150/night",
        notes: "Central location, walking distance to major attractions",
      },
      {
        id: "accom-4",
        name: "Hotel Brunelleschi",
        type: "Hotel",
        location: "Florence, Italy",
        address: "Piazza Santa Elisabetta, 3, 50122 Firenze FI",
        checkIn: "2025-03-20",
        checkOut: "2025-03-25",
        price: "$170/night",
        notes: "Historic hotel with amazing views of the Duomo",
      },
    ],
    activities: [],
  },
]

