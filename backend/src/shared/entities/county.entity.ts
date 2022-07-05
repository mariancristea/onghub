import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity({ name: '_county' })
export class County {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'text', name: 'abbreviation' })
  abbreviation: string;

  @OneToMany(() => City, (city) => city.county)
  cities: City[];

  @Exclude()
  @DeleteDateColumn({
    name: 'deleted_on',
    type: 'timestamp with time zone',
    select: false,
  })
  deletedOn: Date;

  @Index()
  @CreateDateColumn({ name: 'created_on', type: 'timestamp with time zone' })
  createdOn: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_on',
    type: 'timestamp with time zone',
    select: false,
  })
  updatedOn: Date;
}
