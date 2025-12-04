"use client";
import { MultiStepEditorGenery } from "@/modules/create/inedx";
import React, { Suspense } from "react";

export default function Qwe() {
  return (
    <div>
      <Suspense fallback={<div>Загрузка данных...</div>}>
        <MultiStepEditorGenery />
      </Suspense>
    </div>
  );
}
