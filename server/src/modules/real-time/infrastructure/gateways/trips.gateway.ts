import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { GetLastBoatLocationUseCase } from '@app/modules/tracking/application/use-cases/get-last-boat-location.use-case';
import { JwtService } from '@nestjs/jwt';
import type { AuthUser } from '@modules/auth/application/auth-user';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGINS?.split(',') ?? [] },
  namespace: '/trips', // Isola as conexões de viagem de outros possíveis websockets do app
})
@Injectable()
export class TripsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  private readonly logger = new Logger(TripsGateway.name);

  constructor(
    @Inject(forwardRef(() => GetLastBoatLocationUseCase))
    private readonly getLastLocationUseCase: GetLastBoatLocationUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token =
      typeof client.handshake.auth?.token === 'string'
        ? client.handshake.auth.token
        : client.handshake.headers.authorization?.replace(/^Bearer\s+/i, '');
    try {
      if (!token) throw new Error('Token não informado');
      client.data.user = await this.jwtService.verifyAsync<AuthUser>(token);
      this.logger.log(`Cliente autenticado conectado: ${client.id}`);
    } catch {
      this.logger.warn(`Conexão WebSocket não autorizada: ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // Frontend envia: socket.emit('join_trip', { tripId: '123' })
  @SubscribeMessage('join_trip')
  async handleJoinTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() rawData: unknown,
  ) {
    // 1. Garantimos que os dados se tornem um objeto, mesmo se vierem como string JSON
    let data: unknown = rawData;
    if (typeof rawData === 'string') {
      try {
        data = JSON.parse(rawData);
      } catch {
        this.logger.error('Formato de dados inválido recebido no join_trip');
        return { status: 'error', message: 'Invalid payload' };
      }
    }

    // 2. Agora pegamos o tripId com segurança
    const tripId =
      typeof data === 'object' && data !== null && 'tripId' in data
        ? (data as { tripId?: unknown }).tripId
        : undefined;

    if (
      typeof tripId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        tripId,
      )
    ) {
      this.logger.warn(
        `Cliente ${client.id} tentou entrar sem informar o tripId.`,
      );
      return { status: 'error', message: 'tripId is required' };
    }

    const room = `trip_${tripId}`;
    await client.join(room);
    this.logger.log(`Cliente ${client.id} entrou na sala: ${room}`);

    // Continua normal...
    const lastLocation = await this.getLastLocationUseCase.execute(tripId);
    return {
      status: 'success',
      message: `Conectado à viagem ${tripId}`,
      lastLocation: lastLocation,
    };
  }

  // Frontend envia ao sair da tela
  @SubscribeMessage('leave_trip')
  async handleLeaveTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string },
  ) {
    const room = `trip_${data.tripId}`;
    await client.leave(room);
    this.logger.log(`Cliente ${client.id} saiu da sala: ${room}`);
  }
}
