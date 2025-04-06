import { Report } from '../types/Report';
import Dexie from 'dexie';

class ReportsDatabase extends Dexie {
  reports: Dexie.Table<Report, string>;

  constructor() {
    super('ReportsDB');
    this.version(1).stores({
      reports: 'id, title, description, date, status'
    });
    this.reports = this.table('reports');
  }
}

const db = new ReportsDatabase();

export const dbService = {
  async getAllReports(): Promise<Report[]> {
    return await db.reports.toArray();
  },

  async addReport(report: Report): Promise<void> {
    await db.reports.add(report);
  },

  async updateReport(report: Report): Promise<void> {
    await db.reports.put(report);
  },

  async deleteReport(id: string): Promise<void> {
    await db.reports.delete(id);
  },

  async searchReports(query: string): Promise<Report[]> {
    return await db.reports
      .filter(report => 
        report.title.toLowerCase().includes(query.toLowerCase()) ||
        report.description.toLowerCase().includes(query.toLowerCase())
      )
      .toArray();
  },

  async getReportsByStatus(status: 'active' | 'archived'): Promise<Report[]> {
    return await db.reports
      .where('status')
      .equals(status)
      .toArray();
  }
}; 