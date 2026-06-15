export interface EventResponse {
    id: number;
    title: string;
    description: string;
    eventDate: Date;
    location: string;
    capacity: number;
    seatsAvailable: number;
}