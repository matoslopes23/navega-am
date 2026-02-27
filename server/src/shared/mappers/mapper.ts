export interface Mapper<Entity, DTO> {
  toDTO(entity: Entity): DTO;
  toEntity(dto: DTO): Entity;
}
