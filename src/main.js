import { createApp } from 'vue'
import App from './App.vue'

import FightingDesign from 'fighting-design'
import 'fighting-design/dist/index.css'

createApp(App).use(FightingDesign).mount('#app')
import * as Sentry from "@sentry/vue";
Sentry.init({
    app,
    dsn: "https://063e6fa164bf6c5660456e610e283d5a@o4506845558079488.ingest.us.sentry.io/4507151264579584",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });