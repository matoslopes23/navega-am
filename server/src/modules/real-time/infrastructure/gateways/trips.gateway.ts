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


@WebSocketGateway({
    cors: { origin: '*' },
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
    ) { }

    handleConnection(client: Socket) {
        this.logger.log(`Cliente conectado: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Cliente desconectado: ${client.id}`);
    }

    // Frontend envia: socket.emit('join_trip', { tripId: '123' })
    @SubscribeMessage('join_trip')
    async handleJoinTrip(
        @ConnectedSocket() client: Socket,
        // Mudamos o tipo para 'any' para inspecionar o que está chegando
        @MessageBody() rawData: any,
    ) {
        // 1. Garantimos que os dados se tornem um objeto, mesmo se vierem como string JSON
        let data = rawData;
        if (typeof rawData === 'string') {
            try {
                data = JSON.parse(rawData);
            } catch (e) {
                this.logger.error('Formato de dados inválido recebido no join_trip');
                return { status: 'error', message: 'Invalid payload' };
            }
        }

        // 2. Agora pegamos o tripId com segurança
        const tripId = data?.tripId;

        if (!tripId) {
            this.logger.warn(`Cliente ${client.id} tentou entrar sem informar o tripId.`);
            return { status: 'error', message: 'tripId is required' };
        }

        const room = `trip_${tripId}`;
        client.join(room);
        this.logger.log(`Cliente ${client.id} entrou na sala: ${room}`);

        // Continua normal...
        const lastLocation = await this.getLastLocationUseCase.execute(tripId);
        console.log("location:", lastLocation);
        return {
            status: 'success',
            message: `Conectado à viagem ${tripId}`,
            lastLocation: lastLocation,
        };
    }

    // Frontend envia ao sair da tela
    @SubscribeMessage('leave_trip')
    handleLeaveTrip(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { tripId: string },
    ) {
        const room = `trip_${data.tripId}`;
        client.leave(room);
        this.logger.log(`Cliente ${client.id} saiu da sala: ${room}`);
    }
}