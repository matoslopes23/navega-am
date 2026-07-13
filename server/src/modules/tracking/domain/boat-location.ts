export type ConfidenceLevel = 'ALTO' | 'MEDIO' | 'BAIXO';

export class BoatLocation {
  constructor(
    public readonly id: string,
    public readonly tripId: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly confidenceLevel: ConfidenceLevel,
    public readonly calculatedAt: Date,
  ) {}
}
