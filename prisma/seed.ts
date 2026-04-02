import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ids = {
  user: 'user_demo',
  authCode: 'auth_code_demo_login',
  pointAccount: 'point_account_demo',
  rechargeOrder: 'recharge_order_demo',
  project: 'project_demo_news_ai',
  projectNews: 'project_news_demo',
  script: 'script_demo_v1',
  storyboard: 'storyboard_demo_v1',
  asset: 'asset_demo_cover',
  referenceVideo: 'reference_video_demo',
  scriptReference: 'script_reference_demo',
  videoTask: 'video_task_demo',
  videoTaskItem: 'video_task_item_demo_1',
  video: 'video_demo_final',
  pointTransaction: 'point_tx_demo_recharge',
} as const;

async function main() {
  await prisma.user.upsert({
    where: { id: ids.user },
    update: {
      phone: '13800138000',
      nickname: 'Demo User',
    },
    create: {
      id: ids.user,
      phone: '13800138000',
      nickname: 'Demo User',
    },
  });

  await prisma.userAuthCode.upsert({
    where: { id: ids.authCode },
    update: {
      phone: '13800138000',
      code: '123456',
      expiresAt: new Date('2026-12-31T23:59:59.000Z'),
      userId: ids.user,
    },
    create: {
      id: ids.authCode,
      phone: '13800138000',
      code: '123456',
      expiresAt: new Date('2026-12-31T23:59:59.000Z'),
      userId: ids.user,
    },
  });

  await prisma.pointAccount.upsert({
    where: { id: ids.pointAccount },
    update: {
      userId: ids.user,
      availablePoints: 3000,
      frozenPoints: 0,
    },
    create: {
      id: ids.pointAccount,
      userId: ids.user,
      availablePoints: 3000,
      frozenPoints: 0,
    },
  });

  await prisma.rechargeOrder.upsert({
    where: { id: ids.rechargeOrder },
    update: {
      userId: ids.user,
      orderNo: 'demo-order-001',
      status: 'PAID',
      amountCents: 9900,
      points: 3000,
      provider: 'MOCK',
      providerOrderId: 'mock-pay-order-001',
      callbackIdempotencyKey: 'mock-pay-callback-001',
      paidAt: new Date('2026-04-01T09:00:00.000Z'),
    },
    create: {
      id: ids.rechargeOrder,
      userId: ids.user,
      orderNo: 'demo-order-001',
      status: 'PAID',
      amountCents: 9900,
      points: 3000,
      provider: 'MOCK',
      providerOrderId: 'mock-pay-order-001',
      callbackIdempotencyKey: 'mock-pay-callback-001',
      paidAt: new Date('2026-04-01T09:00:00.000Z'),
    },
  });

  await prisma.project.upsert({
    where: { id: ids.project },
    update: {
      userId: ids.user,
      title: 'Demo AI News Project',
      keyword: 'AI',
      status: 'SCRIPT_PENDING_CONFIRM',
      description: 'A seed project for backend MVP integration.',
      form: {
        videoType: 'news-explainer',
        style: 'clean',
        duration: 60,
      },
    },
    create: {
      id: ids.project,
      userId: ids.user,
      title: 'Demo AI News Project',
      keyword: 'AI',
      status: 'SCRIPT_PENDING_CONFIRM',
      description: 'A seed project for backend MVP integration.',
      form: {
        videoType: 'news-explainer',
        style: 'clean',
        duration: 60,
      },
    },
  });

  await prisma.projectNews.upsert({
    where: { id: ids.projectNews },
    update: {
      projectId: ids.project,
      externalNewsId: 'news-demo-001',
      title: 'AI infrastructure investment continues to grow',
      summary: 'Major vendors increased AI infrastructure investment this quarter.',
      source: 'Demo News',
      publishedAt: new Date('2026-04-01T08:30:00.000Z'),
      url: 'https://example.com/news-demo-001',
      rawPayload: {
        keyword: 'AI',
      },
    },
    create: {
      id: ids.projectNews,
      projectId: ids.project,
      externalNewsId: 'news-demo-001',
      title: 'AI infrastructure investment continues to grow',
      summary: 'Major vendors increased AI infrastructure investment this quarter.',
      source: 'Demo News',
      publishedAt: new Date('2026-04-01T08:30:00.000Z'),
      url: 'https://example.com/news-demo-001',
      rawPayload: {
        keyword: 'AI',
      },
    },
  });

  await prisma.script.upsert({
    where: { id: ids.script },
    update: {
      projectId: ids.project,
      version: 1,
      title: 'Seed Script',
      content: {
        sections: [
          {
            title: 'Opening',
            narration: 'AI investment is accelerating as demand grows.',
          },
        ],
      },
      sourceNewsSummary:
        'Major vendors increased AI infrastructure investment this quarter.',
      isCurrent: true,
    },
    create: {
      id: ids.script,
      projectId: ids.project,
      version: 1,
      title: 'Seed Script',
      content: {
        sections: [
          {
            title: 'Opening',
            narration: 'AI investment is accelerating as demand grows.',
          },
        ],
      },
      sourceNewsSummary:
        'Major vendors increased AI infrastructure investment this quarter.',
      isCurrent: true,
    },
  });

  await prisma.storyboard.upsert({
    where: { id: ids.storyboard },
    update: {
      projectId: ids.project,
      version: 1,
      title: 'Seed Storyboard',
      content: {
        frames: [
          {
            scene: 'Studio intro',
            visual: 'Presenter with AI graphics wall',
          },
        ],
      },
      isCurrent: true,
    },
    create: {
      id: ids.storyboard,
      projectId: ids.project,
      version: 1,
      title: 'Seed Storyboard',
      content: {
        frames: [
          {
            scene: 'Studio intro',
            visual: 'Presenter with AI graphics wall',
          },
        ],
      },
      isCurrent: true,
    },
  });

  await prisma.asset.upsert({
    where: { id: ids.asset },
    update: {
      userId: ids.user,
      projectId: ids.project,
      name: 'demo-cover.png',
      mimeType: 'image/png',
      sizeBytes: 1024,
      storageKey: 'assets/demo-cover.png',
      url: 'https://example.com/assets/demo-cover.png',
      deletedAt: null,
    },
    create: {
      id: ids.asset,
      userId: ids.user,
      projectId: ids.project,
      name: 'demo-cover.png',
      mimeType: 'image/png',
      sizeBytes: 1024,
      storageKey: 'assets/demo-cover.png',
      url: 'https://example.com/assets/demo-cover.png',
    },
  });

  await prisma.referenceVideo.upsert({
    where: { id: ids.referenceVideo },
    update: {
      userId: ids.user,
      projectId: ids.project,
      name: 'demo-reference.mp4',
      fileName: 'demo-reference.mp4',
      mimeType: 'video/mp4',
      sizeBytes: 4096,
      durationSeconds: 75,
      storageKey: 'references/demo-reference.mp4',
      url: 'https://example.com/references/demo-reference.mp4',
      status: 'SUCCESS',
      analysisSummary: 'Fast-paced business news style with bold captions.',
      analysisPayload: {
        pacing: 'fast',
        style: 'business-news',
      },
      deletedAt: null,
    },
    create: {
      id: ids.referenceVideo,
      userId: ids.user,
      projectId: ids.project,
      name: 'demo-reference.mp4',
      fileName: 'demo-reference.mp4',
      mimeType: 'video/mp4',
      sizeBytes: 4096,
      durationSeconds: 75,
      storageKey: 'references/demo-reference.mp4',
      url: 'https://example.com/references/demo-reference.mp4',
      status: 'SUCCESS',
      analysisSummary: 'Fast-paced business news style with bold captions.',
      analysisPayload: {
        pacing: 'fast',
        style: 'business-news',
      },
    },
  });

  await prisma.scriptReference.upsert({
    where: { id: ids.scriptReference },
    update: {
      projectId: ids.project,
      referenceVideoId: ids.referenceVideo,
      note: 'Use pacing and subtitle rhythm as reference.',
    },
    create: {
      id: ids.scriptReference,
      projectId: ids.project,
      referenceVideoId: ids.referenceVideo,
      note: 'Use pacing and subtitle rhythm as reference.',
    },
  });

  await prisma.videoGenerateTask.upsert({
    where: { id: ids.videoTask },
    update: {
      userId: ids.user,
      projectId: ids.project,
      status: 'SUCCESS',
      pointCost: 300,
      refundPoints: 0,
      outputCount: 1,
      params: {
        aspectRatio: '16:9',
        voice: 'female-news',
        resolution: '1080p',
      },
      failureReason: null,
    },
    create: {
      id: ids.videoTask,
      userId: ids.user,
      projectId: ids.project,
      status: 'SUCCESS',
      pointCost: 300,
      refundPoints: 0,
      outputCount: 1,
      params: {
        aspectRatio: '16:9',
        voice: 'female-news',
        resolution: '1080p',
      },
    },
  });

  await prisma.video.upsert({
    where: { id: ids.video },
    update: {
      userId: ids.user,
      projectId: ids.project,
      taskId: ids.videoTask,
      title: 'Demo Final Video',
      coverUrl: 'https://example.com/videos/demo-final-cover.png',
      url: 'https://example.com/videos/demo-final.mp4',
      durationSeconds: 61,
      deletedAt: null,
    },
    create: {
      id: ids.video,
      userId: ids.user,
      projectId: ids.project,
      taskId: ids.videoTask,
      title: 'Demo Final Video',
      coverUrl: 'https://example.com/videos/demo-final-cover.png',
      url: 'https://example.com/videos/demo-final.mp4',
      durationSeconds: 61,
    },
  });

  await prisma.videoGenerateTaskItem.upsert({
    where: { id: ids.videoTaskItem },
    update: {
      taskId: ids.videoTask,
      sequence: 1,
      status: 'SUCCESS',
      resultUrl: 'https://example.com/videos/demo-final.mp4',
      errorMessage: null,
      videoId: ids.video,
    },
    create: {
      id: ids.videoTaskItem,
      taskId: ids.videoTask,
      sequence: 1,
      status: 'SUCCESS',
      resultUrl: 'https://example.com/videos/demo-final.mp4',
      videoId: ids.video,
    },
  });

  await prisma.pointTransaction.upsert({
    where: { id: ids.pointTransaction },
    update: {
      accountId: ids.pointAccount,
      userId: ids.user,
      type: 'RECHARGE',
      points: 3000,
      balanceAfter: 3000,
      relatedType: 'RECHARGE_ORDER',
      relatedId: ids.rechargeOrder,
      remark: 'Initial seed recharge',
    },
    create: {
      id: ids.pointTransaction,
      accountId: ids.pointAccount,
      userId: ids.user,
      type: 'RECHARGE',
      points: 3000,
      balanceAfter: 3000,
      relatedType: 'RECHARGE_ORDER',
      relatedId: ids.rechargeOrder,
      remark: 'Initial seed recharge',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
