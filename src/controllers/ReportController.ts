import { Hono } from "hono";
import { AppDataSource } from "../config/database";
import { Sale } from "../entities/Sale";
import { SaleDetail } from "../entities/SaleDetail";
import { Product } from "../entities/Product";
import { Client } from "../entities/Client";

export class ReportController {
    public router = new Hono();
    private saleRepo = AppDataSource.getRepository(Sale);
    private saleDetailRepo = AppDataSource.getRepository(SaleDetail);
    private productRepo = AppDataSource.getRepository(Product);
    private clientRepo = AppDataSource.getRepository(Client);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/dashboard", async (c) => {
            try {
                // 1. Total Revenue and Sales Count
                const sales = await this.saleRepo.find();
                const totalSalesCount = sales.length;
                const totalRevenue = sales.reduce((acc, sale) => acc + Number(sale.totalAmount), 0);

                // 2. Total Clients
                const totalClients = await this.clientRepo.count();

                // 3. Low Stock Products
                const lowStockProducts = await this.productRepo
                    .createQueryBuilder("product")
                    .where("product.stock <= :stock", { stock: 5 })
                    .orderBy("product.stock", "ASC")
                    .getMany();

                // 4. Recent Sales (last 5)
                const recentSales = await this.saleRepo.find({
                    order: { createdAt: "DESC" },
                    take: 5
                });
                
                // Map client names for recent sales
                const clients = await this.clientRepo.find();
                const recentSalesWithClient = recentSales.map(sale => {
                    const client = clients.find(cl => cl.id === sale.clientId);
                    return {
                        ...sale,
                        clientName: client ? client.name : "Consumidor Final"
                    };
                });

                // 5. Top 5 Products by Quantity Sold
                const saleDetails = await this.saleDetailRepo.find();
                const productSalesCount: Record<number, { productId: number; name: string; quantitySold: number; revenue: number }> = {};
                
                const products = await this.productRepo.find();
                
                for (const detail of saleDetails) {
                    if (!productSalesCount[detail.productId]) {
                        const p = products.find(prod => prod.id === detail.productId);
                        productSalesCount[detail.productId] = {
                            productId: detail.productId,
                            name: p ? p.name : "Producto Eliminado",
                            quantitySold: 0,
                            revenue: 0
                        };
                    }
                    productSalesCount[detail.productId].quantitySold += detail.quantity;
                    productSalesCount[detail.productId].revenue += Number(detail.subtotal);
                }

                const topProducts = Object.values(productSalesCount)
                    .sort((a, b) => b.quantitySold - a.quantitySold)
                    .slice(0, 5);

                // 6. Weekly Sales Chart — count sales per day-of-week for the current Mon-Sun week
                const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
                const weeklySales = dayLabels.map(day => ({ day, sales: 0 }));

                const now = new Date();
                const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon … 6=Sat
                const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                const monday = new Date(now);
                monday.setDate(now.getDate() + diffToMonday);
                monday.setHours(0, 0, 0, 0);

                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                sunday.setHours(23, 59, 59, 999);

                for (const sale of sales) {
                    const saleDate = new Date(sale.createdAt);
                    if (saleDate >= monday && saleDate <= sunday) {
                        // Map JS getDay() (0=Sun) → array index (0=Mon … 6=Sun)
                        const jsDay = saleDate.getDay();
                        const idx = jsDay === 0 ? 6 : jsDay - 1;
                        weeklySales[idx].sales += 1;
                    }
                }

                return c.json({
                    totalRevenue,
                    totalSalesCount,
                    totalClients,
                    lowStockProducts,
                    recentSales: recentSalesWithClient,
                    topProducts,
                    weeklySales
                });

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                return c.json({ error: "Failed to fetch dashboard statistics" }, 500);
            }
        });
    }
}
