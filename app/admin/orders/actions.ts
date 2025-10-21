"use server";

import { updateOrderSentStatus, deleteOrder } from "@/lib/orders";

export async function updateSentStatus(
  userId: string,
  orderId: number,
  sent: boolean
) {
  try {
    await updateOrderSentStatus(userId, orderId, sent);
    return { success: true };
  } catch (error) {
    console.error("Error updating sent status:", error);
    return { success: false, error: "Failed to update order" };
  }
}

export async function softDeleteOrder(userId: string, orderId: number) {
  try {
    await deleteOrder(userId, orderId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

