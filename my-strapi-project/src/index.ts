import type { Core } from '@strapi/strapi';
import { taskLifecycleHooks } from './api/task/content-types/task/lifecycle';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
    bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log('🚀 Setting up task lifecycle hooks...');

    strapi.db.lifecycles.subscribe({
      models: ["api::task.task"],
      ...taskLifecycleHooks
    });
  },
};