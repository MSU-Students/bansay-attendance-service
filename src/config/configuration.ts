export default () => ({
  port: parseInt(process.env.PORT!, 10) || 3003,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'msu-attendance',
  },
});
