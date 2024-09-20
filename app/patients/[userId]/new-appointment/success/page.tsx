import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmendId as string) || "";
  const appointment = await getAppointment(appointmentId!);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo2.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif "
            alt="success"
            width={280}
            height={300}
            className=""
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Votre demande de <span className="text-green-500">rendez-vous</span>{" "}
            a été soumise avec succès !
          </h2>
          <p>
            Nous vous contacterons prochainement pour confirmer votre
            rendez-vous
          </p>
        </section>

        <section className="request-details">
          <p>Details du rendez-vous: </p>
          <div className="flex gap-3 items-center">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              alt="calendar"
              height={24}
              width={24}
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant={"outline"} className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New appointment
          </Link>
        </Button>

        <p className="copyright"> 2024 Docto-Djib</p>
      </div>
    </div>
  );
};

export default Success;
