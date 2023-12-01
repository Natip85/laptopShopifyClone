import { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface CustomModalProps {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  icon?: ReactNode;
  triggerTitle?: string;
  btnClasses?: string;
  btnTitle?: string;
}

const Modal = ({
  title,
  description,
  onConfirm,
  icon,
  triggerTitle,
  btnClasses,
  btnTitle,
}: CustomModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={btnClasses}>
          {triggerTitle}
          {icon}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size={"sm"}>
              Continue editing
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            size={"sm"}
            onClick={onConfirm}
          >
            {btnTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
