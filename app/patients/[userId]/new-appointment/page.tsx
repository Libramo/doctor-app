import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.actions";
import { currentYearForCopyright } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen ">
      <section className="remove-scrollbar container flex-1 flex-col py-10 ">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo2.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id}
          />

          <p className="copyright mt-10 py-10">
            {/* © 2024 Doctor App, All rights reserved */}
            {currentYearForCopyright()}
          </p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default NewAppointment;
