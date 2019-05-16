import loginRoutes from './loginRoutes';
import userRoutes from './userRoutes';
import companyRoutes from './companyRoutes';
import personRoutes from './personRoutes';
import hireRoutes from './hireRoutes';

export default function (app) {
  app.use('/api/auth', loginRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/people', personRoutes);
  app.use('/api/hired', hireRoutes);
}