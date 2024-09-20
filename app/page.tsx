import PatientForm from "@/components/forms/PatientForm";
import PassKeyModal from "@/components/PassKeyModal";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";
  return (
    <div className="flex h-screen max-h-screen ">
      {isAdmin && <PassKeyModal />}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[496px] pt-0 mt-0">
          <div className="flex justify-start">
            <Image
              src="/assets/icons/logo2.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
            />
            <p className="mt-2 text-lg">DoctoDjib</p>
          </div>
          <PatientForm />
          <div className="text-14-regular mt-15 mb-4 pt-5 pb-5 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 DoctoDjib, Tous droits réservés
            </p>

            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboard.jpg"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
