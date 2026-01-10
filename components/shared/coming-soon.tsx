import { Construction } from "lucide-react";
import React from "react";

interface ComingSoonProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
}

const ComingSoon = ({
  title = "Coming Soon",
  description = "We are working hard to bring you this feature. Stay tuned!",
  icon: Icon = Construction,
}: ComingSoonProps) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center p-4">
      <div className="rounded-full bg-muted p-6">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default ComingSoon;
