import { CheckCircle, Clock, XCircle } from "lucide-react";
import { VerificationStatus } from "@/lib/database/enums";

interface Props {
  status: VerificationStatus;
  variant?: "default" | "minimal";
}

const verificationConfig: Record<
  VerificationStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  pending: {
    label: "En evaluación",
    icon: Clock,
    className: "bg-yellow-100/70 text-yellow-700",
  },
  verified: {
    label: "",
    icon: CheckCircle,
    className: "bg-green-100/70 text-green-700",
  },
  rejected: {
    label: "Rechazado",
    icon: XCircle,
    className: "bg-red-100/70 text-red-700",
  },
};

export default function VerificationBadge({
  status,
  variant = "default",
}: Props) {
  const config = verificationConfig[status];

  if (!config) return null;

  const Icon = config.icon;

  if (variant === "minimal") {
    return <Icon size={18} className={config.className.split(" ")[1]} />;
  }

  return (
    <span
      className={`fontMontserrat flex items-center gap-1 px-2 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
}
