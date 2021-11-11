import {EntityRepository, Repository} from 'typeorm';
import Vessel from '@/vessel/Vessel';

@EntityRepository(Vessel)
export default class PersonRepository extends Repository<Vessel> {
  findByMMSI(mmsi: string) {
    return this.createQueryBuilder('vessel')
    .where('vessel.mmsi = :mmsi', {mmsi})
    .getOne();
  }
}
