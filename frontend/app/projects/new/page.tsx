"use client";
import ProjectForm from "@/components/Project/ProjectForm";

import React from "react";

type Props = {};

const CreateProjectFormPage = (props: Props) => {
  return (
    <div className="container mx-auto py-24 flex justify-center">
      <div className="card shrink-0 w-full max-w-xl shadow-xl bg-base-200 rounded-xl">
        <ProjectForm />
      </div>
    </div>
  );
};

export default CreateProjectFormPage;
