export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

export const createPaginationMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const createApiResponse = <T>(success: boolean, data?: T, error?: string, message?: string) => ({
  success,
  data,
  error,
  message,
});

export const handleAsyncRoute = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
