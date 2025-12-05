"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";

type KeyPoint = { id: string; text: string };

interface KeyPointsSectionProps {
  initialPoints?: KeyPoint[];
  onChange?: (points: KeyPoint[]) => void;
}

export default function KeyPointsSection({
  initialPoints = [],
  onChange,
}: KeyPointsSectionProps) {
  const [keyPoints, setKeyPoints] = useState<KeyPoint[]>(initialPoints);

  useEffect(() => {
    setKeyPoints(initialPoints);
  }, [initialPoints]);

  const updatePoints = (newPoints: KeyPoint[]) => {
    setKeyPoints(newPoints);
    onChange?.(newPoints);
  };

  const addPoint = () => {
    updatePoints([...keyPoints, { id: crypto.randomUUID(), text: "" }]);
  };

  const updatePoint = (id: string, text: string) => {
    updatePoints(keyPoints.map((p) => (p.id === id ? { ...p, text } : p)));
  };

  const deletePoint = (id: string) => {
    updatePoints(keyPoints.filter((p) => p.id !== id));
  };

  return (
    <section className="w-full">
      <h2 className="font-bold font-poppins-sans text-lg  flex justify-between items-center mb-4">
        <div>Key Points</div>
        <Button variant="outline" type="button" onClick={addPoint}>
          Add Point
        </Button>
      </h2>

      <ul className="font-normal text-base grid gap-2">
        {keyPoints.map((point) => (
          <li key={point.id} className="flex justify-between gap-1">
            <Input
              value={point.text}
              onChange={(e) => updatePoint(point.id, e.target.value)}
            />
            <Button variant="ghost" onClick={() => deletePoint(point.id)}>
              <Trash />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
