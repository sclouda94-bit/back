import { AppDataSource } from "../config/database";
import { Client } from "../entities/Client";

export class ClientRepository {
    private repo = AppDataSource.getRepository(Client);

    async findAll() {
        return this.repo.find();
    }

    async findById(id: number) {
        return this.repo.findOneBy({ id });
    }

    async create(data: Partial<Client>) {
        const client = this.repo.create(data);
        return this.repo.save(client);
    }

    async update(id: number, data: Partial<Client>) {
        await this.repo.update(id, data);
        return this.findById(id);
    }

    async delete(id: number) {
        await this.repo.delete(id);
    }
}
