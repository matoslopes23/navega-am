export class RawLocation {
    constructor(
        public readonly id: string,
        public readonly tripId: string,
        public readonly deviceId: string,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly pingedAt: Date,
        public readonly createdAt: Date,
    ) { }
}