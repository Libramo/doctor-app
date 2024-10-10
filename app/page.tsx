import PatientForm from "@/components/forms/PatientForm";
import PassKeyModal from "@/components/PassKeyModal";
import { Button } from "@/components/ui/button";
import { currentYearForCopyright } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";
  return (
    <div className="flex h-screen max-h-screen ">
      {isAdmin && <PassKeyModal />}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[496px] pt-0 mt-0">
          <div className="flex justify-center items-center flex-col pb-7">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/assets/icons/logo2.svg"
                height={100}
                width={100}
                alt="patient"
                className="rounded-bl-3xl rounded-tr-3xl bg-pink-500"
              />
            </Link>
            <p className="text-4xl pt-5 pb-5 ">
              <span className="text-blue-400 font-pacifico ">Docto</span> &nbsp;
              <span className="text-pink-500">--</span>&nbsp;{" "}
              <span className="text-green-400 font-pacifico">Djib</span>
            </p>
          </div>
          <PatientForm />
          <div className="text-14-regular mt-15 mb-4 pt-5 pb-5 flex justify-between">
            <div className=" flex flex-col gap-3">
              <p className="justify-items-end text-dark-600 xl:text-left">
                {/* © 2024 DoctoDjib, Tous droits réservés */}
                {currentYearForCopyright()}
              </p>
              <p className="justify-items-end text-dark-600 xl:text-left">
                Proudly made in &nbsp; &nbsp;🇩🇯
              </p>
            </div>

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
