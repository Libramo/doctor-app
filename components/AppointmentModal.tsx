import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Appointment } from "@/types/appwrite.types";
import AppointmentForm from "./forms/AppointmentForm";

const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  //   title: string;
  //   description: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">
            {type} le rendez-vous
          </DialogTitle>
          <DialogDescription>
            Veuillez compléter les informations suivantes pour {type} de
            rendez-vous
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          setOpen={setOpen}
          appointment={appointment}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
