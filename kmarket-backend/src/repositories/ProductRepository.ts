import { AppDataSource } from "../config/database";
import { Product } from "../entities/Product";

export class ProductRepository {
    private repo = AppDataSource.getRepository(Product);

    async findAll() {
        return this.repo.find();
    }

    async findById(id: number) {
        return this.repo.findOneBy({ id });
    }

    async create(data: Partial<Product>) {
        const product = this.repo.create(data);
        return this.repo.save(product);
    }

    async update(id: number, data: Partial<Product>) {
        await this.repo.update(id, data);
        return this.findById(id);
    }

    async delete(id: number) {
        await this.repo.delete(id);
    }
}
