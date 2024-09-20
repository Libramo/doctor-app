"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploder from "../FileUploder";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user ? user.name : "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    setIsLoading(true);

    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      //@ts-ignore
      const patient = await registerPatient(patientData);

      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Bienvenue {user?.name.toUpperCase()}👋</h1>
          <p className="text-dark-700">Remplissez le formulaire ci-dessous.</p>
        </section>

        {/* SECTION DES INFORMATIOS PERSONNELLES */}
        <section className="space-y-6">
          <div className="mb-10 space-y-1">
            <h2 className="sub-header">Informations personnelles</h2>
          </div>

          {/* Nom */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Nom"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          {/* Email */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Adresse Email"
              placeholder="Johndoe@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            {/* Phone */}
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Numéro de téléphone"
              placeholder="+253 77 16 41 32 23"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />
          </div>

          {/* Date de naissance */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date de naissance"
            />
            {/* Sexe  */}
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Sexe"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 lg:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label className="cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            {/* Address */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Adresse"
              placeholder="Balbala, Oum Salam, Logement Med Wais"
            />

            {/* Profession */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Profession"
              placeholder="Ingenieur"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            {/* Contact d'urgence */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Nom de la personne contact"
            />

            {/* Numero Phone du contact d'urgence */}
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency contact number"
              placeholder="77 80 00 01"
            />
          </div>
        </section>

        {/* SECTION DES INFORMATIONS MEDICALES */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Informations médicales du patient</h2>
          </div>
        </section>

        {/* PRIMARY CARE PHYSICIAN */}
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Médecin traitant du patient"
          placeholder="Selectionnez un médecin"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer gap-2 items-center">
                {/* <Image  /> */}
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-200"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        {/* INSURANCE & POLICY NUMBER */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="BlueCross BlueShield"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="ABC123456789"
          />
        </div>

        {/* ALLERGY & CURRENT MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (si vous avez des allergies)"
            placeholder="Peanuts, Penicillin, Pollen"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medications"
            placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
          />
        </div>

        {/* FAMILY MEDICATION & PAST MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Antecedants familiaux"
            placeholder="Maladies chroniques des parents"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Antecedents medicaux"
            placeholder="Si vous avez des antecedants médicaux, notez les ici"
          />
        </div>

        {/* SECTION IDENTIFCATION ET VERIFICATION */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Informations médicales du patient</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Type de pièce d'identité"
          placeholder="Selectionner une pièce d'identité"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="indentificationNumber"
          label="Numéro de votre pièce d'identité"
          placeholder="CNI°, Passeport N°, etc..."
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Pièce d'identité"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploder files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
        <div className="flex flex-col gap-6 xl:flex-row"></div>

        {/* SECTION IDENTIFCATION ET VERIFICATION */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">consentement et vie privée</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploder files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure information"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploder files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploder files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <SubmitButton isLoading={isLoading}>Soumettre</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
