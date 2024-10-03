"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmendId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmendId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    // const scheduledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "scheduled");

    // const pendingAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "pending");

    // const cancelledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "cancelled");

    // const data = {
    //   totalCount: appointments.total,
    //   scheduledCount: scheduledAppointments.length,
    //   pendingCount: pendingAppointments.length,
    //   cancelledCount: cancelledAppointments.length,
    //   documents: appointments.documents,
    // };

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  // timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    // const smsMessage = `Docto-Djib (😉) ${
    //   type === "schedule"
    //     ? `Votre rendez-vous pour le ${
    //         formatDateTime(appointment.schedule!).dateTime
    //       } avec Dr. ${appointment.primaryPhysician} est confirmé`
    //     : `Nous avons le regret de vous informer que votre rendez-vous pour le ${
    //         formatDateTime(appointment.schedule!).dateTime
    //       } n'est PAS confirmé. Raison:  ${appointment.cancellationReason}`
    // }.`

    const subjectMessage = `${
      type === "schedule"
        ? "Confirmation de rendez-vous"
        : "Rendez-vous non confirmé"
    }`;

    const emailMessage = `Docto-Djib (😉) ${
      type === "schedule"
        ? `Votre rendez-vous pour le ${
            formatDateTime(appointment.schedule!).dateTime
          } avec Dr. ${appointment.primaryPhysician} est confirmé`
        : `Nous avons le regret de vous informer que votre rendez-vous pour le ${
            formatDateTime(appointment.schedule!).dateTime
          } n'est PAS confirmé. Raison:  ${appointment.cancellationReason}`
    }.`;
    await sendEmailNotification(userId, subjectMessage, emailMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

// export const sendSMSNotification = async (userId: string, content: string) => {
//   try {
//     // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
//     const message = await messaging.createSms(
//       ID.unique(),
//       content,
//       [],
//       [userId]
//     );
//     return parseStringify(message);
//   } catch (error) {
//     console.error("An error occurred while sending sms:", error);
//   }
// };

export const sendEmailNotification = async (
  userId: string,
  subject: string,
  content: string
) => {
  try {
    // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
    const email = await messaging.createEmail(
      ID.unique(),
      subject,
      content,
      [], //Topics
      [userId], // Array of user IDs
      []
    );

    // console.log("LOOOOOOOOOOOOOOOOOOOOOOOOOOOO", email);

    // console.log(email);
    return parseStringify(email);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};
