import { AppDataSource } from "../config/database";
import { UserBusiness } from "../entities/UserBusiness";

export class UserBusinessRepository {
    private repo = AppDataSource.getRepository(UserBusiness);

    async create(data: Partial<UserBusiness>): Promise<UserBusiness> {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }

    async findByUser(userId: number): Promise<UserBusiness[]> {
        return this.repo.find({ where: { userId } });
    }

    async findByUserAndBusiness(userId: number, businessId: number): Promise<UserBusiness | null> {
        return this.repo.findOneBy({ userId, businessId });
    }

    async findBusinessIdsByUser(userId: number): Promise<number[]> {
        const records = await this.repo.find({ where: { userId } });
        return records.map((r) => r.businessId);
    }
}
