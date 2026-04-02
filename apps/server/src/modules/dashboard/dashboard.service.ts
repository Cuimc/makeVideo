import type { DashboardData } from '@make-video/shared';
import { Injectable } from '@nestjs/common';
import { BillingService } from '../billing/billing.service';
import { LibraryService } from '../library/library.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly billingService: BillingService,
    private readonly libraryService: LibraryService,
    private readonly projectsService: ProjectsService,
  ) {}

  async getSummary(userId: string): Promise<DashboardData> {
    const [billingSummary, recentVideos] = await Promise.all([
      this.billingService.getSummary(userId),
      Promise.resolve(
        this.libraryService.listByUser(userId, {
          page: 1,
          pageSize: 6,
        }),
      ),
    ]);
    const recentProjects = this.projectsService.listByUser(userId).slice(0, 6);

    return {
      summary: {
        pointBalance: billingSummary.balance,
        recentProjectCount: recentProjects.length,
        recentVideoCount: recentVideos.items.length,
      },
      recentProjects,
      recentVideos: recentVideos.items,
    };
  }
}
