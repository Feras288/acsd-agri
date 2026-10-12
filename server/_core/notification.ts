/**
 * Notifications are not used in the local-only build. This stub remains so
 * legacy imports compile; new code should not depend on it.
 */
export type NotificationPayload = {
  title: string;
  content: string;
};

export async function notifyOwner(_payload: NotificationPayload): Promise<boolean> {
  console.warn("[Notification] notifyOwner is a no-op in the local-only build.");
  return false;
}
