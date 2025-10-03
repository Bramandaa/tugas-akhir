import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function AlertCard({ message }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
