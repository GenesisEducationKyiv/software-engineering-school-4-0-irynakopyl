import { v4 as uuidv4 } from 'uuid';
import { CustomerRepository } from '../../service/services/customer.service';
import Customer from '../../../common/db/models/customer.model';

export class CustomersRepository implements CustomerRepository {
  public async create(email: string): Promise<Customer> {
    return Customer.create({ id: uuidv4(), createdAt: new Date(), email });
  }

  public async delete(email: string): Promise<void> {
    await Customer.update({ deletedAt: new Date() }, { where: { email: email } });
  }
}
