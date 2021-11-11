import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'vessel'})
export default class Vessel {
  @PrimaryGeneratedColumn({name: 'vessel_id'})
  id!: number;

  @Column({name: 'mmsi', nullable: false, unique: true})
  mmsi!: string;

  @Column({name: 'call_sign'})
  callSign!: string;

  @Column({name: 'imo'})
  imo!: string;

  @Column({name: 'ship_name'})
  shipName!: string;

  @Column({name: 'ship_type'})
  shipType!: string;

  @Column({name: 'renewal_datetime', nullable: false})
  renewalDateTime!: Date;

  @Column({name: 'created_datetime', nullable: false})
  createdDateTime!: Date;

  @Column({name: 'updated_datetime', nullable: false})
  updatedDateTime!: Date;
}
