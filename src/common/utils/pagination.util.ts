import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Interface cho các tham số truy vấn phân trang
 */
export interface PaginationParams {
  page?: string | number;
  limit?: string | number;
  searchTerm?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Interface cho metadata phân trang
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Hàm phân trang tổng quát cho các model Prisma
 * @param prisma Instance của PrismaService
 * @param model Tên model Prisma (ví dụ: 'user', 'building')
 * @param params Các tham số phân trang
 * @param searchFields Các trường để tìm kiếm (cho searchTerm)
 * @param include Đối tượng include của Prisma (tuỳ chọn)
 * @returns Dữ liệu phân trang với metadata được bọc trong ResponseData
 */
export async function paginate<T extends keyof PrismaService, K extends Record<string, any>>(
  prisma: PrismaService,
  model: T,
  params: PaginationParams,
  searchFields: string[] = [],
  include?: K
): Promise<ResponseData<{ items: any[]; meta: PaginationMeta }>> {
  try {
    // Phân tích các tham số phân trang
    const page = typeof params.page === 'string' ? parseInt(params.page, 10) : (params.page as number) || 1;
    const limit = typeof params.limit === 'string' ? parseInt(params.limit, 10) : (params.limit as number) || 10;
    const skip = (page - 1) * limit;
    
    // Xây dựng truy vấn tìm kiếm nếu searchTerm được cung cấp
    let where: any = {};
    if (params.searchTerm && searchFields.length > 0) {
      where.OR = searchFields.map(field => ({
        [field]: { contains: params.searchTerm, mode: 'insensitive' }
      }));
    }
    
    // Xây dựng sắp xếp
    const orderBy: any = {};
    if (params.orderBy) {
      orderBy[params.orderBy] = params.orderDirection || 'asc';
    }
    
    // Lấy model Prisma
    const prismaModel = prisma[model] as any;
    
    // Lấy tổng số lượng
    const total = await prismaModel.count({ where });
    
    // Lấy dữ liệu phân trang
    const items = await prismaModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : { id: 'asc' },
      ...(include ? { include } : {})
    });
    
    // Tính toán metadata phân trang
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;
    
    // Chuẩn bị phản hồi
    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious
    };
    
    return new ResponseData(
      { items, meta },
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS
    );
  } catch (error) {
    return new ResponseData(
      error,
      HttpStatus.SERVER_ERROR,
      HttpMessage.SERVER_ERROR
    );
  }
}

/**
 * Hàm trợ giúp để phân tích tham số phân trang từ controller
 * @param query Tham số truy vấn từ request
 * @returns Các tham số phân trang đã phân tích
 */
export function getPaginationParams(query: Record<string, string>): PaginationParams {
  return {
    page: query.page,
    limit: query.limit,
    searchTerm: query.search,
    orderBy: query.orderBy,
    orderDirection: (query.orderDirection as 'asc' | 'desc') || 'asc'
  };
}
